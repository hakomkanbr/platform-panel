import { UserProfile } from "./identity";

export interface LoginResponse {
  success: boolean;
  data?: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
    user: UserProfile;
  };
  error?: { code: string; message: string };
}

export interface SessionResponse {
  success: boolean;
  data?: {
    isAuthenticated: boolean;
    user: UserProfile;
    expiresAt: number;
  };
  error?: { code: string; message: string };
}

export interface AuthClient {
  login(email: string, password: string): Promise<LoginResponse>;
  logout(): Promise<void>;
  getSession(): Promise<SessionResponse>;
}
