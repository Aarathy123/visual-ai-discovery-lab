
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RiDownloadLine, RiShareLine, RiZoomInLine, RiZoomOutLine, RiRestartLine } from "@remixicon/react";

interface CanvasAreaProps {
  contentType: string;
  onCreditsUsed: (amount: number) => void;
}

export const CanvasArea = ({ contentType, onCreditsUsed }: CanvasAreaProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [zoom, setZoom] = useState(100);

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case "visual-notes": return "Visual notes";
      case "infographics": return "Infographics";
      case "key-points": return "Key points";
      case "summary": return "Summary";
      default: return "Content";
    }
  };

  return (
    <div className="flex flex-col h-full bg-muted/20">
      {/* Canvas Header */}
      <div className="h-12 border-b border-border bg-white flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <h3 className="font-sora font-medium text-foreground">{getContentTypeLabel(contentType)}</h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground font-dm-sans">
            <span>{zoom}%</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(25, zoom - 25))}>
            <RiZoomOutLine className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(200, zoom + 25))}>
            <RiZoomInLine className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setZoom(100)}>
            <RiRestartLine className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" className="font-dm-sans">
            <RiShareLine className="w-4 h-4" />
            Share
          </Button>
          <Button variant="outline" size="sm" className="font-dm-sans">
            <RiDownloadLine className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Canvas Content */}
      <div className="flex-1 relative overflow-hidden p-6">
        <div 
          className="h-full bg-white rounded-lg shadow-sm border border-border flex items-center justify-center"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center' }}
        >
          {isGenerating ? (
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground font-dm-sans">Generating your {getContentTypeLabel(contentType).toLowerCase()}...</p>
            </div>
          ) : (
            <div className="text-center p-8 max-w-md">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h4 className="font-sora font-medium mb-2 text-foreground">Ready to Create</h4>
              <p className="text-sm text-muted-foreground mb-4 font-dm-sans">
                Add your content in the sidebar and click "Generate {getContentTypeLabel(contentType)}" to start creating.
              </p>
              <Button 
                onClick={() => {
                  setIsGenerating(true);
                  setTimeout(() => {
                    setIsGenerating(false);
                    onCreditsUsed(1);
                  }, 3000);
                }}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-dm-sans"
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
