import { describe, expect, it } from "vitest";
import type { Reminder } from "../types";
import { getDueReminders } from "./reminderScheduler";

describe("getDueReminders", () => {
  it("returns undelivered reminders that are due", () => {
    const reminders: Reminder[] = [
      { id: "r1", matchId: "m1", minutesBefore: 30, triggerAtUtc: "2026-06-12T00:30:00.000Z", delivered: false },
      { id: "r2", matchId: "m2", minutesBefore: 30, triggerAtUtc: "2026-06-13T00:30:00.000Z", delivered: false }
    ];

    const due = getDueReminders(reminders, new Date("2026-06-12T00:31:00.000Z"));

    expect(due.map((reminder) => reminder.id)).toEqual(["r1"]);
  });
});
