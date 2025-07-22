
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { TopNavigation } from "./TopNavigation";
import { NavigationSidebar } from "./NavigationSidebar";
import { HomeView } from "./HomeView";
import { HistoryView } from "./HistoryView";

export const ContentGeneratorApp = () => {
  const [credits, setCredits] = useState(150);
  const location = useLocation();

  const isHistoryView = location.pathname === "/history";

  return (
    <div className="min-h-screen flex flex-col w-full bg-background">
      <TopNavigation credits={credits} />
      
      <div className="flex flex-1 w-full">
        <NavigationSidebar />
        
        <main className="flex-1 flex flex-col">
          {isHistoryView ? (
            <HistoryView />
          ) : (
            <HomeView 
              onCreditsUsed={(amount) => setCredits(prev => Math.max(0, prev - amount))}
            />
          )}
        </main>
      </div>
    </div>
  );
};
