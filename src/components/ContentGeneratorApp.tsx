
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TopNavigation } from "./TopNavigation";
import { MainSidebar } from "./MainSidebar";
import { CanvasArea } from "./CanvasArea";

export const ContentGeneratorApp = () => {
  const [credits, setCredits] = useState(150);
  const [selectedContentType, setSelectedContentType] = useState<string>("visual-notes");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full bg-background">
        <TopNavigation credits={credits} />
        
        <div className="flex flex-1 w-full">
          <MainSidebar 
            selectedContentType={selectedContentType}
            onContentTypeChange={setSelectedContentType}
          />
          
          <main className="flex-1 flex flex-col">
            <CanvasArea 
              contentType={selectedContentType}
              onCreditsUsed={(amount) => setCredits(prev => Math.max(0, prev - amount))}
            />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
