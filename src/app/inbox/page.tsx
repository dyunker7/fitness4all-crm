import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";

import { Surface } from "@/components/crm-cards";
import { CrmShell } from "@/components/crm-shell";
import { listConversations } from "@/lib/crm";

export const dynamic = "force-dynamic";

export default async function InboxPage() {
  const conversations = await listConversations();

  return (
    <CrmShell
      title="Inbox"
      subtitle="Work lead conversations across channels and keep follow-up moving from one place."
    >
      <Surface>
        <h2 className="text-xl font-semibold text-white">Conversations</h2>
        <div className="mt-5 space-y-3">
          {conversations.map((conversation) => (
            <Link
              key={conversation.id}
              href={`/inbox/${conversation.id}`}
              className="block rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/8"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-white">
                    {conversation.contactName}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    {conversation.channel} · {conversation.ownerName}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs ${
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
              <p className="mt-3 text-xs text-slate-500">
                Reply due in{" "}
                {formatDistanceToNowStrict(new Date(conversation.nextResponseDueAt))}
              </p>
            </Link>
          ))}
        </div>
      </Surface>
    </CrmShell>
  );
}
