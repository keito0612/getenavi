import { UserData } from "@/lib/types";
import { AuthError } from "@/lib/errors";
import { getAuthCookieClient } from "@/lib/cookie";

export interface IFrontendUserRepository {
    getCurrentUser(): Promise<UserData | null>;
}

export class FrontendUserRepository implements IFrontendUserRepository {
    private baseUrl: string;

    constructor(baseUrl: string = "/api/auth") {
        this.baseUrl = baseUrl;
    }

    async getCurrentUser(): Promise<UserData | null> {
        const token = getAuthCookieClient();

        if (!token) {
            throw new AuthError("認証が必要です", 401);
        }

        const response = await fetch(`${this.baseUrl}/user`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const result = await response.json();

        if (!response.ok) {
            throw new AuthError(
                result.error || "ユーザー情報の取得に失敗しました",
                response.status
            );
        }
        return result.user as UserData;
    }
}

export const frontendUserRepository = new FrontendUserRepository();
