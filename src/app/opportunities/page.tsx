import Link from "next/link";

import {
  createOpportunityAction,
  updateOpportunityStageAction,
} from "@/app/actions/crm";
import { Surface } from "@/components/crm-cards";
import { CrmShell } from "@/components/crm-shell";
import { getPipelineStages, listContacts, listOpportunities } from "@/lib/crm";

export const dynamic = "force-dynamic";

export default async function OpportunitiesPage() {
  const contacts = await listContacts();
  const opportunities = await listOpportunities();
  const stages = getPipelineStages();

  return (
    <CrmShell
      title="Opportunities"
      subtitle="Create real deals, tie them to contacts, and move them through the gym sales pipeline. Stage changes persist and immediately flow back into dashboard reporting."
    >
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Surface>
          <h2 className="text-xl font-semibold text-white">Create an opportunity</h2>
          <form action={createOpportunityAction} className="mt-5 space-y-4">
            <select name="contactId" className="crm-input">
              {contacts.map((contact) => (
                <option key={contact.id} value={contact.id}>
                  {contact.firstName} {contact.lastName}
                </option>
              ))}
            </select>
            <select name="stageName" className="crm-input">
              {stages.map((stage) => (
                <option key={stage.name} value={stage.name}>
                  {stage.name}
                </option>
              ))}
            </select>
            <input name="ownerName" placeholder="Owner name" className="crm-input" />
            <input name="value" type="number" min="0" placeholder="Value" className="crm-input" />
            <textarea
              name="nextAction"
              placeholder="Next action"
              className="crm-input min-h-24"
            />
            <button type="submit" className="crm-button">
              Save opportunity
            </button>
          </form>
        </Surface>

        <Surface>
          <h2 className="text-xl font-semibold text-white">Pipeline management</h2>
          <div className="mt-5 space-y-4">
            {opportunities.map((opportunity) => (
              <div
                key={opportunity.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-white">
                      <Link href={`/opportunities/${opportunity.id}`} className="hover:text-cyan-200">
                        {opportunity.contactName}
                      </Link>
                    </p>
                    <p className="mt-1 text-sm text-slate-300">
                      {opportunity.ownerName} · ${opportunity.value.toLocaleString()}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      {opportunity.nextAction}
                    </p>
                  </div>

                  <form
                    action={updateOpportunityStageAction}
                    className="flex flex-wrap items-center gap-3"
                  >
                    <input type="hidden" name="id" value={opportunity.id} />
                    <select
                      name="stageName"
                      defaultValue={opportunity.stageName}
                      className="crm-input min-w-44"
                    >
                      {stages.map((stage) => (
                        <option key={stage.name} value={stage.name}>
                          {stage.name}
                        </option>
                      ))}
                    </select>
                    <select
                      name="outcome"
                      defaultValue={opportunity.outcome}
                      className="crm-input min-w-32"
                    >
                      <option value="Open">Open</option>
                      <option value="Won">Won</option>
                    </select>
                    <button type="submit" className="crm-button">
                      Update stage
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </Surface>
      </div>
    </CrmShell>
  );
}
