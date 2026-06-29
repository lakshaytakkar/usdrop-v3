import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { setupEmailTables } from "./lib/email-tables-setup";
import { seedDefaultAutomations } from "./lib/email-automation";
import { seedSmsTemplatesAndAutomations } from "./lib/sms-automation";

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export interface CreateAppOptions {
  /**
   * Serve the built client bundle (production `serveStatic`) from this Express
   * app. Defaults to true. Disable on Vercel — the CDN serves `dist/public`
   * statically, and the function only handles `/api/*`. (Also avoids
   * `serveStatic` throwing when `dist/public` is absent from the function bundle.)
   */
  serveClient?: boolean;
}

/**
 * Build and configure the Express app + its HTTP server WITHOUT calling
 * `listen()`. Used by the local/Replit entry (`server/index.ts`, which adds the
 * Vite dev middleware and listens) and by the Vercel serverless handler
 * (`api/index.ts`, which exports the app as a function with `serveClient:false`).
 */
export async function createApp(options: CreateAppOptions = {}) {
  const serveClient = options.serveClient ?? true;

  const app = express();
  const httpServer = createServer(app);

  app.use(
    express.json({
      verify: (req, _res, buf) => {
        req.rawBody = buf;
      },
    }),
  );

  app.use(express.urlencoded({ extended: false }));

  app.get("/api/health", (_req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse: Record<string, any> | undefined = undefined;

    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
      capturedJsonResponse = bodyJson;
      return originalResJson.apply(res, [bodyJson, ...args]);
    };

    res.on("finish", () => {
      const duration = Date.now() - start;
      if (path.startsWith("/api")) {
        let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
        if (capturedJsonResponse) {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse).substring(0, 200)}`;
        }

        log(logLine);
      }
    });

    next();
  });

  setupEmailTables()
    .then(() => seedDefaultAutomations())
    .catch((err) =>
      console.error("[startup] Email tables/seed setup failed:", err),
    );

  seedSmsTemplatesAndAutomations().catch((err) =>
    console.error("[startup] SMS templates/automations seed failed:", err),
  );

  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error("Internal Server Error:", err);

    if (res.headersSent) {
      return next(err);
    }

    return res.status(status).json({ message });
  });

  if (serveClient && process.env.NODE_ENV === "production") {
    serveStatic(app);
  }

  return { app, httpServer };
}
