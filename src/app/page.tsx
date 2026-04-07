import {
  Activity,
  ArrowUpRight,
  Bot,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Dumbbell,
  Funnel,
  Gauge,
  Globe,
  Inbox,
  LayoutDashboard,
  Megaphone,
  MessageCircleMore,
  MessagesSquare,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Star,
  Workflow,
} from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";

import { demoData, navigation, phaseRoadmap } from "@/lib/data";
import {
  getActiveReminders,
  getChannelCoverage,
  getClosedWonValue,
  getOpenTaskCount,
  getPipelineSummary,
  getResponseSlaHealth,
} from "@/lib/metrics";

const pipeline = getPipelineSummary(demoData.opportunities, demoData.pipelines);
const activeReminders = getActiveReminders(demoData.reminderRules);
const openTasks = getOpenTaskCount(demoData.tasks);
const closedWonValue = getClosedWonValue(demoData.opportunities);
const channelCoverage = getChannelCoverage(demoData.channelAccounts);
const responseSla = getResponseSlaHealth(demoData.conversations);

const heroStats = [
  {
    label: "Open opportunities",
    value: pipeline.totalOpen.toString(),
    detail: `${pipeline.stagesWithDeals} active stages across gym sales journeys`,
    icon: BriefcaseBusiness,
  },
  {
    label: "Projected pipeline value",
    value: `$${pipeline.totalValue.toLocaleString()}`,
    detail: "Tours, memberships, PT upsells, and win-back deals",
    icon: Gauge,
  },
  {
    label: "Automated reminders",
    value: activeReminders.toString(),
    detail: "Timezone-aware sequences currently armed",
    icon: CalendarClock,
  },
  {
    label: "Closed-won this month",
    value: `$${closedWonValue.toLocaleString()}`,
    detail: "Revenue reporting without in-app payment processing",
    icon: ArrowUpRight,
  },
];

const productPillars = [
  {
    title: "Gym CRM + pipelines",
    description:
      "Contacts, households, custom fields, stage history, owner assignment, lost reasons, and sales SLAs built around memberships, tours, and PT upsells.",
    icon: LayoutDashboard,
  },
  {
    title: "Unified inbox",
    description:
      "One contact thread across SMS, email, calls, Instagram, Facebook Messenger, WhatsApp, and website chat with opt-out and assignment controls.",
    icon: Inbox,
  },
  {
    title: "Calendars + reminders",
    description:
      "Round-robin tours, consult bookings, conflict calendars, automated reminders, and stop conditions for cancelations, reschedules, and attendance.",
    icon: CalendarClock,
  },
  {
    title: "Workflow automation",
    description:
      "Trigger/action automation for new leads, reminders, no-show rescue, trial conversions, win-back campaigns, and AI-assisted follow-up.",
    icon: Workflow,
  },
];

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-300">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      <p className="text-base leading-7 text-slate-300 sm:text-lg">{description}</p>
    </div>
  );
}

function Panel({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.28)] backdrop-blur ${className}`}
    >
      {children}
    </div>
  );
}

function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
      {children}
    </span>
  );
}

export default function Home() {
  return (
    <main className="relative isolate overflow-hidden">
      <div className="hero-grid absolute inset-0 -z-10 opacity-70" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[36rem] bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(251,191,36,0.12),_transparent_28%),linear-gradient(180deg,_#05111f_0%,_#081828_52%,_#0f172a_100%)]" />

      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-12 px-6 py-8 sm:px-8 lg:px-12">
        <header className="sticky top-4 z-20 rounded-full border border-white/10 bg-slate-950/70 px-4 py-3 backdrop-blur-lg">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 via-sky-400 to-emerald-300 text-slate-950 shadow-lg shadow-cyan-500/30">
                <Dumbbell className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-wide text-white">
                  Fitness4All CRM
                </p>
                <p className="text-xs text-slate-400">
                  GoHighLevel-style gym sales operating system
                </p>
              </div>
            </div>

            <nav className="flex flex-wrap gap-2">
              {navigation.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-full border border-white/10 px-3 py-1.5 text-sm text-slate-200 transition hover:border-cyan-300/40 hover:bg-cyan-400/10 hover:text-white"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </header>

        <section
          id="overview"
          className="grid gap-8 rounded-[36px] border border-white/10 bg-slate-950/55 p-8 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl lg:grid-cols-[1.2fr_0.8fr] lg:p-10"
        >
          <div className="space-y-8">
            <div className="space-y-5">
              <SectionTag>Sales-first gym CRM foundation</SectionTag>
              <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                A real implementation foundation for Fitness4All, built around
                leads, tours, reminders, inboxes, and automation.
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-slate-300">
                This starter covers the first shippable layers of the roadmap:
                CRM records, pipelines, inbox architecture, scheduling and
                reminders, workflow templates, provider abstractions, Meta
                integration stubs, reporting models, and compliance-aware roles.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {heroStats.map((stat) => (
                <Panel key={stat.label} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">{stat.label}</span>
                    <stat.icon className="h-4 w-4 text-cyan-200" />
                  </div>
                  <p className="text-3xl font-semibold text-white">{stat.value}</p>
                  <p className="text-sm leading-6 text-slate-300">{stat.detail}</p>
                </Panel>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {productPillars.map((pillar) => (
                <Panel key={pillar.title} className="flex gap-4">
                  <div className="mt-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-200">
                    <pillar.icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white">{pillar.title}</h3>
                    <p className="text-sm leading-6 text-slate-300">
                      {pillar.description}
                    </p>
                  </div>
                </Panel>
              ))}
            </div>
          </div>

          <Panel className="space-y-6 border-cyan-400/20 bg-gradient-to-b from-cyan-400/10 via-slate-900/70 to-slate-950/90">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-cyan-200">Launch readiness</p>
                <h2 className="mt-1 text-2xl font-semibold text-white">
                  Gym sales command center
                </h2>
              </div>
              <Sparkles className="h-5 w-5 text-cyan-200" />
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-300">First-response SLA health</p>
                <p className="text-sm font-semibold text-white">{responseSla.score}%</p>
              </div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-300 via-cyan-300 to-emerald-300"
                  style={{ width: `${responseSla.score}%` }}
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {responseSla.onTrack} conversations are on track and{" "}
                {responseSla.atRisk} need same-day attention.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Panel className="space-y-2 bg-white/5 p-5">
                <p className="text-sm text-slate-400">Connected launch channels</p>
                <p className="text-3xl font-semibold text-white">{channelCoverage}</p>
                <p className="text-sm text-slate-300">
                  Instagram, Facebook, email, SMS, phone, WhatsApp, and web chat
                  tracked as provider-ready accounts.
                </p>
              </Panel>
              <Panel className="space-y-2 bg-white/5 p-5">
                <p className="text-sm text-slate-400">Open tasks</p>
                <p className="text-3xl font-semibold text-white">{openTasks}</p>
                <p className="text-sm text-slate-300">
                  Follow-up actions queued for front desk, reps, and trainers.
                </p>
              </Panel>
            </div>

            <div className="space-y-3">
              {demoData.integrations.map((integration) => (
                <div
                  key={integration.name}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-white">
                      {integration.name}
                    </p>
                    <p className="text-xs text-slate-400">{integration.summary}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      integration.status === "Connected"
                        ? "bg-emerald-400/15 text-emerald-200"
                        : "bg-amber-300/15 text-amber-100"
                    }`}
                  >
                    {integration.status}
                  </span>
                </div>
              ))}
            </div>
          </Panel>
        </section>

        <section id="workspace" className="space-y-8">
          <SectionHeader
            eyebrow="Workspace"
            title="One place for reps, front desk, managers, and trainers"
            description="The app foundation includes a working information architecture for CRM, conversations, scheduling, automation, campaigns, reputation, and reporting so later implementation can extend instead of restart."
          />

          <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
            <Panel className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Pipeline snapshot</p>
                  <h3 className="text-2xl font-semibold text-white">
                    Membership sales + win-back pipeline
                  </h3>
                </div>
                <a
                  href="#roadmap"
                  className="inline-flex items-center gap-2 text-sm font-medium text-cyan-200 transition hover:text-cyan-100"
                >
                  View rollout
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                {pipeline.stageBreakdown.map((stage) => (
                  <div
                    key={stage.name}
                    className="rounded-3xl border border-white/10 bg-slate-900/70 p-5"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-slate-400">{stage.name}</p>
                      <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-slate-300">
                        {stage.count} deals
                      </span>
                    </div>
                    <p className="mt-6 text-3xl font-semibold text-white">
                      ${stage.value.toLocaleString()}
                    </p>
                    <p className="mt-2 text-sm text-slate-300">{stage.goal}</p>
                  </div>
                ))}
              </div>

              <div className="overflow-hidden rounded-[28px] border border-white/10">
                <table className="min-w-full divide-y divide-white/10 text-left text-sm">
                  <thead className="bg-white/5 text-slate-300">
                    <tr>
                      <th className="px-4 py-3 font-medium">Lead</th>
                      <th className="px-4 py-3 font-medium">Stage</th>
                      <th className="px-4 py-3 font-medium">Owner</th>
                      <th className="px-4 py-3 font-medium">Value</th>
                      <th className="px-4 py-3 font-medium">Next step</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 bg-slate-950/50">
                    {demoData.opportunities.map((opportunity) => {
                      const contact = demoData.contacts.find(
                        (item) => item.id === opportunity.contactId,
                      );

                      return (
                        <tr key={opportunity.id}>
                          <td className="px-4 py-4">
                            <div>
                              <p className="font-medium text-white">
                                {contact?.firstName} {contact?.lastName}
                              </p>
                              <p className="text-xs text-slate-400">
                                {contact?.membershipInterest}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-slate-300">
                            {opportunity.stageName}
                          </td>
                          <td className="px-4 py-4 text-slate-300">
                            {opportunity.ownerName}
                          </td>
                          <td className="px-4 py-4 font-medium text-white">
                            ${opportunity.value.toLocaleString()}
                          </td>
                          <td className="px-4 py-4 text-slate-300">
                            {opportunity.nextAction}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Panel>

            <div className="space-y-6">
              <Panel className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-emerald-300/10 p-3 text-emerald-200">
                    <MessageCircleMore className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Unified inbox</p>
                    <h3 className="text-xl font-semibold text-white">
                      Cross-channel conversations
                    </h3>
                  </div>
                </div>

                <div className="space-y-3">
                  {demoData.conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className="rounded-2xl border border-white/10 bg-slate-900/70 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium text-white">
                            {conversation.contactName}
                          </p>
                          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                            {conversation.channel}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs ${
                            conversation.status === "At risk"
                              ? "bg-amber-300/15 text-amber-100"
                              : "bg-emerald-400/15 text-emerald-200"
                          }`}
                        >
                          {conversation.status}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-300">
                        {conversation.lastMessage}
                      </p>
                      <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                        <span>Owner: {conversation.ownerName}</span>
                        <span>
                          Reply due in{" "}
                          {formatDistanceToNowStrict(
                            new Date(conversation.nextResponseDueAt),
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-amber-300/10 p-3 text-amber-100">
                    <Star className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Reputation</p>
                    <h3 className="text-xl font-semibold text-white">
                      Review request automations
                    </h3>
                  </div>
                </div>

                {demoData.reviewCampaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="rounded-2xl border border-white/10 bg-slate-900/70 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-white">{campaign.name}</p>
                      <p className="text-sm text-slate-300">{campaign.channel}</p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {campaign.summary}
                    </p>
                  </div>
                ))}
              </Panel>
            </div>
          </div>
        </section>

        <section id="automation" className="space-y-8">
          <SectionHeader
            eyebrow="Automation"
            title="Workflow templates and reminder logic are already modeled"
            description="This foundation includes typed workflow triggers, actions, provider interfaces, and reminder rules so the visual builder and runtime can share one schema when you expand the product."
          />

          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <Panel className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-200">
                  <Workflow className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Workflow templates</p>
                  <h3 className="text-2xl font-semibold text-white">
                    Gym-specific automations
                  </h3>
                </div>
              </div>

              <div className="space-y-4">
                {demoData.workflowTemplates.map((workflow) => (
                  <div
                    key={workflow.id}
                    className="rounded-3xl border border-white/10 bg-slate-900/70 p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-white">{workflow.name}</p>
                        <p className="text-sm text-slate-400">{workflow.trigger}</p>
                      </div>
                      <SectionTag>{workflow.goal}</SectionTag>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {workflow.actions.map((action) => (
                        <span
                          key={action}
                          className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-200"
                        >
                          {action}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            <div className="space-y-6">
              <Panel className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-sky-400/10 p-3 text-sky-200">
                    <CalendarClock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Reminder engine</p>
                    <h3 className="text-2xl font-semibold text-white">
                      Automated appointment follow-up
                    </h3>
                  </div>
                </div>
                <div className="space-y-3">
                  {demoData.reminderRules.map((rule) => (
                    <div
                      key={rule.id}
                      className="rounded-2xl border border-white/10 bg-slate-900/70 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-white">{rule.name}</p>
                        <span className="text-sm text-slate-300">
                          {rule.steps.length} steps
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        Stops on {rule.stopConditions.join(", ")}.
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {rule.steps.map((step) => (
                          <span
                            key={step.id}
                            className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100"
                          >
                            {step.offsetMinutes < 0
                              ? `${Math.abs(step.offsetMinutes)} min before`
                              : `${step.offsetMinutes} min after`}{" "}
                            · {step.channel}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-fuchsia-400/10 p-3 text-fuchsia-200">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">AI assist</p>
                    <h3 className="text-2xl font-semibold text-white">
                      Human-in-the-loop launch mode
                    </h3>
                  </div>
                </div>
                <ul className="space-y-3 text-sm leading-6 text-slate-300">
                  {demoData.aiCapabilities.map((capability) => (
                    <li
                      key={capability}
                      className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-200" />
                      <span>{capability}</span>
                    </li>
                  ))}
                </ul>
              </Panel>
            </div>
          </div>
        </section>

        <section id="channels" className="space-y-8">
          <SectionHeader
            eyebrow="Channels"
            title="Meta, messaging, bookings, campaigns, and web intake in one model"
            description="The codebase already defines integration-ready abstractions and demo operating data for the launch channels you asked to prioritize."
          />

          <div className="grid gap-6 lg:grid-cols-2">
            <Panel className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-blue-400/10 p-3 text-blue-200">
                  <MessagesSquare className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Connected accounts</p>
                  <h3 className="text-2xl font-semibold text-white">
                    Social + messaging providers
                  </h3>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {demoData.channelAccounts.map((account) => (
                  <div
                    key={account.id}
                    className="rounded-3xl border border-white/10 bg-slate-900/70 p-5"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-white">{account.name}</p>
                      {account.platform === "Instagram" ? (
                        <MessagesSquare className="h-4 w-4 text-pink-200" />
                      ) : account.platform === "Facebook" ? (
                        <MessagesSquare className="h-4 w-4 text-blue-200" />
                      ) : account.platform === "Website" ? (
                        <Globe className="h-4 w-4 text-cyan-200" />
                      ) : account.platform === "Phone" ? (
                        <PhoneCall className="h-4 w-4 text-emerald-200" />
                      ) : (
                        <Megaphone className="h-4 w-4 text-slate-200" />
                      )}
                    </div>
                    <p className="mt-2 text-sm text-slate-300">{account.platform}</p>
                    <p className="mt-4 text-xs leading-5 text-slate-400">
                      {account.description}
                    </p>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-300/10 p-3 text-emerald-200">
                  <Funnel className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Funnels + attribution</p>
                  <h3 className="text-2xl font-semibold text-white">
                    Lead intake and conversion visibility
                  </h3>
                </div>
              </div>
              <div className="space-y-4">
                {demoData.forms.map((form) => (
                  <div
                    key={form.id}
                    className="rounded-3xl border border-white/10 bg-slate-900/70 p-5"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-white">{form.name}</p>
                        <p className="text-sm text-slate-400">{form.type}</p>
                      </div>
                      <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
                        {form.conversionRate}% CVR
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {form.summary}
                    </p>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </section>

        <section id="platform" className="space-y-8">
          <SectionHeader
            eyebrow="Platform"
            title="Compliance, permissions, and modular growth are built in"
            description="The code defines tenant-aware business entities, provider contracts, auditability, and explicit role boundaries so Fitness4All can grow into a multi-location system without remodeling the core."
          />

          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <Panel className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-300/10 p-3 text-emerald-200">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Roles + governance</p>
                  <h3 className="text-2xl font-semibold text-white">
                    Access model
                  </h3>
                </div>
              </div>

              <div className="space-y-3">
                {demoData.roles.map((role) => (
                  <div
                    key={role.name}
                    className="rounded-2xl border border-white/10 bg-slate-900/70 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-white">{role.name}</p>
                      <span className="text-xs uppercase tracking-[0.24em] text-slate-500">
                        {role.scope}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {role.description}
                    </p>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-orange-300/10 p-3 text-orange-200">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Core modules</p>
                  <h3 className="text-2xl font-semibold text-white">
                    Modular monolith shape
                  </h3>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {demoData.modules.map((module) => (
                  <div
                    key={module.name}
                    className="rounded-2xl border border-white/10 bg-slate-900/70 p-4"
                  >
                    <p className="font-medium text-white">{module.name}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {module.summary}
                    </p>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </section>

        <section id="roadmap" className="space-y-8 pb-10">
          <SectionHeader
            eyebrow="Roadmap"
            title="Phased delivery without repainting the architecture"
            description="The app now visualizes the multi-phase build path so implementation can move in slices while protecting the long-term CRM vision."
          />

          <div className="grid gap-4">
            {phaseRoadmap.map((phase, index) => (
              <Panel
                key={phase.name}
                className="grid gap-4 lg:grid-cols-[0.23fr_0.77fr] lg:items-start"
              >
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
                    Phase {index + 1}
                  </p>
                  <h3 className="text-2xl font-semibold text-white">{phase.name}</h3>
                  <p className="text-sm leading-6 text-slate-300">{phase.summary}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {phase.deliverables.map((deliverable) => (
                    <div
                      key={deliverable}
                      className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3"
                    >
                      <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-cyan-200" />
                      <span className="text-sm leading-6 text-slate-300">
                        {deliverable}
                      </span>
                    </div>
                  ))}
                </div>
              </Panel>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
