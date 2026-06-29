import {
  frontendTagRepository,
  type IFrontendTagRepository,
} from "@/repositories/frontend";
import type { TagData } from "@/lib/types";

export class FrontendTagService {
  constructor(private readonly repository: IFrontendTagRepository) {}

  async getTags(): Promise<TagData[]> {
    return this.repository.getTags();
  }
}

export const frontendTagService = new FrontendTagService(frontendTagRepository);
