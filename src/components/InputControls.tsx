
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Link, FileText, BarChart3, Lightbulb, FileCheck, Map, CreditCard, BookOpen, Image, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ContentType, InputFormat } from "@/types/content";
import { useHomeView } from "@/contexts/HomeViewContext";

const contentTypes = [
  { id: ContentType.INFO_GRAPHICS, label: "Info Graphics", icon: BarChart3 },
  { id: ContentType.CONCEPT_MAP, label: "Concept Map", icon: Map },
  { id: ContentType.VISUAL_NOTES, label: "Visual Notes", icon: FileText },
  { id: ContentType.FLASH_CARDS, label: "Flash Cards", icon: CreditCard },
  { id: ContentType.KEY_POINTS, label: "Key Points", icon: Lightbulb },
  { id: ContentType.SMART_SUMMARY, label: "Smart Summary", icon: BookOpen },
  { id: ContentType.MEDIA_CAROUSELS, label: "Media Carousels", icon: Image },
  { id: ContentType.SOCIAL_MEDIA_POST, label: "Social Media Post", icon: Share2 },
];

export const InputControls = () => {
  const { state, actions } = useHomeView();

  const getContentTypeLabel = (type: string) => {
    const found = contentTypes.find(ct => ct.id === type);
    return found ? found.label : "Content";
  };

  return (
    <div className="space-y-8">
      {/* Content Type Selection */}
      <div className="space-y-4">
        <Label className="text-sm font-medium font-dm-sans text-foreground">Content Type</Label>
        <div className="grid grid-cols-2 gap-3">
          {contentTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = state.selectedContentType === type.id;
            
            return (
              <Button
                key={type.id}
                variant="outline"
                className={cn(
                  "h-auto p-4 flex flex-col gap-2 border-2 transition-all",
                  isSelected 
                    ? "border-orange bg-orange/5 text-orange hover:bg-orange/10" 
                    : "border-border hover:border-primary/30 hover:bg-primary/5"
                )}
                onClick={() => actions.setSelectedContentType(type.id)}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium font-dm-sans">{type.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Input Tabs */}
      <div className="space-y-4">
        <Label className="text-sm font-medium font-dm-sans text-foreground">Input Source</Label>
        <Tabs value={state.activeTab} onValueChange={(value) => actions.setActiveTab(value as InputFormat)} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted/30">
            <TabsTrigger value={InputFormat.TEXT} className="font-dm-sans">Text</TabsTrigger>
            <TabsTrigger value={InputFormat.URL} className="font-dm-sans">URL</TabsTrigger>
            <TabsTrigger value={InputFormat.FILE} className="font-dm-sans">File</TabsTrigger>
          </TabsList>
          
          <TabsContent value={InputFormat.TEXT} className="mt-4">
            <div className="space-y-2">
              <Textarea
                placeholder="Enter your topic, description, or paste content here..."
                value={state.inputText}
                onChange={(e) => actions.setInputText(e.target.value)}
                className="min-h-32 resize-none border-border focus:border-primary"
              />
            </div>
          </TabsContent>
          
          <TabsContent value={InputFormat.URL} className="mt-4">
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="https://example.com"
                  value={state.inputUrl}
                  onChange={(e) => actions.setInputUrl(e.target.value)}
                  className="border-border focus:border-primary"
                />
                <Button size="icon" variant="outline" className="shrink-0">
                  <Link className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value={InputFormat.FILE} className="mt-4">
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
              <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-3 font-dm-sans">
                Drop files here or click to upload
              </p>
              <Button variant="outline" size="sm" className="font-dm-sans">
                Choose Files
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Error Message */}
      {state.error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive font-dm-sans">{state.error}</p>
        </div>
      )}

      {/* Generate Button */}
      <Button 
        className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium font-dm-sans"
        size="lg"
        onClick={actions.handleGenerate}
        disabled={state.isGenerating}
      >
        {state.isGenerating ? (
          <>
            <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2"></div>
            Generating...
          </>
        ) : (
          `Generate ${getContentTypeLabel(state.selectedContentType)}`
        )}
      </Button>
    </div>
  );
};
