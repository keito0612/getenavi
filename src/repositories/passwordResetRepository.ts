import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

export interface IPasswordResetRepository {
  createToken(userId: string): Promise<string>;
  findValidToken(token: string): Promise<{ userId: string } | null>;
  markAsUsed(token: string): Promise<void>;
  deleteExpiredTokens(): Promise<void>;
}

const TOKEN_EXPIRY_HOURS = 1;

export class PasswordResetRepository implements IPasswordResetRepository {
  async createToken(userId: string): Promise<string> {
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

    await prisma.passwordResetToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });

    return token;
  }

  async findValidToken(token: string): Promise<{ userId: string } | null> {
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken) return null;
    if (resetToken.usedAt) return null;
    if (resetToken.expiresAt < new Date()) return null;

    return { userId: resetToken.userId };
  }

  async markAsUsed(token: string): Promise<void> {
    await prisma.passwordResetToken.update({
      where: { token },
      data: { usedAt: new Date() },
    });
  }

  async deleteExpiredTokens(): Promise<void> {
    await prisma.passwordResetToken.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          { usedAt: { not: null } },
        ],
      },
    });
  }
}

export const passwordResetRepository = new PasswordResetRepository();
