import { NextRequest, NextResponse } from "next/server";

import { executeQueuedAutomationRuns } from "@/lib/crm";

export const dynamic = "force-dynamic";

function isAuthorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    return true;
  }

  return request.headers.get("authorization") === `Bearer ${secret}`;
}

async function runDueAutomations(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized automation runner request." },
      { status: 401 },
    );
  }

  const result = await executeQueuedAutomationRuns({ dueOnly: true, limit: 25 });

  return NextResponse.json({
    ok: true,
    mode: "due_steps_only",
    ...result,
    ranAt: new Date().toISOString(),
  });
}

export async function GET(request: NextRequest) {
  return runDueAutomations(request);
}

export async function POST(request: NextRequest) {
  return runDueAutomations(request);
}
