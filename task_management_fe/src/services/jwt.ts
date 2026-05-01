// src/services/jwt.ts
const TOKEN_KEY = 'auth_token';

export const jwtService = {
  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  removeToken: () => localStorage.removeItem(TOKEN_KEY),
  // isAuthenticated(): boolean {
  //   return !!this.getToken();
  // },
};
