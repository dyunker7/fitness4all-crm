import { randomUUID } from "node:crypto";

import { z } from "zod";

import { loadDatabase, saveDatabase } from "@/lib/db";
import { demoData } from "@/lib/data";

const contactSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  email: z.email(),
  phone: z.string().trim().min(7),
  leadSource: z.string().trim().min(1),
  membershipInterest: z.string().trim().min(1),
  trainingGoal: z.string().trim().min(1),
  preferredLocationId: z.string().trim().min(1),
});

const opportunitySchema = z.object({
  contactId: z.string().trim().min(1),
  stageName: z.string().trim().min(1),
  ownerName: z.string().trim().min(1),
  value: z.coerce.number().int().nonnegative(),
  nextAction: z.string().trim().min(1),
});

const contactUpdateSchema = z.object({
  id: z.string().trim().min(1),
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  email: z.email(),
  phone: z.string().trim().min(7),
  lifecycleStage: z.string().trim().min(1),
  membershipInterest: z.string().trim().min(1),
  trainingGoal: z.string().trim().min(1),
});

const opportunityUpdateSchema = z.object({
  id: z.string().trim().min(1),
  ownerName: z.string().trim().min(1),
  value: z.coerce.number().int().nonnegative(),
  nextAction: z.string().trim().min(1),
});

const stageSchema = z.object({
  id: z.string().trim().min(1),
  stageName: z.string().trim().min(1),
  outcome: z.enum(["Open", "Won"]),
});

const taskSchema = z.object({
  title: z.string().trim().min(1),
  relatedType: z.enum(["contact", "opportunity"]),
  relatedId: z.string().trim().min(1),
  ownerName: z.string().trim().min(1),
  dueLabel: z.string().trim().min(1),
});

const taskStatusSchema = z.object({
  id: z.string().trim().min(1),
  status: z.enum(["Open", "Done"]),
});

const messageSchema = z.object({
  conversationId: z.string().trim().min(1),
  body: z.string().trim().min(1),
  sentBy: z.string().trim().min(1),
});

const metaLeadSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  email: z.email(),
  phone: z.string().trim().min(7),
  leadSource: z.string().trim().min(1),
  membershipInterest: z.string().trim().min(1),
  trainingGoal: z.string().trim().min(1),
  preferredLocationId: z.string().trim().min(1),
  ownerName: z.string().trim().min(1),
  message: z.string().trim().min(1),
  channel: z.enum(["Instagram", "Facebook"]),
});

const appointmentSchema = z.object({
  contactId: z.string().trim().min(1),
  opportunityId: z.string().trim().optional().nullable(),
  title: z.string().trim().min(1),
  ownerName: z.string().trim().min(1),
  startsAt: z.string().trim().min(1),
  locationName: z.string().trim().min(1),
  appointmentType: z.string().trim().min(1),
});

const appointmentStatusSchema = z.object({
  id: z.string().trim().min(1),
  status: z.enum(["Scheduled", "Completed", "No Show", "Canceled"]),
});

const enrollAutomationSchema = z.object({
  templateId: z.string().trim().min(1),
  sourceType: z.enum(["contact", "opportunity", "appointment"]),
  sourceId: z.string().trim().min(1),
  contactId: z.string().trim().min(1),
  ownerName: z.string().trim().min(1),
});

export type CrmContact = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  leadSource: string;
  membershipInterest: string;
  trainingGoal: string;
  preferredLocationId: string;
  lifecycleStage: string;
  trialStatus: string;
  waiverStatus: string;
  consentStatus: string;
  createdAt: string;
};

export type CrmOpportunity = {
  id: string;
  contactId: string;
  contactName: string;
  pipelineId: string;
  stageName: string;
  ownerName: string;
  value: number;
  nextAction: string;
  outcome: "Open" | "Won";
  createdAt: string;
};

export type CrmTask = {
  id: string;
  title: string;
  status: "Open" | "Done";
  relatedType: "contact" | "opportunity";
  relatedId: string;
  ownerName: string;
  dueLabel: string;
  createdAt: string;
};

export type CrmConversation = {
  id: string;
  contactId: string;
  contactName: string;
  channel: string;
  ownerName: string;
  status: "On track" | "At risk";
  lastMessage: string;
  nextResponseDueAt: string;
  createdAt: string;
};

export type CrmMessage = {
  id: string;
  conversationId: string;
  direction: "inbound" | "outbound";
  body: string;
  sentBy: string;
  createdAt: string;
};

export type CrmAppointment = {
  id: string;
  contactId: string;
  contactName: string;
  opportunityId: string | null;
  title: string;
  ownerName: string;
  startsAt: string;
  locationName: string;
  appointmentType: string;
  status: "Scheduled" | "Completed" | "No Show" | "Canceled";
  createdAt: string;
};

export type CrmReminder = {
  id: string;
  appointmentId: string;
  channel: string;
  offsetMinutes: number;
  status: "Pending" | "Sent" | "Skipped";
  createdAt: string;
};

export type CrmAutomationTemplate = {
  id: string;
  name: string;
  trigger: string;
  goal: string;
  actions: string[];
};

export type CrmAutomationEnrollment = {
  id: string;
  templateId: string;
  templateName: string;
  sourceType: "contact" | "opportunity" | "appointment";
  sourceId: string;
  contactId: string;
  contactName: string;
  ownerName: string;
  status: "Active" | "Completed";
  createdAt: string;
};

export type CrmAutomationRun = {
  id: string;
  enrollmentId: string;
  templateId: string;
  event: string;
  stepLabel: string;
  status: "Queued" | "Completed";
  scheduledFor: string;
  createdAt: string;
};

export type CrmActivity = {
  id: string;
  eventType: string;
  title: string;
  description: string;
  actorName: string;
  relatedType: "contact" | "opportunity" | "appointment" | "automation" | "conversation";
  relatedId: string;
  contactId: string | null;
  contactName: string | null;
  createdAt: string;
};

const automationTemplates: CrmAutomationTemplate[] = [
  ...demoData.workflowTemplates,
  {
    id: "wf-tour-reminders",
    name: "Tour reminders and attendance rescue",
    trigger: "appointment.booked",
    goal: "Keep booked tours warm, confirmed, and easy to recover when no-shows happen.",
    actions: ["send SMS", "send email", "wait", "create task", "move stage"],
  },
  {
    id: "wf-meta-speed-to-lead",
    name: "Meta lead speed to lead",
    trigger: "meta.lead.created",
    goal: "Respond within minutes so Instagram and Facebook lead intent does not cool down.",
    actions: ["assign owner", "create task", "send SMS", "wait", "send email"],
  },
];

function mapContactRow(row: Record<string, string>) {
  return {
    id: row.id,
    firstName: row.firstName,
    lastName: row.lastName,
    email: row.email,
    phone: row.phone,
    leadSource: row.leadSource,
    membershipInterest: row.membershipInterest,
    trainingGoal: row.trainingGoal,
    preferredLocationId: row.preferredLocationId,
    lifecycleStage: row.lifecycleStage,
    trialStatus: row.trialStatus,
    waiverStatus: row.waiverStatus,
    consentStatus: row.consentStatus,
    createdAt: row.createdAt,
  } satisfies CrmContact;
}

function mapOpportunityRow(
  row: Record<string, string | number>,
): CrmOpportunity {
  return {
    id: row.id as string,
    contactId: row.contactId as string,
    contactName: row.contactName as string,
    pipelineId: row.pipelineId as string,
    stageName: row.stageName as string,
    ownerName: row.ownerName as string,
    value: row.value as number,
    nextAction: row.nextAction as string,
    outcome: row.outcome as "Open" | "Won",
    createdAt: row.createdAt as string,
  };
}

function addActivity(
  database: Awaited<ReturnType<typeof loadDatabase>>,
  input: {
    eventType: string;
    title: string;
    description: string;
    actorName?: string;
    relatedType: CrmActivity["relatedType"];
    relatedId: string;
    contactId?: string | null;
    createdAt?: string;
  },
) {
  database.activities.unshift({
    id: randomUUID(),
    eventType: input.eventType,
    title: input.title,
    description: input.description,
    actorName: input.actorName ?? "System",
    relatedType: input.relatedType,
    relatedId: input.relatedId,
    contactId: input.contactId ?? null,
    createdAt: input.createdAt ?? new Date().toISOString(),
  });
}

export async function getDashboardSnapshot() {
  const database = await loadDatabase();
  const openOpportunities = database.opportunities.filter(
    (opportunity) => opportunity.outcome === "Open",
  );
  const wonOpportunities = database.opportunities.filter(
    (opportunity) => opportunity.outcome === "Won",
  );

  return {
    contactCount: database.contacts.length,
    openOpportunityCount: openOpportunities.length,
    openPipelineValue: openOpportunities.reduce(
      (sum, opportunity) => sum + opportunity.value,
      0,
    ),
    wonValue: wonOpportunities.reduce((sum, opportunity) => sum + opportunity.value, 0),
  };
}

export async function listContacts() {
  const rows = (await loadDatabase()).contacts
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return rows.map(mapContactRow);
}

export async function listOpportunities() {
  const database = await loadDatabase();
  const rows = database.opportunities
    .map((opportunity) => {
      const contact = database.contacts.find(
        (item) => item.id === opportunity.contactId,
      );

      return {
        ...opportunity,
        contactName: contact
          ? `${contact.firstName} ${contact.lastName}`
          : "Unknown contact",
      };
    })
    .sort((a, b) => {
      if (a.outcome === b.outcome) {
        return b.createdAt.localeCompare(a.createdAt);
      }

      return a.outcome === "Open" ? -1 : 1;
    });

  return rows.map(mapOpportunityRow);
}

export async function listTasks() {
  return (await loadDatabase()).tasks
    .slice()
    .sort((a, b) => {
      if (a.status === b.status) {
        return b.createdAt.localeCompare(a.createdAt);
      }

      return a.status === "Open" ? -1 : 1;
    });
}

export async function listRecentActivities(limit = 10) {
  const database = await loadDatabase();

  return database.activities
    .map((activity) => {
      const contact = activity.contactId
        ? database.contacts.find((item) => item.id === activity.contactId)
        : null;

      return {
        ...activity,
        contactName: contact ? `${contact.firstName} ${contact.lastName}` : null,
      } satisfies CrmActivity;
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}

export async function listActivitiesForContact(contactId: string) {
  return (await listRecentActivities(100)).filter(
    (activity) => activity.contactId === contactId,
  );
}

export async function listConversations() {
  const database = await loadDatabase();

  return database.conversations
    .map((conversation) => {
      const contact = database.contacts.find((item) => item.id === conversation.contactId);

      return {
        ...conversation,
        contactName: contact
          ? `${contact.firstName} ${contact.lastName}`
          : "Unknown contact",
      } satisfies CrmConversation;
    })
    .sort((a, b) => a.nextResponseDueAt.localeCompare(b.nextResponseDueAt));
}

export async function getConversationById(id: string) {
  return (await listConversations()).find((item) => item.id === id) ?? null;
}

export async function listMessagesForConversation(conversationId: string) {
  return (await loadDatabase()).messages
    .filter((message) => message.conversationId === conversationId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt)) satisfies CrmMessage[];
}

export async function listAppointments() {
  const database = await loadDatabase();

  return database.appointments
    .map((appointment) => {
      const contact = database.contacts.find((item) => item.id === appointment.contactId);

      return {
        ...appointment,
        contactName: contact
          ? `${contact.firstName} ${contact.lastName}`
          : "Unknown contact",
      } satisfies CrmAppointment;
    })
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}

export async function listRemindersForAppointment(appointmentId: string) {
  return (await loadDatabase()).reminders.filter(
    (reminder) => reminder.appointmentId === appointmentId,
  ) satisfies CrmReminder[];
}

export async function listAutomationEnrollments() {
  const database = await loadDatabase();

  return database.automationEnrollments
    .map((enrollment) => {
      const contact = database.contacts.find((item) => item.id === enrollment.contactId);

      return {
        ...enrollment,
        contactName: contact
          ? `${contact.firstName} ${contact.lastName}`
          : "Unknown contact",
      } satisfies CrmAutomationEnrollment;
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function listAutomationRuns() {
  return (await loadDatabase()).automationRuns
    .slice()
    .sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor)) satisfies CrmAutomationRun[];
}

export async function listAutomationRunsForEnrollment(enrollmentId: string) {
  return (await listAutomationRuns()).filter(
    (run) => run.enrollmentId === enrollmentId,
  );
}

export function listAutomationTemplates() {
  return automationTemplates;
}

export async function getAutomationSnapshot() {
  const [enrollments, runs] = await Promise.all([
    listAutomationEnrollments(),
    listAutomationRuns(),
  ]);

  return {
    activeEnrollments: enrollments.filter((item) => item.status === "Active").length,
    queuedSteps: runs.filter((item) => item.status === "Queued").length,
    completedSteps: runs.filter((item) => item.status === "Completed").length,
  };
}

export async function getContactById(id: string) {
  const contact = (await loadDatabase()).contacts.find((item) => item.id === id);
  return contact ? mapContactRow(contact) : null;
}

export async function getOpportunityById(id: string) {
  return (await listOpportunities()).find((item) => item.id === id) ?? null;
}

export async function listTasksForRecord(
  relatedType: "contact" | "opportunity",
  relatedId: string,
) {
  return (await listTasks()).filter(
    (task) => task.relatedType === relatedType && task.relatedId === relatedId,
  );
}

export async function listOpportunitiesForContact(contactId: string) {
  return (await listOpportunities()).filter((item) => item.contactId === contactId);
}

export async function createContact(input: unknown) {
  const data = contactSchema.parse(input);
  const database = await loadDatabase();
  const contactId = randomUUID();
  const now = new Date().toISOString();

  database.contacts.unshift({
      id: contactId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      leadSource: data.leadSource,
      membershipInterest: data.membershipInterest,
      trainingGoal: data.trainingGoal,
      preferredLocationId: data.preferredLocationId,
      lifecycleStage: "New lead",
      trialStatus: "Not started",
      waiverStatus: "Pending",
      consentStatus: "Pending",
      createdAt: now,
    });
  addActivity(database, {
    eventType: "contact.created",
    title: `Created contact ${data.firstName} ${data.lastName}`,
    description: `${data.leadSource} lead interested in ${data.membershipInterest}.`,
    actorName: "CRM",
    relatedType: "contact",
    relatedId: contactId,
    contactId,
    createdAt: now,
  });

  await saveDatabase(database);
}

export async function createOpportunity(input: unknown) {
  const data = opportunitySchema.parse(input);
  const database = await loadDatabase();
  const opportunityId = randomUUID();
  const contact = database.contacts.find((item) => item.id === data.contactId);
  const now = new Date().toISOString();

  database.opportunities.unshift({
      id: opportunityId,
      contactId: data.contactId,
      pipelineId: "pipeline-sales",
      stageName: data.stageName,
      ownerName: data.ownerName,
      value: data.value,
      nextAction: data.nextAction,
      outcome: "Open",
      createdAt: now,
    });
  addActivity(database, {
    eventType: "opportunity.created",
    title: "Created opportunity",
    description: `${contact ? `${contact.firstName} ${contact.lastName}` : "Lead"} entered ${data.stageName} with $${data.value.toLocaleString()} projected value.`,
    actorName: data.ownerName,
    relatedType: "opportunity",
    relatedId: opportunityId,
    contactId: data.contactId,
    createdAt: now,
  });

  await saveDatabase(database);
}

export async function updateContact(input: unknown) {
  const data = contactUpdateSchema.parse(input);
  const database = await loadDatabase();
  const contact = database.contacts.find((item) => item.id === data.id);

  if (!contact) {
    return;
  }

  contact.firstName = data.firstName;
  contact.lastName = data.lastName;
  contact.email = data.email;
  contact.phone = data.phone;
  contact.lifecycleStage = data.lifecycleStage;
  contact.membershipInterest = data.membershipInterest;
  contact.trainingGoal = data.trainingGoal;
  addActivity(database, {
    eventType: "contact.updated",
    title: "Updated contact profile",
    description: `${contact.firstName} ${contact.lastName} is now marked ${contact.lifecycleStage}.`,
    actorName: "CRM",
    relatedType: "contact",
    relatedId: contact.id,
    contactId: contact.id,
  });
  await saveDatabase(database);
}

export async function updateOpportunity(input: unknown) {
  const data = opportunityUpdateSchema.parse(input);
  const database = await loadDatabase();
  const opportunity = database.opportunities.find((item) => item.id === data.id);

  if (!opportunity) {
    return;
  }

  opportunity.ownerName = data.ownerName;
  opportunity.value = data.value;
  opportunity.nextAction = data.nextAction;
  addActivity(database, {
    eventType: "opportunity.updated",
    title: "Updated opportunity details",
    description: `${data.ownerName} set the deal value to $${data.value.toLocaleString()} and updated the next action.`,
    actorName: data.ownerName,
    relatedType: "opportunity",
    relatedId: opportunity.id,
    contactId: opportunity.contactId,
  });
  await saveDatabase(database);
}

export async function updateOpportunityStage(input: unknown) {
  const data = stageSchema.parse(input);
  const database = await loadDatabase();
  const opportunity = database.opportunities.find((item) => item.id === data.id);

  if (!opportunity) {
    return;
  }

  opportunity.stageName = data.stageName;
  opportunity.outcome = data.outcome;
  addActivity(database, {
    eventType: "opportunity.stage_changed",
    title: `Moved opportunity to ${data.stageName}`,
    description: `Outcome is now ${data.outcome}.`,
    actorName: opportunity.ownerName,
    relatedType: "opportunity",
    relatedId: opportunity.id,
    contactId: opportunity.contactId,
  });
  await saveDatabase(database);
}

export async function createTask(input: unknown) {
  const data = taskSchema.parse(input);
  const database = await loadDatabase();
  const taskId = randomUUID();
  const contactId =
    data.relatedType === "contact"
      ? data.relatedId
      : database.opportunities.find((item) => item.id === data.relatedId)?.contactId ??
        null;
  const now = new Date().toISOString();

  database.tasks.unshift({
    id: taskId,
    title: data.title,
    status: "Open",
    relatedType: data.relatedType,
    relatedId: data.relatedId,
    ownerName: data.ownerName,
    dueLabel: data.dueLabel,
    createdAt: now,
  });
  addActivity(database, {
    eventType: "task.created",
    title: `Created task: ${data.title}`,
    description: `${data.ownerName} owns this follow-up, due ${data.dueLabel}.`,
    actorName: data.ownerName,
    relatedType: data.relatedType,
    relatedId: data.relatedId,
    contactId,
    createdAt: now,
  });

  await saveDatabase(database);
}

export async function createMessage(input: unknown) {
  const data = messageSchema.parse(input);
  const database = await loadDatabase();
  const conversation = database.conversations.find(
    (item) => item.id === data.conversationId,
  );

  if (!conversation) {
    return;
  }

  const now = new Date().toISOString();

  database.messages.push({
    id: randomUUID(),
    conversationId: data.conversationId,
    direction: "outbound",
    body: data.body,
    sentBy: data.sentBy,
    createdAt: now,
  });

  conversation.lastMessage = data.body;
  conversation.status = "On track";
  conversation.nextResponseDueAt = new Date(
    Date.now() + 1000 * 60 * 60 * 24,
  ).toISOString();
  addActivity(database, {
    eventType: "message.sent",
    title: `Sent ${conversation.channel} message`,
    description: data.body,
    actorName: data.sentBy,
    relatedType: "conversation",
    relatedId: conversation.id,
    contactId: conversation.contactId,
    createdAt: now,
  });
  await saveDatabase(database);
}

export async function ingestMetaLead(input: unknown) {
  const data = metaLeadSchema.parse(input);
  const database = await loadDatabase();
  const contactId = randomUUID();
  const opportunityId = randomUUID();
  const conversationId = randomUUID();
  const automationEnrollmentId = randomUUID();
  const now = new Date();

  database.contacts.unshift({
    id: contactId,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    leadSource: data.leadSource,
    membershipInterest: data.membershipInterest,
    trainingGoal: data.trainingGoal,
    preferredLocationId: data.preferredLocationId,
    lifecycleStage: "New lead",
    trialStatus: "Not started",
    waiverStatus: "Pending",
    consentStatus: "Pending",
    createdAt: now.toISOString(),
  });

  database.opportunities.unshift({
    id: opportunityId,
    contactId,
    pipelineId: "pipeline-sales",
    stageName: "New lead",
    ownerName: data.ownerName,
    value: 249,
    nextAction: "Respond immediately and offer a tour or intro consult.",
    outcome: "Open",
    createdAt: now.toISOString(),
  });

  database.conversations.unshift({
    id: conversationId,
    contactId,
    channel: data.channel,
    ownerName: data.ownerName,
    status: "At risk",
    lastMessage: data.message,
    nextResponseDueAt: new Date(Date.now() + 1000 * 60 * 15).toISOString(),
    createdAt: now.toISOString(),
  });

  database.messages.push({
    id: randomUUID(),
    conversationId,
    direction: "inbound",
    body: data.message,
    sentBy: `${data.firstName} ${data.lastName}`,
    createdAt: now.toISOString(),
  });

  database.tasks.unshift({
    id: randomUUID(),
    title: `Reply to ${data.firstName} from ${data.channel}`,
    status: "Open",
    relatedType: "contact",
    relatedId: contactId,
    ownerName: data.ownerName,
    dueLabel: "Within 15 min",
    createdAt: now.toISOString(),
  });
  addActivity(database, {
    eventType: "meta.lead.created",
    title: `Ingested ${data.channel} lead`,
    description: `${data.firstName} ${data.lastName} was added to contacts, opportunities, inbox, tasks, and automations.`,
    actorName: data.channel,
    relatedType: "contact",
    relatedId: contactId,
    contactId,
    createdAt: now.toISOString(),
  });

  database.automationEnrollments.unshift({
    id: automationEnrollmentId,
    templateId: "wf-meta-speed-to-lead",
    templateName: "Meta lead speed to lead",
    sourceType: "contact",
    sourceId: contactId,
    contactId,
    ownerName: data.ownerName,
    status: "Active",
    createdAt: now.toISOString(),
  });

  database.automationRuns.push(
    {
      id: randomUUID(),
      enrollmentId: automationEnrollmentId,
      templateId: "wf-meta-speed-to-lead",
      event: "meta.lead.created",
      stepLabel: "Assign owner",
      status: "Completed",
      scheduledFor: now.toISOString(),
      createdAt: now.toISOString(),
    },
    {
      id: randomUUID(),
      enrollmentId: automationEnrollmentId,
      templateId: "wf-meta-speed-to-lead",
      event: "meta.lead.created",
      stepLabel: "Reply on social and invite to book",
      status: "Queued",
      scheduledFor: new Date(now.getTime() + 1000 * 60 * 5).toISOString(),
      createdAt: now.toISOString(),
    },
    {
      id: randomUUID(),
      enrollmentId: automationEnrollmentId,
      templateId: "wf-meta-speed-to-lead",
      event: "meta.lead.created",
      stepLabel: "Create fallback call task",
      status: "Queued",
      scheduledFor: new Date(now.getTime() + 1000 * 60 * 20).toISOString(),
      createdAt: now.toISOString(),
    },
  );
  addActivity(database, {
    eventType: "workflow.triggered",
    title: "Started Meta speed-to-lead automation",
    description: "Queued social reply and fallback call task for this new lead.",
    actorName: "Automation",
    relatedType: "automation",
    relatedId: automationEnrollmentId,
    contactId,
    createdAt: now.toISOString(),
  });

  await saveDatabase(database);

  return {
    contactId,
    opportunityId,
    conversationId,
  };
}

export async function createAppointment(input: unknown) {
  const data = appointmentSchema.parse(input);
  const database = await loadDatabase();
  const appointmentId = randomUUID();
  const automationEnrollmentId = randomUUID();
  const now = new Date();

  database.appointments.push({
    id: appointmentId,
    contactId: data.contactId,
    opportunityId: data.opportunityId ?? null,
    title: data.title,
    ownerName: data.ownerName,
    startsAt: data.startsAt,
    locationName: data.locationName,
    appointmentType: data.appointmentType,
    status: "Scheduled",
    createdAt: now.toISOString(),
  });

  database.reminders.push(
    {
      id: randomUUID(),
      appointmentId,
      channel: "SMS",
      offsetMinutes: -1440,
      status: "Pending",
      createdAt: now.toISOString(),
    },
    {
      id: randomUUID(),
      appointmentId,
      channel: "SMS",
      offsetMinutes: -30,
      status: "Pending",
      createdAt: now.toISOString(),
    },
  );
  addActivity(database, {
    eventType: "appointment.booked",
    title: `Booked ${data.appointmentType}`,
    description: `${data.title} is scheduled at ${data.locationName}.`,
    actorName: data.ownerName,
    relatedType: "appointment",
    relatedId: appointmentId,
    contactId: data.contactId,
    createdAt: now.toISOString(),
  });

  database.automationEnrollments.unshift({
    id: automationEnrollmentId,
    templateId: "wf-tour-reminders",
    templateName: "Tour reminders and attendance rescue",
    sourceType: "appointment",
    sourceId: appointmentId,
    contactId: data.contactId,
    ownerName: data.ownerName,
    status: "Active",
    createdAt: now.toISOString(),
  });

  database.automationRuns.push(
    {
      id: randomUUID(),
      enrollmentId: automationEnrollmentId,
      templateId: "wf-tour-reminders",
      event: "appointment.booked",
      stepLabel: "Schedule day-before SMS",
      status: "Queued",
      scheduledFor: now.toISOString(),
      createdAt: now.toISOString(),
    },
    {
      id: randomUUID(),
      enrollmentId: automationEnrollmentId,
      templateId: "wf-tour-reminders",
      event: "appointment.booked",
      stepLabel: "Queue 30-minute reminder",
      status: "Queued",
      scheduledFor: now.toISOString(),
      createdAt: now.toISOString(),
    },
  );
  addActivity(database, {
    eventType: "workflow.triggered",
    title: "Started tour reminder automation",
    description: "Queued appointment reminder and attendance rescue steps.",
    actorName: "Automation",
    relatedType: "automation",
    relatedId: automationEnrollmentId,
    contactId: data.contactId,
    createdAt: now.toISOString(),
  });

  await saveDatabase(database);
}

export async function updateAppointmentStatus(input: unknown) {
  const data = appointmentStatusSchema.parse(input);
  const database = await loadDatabase();
  const appointment = database.appointments.find((item) => item.id === data.id);

  if (!appointment) {
    return;
  }

  appointment.status = data.status;
  addActivity(database, {
    eventType: "appointment.status_changed",
    title: `Marked appointment ${data.status}`,
    description: `${appointment.title} is now ${data.status}.`,
    actorName: appointment.ownerName,
    relatedType: "appointment",
    relatedId: appointment.id,
    contactId: appointment.contactId,
  });

  if (data.status !== "Scheduled") {
    for (const enrollment of database.automationEnrollments) {
      if (enrollment.sourceType === "appointment" && enrollment.sourceId === appointment.id) {
        enrollment.status = "Completed";
      }
    }
  }

  await saveDatabase(database);
}

export async function enrollAutomation(input: unknown) {
  const data = enrollAutomationSchema.parse(input);
  const database = await loadDatabase();
  const template = automationTemplates.find((item) => item.id === data.templateId);

  if (!template) {
    return;
  }

  const enrollmentId = randomUUID();
  const now = new Date();

  database.automationEnrollments.unshift({
    id: enrollmentId,
    templateId: template.id,
    templateName: template.name,
    sourceType: data.sourceType,
    sourceId: data.sourceId,
    contactId: data.contactId,
    ownerName: data.ownerName,
    status: "Active",
    createdAt: now.toISOString(),
  });

  database.automationRuns.push(
    ...template.actions.slice(0, 3).map((action, index) => ({
      id: randomUUID(),
      enrollmentId,
      templateId: template.id,
      event: template.trigger,
      stepLabel: action,
      status: index === 0 ? ("Completed" as const) : ("Queued" as const),
      scheduledFor: new Date(now.getTime() + index * 1000 * 60 * 15).toISOString(),
      createdAt: now.toISOString(),
    })),
  );
  addActivity(database, {
    eventType: "workflow.triggered",
    title: `Started ${template.name}`,
    description: `Queued ${Math.min(template.actions.length, 3)} automation steps for this contact.`,
    actorName: data.ownerName,
    relatedType: "automation",
    relatedId: enrollmentId,
    contactId: data.contactId,
    createdAt: now.toISOString(),
  });

  await saveDatabase(database);
}

function buildAutomationMessage(stepLabel: string, contactName: string) {
  const firstName = contactName.split(" ")[0] ?? "there";
  const lowered = stepLabel.toLowerCase();

  if (lowered.includes("social")) {
    return `Hi ${firstName}, thanks for reaching out to Fitness4All. We’d love to help you get started. Want me to help you book a tour this week?`;
  }

  if (lowered.includes("sms") || lowered.includes("text")) {
    return `Hi ${firstName}, this is Fitness4All checking in. We’re holding space for your next step and can help you book or confirm anytime.`;
  }

  if (lowered.includes("email")) {
    return `Hi ${firstName}, we’ve got everything ready on our side. Reply here and we’ll line up the best next visit or consultation for you.`;
  }

  return `Hi ${firstName}, Fitness4All is following up on your request. Let us know what time works best for your next step.`;
}

function needsOutboundMessage(stepLabel: string) {
  const lowered = stepLabel.toLowerCase();
  return (
    lowered.includes("send") ||
    lowered.includes("reply") ||
    lowered.includes("email") ||
    lowered.includes("sms") ||
    lowered.includes("message")
  );
}

function markEnrollmentCompleteIfDone(
  database: Awaited<ReturnType<typeof loadDatabase>>,
  enrollmentId: string,
) {
  const enrollment = database.automationEnrollments.find(
    (item) => item.id === enrollmentId,
  );

  if (!enrollment) {
    return;
  }

  const hasQueuedRuns = database.automationRuns.some(
    (run) => run.enrollmentId === enrollmentId && run.status === "Queued",
  );

  enrollment.status = hasQueuedRuns ? "Active" : "Completed";
}

export async function executeQueuedAutomationRuns({
  dueOnly = false,
  limit = 25,
}: {
  dueOnly?: boolean;
  limit?: number;
} = {}) {
  const database = await loadDatabase();
  const nowDate = new Date();
  const now = nowDate.toISOString();
  const queuedRuns = database.automationRuns
    .filter((run) => {
      if (run.status !== "Queued") {
        return false;
      }

      if (!dueOnly) {
        return true;
      }

      return new Date(run.scheduledFor).getTime() <= nowDate.getTime();
    })
    .slice(0, limit);
  let processedCount = 0;

  for (const run of queuedRuns) {
    const enrollment = database.automationEnrollments.find(
      (item) => item.id === run.enrollmentId,
    );

    if (!enrollment) {
      continue;
    }

    const contact = database.contacts.find((item) => item.id === enrollment.contactId);

    if (!contact) {
      continue;
    }

    const contactName = `${contact.firstName} ${contact.lastName}`;

    if (needsOutboundMessage(run.stepLabel)) {
      let conversation = database.conversations.find(
        (item) => item.contactId === enrollment.contactId,
      );

      if (!conversation) {
        conversation = {
          id: randomUUID(),
          contactId: enrollment.contactId,
          channel: "SMS",
          ownerName: enrollment.ownerName,
          status: "On track",
          lastMessage: "",
          nextResponseDueAt: now,
          createdAt: now,
        };
        database.conversations.unshift(conversation);
      }

      const body = buildAutomationMessage(run.stepLabel, contactName);

      database.messages.push({
        id: randomUUID(),
        conversationId: conversation.id,
        direction: "outbound",
        body,
        sentBy: enrollment.ownerName,
        createdAt: now,
      });

      conversation.lastMessage = body;
      conversation.status = "On track";
      conversation.ownerName = enrollment.ownerName;
      conversation.nextResponseDueAt = new Date(
        Date.now() + 1000 * 60 * 60 * 12,
      ).toISOString();
      addActivity(database, {
        eventType: "automation.message_sent",
        title: `Automation sent message: ${run.stepLabel}`,
        description: body,
        actorName: "Automation",
        relatedType: "automation",
        relatedId: enrollment.id,
        contactId: enrollment.contactId,
        createdAt: now,
      });
    } else {
      database.tasks.unshift({
        id: randomUUID(),
        title: `${run.stepLabel} for ${contact.firstName}`,
        status: "Open",
        relatedType: "contact",
        relatedId: enrollment.contactId,
        ownerName: enrollment.ownerName,
        dueLabel: "Today",
        createdAt: now,
      });
      addActivity(database, {
        eventType: "automation.task_created",
        title: `Automation created task: ${run.stepLabel}`,
        description: `${enrollment.ownerName} owns the next follow-up for ${contactName}.`,
        actorName: "Automation",
        relatedType: "automation",
        relatedId: enrollment.id,
        contactId: enrollment.contactId,
        createdAt: now,
      });
    }

    run.status = "Completed";
    run.scheduledFor = now;
    processedCount += 1;
    markEnrollmentCompleteIfDone(database, enrollment.id);
  }

  await saveDatabase(database);

  return {
    processedCount,
  };
}

export async function updateTaskStatus(input: unknown) {
  const data = taskStatusSchema.parse(input);
  const database = await loadDatabase();
  const task = database.tasks.find((item) => item.id === data.id);

  if (!task) {
    return;
  }

  task.status = data.status;
  addActivity(database, {
    eventType: "task.status_changed",
    title: `Marked task ${data.status}`,
    description: task.title,
    actorName: task.ownerName,
    relatedType: task.relatedType,
    relatedId: task.relatedId,
    contactId:
      task.relatedType === "contact"
        ? task.relatedId
        : database.opportunities.find((item) => item.id === task.relatedId)?.contactId ??
          null,
  });
  await saveDatabase(database);
}

export function getLocations() {
  return demoData.locations;
}

export function getPipelineStages() {
  return demoData.pipelines[0].stages;
}
