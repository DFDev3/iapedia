const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface ApiError {
  error: string;
  message: string;
}

export interface AuthResponse {
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    avatarUrl: string;
    bio: string;
  };
  token: string;
}

class ApiClient {
  private getAuthHeader(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || 'Request failed');
    }
    return response.json();
  }

  // Auth endpoints
  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await this.handleResponse<AuthResponse>(response);
    localStorage.setItem('auth_token', data.token);
    return data;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await this.handleResponse<AuthResponse>(response);
    localStorage.setItem('auth_token', data.token);
    return data;
  }

  async getCurrentUser() {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: this.getAuthHeader()
    });
    return this.handleResponse(response);
  }

  async logout() {
    localStorage.removeItem('auth_token');
  }

  // Tools endpoints
  async addToFavorites(toolId: number) {
    const response = await fetch(`${API_BASE_URL}/tools/${toolId}/favorite`, {
      method: 'POST',
      headers: this.getAuthHeader()
    });
    return this.handleResponse(response);
  }

  async removeFromFavorites(toolId: number) {
    const response = await fetch(`${API_BASE_URL}/tools/${toolId}/favorite`, {
      method: 'DELETE',
      headers: this.getAuthHeader()
    });
    return this.handleResponse(response);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }
}

export const api = new ApiClient();
