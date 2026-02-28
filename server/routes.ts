import { type Express } from "express";
import { type Server } from "http";

import { registerAuthRoutes } from "./routes/auth";
import { registerAdminRoutes } from "./routes/admin";
import { registerPublicRoutes } from "./routes/public";
import { registerCROChecklistRoutes } from "./routes/cro-checklist";
import { registerMentorshipLeadRoutes } from "./routes/mentorship-leads";

export async function registerRoutes(server: Server, app: Express) {
  registerAuthRoutes(app);
  registerAdminRoutes(app);
  registerPublicRoutes(app);
  registerCROChecklistRoutes(app);
  registerMentorshipLeadRoutes(app);
}
