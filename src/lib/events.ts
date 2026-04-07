export const eventContracts = [
  "lead.created",
  "conversation.message.received",
  "appointment.booked",
  "appointment.reminder_due",
  "workflow.triggered",
  "review.received",
  "meta.lead.created",
  "meta.dm.received",
  "calendar.event.changed",
] as const;

export const workflowNodeTypes = {
  triggers: [
    "form.submitted",
    "message.received",
    "opportunity.stage_changed",
    "appointment.booked",
    "appointment.no_show",
    "review.received",
  ],
  actions: [
    "send_message",
    "wait",
    "assign_owner",
    "create_task",
    "move_stage",
    "add_tag",
    "send_webhook",
    "ai_suggest_reply",
    "book_appointment",
  ],
} as const;
