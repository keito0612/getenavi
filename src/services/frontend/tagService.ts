import {
  frontendTagRepository,
  type IFrontendTagRepository,
} from "@/repositories/frontend";
import type { Tag } from "@prisma/client";

export class FrontendTagService {
  constructor(private readonly repository: IFrontendTagRepository) {}

  async getTags(): Promise<Tag[]> {
    return this.repository.getTags();
  }
}

export const frontendTagService = new FrontendTagService(frontendTagRepository);
