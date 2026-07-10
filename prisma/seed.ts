import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

// SQLiteファイルのパスを取得
const dbPath = process.env.DATABASE_URL?.replace("file:", "") || "./dev.db";

// アダプターを作成
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

async function main() {
  // タグマスターの作成
  const wani = await prisma.tag.create({
    data: { name: "ワニ", emoji: "🐊" },
  });
  const hebi = await prisma.tag.create({
    data: { name: "ヘビ", emoji: "🐍" },
  });
  const insect = await prisma.tag.create({
    data: { name: "昆虫食", emoji: "🐜" },
  });
  const ostrich = await prisma.tag.create({
    data: { name: "ダチョウ", emoji: "🦤" },
  });
  const gibier = await prisma.tag.create({
    data: { name: "ジビエ(鹿・猪)", emoji: "🐗" },
  });

  // サンプル店舗データの作成
  await prisma.restaurant.create({
    data: {
      name: "珍食魔宮 新宿店",
      address: "東京都新宿区歌舞伎町1-XX-XX",
      latitude: 35.6938,
      longitude: 139.7032,
      dangerLevel: 5,
      description: "ヘビの生き血や、様々な昆虫の食べ比べができるマニアの聖地。",
      url: "https://example.com/shinjuku",
      tags: {
        connect: [{ id: insect.id }, { id: hebi.id }, { id: wani.id }],
      },
      businessHours: {
        create: [
          { dayOfWeek: 1, openTime: "17:00", closeTime: "23:00", isClosed: false },
          { dayOfWeek: 2, openTime: "17:00", closeTime: "23:00", isClosed: false },
          { dayOfWeek: 3, openTime: "17:00", closeTime: "23:00", isClosed: false },
          { dayOfWeek: 4, openTime: "17:00", closeTime: "23:00", isClosed: false },
          { dayOfWeek: 5, openTime: "17:00", closeTime: "23:00", isClosed: false },
          { dayOfWeek: 6, openTime: "15:00", closeTime: "24:00", isClosed: false },
          { dayOfWeek: 0, openTime: null, closeTime: null, isClosed: true },
        ],
      },
    },
  });

  await prisma.restaurant.create({
    data: {
      name: "ジビエ酒場 渋谷",
      address: "東京都渋谷区道玄坂2-XX-XX",
      latitude: 35.658,
      longitude: 139.7016,
      dangerLevel: 3,
      description: "鹿や猪を中心としたジビエ料理が楽しめる隠れ家的酒場。",
      url: "https://example.com/shibuya",
      tags: {
        connect: [{ id: gibier.id }],
      },
      businessHours: {
        create: [
          { dayOfWeek: 0, openTime: "12:00", closeTime: "22:00", isClosed: false },
          { dayOfWeek: 1, openTime: null, closeTime: null, isClosed: true },
          { dayOfWeek: 2, openTime: "17:00", closeTime: "23:00", isClosed: false },
          { dayOfWeek: 3, openTime: "17:00", closeTime: "23:00", isClosed: false },
          { dayOfWeek: 4, openTime: "17:00", closeTime: "23:00", isClosed: false },
          { dayOfWeek: 5, openTime: "17:00", closeTime: "24:00", isClosed: false },
          { dayOfWeek: 6, openTime: "12:00", closeTime: "24:00", isClosed: false },
        ],
      },
    },
  });

  console.log("Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
