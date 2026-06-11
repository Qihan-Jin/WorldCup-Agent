import { ArrowLeft, Bell } from "lucide-react";
import { generateMatchInsight } from "../insights/insightGenerator";
import type { Match, MatchStage } from "../types";

interface MatchDetailPageProps {
  match: Match;
  onBack: () => void;
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

export function MatchDetailPage({ match, onBack, onReminder }: MatchDetailPageProps) {
  const insight = generateMatchInsight(match);

  return (
    <section className="space-y-5">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-sm text-white/65">
        <ArrowLeft size={16} /> 返回
      </button>
      <div>
        <p className="text-sm uppercase text-lime">{stageLabels[match.stage]}</p>
        <h1 className="mt-1 text-3xl font-bold">
          {match.homeTeam} vs {match.awayTeam}
        </h1>
        <p className="mt-2 text-sm text-white/60">
          {new Date(match.kickoffUtc).toLocaleString()} · {match.venue}
        </p>
      </div>

      <div className="rounded-lg border border-white/10 bg-white/[0.06] p-4">
        <h2 className="text-lg font-semibold">为什么值得关注</h2>
        <p className="mt-2 text-sm leading-6 text-white/70">{insight.whyItMatters}</p>
      </div>

      <div className="rounded-lg border border-white/10 bg-white/[0.06] p-4">
        <h2 className="text-lg font-semibold">看点</h2>
        <ul className="mt-3 space-y-2 text-sm text-white/70">
          {insight.watchFor.map((item) => (
            <li key={item}>· {item}</li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        onClick={onReminder}
        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-lime px-4 py-3 font-semibold text-pitch"
      >
        <Bell size={18} /> 设置比赛提醒
      </button>
    </section>
  );
}
