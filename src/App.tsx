import { useMemo, useState } from "react";
import { BottomNav, type Tab } from "./components/BottomNav";
import { ReminderModal } from "./components/ReminderModal";
import { getAllMatches, getMatchById } from "./data/matchRepository";
import { AskAiPage } from "./pages/AskAiPage";
import { HomePage } from "./pages/HomePage";
import { MatchDetailPage } from "./pages/MatchDetailPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { PlanPage } from "./pages/PlanPage";
import { SettingsPage } from "./pages/SettingsPage";
import { loadProfile } from "./profile/profileStore";
import { addReminder, listReminders } from "./reminders/reminderStore";
import type { Match } from "./types";

export default function App() {
  const [profile, setProfile] = useState(loadProfile);
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [reminderMatch, setReminderMatch] = useState<Match | null>(null);
  const [reminderCount, setReminderCount] = useState(listReminders().length);
  const matches = useMemo(() => getAllMatches(), []);
  const selectedMatch = selectedMatchId ? getMatchById(selectedMatchId) : undefined;

  function handleReminder(minutes: number) {
    if (!reminderMatch) return;
    addReminder({ matchId: reminderMatch.id, minutesBefore: minutes, kickoffUtc: reminderMatch.kickoffUtc });
    setReminderCount(listReminders().length);
    setReminderMatch(null);
  }

  return (
    <main className="min-h-screen bg-pitch text-white">
      <div className="mx-auto min-h-screen max-w-md px-4 pb-28 pt-5">
        <header className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-lime">MatchPilot</p>
            <p className="text-sm text-white/55">AI 世界杯观赛规划 Agent</p>
          </div>
          <span className="rounded-md bg-white/10 px-2 py-1 text-xs">{reminderCount} 个提醒</span>
        </header>

        {!profile.favoriteTeam ? (
          <OnboardingPage profile={profile} onProfileChange={setProfile} />
        ) : selectedMatch ? (
          <MatchDetailPage
            match={selectedMatch}
            onBack={() => setSelectedMatchId(null)}
            onReminder={() => setReminderMatch(selectedMatch)}
          />
        ) : activeTab === "home" ? (
          <HomePage profile={profile} matches={matches} onOpenMatch={setSelectedMatchId} onReminder={setReminderMatch} />
        ) : activeTab === "plan" ? (
          <PlanPage profile={profile} matches={matches} onOpenMatch={setSelectedMatchId} onReminder={setReminderMatch} />
        ) : activeTab === "ask" ? (
          <AskAiPage profile={profile} matches={matches} />
        ) : (
          <SettingsPage profile={profile} onProfileChange={setProfile} />
        )}
      </div>

      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setSelectedMatchId(null);
          setActiveTab(tab);
        }}
      />
      <ReminderModal
        match={reminderMatch}
        onClose={() => setReminderMatch(null)}
        onSetReminder={handleReminder}
      />
    </main>
  );
}
