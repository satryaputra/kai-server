import { Context } from "hono";
import { getCookie } from "hono/cookie";

import { validateSessionToken } from "../src/lib/session";

const whitelist = ["/login", "/register", "/check", "/team"];

export async function sessionMiddleware(c: Context, next: () => Promise<void>) {
  if (whitelist.some((wl) => c.req.url.includes(wl))) {
    return await next();
  }

  const token = getCookie(c, "session");

  if (token) {
    const { session, user } = await validateSessionToken(token);

    if (session && user) {
      c.set("session", session);
      c.set("user", user);

      return await next();
    }
  }

  return c.json({ error: "Unauthorized" }, 401);
}
