import type { ChatMessage } from "./chatClient";

const CHAT_SESSIONS_KEY = "matchpilot.chat.sessions";
const ACTIVE_CHAT_SESSION_KEY = "matchpilot.chat.activeSessionId";

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

const welcomeMessage: ChatMessage = {
  role: "assistant",
  content: "可以问我任何世界杯观赛计划问题。如果 DeepSeek 暂时连不上，我会用本地规划逻辑兜底回答。"
};

function createSessionId(): string {
  return `chat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function readSessions(): ChatSession[] {
  const raw = localStorage.getItem(CHAT_SESSIONS_KEY);
  if (!raw) return [];

  try {
    const sessions = JSON.parse(raw);
    return Array.isArray(sessions) ? (sessions as ChatSession[]) : [];
  } catch {
    return [];
  }
}

function writeSessions(sessions: ChatSession[]): void {
  localStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(sessions));
}

export function createChatSession(): ChatSession {
  const now = new Date().toISOString();
  const session: ChatSession = {
    id: createSessionId(),
    title: "新对话",
    createdAt: now,
    updatedAt: now,
    messages: [welcomeMessage]
  };
  saveChatSession(session);
  setActiveChatSession(session.id);
  return session;
}

export function listChatSessions(): ChatSession[] {
  return readSessions().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function saveChatSession(session: ChatSession): void {
  const titleFromFirstQuestion = session.messages.find((message) => message.role === "user")?.content;
  const nextSession = {
    ...session,
    title: titleFromFirstQuestion ? titleFromFirstQuestion.slice(0, 36) : session.title,
    updatedAt: new Date().toISOString()
  };
  const sessions = readSessions().filter((item) => item.id !== session.id);
  writeSessions([nextSession, ...sessions]);
}

export function setActiveChatSession(sessionId: string): void {
  localStorage.setItem(ACTIVE_CHAT_SESSION_KEY, sessionId);
}

export function deleteChatSession(sessionId: string): ChatSession | undefined {
  const remainingSessions = readSessions().filter((session) => session.id !== sessionId);
  writeSessions(remainingSessions);

  const nextActiveSession = listChatSessions()[0];

  if (nextActiveSession) {
    setActiveChatSession(nextActiveSession.id);
  } else {
    localStorage.removeItem(ACTIVE_CHAT_SESSION_KEY);
  }

  return nextActiveSession;
}

export function loadActiveChatSession(): ChatSession | undefined {
  const activeSessionId = localStorage.getItem(ACTIVE_CHAT_SESSION_KEY);
  const sessions = listChatSessions();

  if (!activeSessionId) {
    return sessions[0];
  }

  return sessions.find((session) => session.id === activeSessionId) ?? sessions[0];
}
