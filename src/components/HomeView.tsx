
import { InputControls } from "./InputControls";
import { CanvasArea } from "./CanvasArea";
import { HomeViewProvider, useHomeView } from "@/contexts/HomeViewContext";
import { Loader2 } from "lucide-react";

interface HomeViewProps {
  onCreditsUsed: (amount: number) => void;
}

// Inner component that uses the context
const HomeViewContent: React.FC<HomeViewProps> = ({ onCreditsUsed }) => {
  const { state, actions } = useHomeView();

  // Show loading state while fetching project data
  if (state.isLoadingProject) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </div>
    );
  }

  // Show error state if project loading failed
  if (state.projectError) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader2 className="h-8 w-8 text-destructive" />
          </div>
          <h3 className="font-sora font-medium text-foreground mb-2">Error loading project</h3>
          <p className="text-muted-foreground">{state.projectError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Create Content Sidebar - Fixed */}
      <div className="w-80 border-r border-border bg-white flex flex-col">
        <div className="p-6 border-b border-border">
          <h2 className="font-sora font-semibold text-xl text-foreground">
            {state.projectData ? 'Edit Content' : 'Create Content'}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {state.projectData ? 'Modify your existing content' : 'Choose your content type and add your inputs'}
          </p>
        </div>
        
        <div className="flex-1 overflow-auto p-6">
          <InputControls />
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1">
        <CanvasArea 
          contentType={state.selectedContentType}
          onCreditsUsed={onCreditsUsed}
        />
      </div>
    </div>
  );
};

// Wrapper component that provides the context
export const HomeView: React.FC<HomeViewProps> = ({ onCreditsUsed }) => {
  return (
    <HomeViewProvider>
      <HomeViewContent onCreditsUsed={onCreditsUsed} />
    </HomeViewProvider>
  );
};
