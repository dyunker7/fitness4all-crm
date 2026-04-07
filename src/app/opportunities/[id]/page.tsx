import { notFound } from "next/navigation";

import {
  createTaskAction,
  updateOpportunityAction,
  updateOpportunityStageAction,
  updateTaskStatusAction,
} from "@/app/actions/crm";
import { Surface } from "@/components/crm-cards";
import { CrmShell } from "@/components/crm-shell";
import { getOpportunityById, getPipelineStages, listTasksForRecord } from "@/lib/crm";

export const dynamic = "force-dynamic";

export default async function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const opportunity = await getOpportunityById(id);

  if (!opportunity) {
    notFound();
  }

  const stages = getPipelineStages();
  const tasks = await listTasksForRecord("opportunity", id);

  return (
    <CrmShell
      title={opportunity.contactName}
      subtitle="Manage the deal itself here: owner, value, next action, stage progression, and the rep tasks needed to close it."
    >
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Surface>
          <h2 className="text-xl font-semibold text-white">Deal details</h2>
          <form action={updateOpportunityAction} className="mt-5 space-y-4">
            <input type="hidden" name="id" value={opportunity.id} />
            <input name="ownerName" defaultValue={opportunity.ownerName} className="crm-input" />
            <input
              name="value"
              type="number"
              min="0"
              defaultValue={opportunity.value}
              className="crm-input"
            />
            <textarea
              name="nextAction"
              defaultValue={opportunity.nextAction}
              className="crm-input min-h-24"
            />
            <button type="submit" className="crm-button">
              Save deal changes
            </button>
          </form>

          <form action={updateOpportunityStageAction} className="mt-6 space-y-4 border-t border-white/10 pt-6">
            <input type="hidden" name="id" value={opportunity.id} />
            <select
              name="stageName"
              defaultValue={opportunity.stageName}
              className="crm-input"
            >
              {stages.map((stage) => (
                <option key={stage.name} value={stage.name}>
                  {stage.name}
                </option>
              ))}
            </select>
            <select name="outcome" defaultValue={opportunity.outcome} className="crm-input">
              <option value="Open">Open</option>
              <option value="Won">Won</option>
            </select>
            <button type="submit" className="crm-button">
              Update stage
            </button>
          </form>
        </Surface>

        <Surface>
          <h2 className="text-xl font-semibold text-white">Deal tasks</h2>
          <form action={createTaskAction} className="mt-5 grid gap-4 sm:grid-cols-[1fr_160px_160px_auto]">
            <input type="hidden" name="relatedType" value="opportunity" />
            <input type="hidden" name="relatedId" value={opportunity.id} />
            <input name="title" placeholder="Task title" className="crm-input" />
            <input name="ownerName" placeholder="Owner" className="crm-input" />
            <input name="dueLabel" placeholder="Due" className="crm-input" />
            <button type="submit" className="crm-button">
              Add task
            </button>
          </form>

          <div className="mt-5 space-y-3">
            {tasks.length === 0 ? (
              <p className="text-sm text-slate-400">No tasks yet for this deal.</p>
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
      </div>
    </CrmShell>
  );
}
