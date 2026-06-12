export type UserData = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = {
  user: UserData;
  token: string;
};

export interface IFrontendAuthRepository {
  register(data: { email: string; password: string; name: string }): Promise<AuthResponse>;
  login(email: string, password: string): Promise<AuthResponse>;
  getCurrentUser(token: string): Promise<UserData>;
}

export class FrontendAuthRepository implements IFrontendAuthRepository {
  private baseUrl: string;

  constructor(baseUrl: string = "/api/auth") {
    this.baseUrl = baseUrl;
  }

  async register(data: { email: string; password: string; name: string }): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "登録に失敗しました");
    }

    return { user: result.user, token: result.token };
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "ログインに失敗しました");
    }

    return { user: result.user, token: result.token };
  }

  async getCurrentUser(token: string): Promise<UserData> {
    const response = await fetch(`${this.baseUrl}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "ユーザー情報の取得に失敗しました");
    }

    return result.user;
  }
}

export const frontendAuthRepository = new FrontendAuthRepository();
