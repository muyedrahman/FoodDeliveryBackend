// 1
// import express, { Request, Response, NextFunction } from "express";
// import cors from "cors";
// import helmet from "helmet";
// import morgan from "morgan";
// import rateLimit from "express-rate-limit";
// import dotenv from "dotenv";

// import { connectDB } from "./config/db";

// import authRoutes from "./modules/auth/auth.routes";
// import foodRoutes from "./modules/food/food.routes";
// import restaurantRoutes from "./modules/restaurant/restaurant.routes";
// import orderRoutes from "./modules/order/order.routes";
// import userRoutes from "./modules/user/user.routes";
// import dashboardRoutes from "./modules/dashboard/dashboard.routes";
// import aiRoutes from "./modules/ai/ai.routes";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Security & parsing middleware
// app.use(helmet());
// app.use(
//   cors({
//     // origin: process.env.FRONTEND_URL || "http://localhost:3000",
//     origin: true,
//     credentials: true,
//   }),
// );
// app.use(express.json());
// app.use(morgan("dev"));

// // Rate limiting — protects against abuse
// const apiLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 200,
//   standardHeaders: true,
//   legacyHeaders: false,
// });
// app.use("/api", apiLimiter);

// // Health check
// app.get("/health", (req: Request, res: Response) => {
//   res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
// });

// // API routes
// const API_PREFIX = "/api/v1";
// app.use(`${API_PREFIX}/auth`, authRoutes);
// app.use(`${API_PREFIX}/foods`, foodRoutes);
// app.use(`${API_PREFIX}/restaurants`, restaurantRoutes);
// app.use(`${API_PREFIX}/orders`, orderRoutes);
// app.use(`${API_PREFIX}/users`, userRoutes);
// app.use(`${API_PREFIX}/dashboard`, dashboardRoutes);
// app.use(`${API_PREFIX}/ai`, aiRoutes);

// // 404 handler
// app.use((req: Request, res: Response) => {
//   res.status(404).json({ error: "Route not found" });
// });

// // Global error handler
// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//   console.error("Unhandled error:", err);
//   res.status(500).json({ error: "Internal server error" });
// });

// async function startServer() {
//   await connectDB();
//   app.listen(PORT, () => {
//     console.log(`FoodieAI backend running on http://localhost:${PORT}`);
//   });
// }

// startServer();

// 2
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

import { connectDB } from "./config/db";

import authRoutes from "./modules/auth/auth.routes";
import foodRoutes from "./modules/food/food.routes";
import restaurantRoutes from "./modules/restaurant/restaurant.routes";
import orderRoutes from "./modules/order/order.routes";
import userRoutes from "./modules/user/user.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";
import aiRoutes from "./modules/ai/ai.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
console.log(`FoodieAI backend running on http://localhost:${PORT}`);



// Security & parsing middleware
app.use(helmet());
app.use(
  cors({
    // origin: process.env.FRONTEND_URL || "http://localhost:3000",
    origin: true,
    credentials: true,
  }),
);
app.use(express.json());
app.use(morgan("dev"));

// Rate limiting — protects against abuse
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", apiLimiter);

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// API routes
const API_PREFIX = "/api/v1";
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/foods`, foodRoutes);
app.use(`${API_PREFIX}/restaurants`, restaurantRoutes);
app.use(`${API_PREFIX}/orders`, orderRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/dashboard`, dashboardRoutes);
app.use(`${API_PREFIX}/ai`, aiRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`FoodieAI backend running on http://localhost:${PORT}`);
  });
}

startServer();