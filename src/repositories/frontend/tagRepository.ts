import type { Tag } from "@prisma/client";

export interface IFrontendTagRepository {
  getTags(): Promise<Tag[]>;
}

export class FrontendTagRepository implements IFrontendTagRepository {
  private baseUrl: string;

  constructor(baseUrl: string = "/api/tags") {
    this.baseUrl = baseUrl;
  }

  async getTags(): Promise<Tag[]> {
    const response = await fetch(this.baseUrl);

    if (!response.ok) {
      throw new Error("Failed to fetch tags");
    }

    const data = await response.json();
    return data.tags;
  }
}

export const frontendTagRepository = new FrontendTagRepository();
