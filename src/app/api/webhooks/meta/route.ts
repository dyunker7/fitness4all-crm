import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.META_VERIFY_TOKEN) {
    return new NextResponse(challenge ?? "", { status: 200 });
  }

  return NextResponse.json(
    {
      ok: false,
      message: "Meta webhook verification failed. Set META_VERIFY_TOKEN to enable verification.",
    },
    { status: 403 },
  );
}

export async function POST(request: NextRequest) {
  const payload = await request.json();

  return NextResponse.json({
    ok: true,
    event: "meta.webhook.received",
    next: [
      "validate signature",
      "normalize DM or lead ad payload",
      "upsert contact and conversation",
      "emit meta.dm.received or meta.lead.created",
      "trigger workflow engine",
    ],
    payloadPreview: payload,
  });
}
