
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Share2, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { useHomeView } from "@/contexts/HomeViewContext";

interface CanvasAreaProps {
  contentType: string;
  onCreditsUsed: (amount: number) => void;
}

export const CanvasArea = ({ contentType, onCreditsUsed }: CanvasAreaProps) => {
  const { state } = useHomeView();
  const [zoom, setZoom] = useState(100);
  const [resultText, setResultText] = useState<string | null>(null);
  const [resultImages, setResultImages] = useState<string[] | null>(null);

  // Update result state when project data changes
  useEffect(() => {
    if (state.projectData) {
      if (state.projectData.resultUrl && Array.isArray(state.projectData.resultUrl)) {
        // Handle resultUrl as array of image URLs
        setResultImages(state.projectData.resultUrl);
        setResultText(null);
      } else if (state.projectData.result) {
        // Handle result as text
        setResultText(state.projectData.result);
        setResultImages(null);
      } else {
        // No result data available
        setResultText(null);
        setResultImages(null);
      }
    } else {
      // No project data, reset result state
      setResultText(null);
      setResultImages(null);
    }
  }, [state.projectData]);

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case "visual-notes": return "Visual notes";
      case "infographics": return "Infographics";
      case "key-points": return "Key points";
      case "summary": return "Summary";
      default: return "Content";
    }
  };

  const renderResultContent = () => {
    if (resultImages && resultImages.length > 0) {
      return (
        <div className="space-y-4 p-6">
          <h4 className="font-sora font-medium text-lg mb-4">Generated Images</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resultImages.map((imageUrl, index) => (
              <div key={index} className="relative group">
                <img
                  src={imageUrl}
                  alt={`Generated content ${index + 1}`}
                  className="w-full h-auto rounded-lg shadow-sm border border-border"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <Button variant="secondary" size="sm">
                    <RiDownloadLine className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (resultText) {
      return (
        <div className="p-6 max-w-4xl mx-auto">
          <h4 className="font-sora font-medium text-lg mb-4">Generated Content</h4>
          <div className="bg-muted/30 rounded-lg p-6 border border-border">
            <pre className="whitespace-pre-wrap font-dm-sans text-sm leading-relaxed">
              {resultText}
            </pre>
          </div>
        </div>
      );
    }

    return null;
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
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(200, zoom + 25))}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setZoom(100)}>
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" className="font-dm-sans">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
          <Button variant="outline" size="sm" className="font-dm-sans">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Canvas Content */}
      <div className="flex-1 relative overflow-hidden p-6">
        <div 
          className="h-full bg-white rounded-lg shadow-sm border border-border overflow-auto"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
        >
          {state.isGenerating ? (
            <div className="text-center p-8">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground font-dm-sans">Generating your {getContentTypeLabel(contentType).toLowerCase()}...</p>
            </div>
          ) : resultText || resultImages ? (
            // Show generated content
            renderResultContent()
          ) : (
            // Show ready state
            <div className="text-center p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h4 className="font-sora font-medium mb-2 text-foreground">Ready to Create</h4>
              <p className="text-sm text-muted-foreground mb-4 font-dm-sans">
                Add your content in the sidebar and click "Generate {getContentTypeLabel(contentType)}" to start creating.
              </p>
              <Button 
                onClick={() => {
                  onCreditsUsed(1);
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
