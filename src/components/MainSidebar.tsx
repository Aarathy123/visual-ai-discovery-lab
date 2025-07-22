
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { InputControls } from "./InputControls";
import { SavedGenerations } from "./SavedGenerations";

interface MainSidebarProps {
  selectedContentType: string;
  onContentTypeChange: (type: string) => void;
}

export const MainSidebar = ({ selectedContentType, onContentTypeChange }: MainSidebarProps) => {
  return (
    <Sidebar className="w-80 border-r border-border">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Create Content</h2>
          <SidebarTrigger />
        </div>
      </div>
      
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel>Input</SidebarGroupLabel>
          <SidebarGroupContent>
            <InputControls 
              selectedContentType={selectedContentType}
              onContentTypeChange={onContentTypeChange}
            />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Saved Generations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SavedGenerations />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
