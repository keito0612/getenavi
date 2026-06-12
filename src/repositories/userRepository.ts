import { prisma } from "@/lib/prisma";
import type { User } from "@prisma/client";

export type UserWithoutPassword = Omit<User, "password">;

export interface IUserRepository {
  findById(id: string): Promise<UserWithoutPassword | null>;
}

export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<UserWithoutPassword | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

export const userRepository = new UserRepository();
