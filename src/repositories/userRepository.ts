import { prisma } from "@/lib/prisma";
import type { User } from "@prisma/client";

export type UserPublic = Pick<User, "id" | "name" | "email" | "createdAt" | "updatedAt">;

export interface IUserRepository {
  findById(id: string): Promise<UserPublic | null>;
}

export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<UserPublic | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }
}

export const userRepository = new UserRepository();
