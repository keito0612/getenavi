import { RestaurantService } from "@/services/restaurantService";
import { IRestaurantRepository } from "@/repositories/restaurantRepository";
import type { RestaurantWithRelations } from "@/lib/types";

describe("RestaurantService", () => {
  const mockRestaurants: RestaurantWithRelations[] = [
    {
      id: "1",
      name: "珍獣屋",
      address: "東京都新宿区",
      latitude: 35.6895,
      longitude: 139.6917,
      url: "https://example.com",
      dangerLevel: 3,
      description: "ワニ料理専門店",
      imageUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [{ id: "wani", name: "ワニ", emoji: "🐊", createdAt: new Date() }],
      businessHours: [],
    },
    {
      id: "2",
      name: "昆虫食堂",
      address: "東京都渋谷区",
      latitude: 35.658,
      longitude: 139.7016,
      url: null,
      dangerLevel: 2,
      description: "昆虫料理のお店",
      imageUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [{ id: "konchu", name: "昆虫", emoji: "🦗", createdAt: new Date() }],
      businessHours: [],
    },
  ];

  const createMockRepository = (): jest.Mocked<IRestaurantRepository> => ({
    getRestaurants: jest.fn(),
    getRestaurant: jest.fn(),
    getRestaurantsByBounds: jest.fn(),
  });

  describe("getRestaurants", () => {
    it("全てのレストランを取得する（パラメータなし）", async () => {
      const mockRepository = createMockRepository();
      mockRepository.getRestaurants.mockResolvedValue(mockRestaurants);
      const service = new RestaurantService(mockRepository);

      const result = await service.getRestaurants();

      expect(result).toEqual(mockRestaurants);
      expect(mockRepository.getRestaurants).toHaveBeenCalledWith(undefined, undefined);
    });

    it("タグでフィルタリングしてレストランを取得する", async () => {
      const mockRepository = createMockRepository();
      const filtered = [mockRestaurants[0]];
      mockRepository.getRestaurants.mockResolvedValue(filtered);
      const service = new RestaurantService(mockRepository);

      const result = await service.getRestaurants({ tags: ["wani"] });

      expect(result).toEqual(filtered);
      expect(mockRepository.getRestaurants).toHaveBeenCalledWith(undefined, ["wani"]);
    });

    it("検索クエリでフィルタリングしてレストランを取得する", async () => {
      const mockRepository = createMockRepository();
      const filtered = [mockRestaurants[0]];
      mockRepository.getRestaurants.mockResolvedValue(filtered);
      const service = new RestaurantService(mockRepository);

      const result = await service.getRestaurants({ query: "珍獣" });

      expect(result).toEqual(filtered);
      expect(mockRepository.getRestaurants).toHaveBeenCalledWith("珍獣", undefined);
    });

    it("地図範囲でフィルタリングしてレストランを取得する", async () => {
      const mockRepository = createMockRepository();
      mockRepository.getRestaurantsByBounds.mockResolvedValue(mockRestaurants);
      const service = new RestaurantService(mockRepository);
      const bounds = { north: 36, south: 35, east: 140, west: 139 };

      const result = await service.getRestaurants({ bounds });

      expect(result).toEqual(mockRestaurants);
      expect(mockRepository.getRestaurantsByBounds).toHaveBeenCalledWith(
        36, 35, 140, 139, undefined, undefined
      );
    });

    it("地図範囲とタグの両方でフィルタリングする", async () => {
      const mockRepository = createMockRepository();
      const filtered = [mockRestaurants[0]];
      mockRepository.getRestaurantsByBounds.mockResolvedValue(filtered);
      const service = new RestaurantService(mockRepository);
      const bounds = { north: 36, south: 35, east: 140, west: 139 };

      const result = await service.getRestaurants({ bounds, tags: ["wani"] });

      expect(result).toEqual(filtered);
      expect(mockRepository.getRestaurantsByBounds).toHaveBeenCalledWith(
        36, 35, 140, 139, undefined, ["wani"]
      );
    });

    it("空の配列を返す（レストランが存在しない場合）", async () => {
      const mockRepository = createMockRepository();
      mockRepository.getRestaurants.mockResolvedValue([]);
      const service = new RestaurantService(mockRepository);

      const result = await service.getRestaurants();

      expect(result).toEqual([]);
    });
  });

  describe("getRestaurant", () => {
    it("指定したIDのレストランを取得する", async () => {
      const mockRepository = createMockRepository();
      const expected = mockRestaurants[0];
      mockRepository.getRestaurant.mockResolvedValue(expected);
      const service = new RestaurantService(mockRepository);

      const result = await service.getRestaurant("1");

      expect(result).toEqual(expected);
      expect(mockRepository.getRestaurant).toHaveBeenCalledWith("1");
    });

    it("存在しないIDの場合はnullを返す", async () => {
      const mockRepository = createMockRepository();
      mockRepository.getRestaurant.mockResolvedValue(null);
      const service = new RestaurantService(mockRepository);

      const result = await service.getRestaurant("nonexistent");

      expect(result).toBeNull();
      expect(mockRepository.getRestaurant).toHaveBeenCalledWith("nonexistent");
    });
  });
});
