import { Hono } from "hono";

import { sessionMiddleware } from "./middleware";
import userRoutes from "../src/modules/user/user.routes";
import fareRoutes from "./modules/fare/fare.routes";

const app = new Hono().basePath("/api");

app.use(sessionMiddleware);

app.route("/user", userRoutes);
app.route("/fare", fareRoutes);

app.get("/team", (c) => {
  return c.json({
    team: "Anjay Gurinjay",
    members: ["Gatau ga hafal nanti diedit"],
  });
});

export default app;
