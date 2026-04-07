import { NextRequest, NextResponse } from "next/server";

import { authenticateUser, createSessionResponse } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const user = await authenticateUser(email, password);

  if (!user) {
    return NextResponse.redirect(
      new URL("/login?error=invalid_credentials", request.url),
    );
  }

  return createSessionResponse(user, request.url);
}
