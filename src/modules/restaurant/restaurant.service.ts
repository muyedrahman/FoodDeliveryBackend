import Restaurant from "./restaurant.model";

export async function getAllRestaurants() {
  return Restaurant.find({ isActive: true }).populate("ownerId", "name email");
}

export async function getRestaurantById(id: string) {
  return Restaurant.findById(id).populate("ownerId", "name email");
}

export async function getRestaurantByOwner(ownerId: string) {
  return Restaurant.findOne({ ownerId });
}

export async function createRestaurant(data: Partial<typeof Restaurant.prototype>) {
  return Restaurant.create(data);
}

export async function updateRestaurant(id: string, data: Partial<typeof Restaurant.prototype>) {
  return Restaurant.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}
