import { Router } from "express";
import * as orderController from "./order.controller";
import { requireAuth, requireRole } from "@/middleware/auth.middleware";

const router = Router();

// All order routes require authentication
router.use(requireAuth);

router.post("/", requireRole("customer"), orderController.placeOrder);
router.get("/", orderController.getMyOrders); // auto-scoped by role inside controller
router.patch(
  "/:id/status",
  requireRole("restaurant_owner", "admin"),
  orderController.updateStatus
);

export default router;
