import type {
  ChannelAccount,
  Conversation,
  Opportunity,
  Pipeline,
  ReminderRule,
  Task,
} from "@/lib/types";

export function getPipelineSummary(opportunities: Opportunity[], pipelines: Pipeline[]) {
  const primaryPipeline = pipelines[0];
  const openOpportunities = opportunities.filter(
    (opportunity) => opportunity.outcome === "Open",
  );
  const totalValue = openOpportunities.reduce(
    (sum, opportunity) => sum + opportunity.value,
    0,
  );

  const stageBreakdown = primaryPipeline.stages
    .map((stage) => {
      const deals = opportunities.filter((opportunity) => opportunity.stageName === stage.name);

      return {
        name: stage.name,
        goal: stage.goal,
        count: deals.length,
        value: deals.reduce((sum, opportunity) => sum + opportunity.value, 0),
      };
    })
    .filter((stage) => stage.count > 0);

  return {
    totalOpen: openOpportunities.length,
    totalValue,
    stagesWithDeals: stageBreakdown.length,
    stageBreakdown,
  };
}

export function getActiveReminders(reminders: ReminderRule[]) {
  return reminders.reduce((sum, rule) => sum + rule.steps.length, 0);
}

export function getOpenTaskCount(tasks: Task[]) {
  return tasks.filter((task) => task.status === "Open").length;
}

export function getClosedWonValue(opportunities: Opportunity[]) {
  return opportunities
    .filter((opportunity) => opportunity.outcome === "Won")
    .reduce((sum, opportunity) => sum + opportunity.value, 0);
}

export function getChannelCoverage(accounts: ChannelAccount[]) {
  return new Set(accounts.map((account) => account.platform)).size;
}

export function getResponseSlaHealth(conversations: Conversation[]) {
  const onTrack = conversations.filter(
    (conversation) => conversation.status === "On track",
  ).length;
  const atRisk = conversations.length - onTrack;
  const score = Math.round((onTrack / conversations.length) * 100);

  return { onTrack, atRisk, score };
}
