import { randomUUID } from "crypto";

type UploadOptions = {
  subDir: string;
};

type UploadResult = {
  fileName: string;
  filePath: string;
  publicUrl: string;
};

export class ImageService {
  /**
   * 画像をローカルに保存
   */
  async upload(file: File, options: UploadOptions): Promise<UploadResult> {
    const { subDir } = options;

    // 動的インポート（Edge Runtime対応）
    const { writeFile, mkdir } = await import("fs/promises");
    const { existsSync } = await import("fs");
    const path = await import("path");

    const uploadBaseDir = path.join(process.cwd(), "public", "uploads");
    const uploadDir = path.join(uploadBaseDir, subDir);

    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // ファイル名生成（UUID + 拡張子）
    const ext = this.getExtension(file.name);
    const fileName = `${randomUUID()}.${ext}`;
    const filePath = path.join(uploadDir, fileName);

    // ファイル保存
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    return {
      fileName,
      filePath,
      publicUrl: `/uploads/${subDir}/${fileName}`,
    };
  }

  /**
   * 複数画像を一括アップロード
   */
  async uploadMultiple(files: File[], options: UploadOptions): Promise<UploadResult[]> {
    const results: UploadResult[] = [];
    for (const file of files) {
      const uploadResult = await this.upload(file, options);
      results.push(uploadResult);
    }
    return results;
  }

  /**
   * 画像を削除
   */
  async delete(publicUrl: string): Promise<void> {
    const { unlink } = await import("fs/promises");
    const { existsSync } = await import("fs");
    const path = await import("path");

    const relativePath = publicUrl.replace(/^\//, "");
    const filePath = path.join(process.cwd(), "public", relativePath);

    if (existsSync(filePath)) {
      await unlink(filePath);
    }
  }

  /**
   * 複数画像を一括削除
   */
  async deleteMultiple(publicUrls: string[]): Promise<void> {
    for (const url of publicUrls) {
      await this.delete(url);
    }
  }

  private getExtension(fileName: string): string {
    return fileName.split(".").pop()?.toLowerCase() || "jpg";
  }
}

export class ImageUploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImageUploadError";
  }
}

export const imageService = new ImageService();
