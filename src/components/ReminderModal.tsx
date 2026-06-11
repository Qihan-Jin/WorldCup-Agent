import type { Match } from "../types";

interface ReminderModalProps {
  match: Match | null;
  onClose: () => void;
  onSetReminder: (minutes: number) => void;
}

export function ReminderModal({ match, onClose, onSetReminder }: ReminderModalProps) {
  if (!match) return null;

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/60 px-4 pb-4">
      <section className="w-full max-w-md rounded-lg bg-white p-4 text-ink">
        <h2 className="text-lg font-bold">提醒我</h2>
        <p className="mt-1 text-sm text-slate-600">
          {match.homeTeam} vs {match.awayTeam}
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[10, 30, 60].map((minutes) => (
            <button
              key={minutes}
              type="button"
              onClick={() => onSetReminder(minutes)}
              className="rounded-md bg-pitch px-3 py-3 text-sm font-semibold text-white"
            >
              {minutes} min
            </button>
          ))}
        </div>
        <button type="button" onClick={onClose} className="mt-3 w-full rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold">
          取消
        </button>
      </section>
    </div>
  );
}
