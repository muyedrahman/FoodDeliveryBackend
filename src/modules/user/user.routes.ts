import { Router } from "express";
import * as userController from "./user.controller";
import { requireAuth, requireRole } from "@/middleware/auth.middleware";

const router = Router();

router.use(requireAuth);

router.get("/profile", userController.getMyProfile);
router.put("/profile", userController.updateMyProfile);

// Admin-only routes
router.get("/", requireRole("admin"), userController.listAllUsers);
router.patch("/:id/role", requireRole("admin"), userController.updateUserRole);

export default router;
