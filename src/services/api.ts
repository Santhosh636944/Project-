import { User, Analysis, FoodItem, AnalyticsResponse, MealType, DetectedFood } from '../types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('nutrivision_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed. Please try again.');
  }

  return data;
}

export const api = {
  // Auth
  auth: {
    login: (credentials: { email: string; password: string }) =>
      request<{ user: User; token: string; message: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    register: (payload: { name: string; email: string; password: string; confirmPassword?: string }) =>
      request<{ user: User; token: string; message: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    getMe: () => request<{ user: User }>('/auth/me'),
  },

  // Food Analysis
  analysis: {
    analyze: (payload: {
      imageBase64?: string;
      mimeType?: string;
      mealType?: MealType;
      isDemo?: boolean;
      sampleImageUrl?: string;
    }) =>
      request<{ analysis: Analysis; message: string }>('/analyze', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    getById: (id: string) => request<{ analysis: Analysis }>(`/analyze/${id}`),
    update: (id: string, payload: { foods?: DetectedFood[]; mealType?: MealType; notes?: string }) =>
      request<{ analysis: Analysis; message: string }>(`/analyze/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      }),
    delete: (id: string) => request<{ message: string }>(`/analyze/${id}`, { method: 'DELETE' }),
  },

  // History
  history: {
    getList: (params?: { mealType?: string; search?: string; page?: number; limit?: number; dateFrom?: string; dateTo?: string }) => {
      const query = new URLSearchParams();
      if (params?.mealType) query.append('mealType', params.mealType);
      if (params?.search) query.append('search', params.search);
      if (params?.page) query.append('page', String(params.page));
      if (params?.limit) query.append('limit', String(params.limit));
      if (params?.dateFrom) query.append('dateFrom', params.dateFrom);
      if (params?.dateTo) query.append('dateTo', params.dateTo);
      return request<{
        analyses: Analysis[];
        pagination: { totalItems: number; totalPages: number; currentPage: number; limit: number };
      }>(`/history?${query.toString()}`);
    },
    getById: (id: string) => request<{ analysis: Analysis }>(`/history/${id}`),
  },

  // Analytics
  analytics: {
    get: (range: string = '7d') => request<AnalyticsResponse>(`/analytics?range=${range}`),
  },

  // Profile
  profile: {
    get: () => request<{ profile: User; stats: { totalAnalyses: number } }>('/profile'),
    update: (data: { name?: string; profileImage?: string; calorieGoal?: number }) =>
      request<{ profile: User; message: string }>('/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    changePassword: (data: { currentPassword: string; newPassword: string }) =>
      request<{ message: string }>('/profile/password', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },

  // Public Food DB
  foods: {
    search: (query?: string, category?: string) => {
      const q = new URLSearchParams();
      if (query) q.append('search', query);
      if (category) q.append('category', category);
      return request<{ foods: FoodItem[] }>(`/foods?${q.toString()}`);
    },
    getById: (id: string) => request<{ food: FoodItem }>(`/foods/${id}`),
  },

  // Admin
  admin: {
    getUsers: (search?: string) =>
      request<{ users: User[] }>(`/admin/users${search ? `?search=${encodeURIComponent(search)}` : ''}`),
    toggleUser: (id: string) =>
      request<{ user: User; message: string }>(`/admin/users/${id}/toggle`, { method: 'PUT' }),
    deleteUser: (id: string) =>
      request<{ message: string }>(`/admin/users/${id}`, { method: 'DELETE' }),
    createFood: (data: Partial<FoodItem>) =>
      request<{ food: FoodItem; message: string }>('/admin/foods', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    updateFood: (id: string, data: Partial<FoodItem>) =>
      request<{ food: FoodItem; message: string }>(`/admin/foods/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    deleteFood: (id: string) =>
      request<{ message: string }>(`/admin/foods/${id}`, { method: 'DELETE' }),
    getStats: () =>
      request<{
        stats: {
          totalUsers: number;
          totalAnalyses: number;
          totalFoodsInDb: number;
          avgCalories: number;
          mostAnalyzedFoods: Array<{ name: string; count: number; calories: number }>;
        };
      }>('/admin/stats'),
  },
};
