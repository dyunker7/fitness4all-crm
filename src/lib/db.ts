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

export type CrmDatabase = {
  contacts: ContactRecord[];
  opportunities: OpportunityRecord[];
  tasks: TaskRecord[];
  users: UserRecord[];
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

      const existingUsers = await sql`SELECT COUNT(*)::int AS count FROM users`;
      if (existingUsers[0].count === 0) {
        await savePostgresDatabase(defaultDatabase);
      }
    })();
  }

  await postgresReady;
}

async function loadPostgresDatabase(): Promise<CrmDatabase> {
  await ensurePostgres();

  if (!sql) {
    return structuredClone(defaultDatabase);
  }

  const [contacts, opportunities, tasks, users] = await Promise.all([
    sql`SELECT * FROM contacts ORDER BY created_at DESC`,
    sql`SELECT * FROM opportunities ORDER BY created_at DESC`,
    sql`SELECT * FROM tasks ORDER BY created_at DESC`,
    sql`SELECT * FROM users ORDER BY created_at DESC`,
  ]);

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
  };
}

async function savePostgresDatabase(data: CrmDatabase) {
  await ensurePostgres();

  if (!sql) {
    return;
  }

  await sql.begin(async (tx) => {
    await tx`DELETE FROM tasks`;
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
  });
}

export async function loadDatabase() {
  if (sql) {
    return loadPostgresDatabase();
  }

  return loadFileDatabase();
}

export async function saveDatabase(data: CrmDatabase) {
  if (sql) {
    await savePostgresDatabase(data);
    return;
  }

  writeFileDatabase(data);
}

export function isUsingPostgres() {
  return Boolean(sql);
}
