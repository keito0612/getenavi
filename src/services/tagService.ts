import { tagRepository, ITagRepository } from "@/repositories/tagRepository";
import type { Tag } from "@prisma/client";

export class TagService {
  constructor(private readonly repository: ITagRepository) {}

  async getTags(): Promise<Tag[]> {
    return this.repository.getTags();
  }

  async getTag(id: string): Promise<Tag | null> {
    return this.repository.getTag(id);
  }
}

export const tagService = new TagService(tagRepository);
