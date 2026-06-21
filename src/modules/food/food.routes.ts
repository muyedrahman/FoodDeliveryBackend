import { Router } from "express";
import * as foodController from "./food.controller";
import { requireAuth, requireRole } from "@/middleware/auth.middleware";

const router = Router();

// Public routes — anyone can browse food
router.get("/", foodController.listFoods);
router.get("/:id", foodController.getFood);

// Protected routes — only restaurant owners and admins can manage food
router.post("/", requireAuth, requireRole("restaurant_owner", "admin"), foodController.createFood);
router.put("/:id", requireAuth, requireRole("restaurant_owner", "admin"), foodController.updateFood);
router.delete("/:id", requireAuth, requireRole("restaurant_owner", "admin"), foodController.deleteFood);

export default router;
