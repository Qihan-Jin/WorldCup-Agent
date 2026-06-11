import { Bell, ChevronRight } from "lucide-react";
import type { Match, MatchStage } from "../types";

interface FixtureCardProps {
  match: Match;
  onOpen: () => void;
  onReminder: () => void;
}

const stageLabels: Record<MatchStage, string> = {
  Group: "小组赛",
  "Round of 32": "32 强",
  "Round of 16": "16 强",
  "Quarter-final": "1/4 决赛",
  "Semi-final": "半决赛",
  "Third place": "三四名决赛",
  Final: "决赛"
};

export function FixtureCard({ match, onOpen, onReminder }: FixtureCardProps) {
  return (
    <article className="rounded-lg border border-white/10 bg-white/[0.06] p-4 shadow-xl shadow-black/10">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs uppercase text-lime">
            比赛 {match.matchNumber} · {stageLabels[match.stage]}
          </p>
          <h3 className="mt-1 text-lg font-semibold leading-6">
            {match.homeTeam} vs {match.awayTeam}
          </h3>
          <p className="mt-1 text-sm text-white/60">{new Date(match.kickoffUtc).toLocaleString()}</p>
          <p className="mt-1 text-xs text-white/45">{match.venue}</p>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={onReminder}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm"
        >
          <Bell size={16} /> 提醒
        </button>
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-lime px-3 py-2 text-sm font-semibold text-pitch"
        >
          详情 <ChevronRight size={16} />
        </button>
      </div>
    </article>
  );
}
