
import { InputControls } from "./InputControls";
import { CanvasArea } from "./CanvasArea";

interface HomeViewProps {
  selectedContentType: string;
  onContentTypeChange: (type: string) => void;
  onCreditsUsed: (amount: number) => void;
}

export const HomeView = ({ 
  selectedContentType, 
  onContentTypeChange, 
  onCreditsUsed 
}: HomeViewProps) => {
  return (
    <div className="flex h-full">
      {/* Create Content Sidebar - Fixed */}
      <div className="w-80 border-r border-border bg-white flex flex-col">
        <div className="p-6 border-b border-border">
          <h2 className="font-sora font-semibold text-xl text-foreground">Create Content</h2>
          <p className="text-sm text-muted-foreground mt-1">Choose your content type and add your inputs</p>
        </div>
        
        <div className="flex-1 overflow-auto p-6">
          <InputControls 
            selectedContentType={selectedContentType}
            onContentTypeChange={onContentTypeChange}
          />
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1">
        <CanvasArea 
          contentType={selectedContentType}
          onCreditsUsed={onCreditsUsed}
        />
      </div>
    </div>
  );
};
