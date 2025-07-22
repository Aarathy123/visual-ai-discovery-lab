
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RiMenuLine, RiCloseLine, RiHomeLine, RiHistoryLine } from "@remixicon/react";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";

export const NavigationSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: "home", label: "Home", icon: RiHomeLine, path: "/" },
    { id: "history", label: "History", icon: RiHistoryLine, path: "/history" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path === "/history" && location.pathname === "/history") return true;
    if (path === "/" && location.pathname.startsWith("/project/")) return true;
    return false;
  };

  return (
    <div 
      className={cn(
        "bg-white border-r border-border transition-all duration-300 ease-in-out h-full flex flex-col",
        isExpanded ? "w-64" : "w-16"
      )}
    >
      {/* Header */}
      <div className="h-14 border-b border-border flex items-center justify-between px-4">
        {isExpanded && (
          <span className="font-sora font-semibold text-lg text-foreground">ContentGen</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-8 w-8 hover:bg-muted"
        >
          {isExpanded ? <RiCloseLine className="h-5 w-5" /> : <RiMenuLine className="h-5 w-5" />}
        </Button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <li key={item.id}>
                <Button
                  variant="ghost"
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "w-full justify-start h-12 relative transition-colors",
                    isExpanded ? "px-4" : "px-0 justify-center",
                    active 
                      ? "bg-primary/10 text-primary hover:bg-primary/15" 
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className={cn("h-5 w-5", isExpanded ? "mr-3" : "")} />
                  {isExpanded && (
                    <span className="font-medium">{item.label}</span>
                  )}
                  {active && (
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-primary rounded-l-full" />
                  )}
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};
