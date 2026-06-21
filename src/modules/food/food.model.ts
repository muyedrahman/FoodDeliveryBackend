import mongoose, { Schema, Document, Types } from "mongoose";

export type FoodCategory =
  | "Burger"
  | "Pizza"
  | "Rice"
  | "Drinks"
  | "Dessert"
  | "Chicken";

export interface IFood extends Document {
  restaurantId: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  image: string;
  category: FoodCategory;
  rating: number;
  reviewCount: number;
  prepTimeMinutes: number;
  calories: number;
  ingredients: string[];
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const foodSchema = new Schema<IFood>(
  {
    restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
    category: {
      type: String,
      enum: ["Burger", "Pizza", "Rice", "Drinks", "Dessert", "Chicken"],
      required: true,
      index: true,
    },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    prepTimeMinutes: { type: Number, required: true },
    calories: { type: Number, required: true },
    ingredients: [{ type: String }],
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

foodSchema.index({ name: "text" });

export default mongoose.models.Food || mongoose.model<IFood>("Food", foodSchema);
