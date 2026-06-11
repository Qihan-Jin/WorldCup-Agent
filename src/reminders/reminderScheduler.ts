import type { Reminder } from "../types";

export function getDueReminders(reminders: Reminder[], now: Date): Reminder[] {
  return reminders.filter((reminder) => !reminder.delivered && new Date(reminder.triggerAtUtc) <= now);
}

export function notifyReminder(title: string, body: string): void {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, { body });
  }
}
