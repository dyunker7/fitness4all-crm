import { format } from "date-fns";

import {
  enrollAutomationAction,
  executeQueuedAutomationRunsAction,
} from "@/app/actions/crm";
import { Surface, StatCard } from "@/components/crm-cards";
import { CrmShell } from "@/components/crm-shell";
import {
  getAutomationSnapshot,
  listAutomationEnrollments,
  listAutomationRuns,
  listAutomationTemplates,
  listContacts,
} from "@/lib/crm";

export const dynamic = "force-dynamic";

export default async function AutomationsPage() {
  const [snapshot, templates, enrollments, runs, contacts] =
    await Promise.all([
      getAutomationSnapshot(),
      Promise.resolve(listAutomationTemplates()),
      listAutomationEnrollments(),
      listAutomationRuns(),
      listContacts(),
    ]);

  return (
    <CrmShell
      title="Automations"
      subtitle="Track live workflow enrollments, see queued follow-up steps, and launch repeatable gym sales automations for new leads and booked appointments."
    >
      <Surface className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Execution controls</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
            Run queued workflow steps to turn automation runs into real inbox messages
            and follow-up tasks across the CRM.
          </p>
        </div>
        <form action={executeQueuedAutomationRunsAction}>
          <button type="submit" className="crm-button">
            Run queued steps now
          </button>
        </form>
      </Surface>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Active enrollments"
          value={snapshot.activeEnrollments.toString()}
          detail="Contacts and bookings currently inside an active automation sequence."
        />
        <StatCard
          label="Queued steps"
          value={snapshot.queuedSteps.toString()}
          detail="Upcoming messages, tasks, and nudges waiting to run."
        />
        <StatCard
          label="Completed steps"
          value={snapshot.completedSteps.toString()}
          detail="Executed workflow actions logged across lead and booking flows."
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Surface>
          <h2 className="text-xl font-semibold text-white">Launch automation</h2>
          <form action={enrollAutomationAction} className="mt-5 space-y-4">
            <select name="templateId" className="crm-input">
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name} · {template.trigger}
                </option>
              ))}
            </select>
            <select name="contactId" className="crm-input">
              {contacts.map((contact) => (
                <option key={contact.id} value={contact.id}>
                  {contact.firstName} {contact.lastName}
                </option>
              ))}
            </select>
            <input type="hidden" name="sourceType" value="contact" />
            <select name="sourceId" className="crm-input">
              {contacts.map((contact) => (
                <option key={contact.id} value={contact.id}>
                  {contact.firstName} {contact.lastName}
                </option>
              ))}
            </select>
            <input
              name="ownerName"
              defaultValue="Avery Cole"
              className="crm-input"
              placeholder="Owner"
            />
            <button type="submit" className="crm-button">
              Enroll in automation
            </button>
          </form>
        </Surface>

        <Surface>
          <h2 className="text-xl font-semibold text-white">Templates</h2>
          <div className="mt-5 space-y-3">
            {templates.map((template) => (
              <div
                key={template.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-white">{template.name}</p>
                  <span className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-xs text-cyan-100">
                    {template.trigger}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-300">{template.goal}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.24em] text-slate-500">
                  {template.actions.join(" · ")}
                </p>
              </div>
            ))}
          </div>
        </Surface>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Surface>
          <h2 className="text-xl font-semibold text-white">Live enrollments</h2>
          <div className="mt-5 space-y-4">
            {enrollments.map((enrollment) => (
              <div
                key={enrollment.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-white">
                      {enrollment.contactName}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      {enrollment.templateName} · {enrollment.ownerName}
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-100">
                    {enrollment.status}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-300">
                  Source: {enrollment.sourceType} · started{" "}
                  {format(new Date(enrollment.createdAt), "MMM d, h:mm a")}
                </p>
              </div>
            ))}
          </div>
        </Surface>

        <Surface>
          <h2 className="text-xl font-semibold text-white">Upcoming steps</h2>
          <div className="mt-5 space-y-3">
            {runs.map((run) => (
              <div
                key={run.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-white">{run.stepLabel}</p>
                  <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-slate-200">
                    {run.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-400">{run.event}</p>
                <p className="mt-3 text-sm text-slate-300">
                  Scheduled for {format(new Date(run.scheduledFor), "MMM d, h:mm a")}
                </p>
              </div>
            ))}
          </div>
        </Surface>
      </div>
    </CrmShell>
  );
}
