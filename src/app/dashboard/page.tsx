import Link from "next/link";

import { CrmShell } from "@/components/crm-shell";
import { StatCard, Surface } from "@/components/crm-cards";
import {
  getDashboardSnapshot,
  getPipelineStages,
  listConversations,
  listOpportunities,
  listTasks,
} from "@/lib/crm";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const snapshot = await getDashboardSnapshot();
  const conversations = (await listConversations()).slice(0, 3);
  const opportunities = await listOpportunities();
  const tasks = (await listTasks()).slice(0, 5);
  const stages = getPipelineStages();

  return (
    <CrmShell
      title="Dashboard"
      subtitle="This is now backed by a real local database. New contacts and opportunities persist between refreshes and update the dashboard in real time."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Contacts"
          value={snapshot.contactCount.toString()}
          detail="Leads and members currently stored in the CRM database."
        />
        <StatCard
          label="Open opportunities"
          value={snapshot.openOpportunityCount.toString()}
          detail="Deals that still need follow-up, booking, or conversion."
        />
        <StatCard
          label="Open pipeline value"
          value={`$${snapshot.openPipelineValue.toLocaleString()}`}
          detail="Projected value of open deals in the sales pipeline."
        />
        <StatCard
          label="Closed-won value"
          value={`$${snapshot.wonValue.toLocaleString()}`}
          detail="Won revenue tracked for reporting without payment processing."
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Surface>
          <h2 className="text-xl font-semibold text-white">Pipeline stages</h2>
          <div className="mt-5 space-y-3">
            {stages.map((stage) => {
              const count = opportunities.filter(
                (opportunity) => opportunity.stageName === stage.name,
              ).length;
              return (
                <div
                  key={stage.name}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-white">{stage.name}</p>
                    <span className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-xs text-cyan-100">
                      {count} deals
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{stage.goal}</p>
                </div>
              );
            })}
          </div>
        </Surface>

        <Surface>
          <h2 className="text-xl font-semibold text-white">Recent opportunities</h2>
          <div className="mt-5 overflow-hidden rounded-3xl border border-white/10">
            <table className="min-w-full divide-y divide-white/10 text-left text-sm">
              <thead className="bg-white/5 text-slate-300">
                <tr>
                  <th className="px-4 py-3 font-medium">Contact</th>
                  <th className="px-4 py-3 font-medium">Stage</th>
                  <th className="px-4 py-3 font-medium">Owner</th>
                  <th className="px-4 py-3 font-medium">Value</th>
                  <th className="px-4 py-3 font-medium">Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-slate-950/30">
                {opportunities.map((opportunity) => (
                  <tr key={opportunity.id}>
                    <td className="px-4 py-4 text-white">
                      <Link href={`/opportunities/${opportunity.id}`} className="hover:text-cyan-200">
                        {opportunity.contactName}
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-slate-300">{opportunity.stageName}</td>
                    <td className="px-4 py-4 text-slate-300">{opportunity.ownerName}</td>
                    <td className="px-4 py-4 text-white">
                      ${opportunity.value.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-slate-300">{opportunity.outcome}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Surface>
      </div>

      <Surface>
        <h2 className="text-xl font-semibold text-white">Open tasks</h2>
        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {tasks.map((task) => (
            <div key={task.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="font-medium text-white">{task.title}</p>
              <p className="mt-2 text-sm text-slate-400">
                {task.ownerName} · {task.dueLabel} · {task.status}
              </p>
            </div>
          ))}
        </div>
      </Surface>

      <Surface>
        <h2 className="text-xl font-semibold text-white">Inbox priorities</h2>
        <div className="mt-5 grid gap-3 lg:grid-cols-3">
          {conversations.map((conversation) => (
            <Link
              key={conversation.id}
              href={`/inbox/${conversation.id}`}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/8"
            >
              <p className="font-medium text-white">{conversation.contactName}</p>
              <p className="mt-1 text-sm text-slate-400">{conversation.channel}</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {conversation.lastMessage}
              </p>
            </Link>
          ))}
        </div>
      </Surface>
    </CrmShell>
  );
}
