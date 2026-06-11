import type { Reminder } from "../types";

const REMINDER_KEY = "matchpilot.reminders";

export interface AddReminderInput {
  matchId: string;
  minutesBefore: number;
  kickoffUtc: string;
}

function saveReminders(reminders: Reminder[]): void {
  localStorage.setItem(REMINDER_KEY, JSON.stringify(reminders));
}

export function listReminders(): Reminder[] {
  const raw = localStorage.getItem(REMINDER_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as Reminder[];
  } catch {
    return [];
  }
}

export function addReminder(input: AddReminderInput): Reminder {
  const kickoff = new Date(input.kickoffUtc);
  const triggerAt = new Date(kickoff.getTime() - input.minutesBefore * 60 * 1000);
  const reminder: Reminder = {
    id: `${input.matchId}-${input.minutesBefore}`,
    matchId: input.matchId,
    minutesBefore: input.minutesBefore,
    triggerAtUtc: triggerAt.toISOString(),
    delivered: false
  };
  const existing = listReminders().filter((item) => item.id !== reminder.id);
  saveReminders([...existing, reminder]);
  return reminder;
}

export function markReminderDelivered(reminderId: string): void {
  saveReminders(
    listReminders().map((reminder) =>
      reminder.id === reminderId ? { ...reminder, delivered: true } : reminder
    )
  );
}
