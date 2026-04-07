import type { Channel } from "@/lib/types";

export interface ProviderSendResult {
  accepted: boolean;
  providerMessageId?: string;
  error?: string;
}

export interface MessagingProvider {
  readonly name: string;
  readonly channels: Channel[];
  sendMessage(input: {
    to: string;
    channel: Channel;
    body: string;
    locationId: string;
  }): Promise<ProviderSendResult>;
}

export interface SocialMessagingProvider {
  readonly name: string;
  ingestDirectMessage(payload: unknown): Promise<{
    contactExternalId: string;
    conversationExternalId: string;
    body: string;
  }>;
  ingestLead(payload: unknown): Promise<{
    externalLeadId: string;
    source: string;
    fullName: string;
  }>;
}

export interface CalendarProvider {
  readonly name: string;
  syncAvailability(input: {
    userId: string;
    locationId: string;
  }): Promise<{ synced: boolean; conflicts: number }>;
}

export interface EmailProvider {
  readonly name: string;
  sendTransactional(input: {
    to: string;
    subject: string;
    html: string;
  }): Promise<ProviderSendResult>;
}

export interface TelephonyProvider {
  readonly name: string;
  startCall(input: {
    agentUserId: string;
    to: string;
    locationId: string;
  }): Promise<{ callId: string }>;
}

export interface ReviewProvider {
  readonly name: string;
  requestReview(input: {
    contactId: string;
    channel: "SMS" | "Email";
    reviewLink: string;
  }): Promise<ProviderSendResult>;
}

export const providerCatalog = {
  messaging: ["twilio", "mailgun", "meta-messenger"] satisfies string[],
  social: ["meta"] satisfies string[],
  calendars: ["google-calendar", "microsoft-graph"] satisfies string[],
  reviews: ["google-business-profile", "facebook"] satisfies string[],
};
