import { TagService } from "@/services/tagService";
import { ITagRepository } from "@/repositories/tagRepository";
import type { Tag } from "@prisma/client";

describe("TagService", () => {
  const mockTags: Tag[] = [
    { id: "wani", name: "ワニ", emoji: "🐊", createdAt: new Date() },
    { id: "hebi", name: "ヘビ", emoji: "🐍", createdAt: new Date() },
    { id: "konchu", name: "昆虫", emoji: "🦗", createdAt: new Date() },
  ];

  const createMockRepository = (): jest.Mocked<ITagRepository> => ({
    getTags: jest.fn(),
    getTag: jest.fn(),
  });

  describe("getTags", () => {
    it("全てのタグを取得する", async () => {
      const mockRepository = createMockRepository();
      mockRepository.getTags.mockResolvedValue(mockTags);
      const service = new TagService(mockRepository);

      const result = await service.getTags();

      expect(result).toEqual(mockTags);
      expect(mockRepository.getTags).toHaveBeenCalledTimes(1);
    });

    it("空の配列を返す（タグが存在しない場合）", async () => {
      const mockRepository = createMockRepository();
      mockRepository.getTags.mockResolvedValue([]);
      const service = new TagService(mockRepository);

      const result = await service.getTags();

      expect(result).toEqual([]);
    });
  });

  describe("getTag", () => {
    it("指定したIDのタグを取得する", async () => {
      const mockRepository = createMockRepository();
      const expectedTag = mockTags[0];
      mockRepository.getTag.mockResolvedValue(expectedTag);
      const service = new TagService(mockRepository);

      const result = await service.getTag("wani");

      expect(result).toEqual(expectedTag);
      expect(mockRepository.getTag).toHaveBeenCalledWith("wani");
    });

    it("存在しないIDの場合はnullを返す", async () => {
      const mockRepository = createMockRepository();
      mockRepository.getTag.mockResolvedValue(null);
      const service = new TagService(mockRepository);

      const result = await service.getTag("nonexistent");

      expect(result).toBeNull();
      expect(mockRepository.getTag).toHaveBeenCalledWith("nonexistent");
    });
  });
});
