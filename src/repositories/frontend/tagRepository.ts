import type { TagData } from "@/lib/types";
import { UtilApi, ApiError } from "@/lib/utilApi";

export interface IFrontendTagRepository {
  getTags(): Promise<TagData[]>;
}

export class FrontendTagRepository implements IFrontendTagRepository {
  async getTags(): Promise<TagData[]> {
    const response = await fetch(UtilApi.buildUrl("/api/tags"));

    if (!response.ok) {
      throw new ApiError("タグ一覧の取得に失敗しました", response.status);
    }

    const data = await response.json();
    return data.tags;
  }
}

export const frontendTagRepository = new FrontendTagRepository();
