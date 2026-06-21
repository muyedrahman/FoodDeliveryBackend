import mongoose, { Schema, Document, Types } from "mongoose";

export interface IRestaurant extends Document {
  ownerId: Types.ObjectId;
  name: string;
  description: string;
  image: string;
  cuisine: string;
  address: string;
  rating: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const restaurantSchema = new Schema<IRestaurant>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    cuisine: { type: String, required: true },
    address: { type: String, required: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Restaurant ||
  mongoose.model<IRestaurant>("Restaurant", restaurantSchema);
