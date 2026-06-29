import type { IncomingMessage, ServerResponse } from "http";
import { createApp } from "./app";

// esbuild bundles this entry into `api/index.js` (a self-contained CJS file) so
// the Vercel serverless function has no extensionless relative imports to
// resolve at runtime — the whole server graph is written bundler-style (no file
// extensions), which Node's native ESM resolver rejects.
//
// The CDN serves the static client (dist/public); this function only handles
// `/api/*`, so `serveClient` is false.
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
