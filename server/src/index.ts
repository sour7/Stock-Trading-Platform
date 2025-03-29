import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth";
import stockRoutes from "./routes/stock";
import tradeRoutes from "./routes/trade";
import portfolioRoutes from "./routes/portfolio";

dotenv.config();

const app = express();

// ✅ Middleware Setup
app.use(
  cors({
    origin: "http://localhost:5173", // Update this to your frontend URL
    credentials: true, // Allow cookies
  })
);

app.use(express.json());
app.use(cookieParser());



// ✅ Apply Routes
app.use("/api/auth", authRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/trades", tradeRoutes);
app.use("/api/portfolio", portfolioRoutes);

// ✅ Run Cron Job (Handle Errors)
import updateStockPrices from "./cron/updateStockPrices";
(async () => {
  try {
    await updateStockPrices(); // Ensure it runs safely
    console.log("✅ Stock price update job started.");
  } catch (error) {
    console.error("❌ Failed to start stock update job:", error);
  }
})();

// ✅ Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
