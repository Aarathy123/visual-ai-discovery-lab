// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/';

// Request timeout in milliseconds
const REQUEST_TIMEOUT = 30000; // 30 seconds for regular requests

// Extended timeout for long-running operations (like content generation)
const EXTENDED_TIMEOUT = 10 * 60 * 1000; // 10 minutes

// Common headers
const getDefaultHeaders = (): HeadersInit => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
});

// Add auth token if available
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// API Response wrapper
export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  message?: string;
  success: boolean;
}

// API Error wrapper
export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: unknown;
}

// Request configuration
export interface RequestConfig extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

// API Client class
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  // Helper method to build full URL
  private buildUrl(endpoint: string): string {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`;
    return url;
  }

  // Helper method to handle response
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    
    let data: T;
    try {
      data = isJson ? await response.json() : await response.text() as T;
    } catch (error) {
      throw new Error('Failed to parse response');
    }

    if (!response.ok) {
      const error: ApiError = {
        message: (data as { message?: string })?.message || `HTTP ${response.status}: ${response.statusText}`,
        status: response.status,
        details: data,
      };
      throw error;
    }

    return {
      data,
      status: response.status,
      success: true,
    };
  }

  // Helper method to create request with timeout
  private createRequestWithTimeout(url: string, config: RequestConfig): Promise<Response> {
    const { timeout = REQUEST_TIMEOUT, ...requestConfig } = config;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    return fetch(url, {
      ...requestConfig,
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));
  }

  // Helper method to retry failed requests
  private async retryRequest<T>(
    url: string, 
    config: RequestConfig, 
    retries: number = 0
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.createRequestWithTimeout(url, config);
      return await this.handleResponse<T>(response);
    } catch (error) {
      if (retries > 0 && this.shouldRetry(error)) {
        const delay = config.retryDelay || 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.retryRequest(url, config, retries - 1);
      }
      throw error;
    }
  }

  // Helper method to determine if request should be retried
  private shouldRetry(error: unknown): boolean {
    // Retry on network errors or 5xx server errors
    return (error as { name?: string }).name === 'AbortError' || 
           ((error as { status?: number }).status && (error as { status: number }).status >= 500) ||
           (error as { message?: string }).message?.includes('Failed to fetch');
  }

  // Generic request method
  async request<T>(
    endpoint: string, 
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const headers = {
      ...getDefaultHeaders(),
      ...getAuthHeaders(),
      ...config.headers,
    };

    const requestConfig: RequestConfig = {
      ...config,
      headers,
    };

    return this.retryRequest<T>(url, requestConfig, config.retries);
  }

  // GET request
  async get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // POST FormData request (for file uploads)
  async postFormData<T>(endpoint: string, formData: FormData, config?: RequestConfig): Promise<ApiResponse<T>> {
    const headers = {
      ...getDefaultHeaders(),
      ...getAuthHeaders(),
      ...config?.headers,
    };

    // Remove Content-Type to let browser set it for FormData
    delete headers['Content-Type'];

    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: formData,
      headers,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PATCH request
  async patch<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  // File upload
  async upload<T>(
    endpoint: string, 
    file: File, 
    onProgress?: (progress: number) => void,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const formData = new FormData();
    formData.append('file', file);

    const headers = {
      ...getAuthHeaders(),
      ...config?.headers,
    };

    // Remove Content-Type to let browser set it with boundary for multipart/form-data
    delete headers['Content-Type'];

    const xhr = new XMLHttpRequest();
    
    return new Promise((resolve, reject) => {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', async () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            resolve({
              data,
              status: xhr.status,
              success: true,
            });
          } catch (error) {
            reject(new Error('Failed to parse response'));
          }
        } else {
          reject({
            message: xhr.statusText || `HTTP ${xhr.status}`,
            status: xhr.status,
          });
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Network error'));
      });

      xhr.addEventListener('timeout', () => {
        reject(new Error('Request timeout'));
      });

      xhr.open('POST', url);
      
      // Set headers
      Object.entries(headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });

      xhr.timeout = config?.timeout || REQUEST_TIMEOUT;
      xhr.send(formData);
    });
  }
}

// Create and export default API client instance
export const apiClient = new ApiClient();

// Export the class for custom instances
export { ApiClient };

// Convenience functions for common operations
export const api = {
  get: <T>(endpoint: string, config?: RequestConfig) => apiClient.get<T>(endpoint, config),
  post: <T>(endpoint: string, data?: unknown, config?: RequestConfig) => apiClient.post<T>(endpoint, data, config),
  postFormData: <T>(endpoint: string, formData: FormData, config?: RequestConfig) => apiClient.postFormData<T>(endpoint, formData, config),
  put: <T>(endpoint: string, data?: unknown, config?: RequestConfig) => apiClient.put<T>(endpoint, data, config),
  patch: <T>(endpoint: string, data?: unknown, config?: RequestConfig) => apiClient.patch<T>(endpoint, data, config),
  delete: <T>(endpoint: string, config?: RequestConfig) => apiClient.delete<T>(endpoint, config),
  upload: <T>(endpoint: string, file: File, onProgress?: (progress: number) => void, config?: RequestConfig) => 
    apiClient.upload<T>(endpoint, file, onProgress, config),
};

// Types are already exported above 