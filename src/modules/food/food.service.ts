import Food, { FoodCategory } from "./food.model";

export interface FoodQueryOptions {
  search?: string;
  category?: FoodCategory | "All";
  minPrice?: number;
  maxPrice?: number;
  sort?: "popular" | "price-asc" | "price-desc" | "rating";
  page?: number;
  limit?: number;
}

export async function getFoods(options: FoodQueryOptions) {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    sort = "popular",
    page = 1,
    limit = 8,
  } = options;

  const filter: Record<string, unknown> = { isAvailable: true };

  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  if (category && category !== "All") {
    filter.category = category;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) (filter.price as Record<string, number>).$gte = minPrice;
    if (maxPrice !== undefined) (filter.price as Record<string, number>).$lte = maxPrice;
  }

  const sortMap: Record<string, Record<string, 1 | -1>> = {
    popular: { reviewCount: -1 },
    "price-asc": { price: 1 },
    "price-desc": { price: -1 },
    rating: { rating: -1 },
  };

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Food.find(filter)
      .sort(sortMap[sort])
      .skip(skip)
      .limit(limit)
      .populate("restaurantId", "name")
      .lean(),
    Food.countDocuments(filter),
  ]);

  return {
    items,
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export async function getFoodById(id: string) {
  return Food.findById(id).populate("restaurantId", "name address").lean();
}

export async function getRelatedFoods(category: string, excludeId: string, limit = 4) {
  return Food.find({ category, _id: { $ne: excludeId }, isAvailable: true })
    .limit(limit)
    .populate("restaurantId", "name")
    .lean();
}

export async function createFood(data: Partial<typeof Food.prototype>) {
  return Food.create(data);
}

export async function updateFood(id: string, data: Partial<typeof Food.prototype>) {
  return Food.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

export async function deleteFood(id: string) {
  return Food.findByIdAndDelete(id);
}
