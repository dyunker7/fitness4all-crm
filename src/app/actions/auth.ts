"use server";

import { redirect } from "next/navigation";

import { authenticateUser, createSession, deleteSession } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const user = await authenticateUser(email, password);

  if (!user) {
    redirect("/login?error=invalid_credentials");
  }

  await createSession(user);
  redirect("/dashboard");
}

export async function logoutAction() {
  await deleteSession();
  redirect("/login");
}
