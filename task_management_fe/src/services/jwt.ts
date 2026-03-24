// src/services/jwt.ts

const TOKEN_KEY = 'auth_token';

export const jwtService = {
  // Call this right after a successful login
  saveToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  // The http.ts interceptor uses this
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Call this for Logout
  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },

  // Use this to protect routes (e.g., if !isLoggedIn redirect to Login)
  isLoggedIn(): boolean {
    const token = this.getToken();
    // A more advanced version would check if the token is expired here
    return !!token;
  }
};
