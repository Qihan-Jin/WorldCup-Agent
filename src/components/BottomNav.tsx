import { CalendarDays, Home, MessageCircle, Settings } from "lucide-react";

export type Tab = "home" | "plan" | "ask" | "settings";

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const items = [
  { id: "home" as const, label: "首页", icon: Home },
  { id: "plan" as const, label: "计划", icon: CalendarDays },
  { id: "ask" as const, label: "Ask AI", icon: MessageCircle },
  { id: "settings" as const, label: "设置", icon: Settings }
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-1/2 z-20 grid w-full max-w-md -translate-x-1/2 grid-cols-4 border-t border-white/10 bg-[#071b16]/95 px-2 py-2 backdrop-blur">
      {items.map((item) => {
        const Icon = item.icon;
        const active = item.id === activeTab;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center gap-1 rounded-md px-2 py-2 text-xs transition ${
              active ? "text-lime" : "text-white/55 hover:text-white"
            }`}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
