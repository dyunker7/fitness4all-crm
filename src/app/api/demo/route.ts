import { NextResponse } from "next/server";

import { demoData } from "@/lib/data";
import { eventContracts, workflowNodeTypes } from "@/lib/events";
import { providerCatalog } from "@/lib/providers";

export async function GET() {
  return NextResponse.json({
    app: "Fitness4All CRM",
    mode: "foundation",
    entities: Object.keys(demoData),
    providers: providerCatalog,
    workflowNodeTypes,
    eventContracts,
    data: demoData,
  });
}
