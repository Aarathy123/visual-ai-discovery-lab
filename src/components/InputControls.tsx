
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Link, FileText, BarChart3, Lightbulb, FileCheck } from "lucide-react";

interface InputControlsProps {
  selectedContentType: string;
  onContentTypeChange: (type: string) => void;
}

const contentTypes = [
  { id: "visual-notes", label: "Visual Notes", icon: FileText },
  { id: "infographics", label: "Infographics", icon: BarChart3 },
  { id: "key-points", label: "Key Points", icon: Lightbulb },
  { id: "summary", label: "Summary", icon: FileCheck },
];

const toneOptions = [
  "Professional",
  "Creative", 
  "Formal",
  "Casual",
  "Academic",
  "Friendly"
];

export const InputControls = ({ selectedContentType, onContentTypeChange }: InputControlsProps) => {
  const [inputText, setInputText] = useState("");
  const [inputUrl, setInputUrl] = useState("");
  const [selectedTone, setSelectedTone] = useState("Professional");

  return (
    <div className="space-y-6">
      {/* Content Type Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Content Type</Label>
        <div className="grid grid-cols-2 gap-2">
          {contentTypes.map((type) => {
            const Icon = type.icon;
            return (
              <Button
                key={type.id}
                variant={selectedContentType === type.id ? "default" : "outline"}
                size="sm"
                className="h-auto p-3 flex flex-col gap-1"
                onClick={() => onContentTypeChange(type.id)}
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs">{type.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Text Input */}
      <div className="space-y-2">
        <Label htmlFor="text-input">Text Input</Label>
        <Textarea
          id="text-input"
          placeholder="Enter your topic, description, or paste content here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="min-h-24"
        />
      </div>

      {/* URL Input */}
      <div className="space-y-2">
        <Label htmlFor="url-input">Website URL</Label>
        <div className="flex gap-2">
          <Input
            id="url-input"
            placeholder="https://example.com"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
          />
          <Button size="icon" variant="outline">
            <Link className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* File Upload */}
      <div className="space-y-2">
        <Label>Upload Files</Label>
        <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
          <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-2">
            Drop files here or click to upload
          </p>
          <Button variant="outline" size="sm">
            Choose Files
          </Button>
        </div>
      </div>

      {/* Tone Selection */}
      <div className="space-y-2">
        <Label>Tone & Style</Label>
        <Select value={selectedTone} onValueChange={setSelectedTone}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {toneOptions.map((tone) => (
              <SelectItem key={tone} value={tone}>
                {tone}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Generate Button */}
      <Button className="w-full" size="lg">
        Generate Content
      </Button>
    </div>
  );
};
