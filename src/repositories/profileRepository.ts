import { prisma } from "@/lib/prisma";
import type { ProfileData } from "@/lib/types";

export type ProfileInput = {
  comment?: string | null;
  backgroundImage?: string | null;
  avatarImage?: string | null;
};

export interface IProfileRepository {
  getByUserId(userId: string): Promise<ProfileData | null>;
  upsert(userId: string, data: ProfileInput): Promise<ProfileData>;
}

export class ProfileRepository implements IProfileRepository {
  async getByUserId(userId: string): Promise<ProfileData | null> {
    return prisma.profile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async upsert(userId: string, data: ProfileInput): Promise<ProfileData> {
    return prisma.profile.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        ...data,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }
}

export const profileRepository = new ProfileRepository();
