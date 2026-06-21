// import { Request, Response } from "express";
// import * as foodService from "./food.service";
// import Restaurant from "@/modules/restaurant/restaurant.model";
// import { AuthenticatedRequest } from "@/middleware/auth.middleware";

// export async function listFoods(req: Request, res: Response) {
//   try {
//     const {
//       search,
//       category,
//       minPrice,
//       maxPrice,
//       sort,
//       page,
//       limit,
//     } = req.query;

//     const result = await foodService.getFoods({
//       search: typeof search === "string" ? search : undefined,
//       category: typeof category === "string" ? (category as never) : undefined,
//       minPrice: minPrice ? Number(minPrice) : undefined,
//       maxPrice: maxPrice ? Number(maxPrice) : undefined,
//       sort: typeof sort === "string" ? (sort as never) : undefined,
//       page: page ? Number(page) : 1,
//       limit: limit ? Number(limit) : 8,
//     });

//     res.status(200).json(result);
//   } catch (error) {
//     console.error("listFoods error:", error);
//     res.status(500).json({ error: "Failed to fetch foods" });
//   }
// }

// export async function getFood(req: Request, res: Response) {
//   try {
//     const food = await foodService.getFoodById(req.params.id);

//     if (!food) {
//       return res.status(404).json({ error: "Food item not found" });
//     }

//     const related = await foodService.getRelatedFoods(
//       (food as { category: string }).category,
//       req.params.id
//     );

//     res.status(200).json({ food, related });
//   } catch (error) {
//     console.error("getFood error:", error);
//     res.status(500).json({ error: "Failed to fetch food item" });
//   }
// }

// export async function createFood(req: AuthenticatedRequest, res: Response) {
//   try {
//     // Verify the restaurant belongs to this owner (or the user is an admin)
//     const restaurant = await Restaurant.findById(req.body.restaurantId);
//     if (!restaurant) {
//       return res.status(404).json({ error: "Restaurant not found" });
//     }

//     if (
//       req.auth?.role !== "admin" &&
//       String(restaurant.ownerId) !== req.auth?.dbUserId
//     ) {
//       return res.status(403).json({ error: "You do not own this restaurant" });
//     }

//     const food = await foodService.createFood(req.body);
//     res.status(201).json({ food });
//   } catch (error) {
//     console.error("createFood error:", error);
//     res.status(400).json({ error: "Failed to create food item" });
//   }
// }

// export async function updateFood(req: AuthenticatedRequest, res: Response) {
//   try {
//     const food = await foodService.updateFood(req.params.id, req.body);
//     if (!food) {
//       return res.status(404).json({ error: "Food item not found" });
//     }
//     res.status(200).json({ food });
//   } catch (error) {
//     console.error("updateFood error:", error);
//     res.status(400).json({ error: "Failed to update food item" });
//   }
// }

// export async function deleteFood(req: AuthenticatedRequest, res: Response) {
//   try {
//     const food = await foodService.deleteFood(req.params.id);
//     if (!food) {
//       return res.status(404).json({ error: "Food item not found" });
//     }
//     res.status(200).json({ message: "Food item deleted" });
//   } catch (error) {
//     console.error("deleteFood error:", error);
//     res.status(500).json({ error: "Failed to delete food item" });
//   }
// }

// 2

import { Request, Response } from "express";
import * as foodService from "./food.service";
import Restaurant from "@/modules/restaurant/restaurant.model";
import { AuthenticatedRequest } from "@/middleware/auth.middleware";

export async function listFoods(req: Request, res: Response) {
  try {
    const { search, category, minPrice, maxPrice, sort, page, limit } =
      req.query;

    const result = await foodService.getFoods({
      search: typeof search === "string" ? search : undefined,
      category: typeof category === "string" ? (category as never) : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      sort: typeof sort === "string" ? (sort as never) : undefined,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 8,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("listFoods error:", error);
    res.status(500).json({ error: "Failed to fetch foods" });
  }
}

export async function getFood(req: Request, res: Response) {
  try {
    const food = await foodService.getFoodById(req.params.id);

    if (!food) {
      return res.status(404).json({ error: "Food item not found" });
    }

    const related = await foodService.getRelatedFoods(
      (food as unknown as { category: string }).category,
      req.params.id,
    );

    res.status(200).json({ food, related });
  } catch (error) {
    console.error("getFood error:", error);
    res.status(500).json({ error: "Failed to fetch food item" });
  }
}

export async function createFood(req: AuthenticatedRequest, res: Response) {
  try {
    // Verify the restaurant belongs to this owner (or the user is an admin)
    const restaurant = await Restaurant.findById(req.body.restaurantId);
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    if (
      req.auth?.role !== "admin" &&
      String(restaurant.ownerId) !== req.auth?.dbUserId
    ) {
      return res.status(403).json({ error: "You do not own this restaurant" });
    }

    const food = await foodService.createFood(req.body);
    res.status(201).json({ food });
  } catch (error) {
    console.error("createFood error:", error);
    res.status(400).json({ error: "Failed to create food item" });
  }
}

export async function updateFood(req: AuthenticatedRequest, res: Response) {
  try {
    const food = await foodService.updateFood(req.params.id, req.body);
    if (!food) {
      return res.status(404).json({ error: "Food item not found" });
    }
    res.status(200).json({ food });
  } catch (error) {
    console.error("updateFood error:", error);
    res.status(400).json({ error: "Failed to update food item" });
  }
}

export async function deleteFood(req: AuthenticatedRequest, res: Response) {
  try {
    const food = await foodService.deleteFood(req.params.id);
    if (!food) {
      return res.status(404).json({ error: "Food item not found" });
    }
    res.status(200).json({ message: "Food item deleted" });
  } catch (error) {
    console.error("deleteFood error:", error);
    res.status(500).json({ error: "Failed to delete food item" });
  }
}