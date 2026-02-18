import { type Express } from "express";
import { type Server } from "http";

import { registerAuthRoutes } from "./routes/auth";
import { registerAdminRoutes } from "./routes/admin";
import { registerPublicRoutes } from "./routes/public";

export async function registerRoutes(server: Server, app: Express) {
  registerAuthRoutes(app);
  registerAdminRoutes(app);
  registerPublicRoutes(app);
}
