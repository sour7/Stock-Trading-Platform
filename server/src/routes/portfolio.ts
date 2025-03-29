import express from "express";
import { getUserPortfolio } from "../controllers/portfolio";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.get("/:userId", authMiddleware, getUserPortfolio);

export default router;
