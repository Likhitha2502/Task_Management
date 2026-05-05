export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  message:              string;
  email:                string;
  requiresPasswordReset: boolean;
  token:                string;
  tokenType:            string;
}

export interface ChangePassword {
  currentPassword: string;
  newPassword: string;
}
