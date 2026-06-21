import { Response } from "express";
import User from "./user.model";
import { AuthenticatedRequest } from "@/middleware/auth.middleware";

export async function getMyProfile(req: AuthenticatedRequest, res: Response) {
  try {
    const user = await User.findById(req.auth?.dbUserId);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ user });
  } catch (error) {
    console.error("getMyProfile error:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
}

export async function updateMyProfile(req: AuthenticatedRequest, res: Response) {
  try {
    const { name, phone, address } = req.body;

    const user = await User.findByIdAndUpdate(
      req.auth?.dbUserId,
      { name, phone, address },
      { new: true, runValidators: true }
    );

    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ user });
  } catch (error) {
    console.error("updateMyProfile error:", error);
    res.status(400).json({ error: "Failed to update profile" });
  }
}

// Admin only
export async function listAllUsers(req: AuthenticatedRequest, res: Response) {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ users });
  } catch (error) {
    console.error("listAllUsers error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
}

// Admin only — change a user's role
export async function updateUserRole(req: AuthenticatedRequest, res: Response) {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ user });
  } catch (error) {
    console.error("updateUserRole error:", error);
    res.status(400).json({ error: "Failed to update user role" });
  }
}
