"use server";

import { revalidatePath } from "next/cache";

import { requirePermission } from "@/lib/auth";
import {
  createAppointment,
  createContact,
  createMessage,
  createOpportunity,
  createTask,
  executeQueuedAutomationRuns,
  enrollAutomation,
  ingestMetaLead,
  updateAppointmentStatus,
  updateContact,
  updateOpportunity,
  updateOpportunityStage,
  updateTaskStatus,
} from "@/lib/crm";

export async function createContactAction(formData: FormData) {
  await requirePermission("contacts:edit");

  await createContact({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    leadSource: formData.get("leadSource"),
    membershipInterest: formData.get("membershipInterest"),
    trainingGoal: formData.get("trainingGoal"),
    preferredLocationId: formData.get("preferredLocationId"),
  });

  revalidatePath("/dashboard");
  revalidatePath("/contacts");
}

export async function createOpportunityAction(formData: FormData) {
  await requirePermission("opportunities:edit");

  await createOpportunity({
    contactId: formData.get("contactId"),
    stageName: formData.get("stageName"),
    ownerName: formData.get("ownerName"),
    value: formData.get("value"),
    nextAction: formData.get("nextAction"),
  });

  revalidatePath("/dashboard");
  revalidatePath("/opportunities");
}

export async function updateContactAction(formData: FormData) {
  await requirePermission("contacts:edit");

  await updateContact({
    id: formData.get("id"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    lifecycleStage: formData.get("lifecycleStage"),
    membershipInterest: formData.get("membershipInterest"),
    trainingGoal: formData.get("trainingGoal"),
  });

  const id = String(formData.get("id"));
  revalidatePath("/dashboard");
  revalidatePath("/contacts");
  revalidatePath(`/contacts/${id}`);
}

export async function updateOpportunityAction(formData: FormData) {
  await requirePermission("opportunities:edit");

  await updateOpportunity({
    id: formData.get("id"),
    ownerName: formData.get("ownerName"),
    value: formData.get("value"),
    nextAction: formData.get("nextAction"),
  });

  const id = String(formData.get("id"));
  revalidatePath("/dashboard");
  revalidatePath("/opportunities");
  revalidatePath(`/opportunities/${id}`);
}

export async function updateOpportunityStageAction(formData: FormData) {
  await requirePermission("opportunities:edit");

  await updateOpportunityStage({
    id: formData.get("id"),
    stageName: formData.get("stageName"),
    outcome: formData.get("outcome"),
  });

  revalidatePath("/dashboard");
  revalidatePath("/opportunities");
  revalidatePath(`/opportunities/${String(formData.get("id"))}`);
}

export async function createTaskAction(formData: FormData) {
  await requirePermission("tasks:edit");

  await createTask({
    title: formData.get("title"),
    relatedType: formData.get("relatedType"),
    relatedId: formData.get("relatedId"),
    ownerName: formData.get("ownerName"),
    dueLabel: formData.get("dueLabel"),
  });

  const relatedType = String(formData.get("relatedType"));
  const relatedId = String(formData.get("relatedId"));
  revalidatePath("/dashboard");
  revalidatePath("/contacts");
  revalidatePath("/opportunities");
  revalidatePath(`/contacts/${relatedId}`);
  revalidatePath(`/opportunities/${relatedId}`);
  if (relatedType === "contact") {
    revalidatePath(`/contacts/${relatedId}`);
  } else {
    revalidatePath(`/opportunities/${relatedId}`);
  }
}

export async function updateTaskStatusAction(formData: FormData) {
  await requirePermission("tasks:edit");

  await updateTaskStatus({
    id: formData.get("id"),
    status: formData.get("status"),
  });

  revalidatePath("/dashboard");
  revalidatePath("/contacts");
  revalidatePath("/opportunities");
}

export async function createMessageAction(formData: FormData) {
  await requirePermission("inbox:send");

  const conversationId = String(formData.get("conversationId"));

  await createMessage({
    conversationId,
    body: formData.get("body"),
    sentBy: formData.get("sentBy"),
  });

  revalidatePath("/dashboard");
  revalidatePath("/inbox");
  revalidatePath(`/inbox/${conversationId}`);
}

export async function createAppointmentAction(formData: FormData) {
  await requirePermission("schedule:edit");

  await createAppointment({
    contactId: formData.get("contactId"),
    opportunityId: formData.get("opportunityId"),
    title: formData.get("title"),
    ownerName: formData.get("ownerName"),
    startsAt: formData.get("startsAt"),
    locationName: formData.get("locationName"),
    appointmentType: formData.get("appointmentType"),
  });

  revalidatePath("/dashboard");
  revalidatePath("/schedule");
  revalidatePath("/automations");
}

export async function updateAppointmentStatusAction(formData: FormData) {
  await requirePermission("schedule:edit");

  await updateAppointmentStatus({
    id: formData.get("id"),
    status: formData.get("status"),
  });

  revalidatePath("/dashboard");
  revalidatePath("/schedule");
  revalidatePath("/automations");
}

export async function ingestMetaLeadAction(formData: FormData) {
  await requirePermission("meta:ingest");

  await ingestMetaLead({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    leadSource: formData.get("leadSource"),
    membershipInterest: formData.get("membershipInterest"),
    trainingGoal: formData.get("trainingGoal"),
    preferredLocationId: formData.get("preferredLocationId"),
    ownerName: formData.get("ownerName"),
    message: formData.get("message"),
    channel: formData.get("channel"),
  });

  revalidatePath("/dashboard");
  revalidatePath("/contacts");
  revalidatePath("/opportunities");
  revalidatePath("/inbox");
  revalidatePath("/automations");
}

export async function enrollAutomationAction(formData: FormData) {
  await requirePermission("automations:edit");

  await enrollAutomation({
    templateId: formData.get("templateId"),
    sourceType: formData.get("sourceType"),
    sourceId: formData.get("sourceId"),
    contactId: formData.get("contactId"),
    ownerName: formData.get("ownerName"),
  });

  revalidatePath("/dashboard");
  revalidatePath("/contacts");
  revalidatePath("/opportunities");
  revalidatePath("/schedule");
  revalidatePath("/automations");
}

export async function executeQueuedAutomationRunsAction() {
  await requirePermission("automations:edit");

  await executeQueuedAutomationRuns();

  revalidatePath("/dashboard");
  revalidatePath("/contacts");
  revalidatePath("/opportunities");
  revalidatePath("/inbox");
  revalidatePath("/schedule");
  revalidatePath("/automations");
}
