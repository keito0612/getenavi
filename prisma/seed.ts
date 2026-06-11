import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

// SQLiteファイルのパスを取得
const dbPath = process.env.DATABASE_URL?.replace("file:", "") || "./dev.db";

// アダプターを作成
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // タグマスターの作成
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { id: "wani" },
      update: {},
      create: { id: "wani", name: "ワニ", emoji: "🐊" },
    }),
    prisma.tag.upsert({
      where: { id: "hebi" },
      update: {},
      create: { id: "hebi", name: "ヘビ", emoji: "🐍" },
    }),
    prisma.tag.upsert({
      where: { id: "insect" },
      update: {},
      create: { id: "insect", name: "昆虫食", emoji: "🐜" },
    }),
    prisma.tag.upsert({
      where: { id: "ostrich" },
      update: {},
      create: { id: "ostrich", name: "ダチョウ", emoji: "🦤" },
    }),
    prisma.tag.upsert({
      where: { id: "gibier" },
      update: {},
      create: { id: "gibier", name: "ジビエ(鹿・猪)", emoji: "🐗" },
    }),
  ]);

  console.log(`Created ${tags.length} tags`);

  // サンプル店舗データの作成
  const restaurant1 = await prisma.restaurant.upsert({
    where: { id: "sample-restaurant-1" },
    update: {},
    create: {
      id: "sample-restaurant-1",
      name: "珍食魔宮 新宿店",
      address: "東京都新宿区歌舞伎町1-XX-XX",
      latitude: 35.6938,
      longitude: 139.7032,
      dangerLevel: 5,
      description: "ヘビの生き血や、様々な昆虫の食べ比べができるマニアの聖地。",
      url: "https://example.com/shinjuku",
      tags: {
        connect: [{ id: "insect" }, { id: "hebi" }, { id: "wani" }],
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

  console.log(`Created restaurant: ${restaurant1.name}`);

  const restaurant2 = await prisma.restaurant.upsert({
    where: { id: "sample-restaurant-2" },
    update: {},
    create: {
      id: "sample-restaurant-2",
      name: "ジビエ酒場 渋谷",
      address: "東京都渋谷区道玄坂2-XX-XX",
      latitude: 35.658,
      longitude: 139.7016,
      dangerLevel: 3,
      description: "鹿や猪を中心としたジビエ料理が楽しめる隠れ家的酒場。",
      url: "https://example.com/shibuya",
      tags: {
        connect: [{ id: "gibier" }],
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

  console.log(`Created restaurant: ${restaurant2.name}`);

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
