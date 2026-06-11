import type { Match, UserProfile } from "../types";
import { getFixtureDataSource } from "../data/matchRepository";
import { askFallbackAi } from "./aiAdapter";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface AskChatAiInput {
  messages: ChatMessage[];
  profile: UserProfile;
  matches: Match[];
  fetcher?: typeof fetch;
}

export interface ChatAiResponse {
  answer: string;
  source: "deepseek" | "fallback";
  error?: string;
}

async function readProxyError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as { error?: string };
    return data.error ? `Chat proxy returned ${response.status}: ${data.error}` : `Chat proxy returned ${response.status}`;
  } catch {
    return `Chat proxy returned ${response.status}`;
  }
}

export async function askChatAi({ messages, profile, matches, fetcher = fetch }: AskChatAiInput): Promise<ChatAiResponse> {
  const latestQuestion = [...messages].reverse().find((message) => message.role === "user")?.content ?? "";

  try {
    const response = await fetcher("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ messages, profile, matches, fixtureDataSource: getFixtureDataSource() })
    });

    if (!response.ok) {
      throw new Error(await readProxyError(response));
    }

    const data = (await response.json()) as { answer?: string };

    if (!data.answer) {
      throw new Error("Chat proxy returned no answer");
    }

    return { answer: data.answer, source: "deepseek" };
  } catch (error) {
    return {
      answer: askFallbackAi(latestQuestion, profile, matches),
      source: "fallback",
      error: error instanceof Error ? error.message : "Chat proxy failed"
    };
  }
}
