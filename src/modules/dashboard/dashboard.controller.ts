import { Response } from "express";
import { AuthenticatedRequest } from "@/middleware/auth.middleware";
import Order from "@/modules/order/order.model";
import Restaurant from "@/modules/restaurant/restaurant.model";
import User from "@/modules/user/user.model";
import Food from "@/modules/food/food.model";

export async function getCustomerDashboard(req: AuthenticatedRequest, res: Response) {
  try {
    const customerId = req.auth?.dbUserId;
    const orders = await Order.find({ customerId });

    const totalOrders = orders.length;
    const totalSpent = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.totalAmount, 0);
    const activeOrders = orders.filter((o) =>
      ["pending", "confirmed", "preparing"].includes(o.status)
    ).length;

    res.status(200).json({
      totalOrders,
      totalSpent,
      activeOrders,
      recentOrders: orders.slice(0, 5),
    });
  } catch (error) {
    console.error("getCustomerDashboard error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
}

export async function getRestaurantDashboard(req: AuthenticatedRequest, res: Response) {
  try {
    const restaurant = await Restaurant.findOne({ ownerId: req.auth?.dbUserId });
    if (!restaurant) {
      return res.status(200).json({
        totalOrders: 0,
        totalRevenue: 0,
        totalMenuItems: 0,
        pendingOrders: 0,
      });
    }

    const orders = await Order.find({ restaurantId: restaurant._id });
    const menuItemCount = await Food.countDocuments({ restaurantId: restaurant._id });

    const totalRevenue = orders
      .filter((o) => o.status === "delivered")
      .reduce((sum, o) => sum + o.totalAmount, 0);
    const pendingOrders = orders.filter((o) =>
      ["pending", "confirmed", "preparing"].includes(o.status)
    ).length;

    res.status(200).json({
      totalOrders: orders.length,
      totalRevenue,
      totalMenuItems: menuItemCount,
      pendingOrders,
    });
  } catch (error) {
    console.error("getRestaurantDashboard error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
}

export async function getAdminDashboard(req: AuthenticatedRequest, res: Response) {
  try {
    const [totalUsers, totalRestaurants, totalOrders, allOrders] = await Promise.all([
      User.countDocuments(),
      Restaurant.countDocuments(),
      Order.countDocuments(),
      Order.find(),
    ]);

    const totalRevenue = allOrders
      .filter((o) => o.status === "delivered")
      .reduce((sum, o) => sum + o.totalAmount, 0);

    res.status(200).json({
      totalUsers,
      totalRestaurants,
      totalOrders,
      totalRevenue,
    });
  } catch (error) {
    console.error("getAdminDashboard error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
}
