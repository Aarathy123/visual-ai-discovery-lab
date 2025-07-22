
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Map, FileText, CreditCard, Lightbulb, BookOpen, Image, Share2, Upload } from "lucide-react";
import { RiUploadLine, RiLinksLine, RiFileTextLine, RiBarChartBoxLine, RiLightbulbLine, RiFileCheckLine, RiMapLine, RiBankCardLine, RiBookOpenLine, RiImageLine, RiShareLine } from "@remixicon/react";
import { cn } from "@/lib/utils";
import { ContentType, InputFormat } from "@/types/content";
import { useHomeView } from "@/contexts/HomeViewContext";
import { Badge } from "@/components/ui/badge";

const contentTypes = [
  { id: ContentType.INFO_GRAPHICS, label: "Info Graphics", icon: BarChart3, comingSoon: false },
  { id: ContentType.CONCEPT_MAP, label: "Concept Map", icon: Map, comingSoon: true },
  { id: ContentType.VISUAL_NOTES, label: "Visual Notes", icon: FileText, comingSoon: false },
  { id: ContentType.FLASH_CARDS, label: "Flash Cards", icon: CreditCard, comingSoon: false },
  { id: ContentType.KEY_POINTS, label: "Key Points", icon: Lightbulb, comingSoon: false },
  { id: ContentType.SMART_SUMMARY, label: "Smart Summary", icon: BookOpen, comingSoon: false },
  { id: ContentType.MEDIA_CAROUSELS, label: "Media Carousels", icon: Image, comingSoon: true },
  { id: ContentType.SOCIAL_MEDIA_POST, label: "Social Media Post", icon: Share2, comingSoon: false },
];

export const InputControls = () => {
  const { state, actions } = useHomeView();

  const getContentTypeLabel = (type: string) => {
    const found = contentTypes.find(ct => ct.id === type);
    return found ? found.label : "Content";
  };

  const handleContentTypeClick = (typeId: string, comingSoon: boolean) => {
    if (!comingSoon) {
      actions.setSelectedContentType(typeId);
    }
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
              <div key={type.id} className="relative">
                <Button
                  variant="outline"
                  className={cn(
                    "h-auto p-4 flex flex-col gap-2 border-2 transition-all w-full",
                    type.comingSoon 
                      ? "opacity-50 blur-[0.5px] cursor-not-allowed border-muted bg-muted/20" 
                      : isSelected 
                        ? "border-orange bg-orange/5 text-orange hover:bg-orange/10" 
                        : "border-border hover:border-primary/30 hover:bg-primary/5"
                  )}
                  onClick={() => handleContentTypeClick(type.id, type.comingSoon)}
                  disabled={type.comingSoon}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium font-dm-sans">{type.label}</span>
                </Button>
                
                {type.comingSoon && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Badge variant="secondary" className="bg-orange/90 text-white text-xs font-medium px-2 py-1">
                      Coming Soon
                    </Badge>
                  </div>
                )}
              </div>
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
            <TabsTrigger value={InputFormat.FILE} className="font-dm-sans">
              File
            </TabsTrigger>
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
                  <RiLinksLine className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value={InputFormat.FILE} className="mt-4">
            <div className="space-y-4">
              {/* Coming Soon - Disabled File Upload */}
              <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground mb-2 font-dm-sans">
                  File Upload
                </p>
                <p className="text-xs text-muted-foreground mb-3 font-dm-sans">
                  Coming Soon
                </p>
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded text-xs text-muted-foreground">
                  <RiFileCheckLine className="w-3 h-3" />
                  Under Development
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Generate Button */}
      <div className="space-y-4">
        <Button 
          onClick={actions.handleGenerate}
          disabled={state.isGenerating}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-dm-sans"
        >
          {state.isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Generating...
            </>
          ) : (
            `Generate ${getContentTypeLabel(state.selectedContentType)}`
          )}
        </Button>
        
        {state.error && (
          <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            {state.error}
          </div>
        )}
      </div>
    </div>
  );
};
