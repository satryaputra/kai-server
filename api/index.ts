import { Hono } from "hono";
import { handle } from "hono/vercel";

import { sessionMiddleware } from "./middleware.js";
import userRoutes from "./user/user.routes.js";

const app = new Hono().basePath("/api");

app.use(sessionMiddleware);

app.route("/user", userRoutes);

app.get("/team", (c) => {
  return c.json({
    team: "Anjay Gurinjay",
    members: ["Gatau ga hafal nanti diedit"],
  });
});

const handler = handle(app);

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const PUT = handler;
export const OPTIONS = handler;
