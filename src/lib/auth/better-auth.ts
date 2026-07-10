import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer } from "better-auth/plugins";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  plugins: [bearer()],
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          // ユーザー作成時に空のProfileを作成
          await prisma.profile.create({
            data: {
              userId: user.id,
              updatedAt: new Date(),
            },
          });
        },
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
