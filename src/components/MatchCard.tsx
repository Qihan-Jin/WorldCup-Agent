import { Bell, ChevronRight } from "lucide-react";
import type { ScoredMatch } from "../types";

interface MatchCardProps {
  scoredMatch: ScoredMatch;
  onOpen: () => void;
  onReminder: () => void;
}

export function MatchCard({ scoredMatch, onOpen, onReminder }: MatchCardProps) {
  const { match, score, reasons, priority } = scoredMatch;

  return (
    <article className="rounded-lg border border-white/10 bg-white/[0.06] p-4 shadow-xl shadow-black/10">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase text-lime">
            {match.stage} · {priority}
          </p>
          <h3 className="mt-1 text-lg font-semibold">
            {match.homeTeam} vs {match.awayTeam}
          </h3>
          <p className="mt-1 text-sm text-white/60">{new Date(match.kickoffUtc).toLocaleString()}</p>
        </div>
        <div className="rounded-md bg-lime px-2 py-1 text-sm font-bold text-pitch">{score}</div>
      </div>
      <p className="mt-3 text-sm text-white/75">{reasons[0]}</p>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={onReminder}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm"
        >
          <Bell size={16} /> Remind
        </button>
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-lime px-3 py-2 text-sm font-semibold text-pitch"
        >
          Details <ChevronRight size={16} />
        </button>
      </div>
    </article>
  );
}
