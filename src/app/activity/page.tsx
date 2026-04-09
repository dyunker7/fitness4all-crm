import { formatDistanceToNowStrict } from "date-fns";

import { Surface } from "@/components/crm-cards";
import { CrmShell } from "@/components/crm-shell";
import { listRecentActivities } from "@/lib/crm";

export const dynamic = "force-dynamic";

export default async function ActivityPage() {
  const activities = await listRecentActivities(100);

  return (
    <CrmShell
      title="Activity"
      subtitle="Review the audit trail for contact changes, deal movement, messages, appointments, Meta lead intake, and automation execution."
    >
      <Surface>
        <h2 className="text-xl font-semibold text-white">CRM audit trail</h2>
        <div className="mt-5 space-y-3">
          {activities.length === 0 ? (
            <p className="text-sm text-slate-400">No activity has been logged yet.</p>
          ) : (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-white">
                      {activity.title}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      {activity.actorName}
                      {activity.contactName ? ` · ${activity.contactName}` : ""}
                    </p>
                  </div>
                  <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100">
                    {activity.eventType}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {activity.description}
                </p>
                <p className="mt-3 text-xs text-slate-500">
                  {formatDistanceToNowStrict(new Date(activity.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            ))
          )}
        </div>
      </Surface>
    </CrmShell>
  );
}
