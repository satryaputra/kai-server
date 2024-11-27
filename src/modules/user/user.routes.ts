import { Hono } from "hono";

import {
  getUser,
  checkUser,
  loginUser,
  logoutUser,
  registerUser,
} from "./user.handlers.js";

const userRoutes = new Hono()
  .get("/me", getUser)
  .get("/check", checkUser)
  .post("/register", registerUser)
  .post("/login", loginUser)
  .post("/logout", logoutUser);

export default userRoutes;
