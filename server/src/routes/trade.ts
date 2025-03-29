import express from "express";
import { buyStock, sellStock } from "../controllers/trade";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.post("/buy", authMiddleware,  buyStock);
router.post("/sell",authMiddleware, sellStock);

export default router;
