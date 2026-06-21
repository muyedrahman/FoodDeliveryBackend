// import { Response, Request } from "express";
// import * as restaurantService from "./restaurant.service";
// import { AuthenticatedRequest } from "@/middleware/auth.middleware";

// export async function listRestaurants(req: Request, res: Response) {
//   try {
//     const restaurants = await restaurantService.getAllRestaurants();
//     res.status(200).json({ restaurants });
//   } catch (error) {
//     console.error("listRestaurants error:", error);
//     res.status(500).json({ error: "Failed to fetch restaurants" });
//   }
// }

// export async function getRestaurant(req: Request, res: Response) {
//   try {
//     const restaurant = await restaurantService.getRestaurantById(req.params.id);
//     if (!restaurant) {
//       return res.status(404).json({ error: "Restaurant not found" });
//     }
//     res.status(200).json({ restaurant });
//   } catch (error) {
//     console.error("getRestaurant error:", error);
//     res.status(500).json({ error: "Failed to fetch restaurant" });
//   }
// }

// export async function createRestaurant(req: AuthenticatedRequest, res: Response) {
//   try {
//     if (!req.auth) return res.status(401).json({ error: "Not authenticated" });

//     const existing = await restaurantService.getRestaurantByOwner(req.auth.dbUserId);
//     if (existing) {
//       return res.status(400).json({ error: "You already have a registered restaurant" });
//     }

//     const restaurant = await restaurantService.createRestaurant({
//       ...req.body,
//       ownerId: req.auth.dbUserId,
//     });

//     res.status(201).json({ restaurant });
//   } catch (error) {
//     console.error("createRestaurant error:", error);
//     res.status(400).json({ error: "Failed to create restaurant" });
//   }
// }

// export async function updateRestaurant(req: AuthenticatedRequest, res: Response) {
//   try {
//     const restaurant = await restaurantService.getRestaurantById(req.params.id);
//     if (!restaurant) {
//       return res.status(404).json({ error: "Restaurant not found" });
//     }

//     if (
//       req.auth?.role !== "admin" &&
//       String((restaurant as { ownerId: { _id: string } }).ownerId._id) !== req.auth?.dbUserId
//     ) {
//       return res.status(403).json({ error: "You do not own this restaurant" });
//     }

//     const updated = await restaurantService.updateRestaurant(req.params.id, req.body);
//     res.status(200).json({ restaurant: updated });
//   } catch (error) {
//     console.error("updateRestaurant error:", error);
//     res.status(400).json({ error: "Failed to update restaurant" });
//   }
// }

// 2

import { Response, Request } from "express";
import * as restaurantService from "./restaurant.service";
import { AuthenticatedRequest } from "@/middleware/auth.middleware";

export async function listRestaurants(req: Request, res: Response) {
  try {
    const restaurants = await restaurantService.getAllRestaurants();
    res.status(200).json({ restaurants });
  } catch (error) {
    console.error("listRestaurants error:", error);
    res.status(500).json({ error: "Failed to fetch restaurants" });
  }
}

export async function getRestaurant(req: Request, res: Response) {
  try {
    const restaurant = await restaurantService.getRestaurantById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }
    res.status(200).json({ restaurant });
  } catch (error) {
    console.error("getRestaurant error:", error);
    res.status(500).json({ error: "Failed to fetch restaurant" });
  }
}

export async function createRestaurant(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    if (!req.auth) return res.status(401).json({ error: "Not authenticated" });

    const existing = await restaurantService.getRestaurantByOwner(
      req.auth.dbUserId,
    );
    if (existing) {
      return res
        .status(400)
        .json({ error: "You already have a registered restaurant" });
    }

    const restaurant = await restaurantService.createRestaurant({
      ...req.body,
      ownerId: req.auth.dbUserId,
    });

    res.status(201).json({ restaurant });
  } catch (error) {
    console.error("createRestaurant error:", error);
    res.status(400).json({ error: "Failed to create restaurant" });
  }
}

export async function updateRestaurant(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const restaurant = await restaurantService.getRestaurantById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    if (
      req.auth?.role !== "admin" &&
      String(
        (restaurant as unknown as { ownerId: { _id: string } }).ownerId._id,
      ) !== req.auth?.dbUserId
    ) {
      return res.status(403).json({ error: "You do not own this restaurant" });
    }

    const updated = await restaurantService.updateRestaurant(
      req.params.id,
      req.body,
    );
    res.status(200).json({ restaurant: updated });
  } catch (error) {
    console.error("updateRestaurant error:", error);
    res.status(400).json({ error: "Failed to update restaurant" });
  }
}