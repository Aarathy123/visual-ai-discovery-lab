import { api, ApiResponse } from '@/lib/api';

// Types based on the API response structure
export interface HistoryItem {
  _id: string;
  type: string;
  prompt: string;
  input: string;
  inputUrl: string;
  url: string;
  result: string;
  resultUrl: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// History service
export class HistoryService {
  private static readonly BASE_ENDPOINT = '/history';

  // Get all history items
  static async getHistory(): Promise<ApiResponse<HistoryItem[]>> {
    return api.get<HistoryItem[]>(HistoryService.BASE_ENDPOINT);
  }

  // Delete a history item
  static async deleteHistoryItem(itemId: string): Promise<ApiResponse<{ success: boolean }>> {
    return api.delete<{ success: boolean }>(`${HistoryService.BASE_ENDPOINT}/${itemId}`);
  }
}

// Export convenience functions
export const historyService = {
  getHistory: HistoryService.getHistory,
  deleteHistoryItem: HistoryService.deleteHistoryItem,
}; 