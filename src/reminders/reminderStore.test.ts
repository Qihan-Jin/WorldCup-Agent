import { beforeEach, describe, expect, it } from "vitest";
import { addReminder, listReminders, markReminderDelivered } from "./reminderStore";

describe("reminderStore", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("adds and lists reminders", () => {
    addReminder({ matchId: "m-mex-rsa", minutesBefore: 30, kickoffUtc: "2026-06-11T19:00:00.000Z" });

    expect(listReminders()).toHaveLength(1);
    expect(listReminders()[0].triggerAtUtc).toBe("2026-06-11T18:30:00.000Z");
  });

  it("marks a reminder as delivered", () => {
    const reminder = addReminder({ matchId: "m-mex-rsa", minutesBefore: 10, kickoffUtc: "2026-06-11T19:00:00.000Z" });
    markReminderDelivered(reminder.id);

    expect(listReminders()[0].delivered).toBe(true);
  });
});
