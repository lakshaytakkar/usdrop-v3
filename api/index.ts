import type { IncomingMessage, ServerResponse } from "http";
import { createApp } from "../server/app";

// Build the Express app once per warm serverless instance. The CDN serves the
// static client (dist/public); this function only handles `/api/*`, so
// `serveClient` is false (no `serveStatic`, which would need dist/public in the
// function bundle).
const appPromise = createApp({ serveClient: false }).then(({ app }) => app);

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  const app = await appPromise;
  return (app as unknown as (req: IncomingMessage, res: ServerResponse) => void)(
    req,
    res,
  );
}
