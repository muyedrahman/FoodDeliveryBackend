import { Response } from "express";
import * as orderService from "./order.service";
import Restaurant from "@/modules/restaurant/restaurant.model";
import { AuthenticatedRequest } from "@/middleware/auth.middleware";

export async function placeOrder(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.auth) return res.status(401).json({ error: "Not authenticated" });

    const order = await orderService.createOrder({
      customerId: req.auth.dbUserId,
      restaurantId: req.body.restaurantId,
      items: req.body.items,
      address: req.body.address,
    });

    res.status(201).json({ order });
  } catch (error) {
    console.error("placeOrder error:", error);
    res.status(400).json({ error: "Failed to place order" });
  }
}

/**
 * Returns orders scoped to the requester's role:
 * - customer: only their own orders
 * - restaurant_owner: only orders for restaurants they own
 * - admin: all orders in the system
 */
export async function getMyOrders(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.auth) return res.status(401).json({ error: "Not authenticated" });

    const { role, dbUserId } = req.auth;

    if (role === "admin") {
      const orders = await orderService.getAllOrders();
      return res.status(200).json({ orders });
    }

    if (role === "restaurant_owner") {
      const restaurant = await Restaurant.findOne({ ownerId: dbUserId });
      if (!restaurant) {
        return res.status(200).json({ orders: [] });
      }
      const orders = await orderService.getRestaurantOrders(String(restaurant._id));
      return res.status(200).json({ orders });
    }

    // default: customer
    const orders = await orderService.getCustomerOrders(dbUserId);
    return res.status(200).json({ orders });
  } catch (error) {
    console.error("getMyOrders error:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
}

export async function updateStatus(req: AuthenticatedRequest, res: Response) {
  try {
    const { status } = req.body;
    const order = await orderService.updateOrderStatus(req.params.id, status);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error("updateStatus error:", error);
    res.status(400).json({ error: "Failed to update order status" });
  }
}
