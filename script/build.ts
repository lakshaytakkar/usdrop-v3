import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { rm, readFile } from "fs/promises";

const allowlist = [
  "express",
  "pg",
  "postgres",
  "drizzle-orm",
  "bcryptjs",
  "jsonwebtoken",
  "zod",
  "date-fns",
  "nanoid",
  "ws",
  "@supabase/supabase-js",
];

async function buildAll() {
  await rm("dist", { recursive: true, force: true });

  console.log("building client...");
  await viteBuild();

  console.log("building server...");
  const pkg = JSON.parse(await readFile("package.json", "utf-8"));
  const allDeps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ];
  const externals = allDeps.filter((dep) => !allowlist.includes(dep));

  await esbuild({
    entryPoints: ["server/index.ts"],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: "dist/index.cjs",
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    minify: true,
    external: externals,
    logLevel: "info",
  });

  // Vercel serverless function: a self-contained CJS bundle so there are no
  // extensionless relative imports for Node's ESM resolver to choke on.
  // `api/package.json` ({"type":"commonjs"}) makes Node treat this `.js` as CJS
  // despite the root `"type":"module"`.
  console.log("building Vercel function (api/index.js)...");
  await esbuild({
    entryPoints: ["server/vercel-entry.ts"],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: "api/index.js",
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    minify: true,
    external: externals,
    logLevel: "info",
  });
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
