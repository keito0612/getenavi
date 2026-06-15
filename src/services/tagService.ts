import { NextResponse } from "next/server";
import { tagRepository, ITagRepository } from "@/repositories/tagRepository";
import { ApiResponse } from "@/lib/api";

export class TagService {
  constructor(private readonly repository: ITagRepository) {}

  async getTags(): Promise<NextResponse> {
    try {
      const tags = await this.repository.getTags();
      return ApiResponse.success({ tags });
    } catch (error) {
      console.error("Error fetching tags:", error);
      return ApiResponse.serverError("タグの取得に失敗しました");
    }
  }
}

export const tagService = new TagService(tagRepository);
