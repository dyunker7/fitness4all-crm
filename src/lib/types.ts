export type Channel =
  | "SMS"
  | "Email"
  | "Phone"
  | "Instagram"
  | "Facebook"
  | "WhatsApp"
  | "Website";

export type UserRole =
  | "Admin"
  | "Sales Manager"
  | "Sales Rep / Front Desk"
  | "Trainer"
  | "Support";

export type WorkflowTrigger =
  | "form.submitted"
  | "message.received"
  | "opportunity.stage_changed"
  | "appointment.booked"
  | "appointment.no_show"
  | "review.received";

export interface Location {
  id: string;
  name: string;
  timezone: string;
}

export interface Contact {
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
  consentStatus: "Opted in" | "Pending";
}

export interface Pipeline {
  id: string;
  name: string;
  stages: {
    name: string;
    goal: string;
  }[];
}

export interface Opportunity {
  id: string;
  contactId: string;
  pipelineId: string;
  stageName: string;
  ownerName: string;
  value: number;
  nextAction: string;
  outcome: "Open" | "Won";
}

export interface Conversation {
  id: string;
  contactName: string;
  channel: Channel;
  ownerName: string;
  status: "On track" | "At risk";
  lastMessage: string;
  nextResponseDueAt: string;
}

export interface ReminderRuleStep {
  id: string;
  channel: Channel;
  offsetMinutes: number;
}

export interface ReminderRule {
  id: string;
  name: string;
  stopConditions: string[];
  steps: ReminderRuleStep[];
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  trigger: WorkflowTrigger;
  goal: string;
  actions: string[];
}

export interface ChannelAccount {
  id: string;
  name: string;
  platform: Channel;
  description: string;
}

export interface IntegrationStatusCard {
  name: string;
  summary: string;
  status: "Connected" | "Planned";
}

export interface FormAsset {
  id: string;
  name: string;
  type: "Form" | "Survey" | "Quiz" | "Landing Page";
  conversionRate: number;
  summary: string;
}

export interface ReviewCampaign {
  id: string;
  name: string;
  channel: string;
  summary: string;
}

export interface AppModule {
  name: string;
  summary: string;
}

export interface RoleDefinition {
  name: UserRole;
  scope: string;
  description: string;
}

export interface Task {
  id: string;
  title: string;
  status: "Open" | "Done";
}

export interface RoadmapPhase {
  name: string;
  summary: string;
  deliverables: string[];
}
