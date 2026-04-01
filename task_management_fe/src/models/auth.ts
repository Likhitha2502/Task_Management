export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  token: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  email: string;
  message: string;
  requiresPasswordReset: boolean;
}

export interface ChangePassword {
  email: string;
  currentPassword: string;
  newPassword: string;
}
