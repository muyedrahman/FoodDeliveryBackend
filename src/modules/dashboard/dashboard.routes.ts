import { Router } from "express";
import * as dashboardController from "./dashboard.controller";
import { requireAuth, requireRole } from "@/middleware/auth.middleware";

const router = Router();

router.use(requireAuth);

router.get("/customer", requireRole("customer"), dashboardController.getCustomerDashboard);
router.get(
  "/restaurant",
  requireRole("restaurant_owner"),
  dashboardController.getRestaurantDashboard
);
router.get("/admin", requireRole("admin"), dashboardController.getAdminDashboard);

export default router;
