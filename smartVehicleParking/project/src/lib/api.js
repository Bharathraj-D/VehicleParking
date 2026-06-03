// Spring Boot API configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export class ApiClient {
  static getToken() {
    return localStorage.getItem('token');
  }

  static setToken(token) {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }

  static getAuthHeader() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  static async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...this.getAuthHeader(),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || response.statusText);
    }

    return response.json();
  }

  static get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  static post(endpoint, body) {
    return this.request(endpoint, { method: 'POST', body: JSON.stringify(body) });
  }
}
