import { Request, Response, NextFunction } from "express";
import { clerkClient } from "@clerk/clerk-sdk-node";
import User, { UserRole } from "@/modules/user/user.model";

export interface AuthenticatedRequest extends Request {
  auth?: {
    userId: string;
    role: UserRole;
    dbUserId: string;
  };
}

/**
 * Verifies the Clerk session token sent in the Authorization header
 * and attaches the user's role (looked up from MongoDB) to the request.
 */
export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Missing or invalid authorization header" });
      return;
    }

    const token = authHeader.split(" ")[1];

    const session = await clerkClient.verifyToken(token);
    if (!session || !session.sub) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }

    const clerkUserId = session.sub;

    const dbUser = await User.findOne({ clerkId: clerkUserId });
    if (!dbUser) {
      res.status(404).json({ error: "User not found in database. Please sync your account first." });
      return;
    }

    req.auth = {
      userId: clerkUserId,
      role: dbUser.role,
      dbUserId: String(dbUser._id),
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ error: "Authentication failed" });
  }
}

/**
 * Restricts a route to specific roles.
 * Usage: requireRole("admin") or requireRole("admin", "restaurant_owner")
 */
export function requireRole(...allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.auth) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    if (!allowedRoles.includes(req.auth.role)) {
      res.status(403).json({
        error: `Access denied. This action requires one of these roles: ${allowedRoles.join(", ")}`,
      });
      return;
    }

    next();
  };
}
