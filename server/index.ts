import { createApp, log } from "./app";

(async () => {
  const { app, httpServer } = await createApp();

  // Dev only: attach the Vite middleware. Kept out of `createApp` so the Vercel
  // serverless bundle (which imports `./app`) never pulls in Vite.
  if (process.env.NODE_ENV !== "production") {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      // reusePort is unsupported on Windows (listen ENOTSUP); keep it on elsewhere.
      reusePort: process.platform !== "win32",
    },
    () => {
      log(`serving on port ${port}`);
    },
  );
})();
