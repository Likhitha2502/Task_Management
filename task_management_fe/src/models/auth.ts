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
