import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { compare } from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { NextResponse } from "next/server";

import { loadDatabase } from "@/lib/db";

const SESSION_COOKIE = "f4a_session";

type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

function getSecret() {
  return new TextEncoder().encode(
    process.env.AUTH_SECRET ?? "fitness4all-local-dev-secret-change-me",
  );
}

export async function authenticateUser(email: string, password: string) {
  const database = await loadDatabase();
  const user = database.users.find(
    (item) => item.email.toLowerCase() === email.toLowerCase(),
  );

  if (!user) {
    return null;
  }

  const isValid = await compare(password, user.passwordHash);
  if (!isValid) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  } satisfies SessionUser;
}

export async function createSession(user: SessionUser) {
  const token = await new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function createSessionResponse(user: SessionUser, requestUrl: string) {
  const token = await new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());

  const response = NextResponse.redirect(new URL("/dashboard", requestUrl));
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  try {
    const verified = await jwtVerify(token, getSecret());
    return verified.payload as SessionUser;
  } catch {
    return null;
  }
}

export async function requireSession() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return session;
}
