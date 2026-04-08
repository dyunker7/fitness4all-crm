import fs from "node:fs";
import path from "node:path";

import { hashSync } from "bcryptjs";
import postgres from "postgres";

import { demoData } from "@/lib/data";

export type ContactRecord = {
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

export type OpportunityRecord = {
  id: string;
  contactId: string;
  pipelineId: string;
  stageName: string;
  ownerName: string;
  value: number;
  nextAction: string;
  outcome: "Open" | "Won";
  createdAt: string;
};

export type TaskRecord = {
  id: string;
  title: string;
  status: "Open" | "Done";
  relatedType: "contact" | "opportunity";
  relatedId: string;
  ownerName: string;
  dueLabel: string;
  createdAt: string;
};

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Sales Manager" | "Sales Rep / Front Desk" | "Trainer" | "Support";
  passwordHash: string;
  createdAt: string;
};

export type ConversationRecord = {
  id: string;
  contactId: string;
  channel: "SMS" | "Email" | "Phone" | "Instagram" | "Facebook" | "WhatsApp" | "Website";
  ownerName: string;
  status: "On track" | "At risk";
  lastMessage: string;
  nextResponseDueAt: string;
  createdAt: string;
};

export type MessageRecord = {
  id: string;
  conversationId: string;
  direction: "inbound" | "outbound";
  body: string;
  sentBy: string;
  createdAt: string;
};

export type AppointmentRecord = {
  id: string;
  contactId: string;
  opportunityId: string | null;
  title: string;
  ownerName: string;
  startsAt: string;
  locationName: string;
  appointmentType: string;
  status: "Scheduled" | "Completed" | "No Show" | "Canceled";
  createdAt: string;
};

export type ReminderRecord = {
  id: string;
  appointmentId: string;
  channel: "SMS" | "Email" | "Phone" | "Instagram" | "Facebook" | "WhatsApp" | "Website";
  offsetMinutes: number;
  status: "Pending" | "Sent" | "Skipped";
  createdAt: string;
};

export type AutomationEnrollmentRecord = {
  id: string;
  templateId: string;
  templateName: string;
  sourceType: "contact" | "opportunity" | "appointment";
  sourceId: string;
  contactId: string;
  ownerName: string;
  status: "Active" | "Completed";
  createdAt: string;
};

export type AutomationRunRecord = {
  id: string;
  enrollmentId: string;
  templateId: string;
  event: string;
  stepLabel: string;
  status: "Queued" | "Completed";
  scheduledFor: string;
  createdAt: string;
};

export type CrmDatabase = {
  contacts: ContactRecord[];
  opportunities: OpportunityRecord[];
  tasks: TaskRecord[];
  users: UserRecord[];
  conversations: ConversationRecord[];
  messages: MessageRecord[];
  appointments: AppointmentRecord[];
  reminders: ReminderRecord[];
  automationEnrollments: AutomationEnrollmentRecord[];
  automationRuns: AutomationRunRecord[];
};

const seededPasswordHash = hashSync("fitness4all123", 10);

const defaultDatabase: CrmDatabase = {
  contacts: demoData.contacts.map((contact) => ({
    ...contact,
    createdAt: new Date().toISOString(),
  })),
  opportunities: demoData.opportunities.map((opportunity) => ({
    ...opportunity,
    createdAt: new Date().toISOString(),
  })),
  tasks: demoData.tasks.map((task, index) => ({
    id: task.id,
    title: task.title,
    status: task.status,
    relatedType: index % 2 === 0 ? "contact" : "opportunity",
    relatedId: index % 2 === 0 ? demoData.contacts[0].id : demoData.opportunities[0].id,
    ownerName: index % 2 === 0 ? "Avery Cole" : "Lena Patel",
    dueLabel: index % 2 === 0 ? "Today" : "Tomorrow",
    createdAt: new Date().toISOString(),
  })),
  users: [
    {
      id: "user-admin",
      name: "Dave Yunker",
      email: "admin@fitness4allcrm.com",
      role: "Admin",
      passwordHash: seededPasswordHash,
      createdAt: new Date().toISOString(),
    },
    {
      id: "user-manager",
      name: "Avery Cole",
      email: "manager@fitness4allcrm.com",
      role: "Sales Manager",
      passwordHash: seededPasswordHash,
      createdAt: new Date().toISOString(),
    },
    {
      id: "user-rep",
      name: "Lena Patel",
      email: "rep@fitness4allcrm.com",
      role: "Sales Rep / Front Desk",
      passwordHash: seededPasswordHash,
      createdAt: new Date().toISOString(),
    },
  ],
  conversations: demoData.conversations.map((conversation, index) => ({
    id: conversation.id,
    contactId: demoData.contacts[index]?.id ?? demoData.contacts[0].id,
    channel: conversation.channel,
    ownerName: conversation.ownerName,
    status: conversation.status,
    lastMessage: conversation.lastMessage,
    nextResponseDueAt: conversation.nextResponseDueAt,
    createdAt: new Date().toISOString(),
  })),
  messages: demoData.conversations.map((conversation, index) => ({
    id: `${conversation.id}-seed-1`,
    conversationId: conversation.id,
    direction: "inbound" as const,
    body: conversation.lastMessage,
    sentBy: demoData.contacts[index]
      ? `${demoData.contacts[index].firstName} ${demoData.contacts[index].lastName}`
      : "Lead",
    createdAt: new Date().toISOString(),
  })),
  appointments: [
    {
      id: "appt-1",
      contactId: demoData.contacts[0].id,
      opportunityId: demoData.opportunities[0].id,
      title: "Saturday intro tour",
      ownerName: "Avery Cole",
      startsAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      locationName: "Midtown Club",
      appointmentType: "Tour",
      status: "Scheduled",
      createdAt: new Date().toISOString(),
    },
    {
      id: "appt-2",
      contactId: demoData.contacts[1].id,
      opportunityId: demoData.opportunities[1].id,
      title: "Trial follow-up consult",
      ownerName: "Lena Patel",
      startsAt: new Date(Date.now() + 1000 * 60 * 60 * 30).toISOString(),
      locationName: "Midtown Club",
      appointmentType: "Consult",
      status: "Scheduled",
      createdAt: new Date().toISOString(),
    },
  ],
  reminders: [
    {
      id: "rem-1",
      appointmentId: "appt-1",
      channel: "SMS",
      offsetMinutes: -1440,
      status: "Pending",
      createdAt: new Date().toISOString(),
    },
    {
      id: "rem-2",
      appointmentId: "appt-1",
      channel: "SMS",
      offsetMinutes: -30,
      status: "Pending",
      createdAt: new Date().toISOString(),
    },
    {
      id: "rem-3",
      appointmentId: "appt-2",
      channel: "Email",
      offsetMinutes: -180,
      status: "Pending",
      createdAt: new Date().toISOString(),
    },
  ],
  automationEnrollments: [
    {
      id: "auto-enrollment-1",
      templateId: "wf-new-lead",
      templateName: "New lead nurture",
      sourceType: "contact",
      sourceId: demoData.contacts[0].id,
      contactId: demoData.contacts[0].id,
      ownerName: "Avery Cole",
      status: "Active",
      createdAt: new Date().toISOString(),
    },
    {
      id: "auto-enrollment-2",
      templateId: "wf-trial-convert",
      templateName: "Trial to membership conversion",
      sourceType: "appointment",
      sourceId: "appt-2",
      contactId: demoData.contacts[1].id,
      ownerName: "Lena Patel",
      status: "Active",
      createdAt: new Date().toISOString(),
    },
  ],
  automationRuns: [
    {
      id: "auto-run-1",
      enrollmentId: "auto-enrollment-1",
      templateId: "wf-new-lead",
      event: "meta.lead.created",
      stepLabel: "Assign owner",
      status: "Completed",
      scheduledFor: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: "auto-run-2",
      enrollmentId: "auto-enrollment-1",
      templateId: "wf-new-lead",
      event: "meta.lead.created",
      stepLabel: "Send welcome SMS",
      status: "Queued",
      scheduledFor: new Date(Date.now() + 1000 * 60 * 5).toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: "auto-run-3",
      enrollmentId: "auto-enrollment-2",
      templateId: "wf-trial-convert",
      event: "appointment.booked",
      stepLabel: "Send trial prep email",
      status: "Queued",
      scheduledFor: new Date(Date.now() + 1000 * 60 * 10).toISOString(),
      createdAt: new Date().toISOString(),
    },
  ],
};

const candidatePaths = [
  path.join(process.cwd(), "data", "crm.json"),
  path.join("/tmp", "fitness4all-crm.json"),
];

function pickDatabaseUrl() {
  const candidates = [
    process.env.POSTGRES_URL_NON_POOLING,
    process.env.POSTGRES_URL,
    process.env.DATABASE_URL,
  ].filter(Boolean) as string[];

  return candidates.find((value) => !value.startsWith("prisma://")) ?? null;
}

const databaseUrl = pickDatabaseUrl();
const sql = databaseUrl
  ? postgres(databaseUrl, {
      ssl: "require",
      max: 1,
      prepare: false,
    })
  : null;

let postgresReady: Promise<void> | null = null;
const POSTGRES_TIMEOUT_MS = 2500;

function ensureDirectory(filePath: string) {
  const directory = path.dirname(filePath);

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

function getReadablePath() {
  return candidatePaths.find((filePath) => fs.existsSync(filePath));
}

function getWritablePath() {
  for (const filePath of candidatePaths) {
    try {
      ensureDirectory(filePath);
      fs.accessSync(path.dirname(filePath), fs.constants.W_OK);
      return filePath;
    } catch {}
  }

  return candidatePaths[candidatePaths.length - 1];
}

function writeFileDatabase(data: CrmDatabase) {
  const filePath = getWritablePath();
  ensureDirectory(filePath);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function loadFileDatabase() {
  const filePath = getReadablePath();

  if (!filePath) {
    writeFileDatabase(defaultDatabase);
    return structuredClone(defaultDatabase);
  }

  const content = fs.readFileSync(filePath, "utf8");
  return JSON.parse(content) as CrmDatabase;
}

async function ensurePostgres() {
  if (!sql) {
    return;
  }

  if (!postgresReady) {
    postgresReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS contacts (
          id TEXT PRIMARY KEY,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT NOT NULL,
          lead_source TEXT NOT NULL,
          membership_interest TEXT NOT NULL,
          training_goal TEXT NOT NULL,
          preferred_location_id TEXT NOT NULL,
          lifecycle_stage TEXT NOT NULL,
          trial_status TEXT NOT NULL,
          waiver_status TEXT NOT NULL,
          consent_status TEXT NOT NULL,
          created_at TEXT NOT NULL
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS opportunities (
          id TEXT PRIMARY KEY,
          contact_id TEXT NOT NULL,
          pipeline_id TEXT NOT NULL,
          stage_name TEXT NOT NULL,
          owner_name TEXT NOT NULL,
          value INTEGER NOT NULL,
          next_action TEXT NOT NULL,
          outcome TEXT NOT NULL,
          created_at TEXT NOT NULL
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS tasks (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          status TEXT NOT NULL,
          related_type TEXT NOT NULL,
          related_id TEXT NOT NULL,
          owner_name TEXT NOT NULL,
          due_label TEXT NOT NULL,
          created_at TEXT NOT NULL
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          role TEXT NOT NULL,
          password_hash TEXT NOT NULL,
          created_at TEXT NOT NULL
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS conversations (
          id TEXT PRIMARY KEY,
          contact_id TEXT NOT NULL,
          channel TEXT NOT NULL,
          owner_name TEXT NOT NULL,
          status TEXT NOT NULL,
          last_message TEXT NOT NULL,
          next_response_due_at TEXT NOT NULL,
          created_at TEXT NOT NULL
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS messages (
          id TEXT PRIMARY KEY,
          conversation_id TEXT NOT NULL,
          direction TEXT NOT NULL,
          body TEXT NOT NULL,
          sent_by TEXT NOT NULL,
          created_at TEXT NOT NULL
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS appointments (
          id TEXT PRIMARY KEY,
          contact_id TEXT NOT NULL,
          opportunity_id TEXT,
          title TEXT NOT NULL,
          owner_name TEXT NOT NULL,
          starts_at TEXT NOT NULL,
          location_name TEXT NOT NULL,
          appointment_type TEXT NOT NULL,
          status TEXT NOT NULL,
          created_at TEXT NOT NULL
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS reminders (
          id TEXT PRIMARY KEY,
          appointment_id TEXT NOT NULL,
          channel TEXT NOT NULL,
          offset_minutes INTEGER NOT NULL,
          status TEXT NOT NULL,
          created_at TEXT NOT NULL
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS automation_enrollments (
          id TEXT PRIMARY KEY,
          template_id TEXT NOT NULL,
          template_name TEXT NOT NULL,
          source_type TEXT NOT NULL,
          source_id TEXT NOT NULL,
          contact_id TEXT NOT NULL,
          owner_name TEXT NOT NULL,
          status TEXT NOT NULL,
          created_at TEXT NOT NULL
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS automation_runs (
          id TEXT PRIMARY KEY,
          enrollment_id TEXT NOT NULL,
          template_id TEXT NOT NULL,
          event TEXT NOT NULL,
          step_label TEXT NOT NULL,
          status TEXT NOT NULL,
          scheduled_for TEXT NOT NULL,
          created_at TEXT NOT NULL
        )
      `;

      const existingUsers = await sql`SELECT COUNT(*)::int AS count FROM users`;
      if (existingUsers[0].count === 0) {
        await savePostgresDatabase(defaultDatabase);
      }
    })();
  }

  await postgresReady;
}

async function withTimeout<T>(promise: Promise<T>, label: string) {
  return await Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`${label} timed out`)), POSTGRES_TIMEOUT_MS);
    }),
  ]);
}

async function loadPostgresDatabase(): Promise<CrmDatabase> {
  await withTimeout(ensurePostgres(), "Postgres init");

  if (!sql) {
    return structuredClone(defaultDatabase);
  }

  const [contacts, opportunities, tasks, users, conversations, messages, appointments, reminders, automationEnrollments, automationRuns] = await withTimeout(
    Promise.all([
      sql`SELECT * FROM contacts ORDER BY created_at DESC`,
      sql`SELECT * FROM opportunities ORDER BY created_at DESC`,
      sql`SELECT * FROM tasks ORDER BY created_at DESC`,
      sql`SELECT * FROM users ORDER BY created_at DESC`,
      sql`SELECT * FROM conversations ORDER BY created_at DESC`,
      sql`SELECT * FROM messages ORDER BY created_at ASC`,
      sql`SELECT * FROM appointments ORDER BY starts_at ASC`,
      sql`SELECT * FROM reminders ORDER BY created_at ASC`,
      sql`SELECT * FROM automation_enrollments ORDER BY created_at DESC`,
      sql`SELECT * FROM automation_runs ORDER BY scheduled_for ASC`,
    ]),
    "Postgres query",
  );

  return {
    contacts: contacts.map((row) => ({
      id: row.id,
      firstName: row.first_name,
      lastName: row.last_name,
      email: row.email,
      phone: row.phone,
      leadSource: row.lead_source,
      membershipInterest: row.membership_interest,
      trainingGoal: row.training_goal,
      preferredLocationId: row.preferred_location_id,
      lifecycleStage: row.lifecycle_stage,
      trialStatus: row.trial_status,
      waiverStatus: row.waiver_status,
      consentStatus: row.consent_status,
      createdAt: row.created_at,
    })),
    opportunities: opportunities.map((row) => ({
      id: row.id,
      contactId: row.contact_id,
      pipelineId: row.pipeline_id,
      stageName: row.stage_name,
      ownerName: row.owner_name,
      value: Number(row.value),
      nextAction: row.next_action,
      outcome: row.outcome,
      createdAt: row.created_at,
    })),
    tasks: tasks.map((row) => ({
      id: row.id,
      title: row.title,
      status: row.status,
      relatedType: row.related_type,
      relatedId: row.related_id,
      ownerName: row.owner_name,
      dueLabel: row.due_label,
      createdAt: row.created_at,
    })),
    users: users.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role,
      passwordHash: row.password_hash,
      createdAt: row.created_at,
    })),
    conversations: conversations.map((row) => ({
      id: row.id,
      contactId: row.contact_id,
      channel: row.channel,
      ownerName: row.owner_name,
      status: row.status,
      lastMessage: row.last_message,
      nextResponseDueAt: row.next_response_due_at,
      createdAt: row.created_at,
    })),
    messages: messages.map((row) => ({
      id: row.id,
      conversationId: row.conversation_id,
      direction: row.direction,
      body: row.body,
      sentBy: row.sent_by,
      createdAt: row.created_at,
    })),
    appointments: appointments.map((row) => ({
      id: row.id,
      contactId: row.contact_id,
      opportunityId: row.opportunity_id,
      title: row.title,
      ownerName: row.owner_name,
      startsAt: row.starts_at,
      locationName: row.location_name,
      appointmentType: row.appointment_type,
      status: row.status,
      createdAt: row.created_at,
    })),
    reminders: reminders.map((row) => ({
      id: row.id,
      appointmentId: row.appointment_id,
      channel: row.channel,
      offsetMinutes: Number(row.offset_minutes),
      status: row.status,
      createdAt: row.created_at,
    })),
    automationEnrollments: automationEnrollments.map((row) => ({
      id: row.id,
      templateId: row.template_id,
      templateName: row.template_name,
      sourceType: row.source_type,
      sourceId: row.source_id,
      contactId: row.contact_id,
      ownerName: row.owner_name,
      status: row.status,
      createdAt: row.created_at,
    })),
    automationRuns: automationRuns.map((row) => ({
      id: row.id,
      enrollmentId: row.enrollment_id,
      templateId: row.template_id,
      event: row.event,
      stepLabel: row.step_label,
      status: row.status,
      scheduledFor: row.scheduled_for,
      createdAt: row.created_at,
    })),
  };
}

async function savePostgresDatabase(data: CrmDatabase) {
  await withTimeout(ensurePostgres(), "Postgres init");

  if (!sql) {
    return;
  }

  await withTimeout(
    sql.begin(async (tx) => {
      await tx`DELETE FROM tasks`;
      await tx`DELETE FROM messages`;
      await tx`DELETE FROM conversations`;
      await tx`DELETE FROM reminders`;
      await tx`DELETE FROM appointments`;
      await tx`DELETE FROM automation_runs`;
      await tx`DELETE FROM automation_enrollments`;
      await tx`DELETE FROM opportunities`;
      await tx`DELETE FROM contacts`;
      await tx`DELETE FROM users`;

      for (const user of data.users) {
        await tx`
          INSERT INTO users (id, name, email, role, password_hash, created_at)
          VALUES (${user.id}, ${user.name}, ${user.email}, ${user.role}, ${user.passwordHash}, ${user.createdAt})
        `;
      }

      for (const contact of data.contacts) {
        await tx`
          INSERT INTO contacts (
            id, first_name, last_name, email, phone, lead_source, membership_interest,
            training_goal, preferred_location_id, lifecycle_stage, trial_status,
            waiver_status, consent_status, created_at
          ) VALUES (
            ${contact.id}, ${contact.firstName}, ${contact.lastName}, ${contact.email}, ${contact.phone},
            ${contact.leadSource}, ${contact.membershipInterest}, ${contact.trainingGoal},
            ${contact.preferredLocationId}, ${contact.lifecycleStage}, ${contact.trialStatus},
            ${contact.waiverStatus}, ${contact.consentStatus}, ${contact.createdAt}
          )
        `;
      }

      for (const opportunity of data.opportunities) {
        await tx`
          INSERT INTO opportunities (
            id, contact_id, pipeline_id, stage_name, owner_name, value,
            next_action, outcome, created_at
          ) VALUES (
            ${opportunity.id}, ${opportunity.contactId}, ${opportunity.pipelineId},
            ${opportunity.stageName}, ${opportunity.ownerName}, ${opportunity.value},
            ${opportunity.nextAction}, ${opportunity.outcome}, ${opportunity.createdAt}
          )
        `;
      }

      for (const task of data.tasks) {
        await tx`
          INSERT INTO tasks (
            id, title, status, related_type, related_id, owner_name, due_label, created_at
          ) VALUES (
            ${task.id}, ${task.title}, ${task.status}, ${task.relatedType},
            ${task.relatedId}, ${task.ownerName}, ${task.dueLabel}, ${task.createdAt}
          )
        `;
      }

      for (const conversation of data.conversations) {
        await tx`
          INSERT INTO conversations (
            id, contact_id, channel, owner_name, status, last_message, next_response_due_at, created_at
          ) VALUES (
            ${conversation.id}, ${conversation.contactId}, ${conversation.channel},
            ${conversation.ownerName}, ${conversation.status}, ${conversation.lastMessage},
            ${conversation.nextResponseDueAt}, ${conversation.createdAt}
          )
        `;
      }

      for (const message of data.messages) {
        await tx`
          INSERT INTO messages (
            id, conversation_id, direction, body, sent_by, created_at
          ) VALUES (
            ${message.id}, ${message.conversationId}, ${message.direction},
            ${message.body}, ${message.sentBy}, ${message.createdAt}
          )
        `;
      }

      for (const appointment of data.appointments) {
        await tx`
          INSERT INTO appointments (
            id, contact_id, opportunity_id, title, owner_name, starts_at, location_name, appointment_type, status, created_at
          ) VALUES (
            ${appointment.id}, ${appointment.contactId}, ${appointment.opportunityId}, ${appointment.title},
            ${appointment.ownerName}, ${appointment.startsAt}, ${appointment.locationName},
            ${appointment.appointmentType}, ${appointment.status}, ${appointment.createdAt}
          )
        `;
      }

      for (const reminder of data.reminders) {
        await tx`
          INSERT INTO reminders (
            id, appointment_id, channel, offset_minutes, status, created_at
          ) VALUES (
            ${reminder.id}, ${reminder.appointmentId}, ${reminder.channel},
            ${reminder.offsetMinutes}, ${reminder.status}, ${reminder.createdAt}
          )
        `;
      }

      for (const enrollment of data.automationEnrollments) {
        await tx`
          INSERT INTO automation_enrollments (
            id, template_id, template_name, source_type, source_id, contact_id, owner_name, status, created_at
          ) VALUES (
            ${enrollment.id}, ${enrollment.templateId}, ${enrollment.templateName},
            ${enrollment.sourceType}, ${enrollment.sourceId}, ${enrollment.contactId},
            ${enrollment.ownerName}, ${enrollment.status}, ${enrollment.createdAt}
          )
        `;
      }

      for (const run of data.automationRuns) {
        await tx`
          INSERT INTO automation_runs (
            id, enrollment_id, template_id, event, step_label, status, scheduled_for, created_at
          ) VALUES (
            ${run.id}, ${run.enrollmentId}, ${run.templateId}, ${run.event},
            ${run.stepLabel}, ${run.status}, ${run.scheduledFor}, ${run.createdAt}
          )
        `;
      }
    }),
    "Postgres write",
  );
}

export async function loadDatabase() {
  if (sql) {
    try {
      return await loadPostgresDatabase();
    } catch {
      return loadFileDatabase();
    }
  }

  return loadFileDatabase();
}

export async function saveDatabase(data: CrmDatabase) {
  if (sql) {
    try {
      await savePostgresDatabase(data);
      return;
    } catch {
      writeFileDatabase(data);
      return;
    }
  }

  writeFileDatabase(data);
}

export function isUsingPostgres() {
  return Boolean(sql);
}
