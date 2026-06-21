import { Router, Request, Response } from "express";
import { clerkClient } from "@clerk/clerk-sdk-node";
import User from "@/modules/user/user.model";

const router = Router();

/**
 * POST /api/v1/auth/sync
 * Called from the frontend right after a user signs in.
 * Creates a MongoDB user record if one doesn't exist yet (defaults to "customer" role).
 * If the user already exists, simply returns their current record.
 */
router.post("/sync", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing authorization header" });
    }

    const token = authHeader.split(" ")[1];
    const session = await clerkClient.verifyToken(token);

    if (!session || !session.sub) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const clerkUser = await clerkClient.users.getUser(session.sub);

    let dbUser = await User.findOne({ clerkId: clerkUser.id });

    if (!dbUser) {
      dbUser = await User.create({
        clerkId: clerkUser.id,
        name: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() || "New User",
        email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
        avatar: clerkUser.imageUrl,
        role: "customer",
      });
    }

    return res.status(200).json({ user: dbUser });
  } catch (error) {
    console.error("Auth sync error:", error);
    return res.status(500).json({ error: "Failed to sync user" });
  }
});

export default router;
