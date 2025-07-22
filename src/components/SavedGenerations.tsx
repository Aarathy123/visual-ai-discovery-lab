
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RiFileTextLine, RiBarChartBoxLine, RiLightbulbLine, RiFileCheckLine, RiMoreLine } from "@remixicon/react";

const mockGenerations = [
  {
    id: 1,
    title: "Project Overview",
    type: "visual-notes",
    date: "2 hours ago",
  },
  {
    id: 2,
    title: "Market Analysis",
    type: "infographics", 
    date: "1 day ago",
  },
  {
    id: 3,
    title: "Key Takeaways",
    type: "key-points",
    date: "2 days ago",
  },
  {
    id: 4,
    title: "Report Summary",
    type: "summary",
    date: "1 week ago",
  },
];

const getIcon = (type: string) => {
  switch (type) {
    case "visual-notes": return RiFileTextLine;
    case "infographics": return RiBarChartBoxLine;
    case "key-points": return RiLightbulbLine;
    case "summary": return RiFileCheckLine;
    default: return RiFileTextLine;
  }
};

export const SavedGenerations = () => {
  return (
    <ScrollArea className="h-64">
      <div className="space-y-2">
        {mockGenerations.map((generation) => {
          const Icon = getIcon(generation.type);
          return (
            <div
              key={generation.id}
              className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                <Icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{generation.title}</p>
                <p className="text-xs text-muted-foreground">{generation.date}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-6 h-6 opacity-0 group-hover:opacity-100"
              >
                <RiMoreLine className="w-3 h-3" />
              </Button>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};
