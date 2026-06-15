import { prisma } from "@/lib/prisma";
import type { User } from "@prisma/client";

export type UserWithoutPassword = Omit<User, "password">;

export interface IAuthRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  createUser(data: { email: string; password: string; name: string }): Promise<UserWithoutPassword>;
  updateProfile(userId: string, data: { name: string }): Promise<UserWithoutPassword>;
  updatePassword(userId: string, hashedPassword: string): Promise<void>;
}

export class AuthRepository implements IAuthRepository {
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async createUser(data: { email: string; password: string; name: string }): Promise<UserWithoutPassword> {
    const user = await prisma.user.create({
      data,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async updateProfile(userId: string, data: { name: string }): Promise<UserWithoutPassword> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { name: data.name },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }
}

export const authRepository = new AuthRepository();
