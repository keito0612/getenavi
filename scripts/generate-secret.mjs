#!/usr/bin/env node

import { randomBytes } from "crypto";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve } from "path";

const ENV_FILE = resolve(process.cwd(), ".env");
const SECRET_KEY = "JWT_SECRET";

function generateSecret() {
  return randomBytes(32).toString("base64");
}

function main() {
  const secret = generateSecret();

  if (!existsSync(ENV_FILE)) {
    // .envファイルがない場合は作成
    writeFileSync(ENV_FILE, `${SECRET_KEY}="${secret}"\n`);
    console.log("✅ .env ファイルを作成し、JWT_SECRET を生成しました");
    return;
  }

  // .envファイルを読み込み
  let envContent = readFileSync(ENV_FILE, "utf-8");

  if (envContent.includes(`${SECRET_KEY}=`)) {
    // 既存のJWT_SECRETを置換
    envContent = envContent.replace(
      /JWT_SECRET=.*/,
      `${SECRET_KEY}="${secret}"`
    );
    console.log("✅ JWT_SECRET を再生成しました");
  } else {
    // JWT_SECRETを追加
    envContent += `\n# JWT認証用シークレットキー\n${SECRET_KEY}="${secret}"\n`;
    console.log("✅ JWT_SECRET を追加しました");
  }

  writeFileSync(ENV_FILE, envContent);
  console.log(`   キー: ${secret.substring(0, 10)}...`);
}

main();
