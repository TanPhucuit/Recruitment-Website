// Custom error class for API errors
class ApiError extends Error {
  constructor(status, message, data = null) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'ApiError';
  }
}

// HTTP Error Handler
const handleHttpError = (status, data) => {
  switch (status) {
    case 400:
      return new ApiError(400, 'Yêu cầu không hợp lệ', data);
    case 401:
      // Clear token and redirect to login if unauthorized
      localStorage.removeItem('token');
      window.location.href = '/login';
      return new ApiError(401, 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    case 403:
      return new ApiError(403, 'Bạn không có quyền thực hiện thao tác này');
    case 404:
      return new ApiError(404, 'Không tìm thấy tài nguyên');
    case 500:
      return new ApiError(500, 'Lỗi máy chủ. Vui lòng thử lại sau');
    default:
      return new ApiError(status, 'Đã xảy ra lỗi. Vui lòng thử lại sau');
  }
};

// API Service with enhanced error handling
class ApiService {
  static async request(endpoint, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
          ...options.headers
        }
      });

      clearTimeout(timeoutId);

      // Handle non-OK responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw handleHttpError(response.status, errorData);
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        return data;
      }
      return null;

    } catch (error) {
      clearTimeout(timeoutId);

      // Handle specific error types
      if (error.name === 'AbortError') {
        throw new ApiError(408, 'Yêu cầu đã hết thời gian chờ. Vui lòng thử lại');
      }

      if (error instanceof ApiError) {
        throw error;
      }

      // Handle network errors
      if (!navigator.onLine) {
        throw new ApiError(0, 'Không có kết nối mạng. Vui lòng kiểm tra lại kết nối');
      }

      // Log error for debugging
      console.error(`API Error [${endpoint}]:`, error);
      
      // Throw generic error for unknown cases
      throw new ApiError(500, 'Đã xảy ra lỗi không xác định. Vui lòng thử lại sau');
    }
  }

  static async get(endpoint) {
    return this.request(endpoint);
  }

  static async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  static async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE'
    });
  }

  // Helper method to check if error is an ApiError
  static isApiError(error) {
    return error instanceof ApiError;
  }
}

// Export both default and named exports for compatibility
export default ApiService;
export const apiService = ApiService; 