
import { Button } from "@/components/ui/button";
import { Sparkles, Crown } from "lucide-react";

interface TopNavigationProps {
  credits: number;
}

export const TopNavigation = ({ credits }: TopNavigationProps) => {
  return (
    <header className="h-14 border-b border-border bg-white flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-sora font-semibold text-lg text-foreground">ContentGen</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-lg border border-border">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium font-dm-sans text-foreground">{credits} credits</span>
        </div>
        
        <Button size="sm" className="gap-2 bg-orange hover:bg-orange/90 text-orange-foreground font-dm-sans">
          <Crown className="w-4 h-4" />
          Upgrade
        </Button>
      </div>
    </header>
  );
};
