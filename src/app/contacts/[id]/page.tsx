import Link from "next/link";
import { notFound } from "next/navigation";

import { createTaskAction, updateContactAction, updateTaskStatusAction } from "@/app/actions/crm";
import { Surface } from "@/components/crm-cards";
import { CrmShell } from "@/components/crm-shell";
import {
  getContactById,
  listActivitiesForContact,
  listOpportunitiesForContact,
  listTasksForRecord,
} from "@/lib/crm";

export const dynamic = "force-dynamic";

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const contact = await getContactById(id);

  if (!contact) {
    notFound();
  }

  const opportunities = await listOpportunitiesForContact(id);
  const tasks = await listTasksForRecord("contact", id);
  const activities = await listActivitiesForContact(id);

  return (
    <CrmShell
      title={`${contact.firstName} ${contact.lastName}`}
      subtitle="Edit the lead profile, review related opportunities, and track concrete follow-up tasks for this person."
    >
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Surface>
          <h2 className="text-xl font-semibold text-white">Lead profile</h2>
          <form action={updateContactAction} className="mt-5 space-y-4">
            <input type="hidden" name="id" value={contact.id} />
            <div className="grid gap-4 sm:grid-cols-2">
              <input name="firstName" defaultValue={contact.firstName} className="crm-input" />
              <input name="lastName" defaultValue={contact.lastName} className="crm-input" />
            </div>
            <input name="email" defaultValue={contact.email} className="crm-input" />
            <input name="phone" defaultValue={contact.phone} className="crm-input" />
            <input
              name="membershipInterest"
              defaultValue={contact.membershipInterest}
              className="crm-input"
            />
            <input
              name="lifecycleStage"
              defaultValue={contact.lifecycleStage}
              className="crm-input"
            />
            <textarea
              name="trainingGoal"
              defaultValue={contact.trainingGoal}
              className="crm-input min-h-24"
            />
            <button type="submit" className="crm-button">
              Save contact changes
            </button>
          </form>
        </Surface>

        <div className="space-y-6">
          <Surface>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Related opportunities</h2>
              <Link href="/opportunities" className="text-sm text-cyan-200 hover:text-cyan-100">
                View all deals
              </Link>
            </div>
            <div className="mt-5 space-y-3">
              {opportunities.length === 0 ? (
                <p className="text-sm text-slate-400">No opportunities linked yet.</p>
              ) : (
                opportunities.map((opportunity) => (
                  <Link
                    key={opportunity.id}
                    href={`/opportunities/${opportunity.id}`}
                    className="block rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/8"
                  >
                    <p className="font-medium text-white">{opportunity.stageName}</p>
                    <p className="mt-1 text-sm text-slate-300">
                      {opportunity.ownerName} · ${opportunity.value.toLocaleString()}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {opportunity.nextAction}
                    </p>
                  </Link>
                ))
              )}
            </div>
          </Surface>

          <Surface>
            <h2 className="text-xl font-semibold text-white">Tasks</h2>
            <form action={createTaskAction} className="mt-5 grid gap-4 sm:grid-cols-[1fr_160px_160px_auto]">
              <input type="hidden" name="relatedType" value="contact" />
              <input type="hidden" name="relatedId" value={contact.id} />
              <input name="title" placeholder="Task title" className="crm-input" />
              <input name="ownerName" placeholder="Owner" className="crm-input" />
              <input name="dueLabel" placeholder="Due" className="crm-input" />
              <button type="submit" className="crm-button">
                Add task
              </button>
            </form>

            <div className="mt-5 space-y-3">
              {tasks.length === 0 ? (
                <p className="text-sm text-slate-400">No tasks yet for this contact.</p>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div>
                      <p className="font-medium text-white">{task.title}</p>
                      <p className="mt-1 text-sm text-slate-400">
                        {task.ownerName} · {task.dueLabel}
                      </p>
                    </div>
                    <form action={updateTaskStatusAction}>
                      <input type="hidden" name="id" value={task.id} />
                      <input
                        type="hidden"
                        name="status"
                        value={task.status === "Open" ? "Done" : "Open"}
                      />
                      <button type="submit" className="crm-button">
                        Mark {task.status === "Open" ? "done" : "open"}
                      </button>
                    </form>
                  </div>
                ))
              )}
            </div>
          </Surface>

          <Surface>
            <h2 className="text-xl font-semibold text-white">Activity history</h2>
            <div className="mt-5 space-y-3">
              {activities.length === 0 ? (
                <p className="text-sm text-slate-400">
                  No activity has been logged for this contact yet.
                </p>
              ) : (
                activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="font-medium text-white">{activity.title}</p>
                      <span className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-xs text-cyan-100">
                        {activity.actorName}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {activity.description}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      {activity.eventType}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Surface>
        </div>
      </div>
    </CrmShell>
  );
}
