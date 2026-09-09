export interface LoginResponse {
  customerId: number;
  fullName: string;
  email: string;
  role: string;
  emailVerified: boolean;
  token: string;
  expiresAt: string;
}
