
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RiDeleteBinLine, RiFileTextLine, RiBarChartBoxLine, RiLightbulbLine, RiFileCheckLine, RiLoaderLine } from "@remixicon/react";
import { useNavigate } from "react-router-dom";
import { historyService, HistoryItem } from "@/services/historyService";
import { ApiError } from "@/lib/api";

const contentTypeIcons = {
  "pdf": RiFileTextLine,
  "infographics": RiBarChartBoxLine,
  "key-points": RiLightbulbLine,
  "summary": RiFileCheckLine,
  "visual-notes": RiFileTextLine,
};

const contentTypeLabels = {
  "pdf": "PDF Document",
  "infographics": "Infographics", 
  "key-points": "Key Points",
  "summary": "Summary",
  "visual-notes": "Visual Notes",
};

export const HistoryView = () => {
  const navigate = useNavigate();
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch history data on component mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await historyService.getHistory();
        setHistoryItems(response.data);
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError.message || 'Failed to fetch history');
        console.error('Error fetching history:', apiError);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleItemClick = (item: HistoryItem) => {
    navigate(`/project/${item._id}`);
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Helper function to get title from prompt or input
  const getTitle = (item: HistoryItem) => {
    if (item.prompt) {
      return item.prompt.length > 50 ? item.prompt.substring(0, 50) + '...' : item.prompt;
    }
    if (item.input) {
      return item.input.length > 50 ? item.input.substring(0, 50) + '...' : item.input;
    }
    return 'Untitled';
  };

  const handleDelete = async (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    try {
      await historyService.deleteHistoryItem(itemId);
      // Remove the item from the local state
      setHistoryItems(prev => prev.filter(item => item._id !== itemId));
    } catch (err) {
      const apiError = err as ApiError;
      console.error('Error deleting item:', apiError);
      // You might want to show a toast notification here
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="font-sora text-2xl font-semibold text-foreground mb-2">Generation History</h1>
          <p className="text-muted-foreground">View and manage your previous content generations</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <RiLoaderLine className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading history...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="font-sora text-2xl font-semibold text-foreground mb-2">Generation History</h1>
          <p className="text-muted-foreground">View and manage your previous content generations</p>
        </div>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <RiFileTextLine className="h-8 w-8 text-destructive" />
          </div>
          <h3 className="font-sora font-medium text-foreground mb-2">Error loading history</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-sora text-2xl font-semibold text-foreground mb-2">Generation History</h1>
        <p className="text-muted-foreground">View and manage your previous content generations</p>
      </div>

      <div className="space-y-4">
        {historyItems.map((item) => {
          const Icon = contentTypeIcons[item.type as keyof typeof contentTypeIcons] || RiFileTextLine;
          
          return (
            <Card 
              key={item._id}
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
                      <h3 className="font-sora font-medium text-foreground">{getTitle(item)}</h3>
                      <p className="text-sm text-muted-foreground">
                        {contentTypeLabels[item.type as keyof typeof contentTypeLabels] || 'Document'} • {formatDate(item.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleDelete(e, item._id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <RiDeleteBinLine className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
        
        {historyItems.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <RiFileTextLine className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-sora font-medium text-foreground mb-2">No generations yet</h3>
            <p className="text-muted-foreground">Start creating content to see your history here</p>
          </div>
        )}
      </div>
    </div>
  );
};
