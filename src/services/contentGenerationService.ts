import { api, ApiResponse } from '@/lib/api';
import { ContentType, InputFormat } from '@/types/content';

// Timeout for content generation requests (10 minutes)
const CONTENT_GENERATION_TIMEOUT = 10 * 60 * 1000;

// Types for content generation
export interface ContentGenerationRequest {
  type: ContentType;
  url?: string;
  text?: string;
  file?: File;
}

export interface ContentGenerationResponse {
  id: string;
  type: ContentType;
  status: 'processing' | 'completed' | 'failed';
  result?: string;
  resultUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Content Generation Service
export class ContentGenerationService {
  private static readonly BASE_ENDPOINT_URL = '/url/process';
  private static readonly BASE_ENDPOINT_TEXT = '/text/process';
  private static readonly BASE_ENDPOINT_FILE = '/pdf/process';

  // Generate content from URL
  static async generateFromUrl(
    type: ContentType,
    url: string
  ): Promise<ApiResponse<ContentGenerationResponse>> {
    const payload = {
      type,
      url,
    };

    return api.post<ContentGenerationResponse>(ContentGenerationService.BASE_ENDPOINT_URL, payload, {
      timeout: CONTENT_GENERATION_TIMEOUT,
    });
  }

  // Generate content from text
  static async generateFromText(
    type: ContentType,
    text: string
  ): Promise<ApiResponse<ContentGenerationResponse>> {
    const payload = {
      type,
      text,
    };

    return api.post<ContentGenerationResponse>('/text/process', payload, {
      timeout: CONTENT_GENERATION_TIMEOUT,
    });
  }

  // Generate content from file
  static async generateFromFile(
    type: ContentType,
    file: File
  ): Promise<ApiResponse<ContentGenerationResponse>> {
    const formData = new FormData();
    formData.append('type', type);
    formData.append('file', file);

    return api.post<ContentGenerationResponse>('/file/process', formData, {
      timeout: CONTENT_GENERATION_TIMEOUT,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  // Generic method that routes to appropriate endpoint based on input format
  static async generateContent(
    type: ContentType,
    inputFormat: InputFormat,
    inputData: { url?: string; text?: string; file?: File }
  ): Promise<ApiResponse<ContentGenerationResponse>> {
    switch (inputFormat) {
      case InputFormat.URL:
        if (!inputData.url) {
          throw new Error('URL is required for URL input format');
        }
        return this.generateFromUrl(type, inputData.url);
      
      case InputFormat.TEXT:
        if (!inputData.text) {
          throw new Error('Text is required for text input format');
        }
        return this.generateFromText(type, inputData.text);
      
      case InputFormat.FILE:
        if (!inputData.file) {
          throw new Error('File is required for file input format');
        }
        return this.generateFromFile(type, inputData.file);
      
      default:
        throw new Error(`Unsupported input format: ${inputFormat}`);
    }
  }
}

// Export convenience functions
export const contentGenerationService = {
  generateFromUrl: ContentGenerationService.generateFromUrl,
  generateFromText: ContentGenerationService.generateFromText,
  generateFromFile: ContentGenerationService.generateFromFile,
  generateContent: ContentGenerationService.generateContent,
}; 