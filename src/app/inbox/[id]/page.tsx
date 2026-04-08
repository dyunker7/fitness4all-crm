import { notFound } from "next/navigation";

import { createMessageAction } from "@/app/actions/crm";
import { Surface } from "@/components/crm-cards";
import { CrmShell } from "@/components/crm-shell";
import {
  getConversationById,
  listMessagesForConversation,
} from "@/lib/crm";

export const dynamic = "force-dynamic";

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const conversation = await getConversationById(id);

  if (!conversation) {
    notFound();
  }

  const messages = await listMessagesForConversation(id);

  return (
    <CrmShell
      title={conversation.contactName}
      subtitle={`Conversation thread for ${conversation.channel}. Send follow-ups and keep sales outreach moving.`}
    >
      <Surface>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-400">{conversation.channel}</p>
            <h2 className="text-2xl font-semibold text-white">
              {conversation.contactName}
            </h2>
          </div>
          <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100">
            Owner: {conversation.ownerName}
          </span>
        </div>

        <div className="mt-6 space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`max-w-3xl rounded-3xl border px-4 py-3 ${
                message.direction === "outbound"
                  ? "ml-auto border-cyan-300/20 bg-cyan-300/10"
                  : "border-white/10 bg-white/5"
              }`}
            >
              <p className="text-sm font-medium text-white">{message.sentBy}</p>
              <p className="mt-2 text-sm leading-6 text-slate-200">{message.body}</p>
            </div>
          ))}
        </div>

        <form
          action={createMessageAction}
          className="mt-6 space-y-4 border-t border-white/10 pt-6"
        >
          <input type="hidden" name="conversationId" value={conversation.id} />
          <input type="hidden" name="sentBy" value={conversation.ownerName} />
          <textarea
            name="body"
            placeholder="Send a follow-up message"
            className="crm-input min-h-28"
          />
          <button type="submit" className="crm-button">
            Send message
          </button>
        </form>
      </Surface>
    </CrmShell>
  );
}
