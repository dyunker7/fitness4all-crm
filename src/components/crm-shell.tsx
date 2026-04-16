import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  BriefcaseBusiness,
  MessageCircleMore,
  CalendarClock,
  BadgePlus,
  Bot,
  ListChecks,
} from "lucide-react";

import { logoutAction } from "@/app/actions/auth";
import { requireSession } from "@/lib/auth";
import { hasPermission, type CrmPermission } from "@/lib/permissions";
import type { UserRole } from "@/lib/types";

const navItems: Array<{
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  permission: CrmPermission;
}> = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    permission: "dashboard:view",
  },
  {
    href: "/contacts",
    label: "Contacts",
    icon: Users,
    permission: "contacts:view",
  },
  {
    href: "/opportunities",
    label: "Opportunities",
    icon: BriefcaseBusiness,
    permission: "opportunities:view",
  },
  {
    href: "/inbox",
    label: "Inbox",
    icon: MessageCircleMore,
    permission: "inbox:view",
  },
  {
    href: "/schedule",
    label: "Schedule",
    icon: CalendarClock,
    permission: "schedule:view",
  },
  {
    href: "/automations",
    label: "Automations",
    icon: Bot,
    permission: "automations:view",
  },
  {
    href: "/meta",
    label: "Meta Leads",
    icon: BadgePlus,
    permission: "meta:view",
  },
  {
    href: "/activity",
    label: "Activity",
    icon: ListChecks,
    permission: "activity:view",
  },
];

export function canRoleAccess(role: UserRole, permission: CrmPermission) {
  return hasPermission(role, permission);
}

export async function CrmShell({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  const session = await requireSession();
  const visibleNavItems = navItems.filter((item) =>
    hasPermission(session.role, item.permission),
  );

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.12),_transparent_30%),linear-gradient(180deg,_#05111f_0%,_#081828_52%,_#0f172a_100%)]">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[240px_1fr] lg:px-8">
        <aside className="rounded-[28px] border border-white/10 bg-slate-950/70 p-5 backdrop-blur">
          <div className="mb-8">
            <p className="text-lg font-semibold text-white">Fitness4All CRM</p>
            <p className="mt-1 text-sm text-slate-400">
              Real CRM slice: contacts, deals, and dashboard
            </p>
          </div>

          <nav className="space-y-2">
            {visibleNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-slate-200 transition hover:bg-white/5 hover:text-white"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="font-medium text-white">{session.name}</p>
            <p className="mt-1 text-sm text-slate-400">{session.role}</p>
            <p className="mt-1 text-xs text-slate-500">{session.email}</p>
            <form action={logoutAction} className="mt-4">
              <button type="submit" className="crm-button w-full">
                Log out
              </button>
            </form>
          </div>
        </aside>

        <section className="space-y-6">
          <header className="rounded-[28px] border border-white/10 bg-slate-950/60 p-6 backdrop-blur">
            <h1 className="text-3xl font-semibold text-white">{title}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
              {subtitle}
            </p>
          </header>

          {children}
        </section>
      </div>
    </main>
  );
}
