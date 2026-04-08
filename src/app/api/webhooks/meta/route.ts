import { NextRequest, NextResponse } from "next/server";

import { ingestMetaLead } from "@/lib/crm";

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

  const lead = payload?.lead ?? payload;

  const result = await ingestMetaLead({
    firstName: lead.firstName ?? lead.first_name ?? "Meta",
    lastName: lead.lastName ?? lead.last_name ?? "Lead",
    email: lead.email ?? "meta-lead@fitness4allcrm.com",
    phone: lead.phone ?? "(000) 000-0000",
    leadSource: lead.leadSource ?? lead.source ?? "Meta Lead Ad",
    membershipInterest:
      lead.membershipInterest ?? lead.membership_interest ?? "General membership",
    trainingGoal: lead.trainingGoal ?? lead.training_goal ?? "Get started",
    preferredLocationId:
      lead.preferredLocationId ?? lead.preferred_location_id ?? "loc-midtown",
    ownerName: lead.ownerName ?? lead.owner_name ?? "Avery Cole",
    message: lead.message ?? "Interested in learning more about the gym.",
    channel: lead.channel ?? "Facebook",
  });

  return NextResponse.json({
    ok: true,
    event: "meta.lead.created",
    recordIds: result,
    payloadPreview: payload,
  });
}
