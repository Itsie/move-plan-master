import { cn } from "@/lib/utils";

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isPlanningEnabled: boolean;
}

export const TabNavigation = ({ activeTab, onTabChange, isPlanningEnabled }: TabNavigationProps) => {
  return (
    <div className="flex border-b border-border bg-content-bg">
      <button
        className={cn(
          "px-6 py-4 text-sm font-medium border-b-2 transition-colors",
          activeTab === "auftragserfassung"
            ? "text-foreground border-primary"
            : "text-muted-foreground border-transparent hover:text-foreground"
        )}
        onClick={() => onTabChange("auftragserfassung")}
      >
        Auftragserfassung
      </button>
      <button
        className={cn(
          "px-6 py-4 text-sm font-medium border-b-2 transition-colors",
          !isPlanningEnabled && "opacity-50 cursor-not-allowed",
          activeTab === "soll-plan" && isPlanningEnabled
            ? "text-foreground border-primary"
            : "text-muted-foreground border-transparent hover:text-foreground"
        )}
        onClick={() => isPlanningEnabled && onTabChange("soll-plan")}
        disabled={!isPlanningEnabled}
      >
        Soll-Plan Anpassung
      </button>
    </div>
  );
};