const GATEWAY_URL =
  process.env.NEXT_PUBLIC_GATEWAY_URL || "http://localhost:5000";

interface LoginResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      emailVerified: boolean;
      tenantId: string | null;
      tenantName: string | null;
      roles: string[];
    };
  };
  error?: { code: string; message: string };
}

interface RegisterResponse {
  success: boolean;
  data?: { userId: string; tenantId: string; email: string; message: string };
  error?: { code: string; message: string };
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
}

export const authApi = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const res = await fetch(`${GATEWAY_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
    return res.json();
  },

  async register(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    companyName?: string;
    industry?: string;
    teamSize?: number;
  }): Promise<RegisterResponse> {
    const res = await fetch(`${GATEWAY_URL}/api/v1/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async logout(refreshToken: string): Promise<ApiResponse<null>> {
    const res = await fetch(`${GATEWAY_URL}/api/v1/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    return res.json();
  },

  async forgotPassword(email: string): Promise<ApiResponse<null>> {
    const res = await fetch(`${GATEWAY_URL}/api/v1/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return res.json();
  },

  async resetPassword(
    token: string,
    password: string,
    confirmPassword: string,
  ): Promise<ApiResponse<null>> {
    const res = await fetch(`${GATEWAY_URL}/api/v1/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password, confirmPassword }),
    });
    return res.json();
  },

  async changePassword(
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<ApiResponse<null>> {
    const res = await fetch(`${GATEWAY_URL}/api/v1/auth/change-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
    });
    return res.json();
  },

  async verifyEmail(token: string, email: string): Promise<ApiResponse<null>> {
    const res = await fetch(
      `${GATEWAY_URL}/api/v1/auth/verify-email?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`,
    );
    return res.json();
  },

  async verifyStatus(
    email: string,
  ): Promise<ApiResponse<{ verified: boolean }>> {
    const res = await fetch(
      `${GATEWAY_URL}/api/v1/auth/verify-status?email=${encodeURIComponent(email)}`,
    );
    return res.json();
  },
};
