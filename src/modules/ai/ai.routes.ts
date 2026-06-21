import { Router } from "express";
import * as aiController from "./ai.controller";

const router = Router();

// Chat assistant is public (works for both logged-in and guest users)
router.post("/chat", aiController.chatWithAssistant);

// Description generator is for restaurant owners creating menu items
router.post("/generate-description", aiController.generateFoodDescription);

export default router;
