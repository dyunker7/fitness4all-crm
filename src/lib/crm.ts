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

  database.contacts.unshift({
      id: randomUUID(),
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
      createdAt: new Date().toISOString(),
    });

  await saveDatabase(database);
}

export async function createOpportunity(input: unknown) {
  const data = opportunitySchema.parse(input);
  const database = await loadDatabase();

  database.opportunities.unshift({
      id: randomUUID(),
      contactId: data.contactId,
      pipelineId: "pipeline-sales",
      stageName: data.stageName,
      ownerName: data.ownerName,
      value: data.value,
      nextAction: data.nextAction,
      outcome: "Open",
      createdAt: new Date().toISOString(),
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
  await saveDatabase(database);
}

export async function createTask(input: unknown) {
  const data = taskSchema.parse(input);
  const database = await loadDatabase();

  database.tasks.unshift({
    id: randomUUID(),
    title: data.title,
    status: "Open",
    relatedType: data.relatedType,
    relatedId: data.relatedId,
    ownerName: data.ownerName,
    dueLabel: data.dueLabel,
    createdAt: new Date().toISOString(),
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

  database.messages.push({
    id: randomUUID(),
    conversationId: data.conversationId,
    direction: "outbound",
    body: data.body,
    sentBy: data.sentBy,
    createdAt: new Date().toISOString(),
  });

  conversation.lastMessage = data.body;
  conversation.status = "On track";
  conversation.nextResponseDueAt = new Date(
    Date.now() + 1000 * 60 * 60 * 24,
  ).toISOString();
  await saveDatabase(database);
}

export async function ingestMetaLead(input: unknown) {
  const data = metaLeadSchema.parse(input);
  const database = await loadDatabase();
  const contactId = randomUUID();
  const opportunityId = randomUUID();
  const conversationId = randomUUID();

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
    createdAt: new Date().toISOString(),
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
    createdAt: new Date().toISOString(),
  });

  database.conversations.unshift({
    id: conversationId,
    contactId,
    channel: data.channel,
    ownerName: data.ownerName,
    status: "At risk",
    lastMessage: data.message,
    nextResponseDueAt: new Date(Date.now() + 1000 * 60 * 15).toISOString(),
    createdAt: new Date().toISOString(),
  });

  database.messages.push({
    id: randomUUID(),
    conversationId,
    direction: "inbound",
    body: data.message,
    sentBy: `${data.firstName} ${data.lastName}`,
    createdAt: new Date().toISOString(),
  });

  database.tasks.unshift({
    id: randomUUID(),
    title: `Reply to ${data.firstName} from ${data.channel}`,
    status: "Open",
    relatedType: "contact",
    relatedId: contactId,
    ownerName: data.ownerName,
    dueLabel: "Within 15 min",
    createdAt: new Date().toISOString(),
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
    createdAt: new Date().toISOString(),
  });

  database.reminders.push(
    {
      id: randomUUID(),
      appointmentId,
      channel: "SMS",
      offsetMinutes: -1440,
      status: "Pending",
      createdAt: new Date().toISOString(),
    },
    {
      id: randomUUID(),
      appointmentId,
      channel: "SMS",
      offsetMinutes: -30,
      status: "Pending",
      createdAt: new Date().toISOString(),
    },
  );

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
  await saveDatabase(database);
}

export async function updateTaskStatus(input: unknown) {
  const data = taskStatusSchema.parse(input);
  const database = await loadDatabase();
  const task = database.tasks.find((item) => item.id === data.id);

  if (!task) {
    return;
  }

  task.status = data.status;
  await saveDatabase(database);
}

export function getLocations() {
  return demoData.locations;
}

export function getPipelineStages() {
  return demoData.pipelines[0].stages;
}
