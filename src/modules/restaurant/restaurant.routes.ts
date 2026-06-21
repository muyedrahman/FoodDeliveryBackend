import { Router } from "express";
import * as restaurantController from "./restaurant.controller";
import { requireAuth, requireRole } from "@/middleware/auth.middleware";

const router = Router();

router.get("/", restaurantController.listRestaurants);
router.get("/:id", restaurantController.getRestaurant);

router.post("/", requireAuth, requireRole("restaurant_owner"), restaurantController.createRestaurant);
router.put(
  "/:id",
  requireAuth,
  requireRole("restaurant_owner", "admin"),
  restaurantController.updateRestaurant
);

export default router;
