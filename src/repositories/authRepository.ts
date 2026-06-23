import { prisma } from "@/lib/prisma";
import type { User, Account } from "@prisma/client";
import type { UserData } from "@/lib/types";

export interface IAuthRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAccountByUserId(userId: string, providerId: string): Promise<Account | null>;
  updateAccountPassword(accountId: string, hashedPassword: string): Promise<void>;
  updateName(userId: string, name: string): Promise<UserData>;
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

  async findAccountByUserId(userId: string, providerId: string): Promise<Account | null> {
    return prisma.account.findFirst({
      where: { userId, providerId },
    });
  }

  async updateAccountPassword(accountId: string, hashedPassword: string): Promise<void> {
    await prisma.account.update({
      where: { id: accountId },
      data: { password: hashedPassword },
    });
  }

  async updateName(userId: string, name: string): Promise<UserData> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { name },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

export const authRepository = new AuthRepository();
