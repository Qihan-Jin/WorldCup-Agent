import { describe, expect, it, vi } from "vitest";
import { getAllMatches } from "../data/matchRepository";
import { defaultProfile } from "../profile/profileStore";
import type { ChatMessage } from "./chatClient";
import { askChatAi } from "./chatClient";

describe("askChatAi", () => {
  it("uses DeepSeek proxy response when available", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ answer: "DeepSeek answer" })
    });
    const messages: ChatMessage[] = [{ role: "user", content: "Which match should I watch?" }];

    const answer = await askChatAi({
      messages,
      profile: defaultProfile,
      matches: getAllMatches(),
      fetcher: fetchMock
    });

    expect(answer.answer).toBe("DeepSeek answer");
    expect(answer.source).toBe("deepseek");
  });

  it("falls back locally when proxy is unavailable", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error("offline"));
    const messages: ChatMessage[] = [{ role: "user", content: "Which match should I watch?" }];

    const answer = await askChatAi({
      messages,
      profile: defaultProfile,
      matches: getAllMatches(),
      fetcher: fetchMock
    });

    expect(answer.answer).toContain("Top pick");
    expect(answer.source).toBe("fallback");
  });

  it("returns fallback reason when the proxy rejects the request", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ error: "fetch failed" })
    });
    const messages: ChatMessage[] = [{ role: "user", content: "hello" }];

    const answer = await askChatAi({
      messages,
      profile: defaultProfile,
      matches: getAllMatches(),
      fetcher: fetchMock
    });

    expect(answer.source).toBe("fallback");
    expect(answer.error).toBe("Chat proxy returned 500: fetch failed");
  });

  it("falls back with a useful answer for final-date questions", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error("offline"));
    const messages: ChatMessage[] = [{ role: "user", content: "决赛是哪天" }];

    const answer = await askChatAi({
      messages,
      profile: defaultProfile,
      matches: getAllMatches(),
      fetcher: fetchMock
    });

    expect(answer.answer).toContain("2026-07-19");
    expect(answer.source).toBe("fallback");
  });
});
