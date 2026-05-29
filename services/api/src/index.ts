import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { getEnv } from "./env.js";
import { authMiddleware } from "./middleware/auth.js";
import { authRoutes } from "./routes/auth.js";
import { parcelsRoutes } from "./routes/parcels.js";
import { tkgmRoutes } from "./routes/tkgm.js";

const env = getEnv();

const app = new Hono();

app.use("*", logger());
app.use(
  "*",
  cors({
    origin: [
      "http://localhost:3001",
      "https://app.filizlen.io",
      "http://localhost:8081",
    ],
    allowHeaders: ["Authorization", "Content-Type"],
    allowMethods: ["GET", "POST", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

app.get("/health", (c) =>
  c.json({
    status: "ok",
    service: "filizlen-api",
    version: "0.2.0",
    db: env.isConfigured,
  }),
);

app.route("/auth", authRoutes);
app.route("/tkgm", tkgmRoutes);

const protectedRoutes = new Hono();
protectedRoutes.use("*", authMiddleware);
protectedRoutes.route("/parcels", parcelsRoutes);
app.route("/", protectedRoutes);

const port = Number(process.env.PORT ?? 3012);

serve({ fetch: app.fetch, port }, () => {
  console.log(`filizlen-api listening on http://127.0.0.1:${port}`);
});

export default app;
