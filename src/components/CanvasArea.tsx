
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Share2, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface CanvasAreaProps {
  contentType: string;
  onCreditsUsed: (amount: number) => void;
}

export const CanvasArea = ({ contentType, onCreditsUsed }: CanvasAreaProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [zoom, setZoom] = useState(100);

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case "visual-notes": return "Visual Notes";
      case "infographics": return "Infographics";
      case "key-points": return "Key Points";
      case "summary": return "Summary";
      default: return "Content";
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Canvas Header */}
      <div className="h-12 border-b border-border bg-background flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <h3 className="font-medium">{getContentTypeLabel(contentType)}</h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>{zoom}%</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(25, zoom - 25))}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(200, zoom + 25))}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setZoom(100)}>
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Canvas Content */}
      <div className="flex-1 bg-muted/20 relative overflow-hidden">
        <div 
          className="absolute inset-4 bg-white rounded-lg shadow-sm border border-border flex items-center justify-center"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center' }}
        >
          {isGenerating ? (
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Generating your {getContentTypeLabel(contentType).toLowerCase()}...</p>
            </div>
          ) : (
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h4 className="font-medium mb-2">Ready to Create</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Add your content in the sidebar and click "Generate Content" to start creating your {getContentTypeLabel(contentType).toLowerCase()}.
              </p>
              <Button 
                onClick={() => {
                  setIsGenerating(true);
                  setTimeout(() => {
                    setIsGenerating(false);
                    onCreditsUsed(1);
                  }, 3000);
                }}
              >
                Start Creating
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
