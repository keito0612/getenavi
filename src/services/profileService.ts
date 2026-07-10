import { NextRequest, NextResponse } from "next/server";
import { profileRepository, IProfileRepository } from "@/repositories/profileRepository";
import { updateProfileSchema } from "@/lib/validations/profile";
import { ApiResponse } from "@/lib/api";
import { verifyBearerToken } from "@/lib/auth/verifyToken";
import { AuthResult } from "@/lib/types";

export class ProfileService {
  constructor(private readonly repository: IProfileRepository) { }

  async getProfile(request: NextRequest, id: string | undefined = undefined): Promise<NextResponse> {
    let auth: AuthResult;
    if (id === undefined) {
      const auth = await verifyBearerToken(request.headers);
      if (!auth) {
        return ApiResponse.unauthorized();
      }
    }

    try {
      const profile = await this.repository.getByUserId(id !== undefined ? id : auth!.userId);
      return ApiResponse.success({ profile });
    } catch (error) {
      console.error("Error fetching profile:", error);
      return ApiResponse.serverError("プロフィールの取得に失敗しました");
    }
  }

  async updateProfile(request: NextRequest): Promise<NextResponse> {
    const auth = await verifyBearerToken(request.headers);
    if (!auth) {
      return ApiResponse.unauthorized();
    }

    try {
      const body = await request.json();
      const result = updateProfileSchema.safeParse(body);
      if (!result.success) {
        return ApiResponse.validationError(result.error);
      }

      const profile = await this.repository.upsert(auth.userId, result.data);
      return ApiResponse.success({ profile });
    } catch (error) {
      console.error("Error updating profile:", error);
      return ApiResponse.serverError("プロフィールの更新に失敗しました");
    }
  }
}

export const profileService = new ProfileService(profileRepository);
