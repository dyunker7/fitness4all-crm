import { ingestMetaLeadAction } from "@/app/actions/crm";
import { Surface } from "@/components/crm-cards";
import { CrmShell } from "@/components/crm-shell";

export const dynamic = "force-dynamic";

export default function MetaPage() {
  return (
    <CrmShell
      title="Meta Lead Intake"
      subtitle="Simulate Facebook and Instagram lead capture so inbound social leads enter contacts, opportunities, inbox, and tasks automatically."
    >
      <Surface>
        <h2 className="text-xl font-semibold text-white">Create a Meta lead</h2>
        <form action={ingestMetaLeadAction} className="mt-5 grid gap-4 md:grid-cols-2">
          <input name="firstName" placeholder="First name" className="crm-input" />
          <input name="lastName" placeholder="Last name" className="crm-input" />
          <input name="email" type="email" placeholder="Email" className="crm-input" />
          <input name="phone" placeholder="Phone" className="crm-input" />
          <select name="channel" className="crm-input">
            <option value="Facebook">Facebook</option>
            <option value="Instagram">Instagram</option>
          </select>
          <input name="leadSource" defaultValue="Meta Lead Ad" className="crm-input" />
          <input
            name="membershipInterest"
            placeholder="Membership interest"
            className="crm-input"
          />
          <input name="trainingGoal" placeholder="Training goal" className="crm-input" />
          <input
            name="preferredLocationId"
            defaultValue="loc-midtown"
            className="crm-input"
          />
          <input name="ownerName" defaultValue="Avery Cole" className="crm-input" />
          <textarea
            name="message"
            placeholder="Lead message"
            className="crm-input min-h-28 md:col-span-2"
          />
          <button type="submit" className="crm-button md:col-span-2">
            Ingest Meta lead
          </button>
        </form>
      </Surface>
    </CrmShell>
  );
}
