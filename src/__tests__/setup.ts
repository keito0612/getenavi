// Prismaモジュールをモック化（DB接続を防ぐ）
jest.mock("@/lib/prisma", () => ({
  prisma: {},
}));
