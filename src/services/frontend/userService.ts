import {
  frontendUserRepository,
  type IFrontendUserRepository,
} from "@/repositories/frontend/userRepository";
import type { UserData } from "@/lib/types";

export class FrontendUserService {
  constructor(private readonly repository: IFrontendUserRepository) { }

  async getCurrentUser(): Promise<UserData | null> {
    return this.repository.getCurrentUser();
  }
}

export const frontendUserService = new FrontendUserService(frontendUserRepository);
