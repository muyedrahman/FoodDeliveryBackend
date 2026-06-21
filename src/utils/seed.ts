import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db";
import User from "../modules/user/user.model";
import Restaurant from "../modules/restaurant/restaurant.model";
import Food from "../modules/food/food.model";

dotenv.config();

async function seed() {
  await connectDB();

  console.log("Clearing existing data...");
  await Promise.all([User.deleteMany({}), Restaurant.deleteMany({}), Food.deleteMany({})]);

  console.log("Creating sample restaurant owner...");
  const owner = await User.create({
    clerkId: "seed_owner_placeholder", // Replace with a real Clerk ID after testing signup
    name: "Restaurant Owner Demo",
    email: "owner@foodieai.demo",
    role: "restaurant_owner",
  });

  console.log("Creating sample admin...");
  await User.create({
    clerkId: "seed_admin_placeholder", // Replace with a real Clerk ID after testing signup
    name: "Admin Demo",
    email: "admin@foodieai.demo",
    role: "admin",
  });

  console.log("Creating restaurants...");
  const burgerHouse = await Restaurant.create({
    ownerId: owner._id,
    name: "Burger House",
    description: "Classic American burgers made fresh daily.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
    cuisine: "American",
    address: "Dhanmondi, Dhaka",
    rating: 4.8,
  });

  const pizzaPalace = await Restaurant.create({
    ownerId: owner._id,
    name: "Pizza Palace",
    description: "Authentic Italian pizza with fresh ingredients.",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&q=80",
    cuisine: "Italian",
    address: "Gulshan, Dhaka",
    rating: 4.9,
  });

  console.log("Creating food items...");
  await Food.create([
    {
      restaurantId: burgerHouse._id,
      name: "Chicken Burger",
      description: "Juicy grilled chicken breast with lettuce, tomato, and mayo sauce.",
      price: 4.99,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
      category: "Burger",
      rating: 4.8,
      reviewCount: 124,
      prepTimeMinutes: 15,
      calories: 540,
      ingredients: ["Chicken breast", "Brioche bun", "Lettuce", "Tomato", "Mayo sauce"],
    },
    {
      restaurantId: pizzaPalace._id,
      name: "Pepperoni Pizza",
      description: "Classic pizza loaded with spicy pepperoni and mozzarella.",
      price: 9.99,
      image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&q=80",
      category: "Pizza",
      rating: 4.9,
      reviewCount: 210,
      prepTimeMinutes: 25,
      calories: 820,
      ingredients: ["Pizza dough", "Pepperoni", "Mozzarella", "Tomato sauce"],
    },
  ]);

  console.log("Seed complete!");
  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
