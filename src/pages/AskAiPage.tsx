import { Plus, Send, Trash2 } from "lucide-react";
import { useState } from "react";
import { askChatAi, type ChatMessage } from "../ai/chatClient";
import {
  createChatSession,
  deleteChatSession,
  listChatSessions,
  loadActiveChatSession,
  saveChatSession,
  setActiveChatSession,
  type ChatSession
} from "../ai/chatHistory";
import { formatAssistantMessage } from "../ai/messageFormatter";
import { getFixtureDataSource } from "../data/matchRepository";
import type { Match, UserProfile } from "../types";

interface AskAiPageProps {
  profile: UserProfile;
  matches: Match[];
}

const starterPrompts = ["今晚该看哪场？", "我不能熬夜，帮我调整计划", "哪场适合和朋友一起看？", "我的主队赛程有覆盖吗？"];

function getInitialSession(): ChatSession {
  return loadActiveChatSession() ?? createChatSession();
}

export function AskAiPage({ profile, matches }: AskAiPageProps) {
  const fixtureDataSource = getFixtureDataSource();
  const [sessions, setSessions] = useState(listChatSessions);
  const [activeSession, setActiveSession] = useState(getInitialSession);
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [source, setSource] = useState<"deepseek" | "fallback">("fallback");
  const [fallbackReason, setFallbackReason] = useState<string | null>(null);

  function refreshSession(nextSession: ChatSession) {
    saveChatSession(nextSession);
    setActiveChatSession(nextSession.id);
    setActiveSession(nextSession);
    setSessions(listChatSessions());
  }

  function startNewChat() {
    const session = createChatSession();
    setActiveSession(session);
    setSessions(listChatSessions());
    setDraft("");
    setSource("fallback");
    setFallbackReason(null);
  }

  function switchSession(sessionId: string) {
    setActiveChatSession(sessionId);
    const session = listChatSessions().find((item) => item.id === sessionId);
    if (session) {
      setActiveSession(session);
      setSource("fallback");
      setFallbackReason(null);
    }
  }

  function removeSession(sessionId: string) {
    const nextActiveSession = deleteChatSession(sessionId) ?? createChatSession();
    setActiveSession(nextActiveSession);
    setSessions(listChatSessions());
    setDraft("");
    setSource("fallback");
    setFallbackReason(null);
  }

  async function sendMessage(content: string) {
    const trimmed = content.trim();
    if (!trimmed || isLoading) return;

    const nextMessages: ChatMessage[] = [...activeSession.messages, { role: "user", content: trimmed }];
    const nextSession = { ...activeSession, messages: nextMessages };
    refreshSession(nextSession);
    setDraft("");
    setIsLoading(true);

    const response = await askChatAi({ messages: nextMessages, profile, matches });
    setSource(response.source);
    setFallbackReason(response.source === "fallback" ? response.error ?? "Chat proxy failed" : null);
    refreshSession({
      ...nextSession,
      messages: [...nextMessages, { role: "assistant", content: formatAssistantMessage(response.answer) }]
    });
    setIsLoading(false);
  }

  return (
    <section className="flex min-h-[calc(100vh-9rem)] flex-col gap-4">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Ask AI</h1>
            <p className="mt-1 text-sm text-white/60">和 MatchPilot 讨论看哪场、跳过哪场、哪些留给集锦。</p>
          </div>
          <button
            type="button"
            onClick={startNewChat}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-lime text-pitch"
            aria-label="新建对话"
          >
            <Plus size={18} />
          </button>
        </div>

        <p
          className={`mt-2 inline-flex rounded-md px-2 py-1 text-xs ${
            source === "deepseek" ? "bg-lime text-pitch" : "bg-white/10 text-white/65"
          }`}
        >
          {source === "deepseek" ? "DeepSeek 已连接" : "本地兜底模式"}
        </p>
        {fallbackReason ? <p className="mt-1 text-xs text-white/45">原因：{fallbackReason}</p> : null}
        <p className="mt-1 text-xs text-white/45">
          赛程数据：{fixtureDataSource.provider} 完整静态赛程 · 更新于 {fixtureDataSource.updatedAt} · 覆盖{" "}
          {fixtureDataSource.matchCount} 场
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`inline-flex max-w-full items-center rounded-md border px-3 py-2 text-left text-xs ${
              session.id === activeSession.id ? "border-lime bg-lime text-pitch" : "border-white/10 bg-white/[0.06] text-white/70"
            }`}
          >
            <button type="button" onClick={() => switchSession(session.id)} className="max-w-[11rem] truncate text-left">
              {session.title}
            </button>
            <button
              type="button"
              onClick={() => removeSession(session.id)}
              className="ml-2 inline-flex opacity-65 hover:opacity-100"
              aria-label="删除对话"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {starterPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => void sendMessage(prompt)}
            className="min-h-12 rounded-md border border-white/10 bg-white/[0.06] px-3 py-2 text-left text-xs leading-5 text-white/80"
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto rounded-lg border border-white/10 bg-white/[0.04] p-3">
        {activeSession.messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] whitespace-pre-line rounded-lg px-3 py-2 text-sm leading-6 ${
                message.role === "user" ? "bg-lime text-pitch" : "bg-white text-ink"
              }`}
            >
              {message.role === "assistant" ? formatAssistantMessage(message.content) : message.content}
            </div>
          </div>
        ))}
        {isLoading ? <p className="text-sm text-white/50">MatchPilot 正在思考...</p> : null}
      </div>

      <form
        className="flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          void sendMessage(draft);
        }}
      >
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="问今晚、主队、熬夜安排或观赛取舍"
          className="min-w-0 flex-1 rounded-md border border-white/10 bg-white/[0.06] px-3 py-3 text-sm text-white outline-none placeholder:text-white/35"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-lime text-pitch disabled:opacity-60"
          aria-label="发送消息"
        >
          <Send size={18} />
        </button>
      </form>
    </section>
  );
}
