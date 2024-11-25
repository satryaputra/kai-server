import { Hono } from "hono";
import {
  getUser,
  checkUser,
  loginUser,
  logoutUser,
  registerUser,
} from "./user.services.js";

const userRoutes = new Hono();

userRoutes.get("/me", getUser);

userRoutes.get("/check", checkUser);
userRoutes.post("/register", registerUser);
userRoutes.post("/login", loginUser);
userRoutes.post("/logout", logoutUser);

export default userRoutes;
