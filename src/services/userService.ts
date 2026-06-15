import { ApiResponse } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { userRepository, type IUserRepository, type UserWithoutPassword } from "@/repositories/userRepository";
import { NextResponse } from "next/server";

export class UserService {
  constructor(private readonly repository: IUserRepository) { }

  async getUser(): Promise<NextResponse> {
    try {
      const user = await getCurrentUser();
      if (!user) {
        return ApiResponse.unauthorized();
      }
      return ApiResponse.success({ user });
    } catch (error) {
      console.error("Error fetching current user:", error);
      return ApiResponse.serverError("ユーザー情報の取得に失敗しました");
    }
  }
}

export const userService = new UserService(userRepository);
