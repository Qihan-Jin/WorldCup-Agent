import { describe, expect, it } from "vitest";
import { formatAssistantMessage } from "./messageFormatter";

describe("formatAssistantMessage", () => {
  it("removes lightweight markdown while preserving readable lines", () => {
    const formatted = formatAssistantMessage("我是 **MatchPilot**\\n- 看 Canada\\n- 看集锦");

    expect(formatted).toBe("我是 MatchPilot\n看 Canada\n看集锦");
  });

  it("normalizes checkbox and bullet clutter from model answers", () => {
    const formatted = formatAssistantMessage("✅ **必看**：Mexico vs South Africa");

    expect(formatted).toBe("必看：Mexico vs South Africa");
  });
});
