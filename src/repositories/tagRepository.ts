import { prisma } from "@/lib/prisma";
import type { Tag } from "@prisma/client";

export interface ITagRepository {
  getTags(): Promise<Tag[]>;
  getTag(id: number): Promise<Tag | null>;
}

export class TagRepository implements ITagRepository {
  async getTags(): Promise<Tag[]> {
    return prisma.tag.findMany({
      orderBy: { id: "asc" },
    });
  }

  async getTag(id: number): Promise<Tag | null> {
    return prisma.tag.findUnique({
      where: { id },
    });
  }
}

export const tagRepository = new TagRepository();
