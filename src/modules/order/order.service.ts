import Order, { OrderStatus } from "./order.model";
import Food from "@/modules/food/food.model";
import { Types } from "mongoose";

export async function createOrder(data: {
  customerId: string;
  restaurantId: string;
  items: { foodId: string; quantity: number }[];
  address: string;
}) {
  const foodIds = data.items.map((i) => i.foodId);
  const foods = await Food.find({ _id: { $in: foodIds } });

  const items = data.items.map((item) => {
    const food = foods.find((f) => String(f._id) === item.foodId);
    if (!food) throw new Error(`Food item ${item.foodId} not found`);
    return {
      foodId: new Types.ObjectId(item.foodId),
      name: food.name,
      price: food.price,
      quantity: item.quantity,
    };
  });

  const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return Order.create({
    customerId: data.customerId,
    restaurantId: data.restaurantId,
    items,
    totalAmount,
    address: data.address,
    status: "pending",
  });
}

export async function getCustomerOrders(customerId: string) {
  return Order.find({ customerId }).sort({ createdAt: -1 }).populate("restaurantId", "name");
}

export async function getRestaurantOrders(restaurantId: string) {
  return Order.find({ restaurantId }).sort({ createdAt: -1 }).populate("customerId", "name email");
}

export async function getAllOrders() {
  return Order.find()
    .sort({ createdAt: -1 })
    .populate("customerId", "name email")
    .populate("restaurantId", "name");
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  return Order.findByIdAndUpdate(orderId, { status }, { new: true });
}
