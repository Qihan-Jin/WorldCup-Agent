import { beforeEach, describe, expect, it } from "vitest";
import {
  createChatSession,
  deleteChatSession,
  listChatSessions,
  loadActiveChatSession,
  saveChatSession,
  setActiveChatSession
} from "./chatHistory";

describe("chatHistory", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("creates and loads an active chat session", () => {
    const session = createChatSession();
    setActiveChatSession(session.id);

    expect(loadActiveChatSession()?.id).toBe(session.id);
  });

  it("persists messages in a saved chat session", () => {
    const session = createChatSession();
    saveChatSession({
      ...session,
      messages: [
        ...session.messages,
        { role: "user", content: "Hello" },
        { role: "assistant", content: "Hi" }
      ]
    });

    expect(listChatSessions()[0].messages).toHaveLength(3);
    expect(listChatSessions()[0].messages[1].content).toBe("Hello");
  });

  it("deletes a chat session and moves active chat to the next session", () => {
    const first = createChatSession();
    const second = createChatSession();
    setActiveChatSession(second.id);

    const nextActive = deleteChatSession(second.id);

    expect(listChatSessions().map((session) => session.id)).toEqual([first.id]);
    expect(nextActive?.id).toBe(first.id);
    expect(loadActiveChatSession()?.id).toBe(first.id);
  });
});
