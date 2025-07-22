// Example usage of the API wrapper
import { api, ApiResponse, ApiError } from './api';

// Example types (you can define these based on your actual API)
interface User {
  id: string;
  name: string;
  email: string;
}

interface CreateUserRequest {
  name: string;
  email: string;
}

// Example API calls
export const exampleApiCalls = {
  // GET request
  async getUser(userId: string): Promise<ApiResponse<User>> {
    return api.get<User>(`/users/${userId}`);
  },

  // POST request
  async createUser(userData: CreateUserRequest): Promise<ApiResponse<User>> {
    return api.post<User>('/users', userData);
  },

  // PUT request
  async updateUser(userId: string, userData: Partial<CreateUserRequest>): Promise<ApiResponse<User>> {
    return api.put<User>(`/users/${userId}`, userData);
  },

  // DELETE request
  async deleteUser(userId: string): Promise<ApiResponse<{ success: boolean }>> {
    return api.delete<{ success: boolean }>(`/users/${userId}`);
  },

  // File upload
  async uploadAvatar(userId: string, file: File): Promise<ApiResponse<{ avatarUrl: string }>> {
    return api.upload<{ avatarUrl: string }>(`/users/${userId}/avatar`, file, (progress) => {
      console.log(`Upload progress: ${progress}%`);
    });
  },
};

// Example error handling
export const handleApiError = (error: ApiError) => {
  console.error('API Error:', error.message);
  
  switch (error.status) {
    case 401:
      // Handle unauthorized
      console.log('User not authenticated');
      break;
    case 403:
      // Handle forbidden
      console.log('User not authorized');
      break;
    case 404:
      // Handle not found
      console.log('Resource not found');
      break;
    case 500:
      // Handle server error
      console.log('Server error occurred');
      break;
    default:
      console.log('Unknown error occurred');
  }
};

// Example usage in a component
export const exampleUsage = async () => {
  try {
    // Get user
    const userResponse = await exampleApiCalls.getUser('123');
    console.log('User:', userResponse.data);

    // Create user
    const newUserResponse = await exampleApiCalls.createUser({
      name: 'John Doe',
      email: 'john@example.com',
    });
    console.log('Created user:', newUserResponse.data);

  } catch (error) {
    handleApiError(error as ApiError);
  }
}; 