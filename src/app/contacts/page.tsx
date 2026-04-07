import Link from "next/link";

import { createContactAction } from "@/app/actions/crm";
import { Surface } from "@/components/crm-cards";
import { CrmShell } from "@/components/crm-shell";
import { getLocations, listContacts } from "@/lib/crm";

export const dynamic = "force-dynamic";

export default async function ContactsPage() {
  const contacts = await listContacts();
  const locations = getLocations();

  return (
    <CrmShell
      title="Contacts"
      subtitle="Create and store real lead records for Fitness4All. These entries are persisted in the local CRM database and drive the rest of the sales workflow."
    >
      <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
        <Surface>
          <h2 className="text-xl font-semibold text-white">Add a contact</h2>
          <form action={createContactAction} className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input name="firstName" placeholder="First name" className="crm-input" />
              <input name="lastName" placeholder="Last name" className="crm-input" />
            </div>
            <input name="email" type="email" placeholder="Email" className="crm-input" />
            <input name="phone" placeholder="Phone" className="crm-input" />
            <input name="leadSource" placeholder="Lead source" className="crm-input" />
            <input
              name="membershipInterest"
              placeholder="Membership interest"
              className="crm-input"
            />
            <textarea
              name="trainingGoal"
              placeholder="Training goal"
              className="crm-input min-h-24"
            />
            <select name="preferredLocationId" className="crm-input">
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
            <button type="submit" className="crm-button">
              Save contact
            </button>
          </form>
        </Surface>

        <Surface>
          <h2 className="text-xl font-semibold text-white">Stored contacts</h2>
          <div className="mt-5 overflow-hidden rounded-3xl border border-white/10">
            <table className="min-w-full divide-y divide-white/10 text-left text-sm">
              <thead className="bg-white/5 text-slate-300">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Source</th>
                  <th className="px-4 py-3 font-medium">Interest</th>
                  <th className="px-4 py-3 font-medium">Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-slate-950/30">
                {contacts.map((contact) => (
                  <tr key={contact.id}>
                    <td className="px-4 py-4">
                      <Link
                        href={`/contacts/${contact.id}`}
                        className="font-medium text-white hover:text-cyan-200"
                      >
                        {contact.firstName} {contact.lastName}
                      </Link>
                      <p className="text-xs text-slate-400">{contact.email}</p>
                    </td>
                    <td className="px-4 py-4 text-slate-300">{contact.leadSource}</td>
                    <td className="px-4 py-4 text-slate-300">
                      {contact.membershipInterest}
                    </td>
                    <td className="px-4 py-4 text-slate-300">{contact.lifecycleStage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Surface>
      </div>
    </CrmShell>
  );
}
