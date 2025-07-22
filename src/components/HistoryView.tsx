
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, FileText, BarChart3, Lightbulb, FileCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HistoryItem {
  id: string;
  contentType: string;
  title: string;
  createdAt: string;
  counter: number;
}

const contentTypeIcons = {
  "visual-notes": FileText,
  "infographics": BarChart3,
  "key-points": Lightbulb,
  "summary": FileCheck,
};

const contentTypeLabels = {
  "visual-notes": "Visual Notes",
  "infographics": "Infographics", 
  "key-points": "Key Points",
  "summary": "Summary",
};

export const HistoryView = () => {
  const navigate = useNavigate();
  
  // Mock history data - will be replaced with real data management
  const [historyItems] = useState<HistoryItem[]>([
    {
      id: "uuid-1",
      contentType: "visual-notes",
      title: "Visual Notes - 1",
      createdAt: "2024-01-15",
      counter: 1,
    },
    {
      id: "uuid-2", 
      contentType: "infographics",
      title: "Infographics - 1",
      createdAt: "2024-01-14",
      counter: 1,
    },
    {
      id: "uuid-3",
      contentType: "visual-notes",
      title: "Visual Notes - 2", 
      createdAt: "2024-01-13",
      counter: 2,
    },
  ]);

  const handleItemClick = (item: HistoryItem) => {
    navigate(`/project/${item.id}`);
  };

  const handleDelete = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    // TODO: Implement delete functionality
    console.log("Delete item:", itemId);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-sora text-2xl font-semibold text-foreground mb-2">Generation History</h1>
        <p className="text-muted-foreground">View and manage your previous content generations</p>
      </div>

      <div className="space-y-4">
        {historyItems.map((item) => {
          const Icon = contentTypeIcons[item.contentType as keyof typeof contentTypeIcons];
          
          return (
            <Card 
              key={item.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleItemClick(item)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-sora font-medium text-foreground">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {contentTypeLabels[item.contentType as keyof typeof contentTypeLabels]} • {item.createdAt}
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleDelete(e, item.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
        
        {historyItems.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-sora font-medium text-foreground mb-2">No generations yet</h3>
            <p className="text-muted-foreground">Start creating content to see your history here</p>
          </div>
        )}
      </div>
    </div>
  );
};
