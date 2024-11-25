import { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";

import db from "../../lib/db.js";
import hasher from "../../lib/hasher.js";
import {
  createSession,
  generateSessionToken,
  invalidateSession,
} from "../../lib/session.js";

export function getUser(c: Context) {
  var user = c.get("user");

  if (user) {
    const { passwordHash, ...userWithoutPassword } = user;
    return c.json(userWithoutPassword, 200);
  }

  return c.json({ error: "User not found" }, 404);
}

export async function checkUser(c: Context) {
  const { q } = c.req.query();
  console.log(q);

  var user = await db.user.findFirst({
    where: {
      OR: [{ email: q }, { phoneNumber: q }],
    },
  });

  if (user) {
    return c.json({ message: "Registered user" }, 200);
  } else {
    return c.json({ message: "Unregister user" }, 404);
  }
}

export async function registerUser(c: Context) {
  const { email, phoneNumber, password } = await c.req.json();

  console.log({ email, phoneNumber, password });

  const passwordHash = await hasher.hash(password);

  console.log({ passwordHash });

  const { id: userId } = await db.user.create({
    data: {
      email,
      phoneNumber,
      passwordHash,
    },
    select: {
      id: true,
    },
  });

  const token = generateSessionToken();

  const session = await createSession(token, userId);

  setCookie(c, "session", token, {
    path: "/",
    maxAge: 1000,
    httpOnly: true,
    expires: session.expiresAt,
  });

  return c.json({ id: userId }, 201);
}

export async function loginUser(c: Context) {
  const { email, phoneNumber, password } = await c.req.json();

  var user = await db.user.findFirst({
    where: {
      OR: [{ email }, { phoneNumber }],
    },
  });

  if (!user) {
    return c.status(404);
  }

  const passwordMatch = await hasher.verify(password, user.passwordHash);

  if (!passwordMatch) {
    return c.status(401);
  }

  const token = generateSessionToken();
  const session = await createSession(token, user.id);

  setCookie(c, "session", token, {
    path: "/",
    maxAge: 1000,
    httpOnly: true,
    expires: session.expiresAt,
  });

  return c.status(200);
}

export async function logoutUser(c: Context) {
  const session = c.get("session");

  console.log(session);

  if (session) {
    await invalidateSession(session.id);
    deleteCookie(c, "session");

    return c.json({ message: "Logged out" }, 200);
  } else {
    return c.json({ error: "Invalid session, please clear your cache." }, 400);
  }
}
