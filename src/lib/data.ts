import type {
  AppModule,
  ChannelAccount,
  Contact,
  Conversation,
  FormAsset,
  IntegrationStatusCard,
  Location,
  Opportunity,
  Pipeline,
  ReminderRule,
  ReviewCampaign,
  RoadmapPhase,
  RoleDefinition,
  Task,
  WorkflowTemplate,
} from "@/lib/types";

export const navigation = [
  { label: "Overview", href: "#overview" },
  { label: "Workspace", href: "#workspace" },
  { label: "Automation", href: "#automation" },
  { label: "Channels", href: "#channels" },
  { label: "Platform", href: "#platform" },
  { label: "Roadmap", href: "#roadmap" },
];

const locations: Location[] = [
  { id: "loc-midtown", name: "Midtown Club", timezone: "America/New_York" },
  { id: "loc-brooklyn", name: "Brooklyn Training Loft", timezone: "America/New_York" },
];

const contacts: Contact[] = [
  {
    id: "contact-1",
    firstName: "Jasmine",
    lastName: "Reed",
    email: "jasmine@example.com",
    phone: "(917) 555-0142",
    leadSource: "Instagram DM",
    membershipInterest: "Unlimited + small-group training",
    trainingGoal: "Weight loss and accountability coaching",
    preferredLocationId: "loc-midtown",
    lifecycleStage: "Booked tour",
    trialStatus: "Trial pending",
    waiverStatus: "Pending",
    consentStatus: "Opted in",
  },
  {
    id: "contact-2",
    firstName: "Marco",
    lastName: "Ellis",
    email: "marco@example.com",
    phone: "(917) 555-0176",
    leadSource: "Facebook Lead Ad",
    membershipInterest: "6-month membership",
    trainingGoal: "Strength and mobility",
    preferredLocationId: "loc-midtown",
    lifecycleStage: "Trial started",
    trialStatus: "Active",
    waiverStatus: "Signed",
    consentStatus: "Opted in",
  },
  {
    id: "contact-3",
    firstName: "Keisha",
    lastName: "Mills",
    email: "keisha@example.com",
    phone: "(646) 555-0113",
    leadSource: "Website form",
    membershipInterest: "PT starter pack",
    trainingGoal: "Postpartum strength rebuild",
    preferredLocationId: "loc-brooklyn",
    lifecycleStage: "Qualified lead",
    trialStatus: "Not started",
    waiverStatus: "Pending",
    consentStatus: "Pending",
  },
];

const pipelines: Pipeline[] = [
  {
    id: "pipeline-sales",
    name: "Membership Sales",
    stages: [
      { name: "New lead", goal: "Respond inside 5 minutes" },
      { name: "Booked tour", goal: "Confirm reminder cadence" },
      { name: "Trial started", goal: "Convert before final visit" },
      { name: "Membership sold", goal: "Track close-won value" },
      { name: "Win-back", goal: "Reactivate former members" },
    ],
  },
];

const opportunities: Opportunity[] = [
  {
    id: "opp-1",
    contactId: "contact-1",
    pipelineId: "pipeline-sales",
    stageName: "Booked tour",
    ownerName: "Avery Cole",
    value: 249,
    nextAction: "Send day-before SMS reminder and trainer intro",
    outcome: "Open",
  },
  {
    id: "opp-2",
    contactId: "contact-2",
    pipelineId: "pipeline-sales",
    stageName: "Membership sold",
    ownerName: "Lena Patel",
    value: 399,
    nextAction: "Hand off to trainer and request first-week review",
    outcome: "Won",
  },
  {
    id: "opp-3",
    contactId: "contact-3",
    pipelineId: "pipeline-sales",
    stageName: "New lead",
    ownerName: "Avery Cole",
    value: 699,
    nextAction: "Call within 10 minutes and offer body scan booking",
    outcome: "Open",
  },
];

const conversations: Conversation[] = [
  {
    id: "conv-1",
    contactName: "Jasmine Reed",
    channel: "Instagram",
    ownerName: "Avery Cole",
    status: "On track",
    lastMessage: "Can I bring a friend to the Saturday intro class?",
    nextResponseDueAt: "2026-04-07T12:15:00.000Z",
  },
  {
    id: "conv-2",
    contactName: "Marco Ellis",
    channel: "SMS",
    ownerName: "Lena Patel",
    status: "At risk",
    lastMessage: "I might need to push my consult to next week.",
    nextResponseDueAt: "2026-04-07T11:40:00.000Z",
  },
  {
    id: "conv-3",
    contactName: "Keisha Mills",
    channel: "Facebook",
    ownerName: "Avery Cole",
    status: "On track",
    lastMessage: "Just filled out the free body scan form. What times do you have tomorrow?",
    nextResponseDueAt: "2026-04-07T12:30:00.000Z",
  },
];

const reminderRules: ReminderRule[] = [
  {
    id: "reminder-tour",
    name: "Tour confirmation and day-of reminders",
    stopConditions: [
      "appointment canceled",
      "appointment rescheduled",
      "attended",
      "manual suppression",
    ],
    steps: [
      { id: "step-1", channel: "SMS", offsetMinutes: -1440 },
      { id: "step-2", channel: "Email", offsetMinutes: -180 },
      { id: "step-3", channel: "SMS", offsetMinutes: -30 },
    ],
  },
  {
    id: "reminder-trial",
    name: "Trial follow-up and no-show rescue",
    stopConditions: ["membership sold", "manual suppression"],
    steps: [
      { id: "step-4", channel: "SMS", offsetMinutes: -60 },
      { id: "step-5", channel: "Email", offsetMinutes: 120 },
      { id: "step-6", channel: "Facebook", offsetMinutes: 1440 },
    ],
  },
];

const workflowTemplates: WorkflowTemplate[] = [
  {
    id: "wf-new-lead",
    name: "New lead nurture",
    trigger: "form.submitted",
    goal: "Respond fast, book a tour, and assign the right rep",
    actions: ["assign owner", "send SMS", "create task", "wait", "send email"],
  },
  {
    id: "wf-no-show",
    name: "No-show rescue",
    trigger: "appointment.no_show",
    goal: "Recover missed tours before lead intent cools down",
    actions: ["send SMS", "wait", "send email", "move stage", "create task"],
  },
  {
    id: "wf-trial-convert",
    name: "Trial to membership conversion",
    trigger: "appointment.booked",
    goal: "Prompt offers and staff outreach during active trial usage",
    actions: ["add tag", "wait", "ai_suggest_reply", "move stage"],
  },
];

const channelAccounts: ChannelAccount[] = [
  {
    id: "account-instagram",
    name: "Fitness4All NYC",
    platform: "Instagram",
    description: "Business DM inbox and post scheduling account.",
  },
  {
    id: "account-facebook",
    name: "Fitness4All Facebook Page",
    platform: "Facebook",
    description: "Messenger inbox and lead ads webhook source.",
  },
  {
    id: "account-email",
    name: "hello@fitness4all.com",
    platform: "Email",
    description: "Transactional reminders, campaigns, and inbox sync.",
  },
  {
    id: "account-phone",
    name: "Main sales line",
    platform: "Phone",
    description: "Call tracking, click-to-call, and missed-call text back.",
  },
  {
    id: "account-whatsapp",
    name: "Member concierge",
    platform: "WhatsApp",
    description: "Planned for launch wave 2 with provider-specific rules.",
  },
  {
    id: "account-webchat",
    name: "Website chat widget",
    platform: "Website",
    description: "Live lead capture and tour-booking handoff from landing pages.",
  },
];

const integrations: IntegrationStatusCard[] = [
  {
    name: "Meta business integration",
    summary: "Instagram DMs, Facebook Messenger, and lead ads ingestion.",
    status: "Connected",
  },
  {
    name: "Calendar sync",
    summary: "Two-way sync contract ready for Google and Outlook.",
    status: "Planned",
  },
  {
    name: "Reputation stack",
    summary: "Review request automations and source connectors.",
    status: "Planned",
  },
];

const forms: FormAsset[] = [
  {
    id: "form-free-pass",
    name: "7-Day Free Pass",
    type: "Landing Page",
    conversionRate: 18,
    summary: "Hero offer page with embedded booking widget and source attribution.",
  },
  {
    id: "form-body-scan",
    name: "Body Scan Booking Form",
    type: "Form",
    conversionRate: 24,
    summary: "Lead capture form that routes consult requests into the sales pipeline.",
  },
  {
    id: "form-goal-quiz",
    name: "Goal Matching Quiz",
    type: "Quiz",
    conversionRate: 31,
    summary: "Segments leads by goals, budget, and location before follow-up.",
  },
];

const reviewCampaigns: ReviewCampaign[] = [
  {
    id: "review-1",
    name: "New member day-7 request",
    channel: "SMS + email",
    summary:
      "Triggered after the first attended week and paused if the member has a support ticket open.",
  },
  {
    id: "review-2",
    name: "PT milestone celebration",
    channel: "Email",
    summary: "Sent after session 8 with review link and referral CTA.",
  },
];

const modules: AppModule[] = [
  {
    name: "Core CRM",
    summary: "Contacts, companies, custom fields, consent flags, notes, files, and tasks.",
  },
  {
    name: "Conversations",
    summary: "Unified inbox, assignment, templates, attachments, and message states.",
  },
  {
    name: "Calendars & Booking",
    summary: "Appointment types, availability windows, round robin, and reminder triggers.",
  },
  {
    name: "Automation Engine",
    summary: "Typed events, workflows, waits, retries, and provider actions.",
  },
  {
    name: "Campaigns",
    summary: "Segmented outbound broadcasts, nurture sequences, and audience suppression.",
  },
  {
    name: "Sites & Forms",
    summary: "Landing pages, forms, surveys, quizzes, and embedded booking widgets.",
  },
  {
    name: "Reputation",
    summary: "Review requests, response workflows, and source integrations.",
  },
  {
    name: "Memberships",
    summary: "Plans, onboarding docs, waivers, client portal, and community-ready foundation.",
  },
  {
    name: "Reporting",
    summary: "Lead source ROI, close rate, show rate, time-to-response, and churn insights.",
  },
  {
    name: "Admin & Permissions",
    summary: "Multi-location roles, audit logs, retention policy hooks, and settings.",
  },
  {
    name: "AI Services",
    summary: "Reply drafting, missed-reply detection, booking assists, and lead summaries.",
  },
];

const roles: RoleDefinition[] = [
  {
    name: "Admin",
    scope: "All locations",
    description:
      "Full configuration, integrations, reporting, permissions, and security controls.",
  },
  {
    name: "Sales Manager",
    scope: "Assigned locations",
    description:
      "Owns pipelines, team dashboards, workflow approvals, and sales coaching visibility.",
  },
  {
    name: "Sales Rep / Front Desk",
    scope: "Assigned inboxes and leads",
    description:
      "Works conversations, books tours, updates opportunities, and collects follow-up tasks.",
  },
  {
    name: "Trainer",
    scope: "Assigned members and appointments",
    description:
      "Sees schedules, trial status, notes, and handoff context after sales conversion.",
  },
  {
    name: "Support",
    scope: "Service queue",
    description:
      "Handles schedule changes, member issues, and escalation routing.",
  },
];

const tasks: Task[] = [
  { id: "task-1", title: "Call Keisha within 10 minutes", status: "Open" },
  { id: "task-2", title: "Review Marco's PT handoff", status: "Open" },
  { id: "task-3", title: "Send waiver reminder to Jasmine", status: "Open" },
  { id: "task-4", title: "Reassign stale Facebook leads", status: "Done" },
];

export const phaseRoadmap: RoadmapPhase[] = [
  {
    name: "CRM foundation",
    summary: "Stand up the business entities, permissions, dashboards, and audit trail layer.",
    deliverables: [
      "Authentication and role-aware navigation",
      "Contacts, tasks, notes, tags, and custom fields",
      "Pipelines with stage history and ownership",
      "Dashboard metrics and audit event logging",
    ],
  },
  {
    name: "Inbox and lead intake",
    summary: "Bring lead sources and messaging channels into one operating surface.",
    deliverables: [
      "Email, SMS, website forms, and lead source ingestion",
      "Meta DM and Facebook lead ads syncing",
      "Conversation assignment and SLA tracking",
      "Message templates, snippets, and opt-out controls",
    ],
  },
  {
    name: "Booking and reminders",
    summary: "Layer on calendars, conflict handling, and automated attendance workflows.",
    deliverables: [
      "Appointment types, availability rules, and booking pages",
      "Google and Outlook calendar providers",
      "Automated reminder sequences with stop conditions",
      "No-show handling and reschedule flows",
    ],
  },
  {
    name: "Automation engine",
    summary: "Ship the builder and runtime that orchestrate every lead and member lifecycle.",
    deliverables: [
      "Visual workflow builder with typed nodes",
      "Event-triggered runs, waits, retries, and branching",
      "Webhook and provider actions",
      "Reusable gym sales automation templates",
    ],
  },
  {
    name: "Expansion layer",
    summary: "Expand from sales execution into reputation, memberships, and AI acceleration.",
    deliverables: [
      "Landing pages, quizzes, campaigns, and attribution analytics",
      "Review requests, member onboarding, and client portal surfaces",
      "AI drafting, booking assistant, and lead summaries",
      "Advanced reporting, mobile workflows, and multi-location scaling",
    ],
  },
];

export const demoData = {
  locations,
  contacts,
  pipelines,
  opportunities,
  conversations,
  reminderRules,
  workflowTemplates,
  channelAccounts,
  integrations,
  forms,
  reviewCampaigns,
  modules,
  roles,
  tasks,
  aiCapabilities: [
    "Draft channel-aware replies with approval required before send.",
    "Summarize new leads so reps walk into calls with context.",
    "Recommend next-best actions when a lead stops replying.",
    "Generate workflow drafts from plain-language gym campaign goals.",
  ],
};
