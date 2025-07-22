
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Link, FileText, BarChart3, Lightbulb, FileCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface InputControlsProps {
  selectedContentType: string;
  onContentTypeChange: (type: string) => void;
}

const contentTypes = [
  { id: "key-points", label: "Key points", icon: Lightbulb },
  { id: "visual-notes", label: "Visual notes", icon: FileText },
  { id: "infographics", label: "Infographics", icon: BarChart3 },
  { id: "summary", label: "Summary", icon: FileCheck },
];

export const InputControls = ({ selectedContentType, onContentTypeChange }: InputControlsProps) => {
  const [inputText, setInputText] = useState("");
  const [inputUrl, setInputUrl] = useState("");
  const [activeTab, setActiveTab] = useState("text");

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
            const isSelected = selectedContentType === type.id;
            
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
                onClick={() => onContentTypeChange(type.id)}
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted/30">
            <TabsTrigger value="text" className="font-dm-sans">Text</TabsTrigger>
            <TabsTrigger value="url" className="font-dm-sans">URL</TabsTrigger>
            <TabsTrigger value="file" className="font-dm-sans">File</TabsTrigger>
          </TabsList>
          
          <TabsContent value="text" className="mt-4">
            <div className="space-y-2">
              <Textarea
                placeholder="Enter your topic, description, or paste content here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-32 resize-none border-border focus:border-primary"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="url" className="mt-4">
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="https://example.com"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  className="border-border focus:border-primary"
                />
                <Button size="icon" variant="outline" className="shrink-0">
                  <Link className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="file" className="mt-4">
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

      {/* Generate Button */}
      <Button 
        className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium font-dm-sans"
        size="lg"
      >
        Generate {getContentTypeLabel(selectedContentType)}
      </Button>
    </div>
  );
};
