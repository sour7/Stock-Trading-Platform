import express from "express";
import { getStocks } from "../controllers/stock";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.get("/", authMiddleware, getStocks);

export default router;
