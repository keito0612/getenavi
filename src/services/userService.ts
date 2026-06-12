import { userRepository, type IUserRepository, type UserWithoutPassword } from "@/repositories/userRepository";

export class UserService {
  constructor(private readonly repository: IUserRepository) {}

  async getUser(id: string): Promise<UserWithoutPassword | null> {
    return this.repository.findById(id);
  }
}

export const userService = new UserService(userRepository);
