import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Get User Portfolio
 */
export const getUserPortfolio = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  if (!userId) {
    res.status(400).json({ error: "User ID is required" });
    return;
  }

  try {
    await prisma.$disconnect(); // Ensure fresh data fetch
    await prisma.$connect(); // Reconnect before querying

    const portfolio = await prisma.portfolio.findMany({
      where: { userId },
      include: { stock: true },
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { balance: true },
    });

    const holdings = portfolio.map((entry) => ({
      stockId: entry.stock.id,
      symbol: entry.stock.symbol,
      name: entry.stock.name,
      quantity: entry.quantity,
      avgPrice: entry.avgPrice,
      currentPrice: entry.stock.currentPrice,
      currentValue: entry.stock.currentPrice * entry.quantity,
      profitLoss: entry.stock.currentPrice * entry.quantity - entry.avgPrice * entry.quantity,
      profitLossPercentage: entry.avgPrice > 0
        ? (((entry.stock.currentPrice - entry.avgPrice) / entry.avgPrice) * 100).toFixed(2)
        : "0",
    }));

    res.json({ holdings, balance: user?.balance || 0 });
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
