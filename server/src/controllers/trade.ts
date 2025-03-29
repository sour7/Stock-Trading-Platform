import { Request, Response } from "express";
import { PrismaClient, TradeType } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Buy Stock Handler
 */
export const buyStock = async (req: Request, res: Response): Promise<void> => {
  const { userId, stockId, quantity } = req.body;

  if (!userId || !stockId || !quantity || quantity <= 0) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const stock = await prisma.stock.findUnique({ where: { id: stockId } });

    if (!user || !stock) {
      res.status(404).json({ error: "User or Stock not found" });
      return;
    }

    const totalCost = stock.currentPrice * quantity;

    if (user.balance < totalCost) {
      res.status(400).json({ error: "Insufficient balance" });
      return;
    }

    const updatedUser = await prisma.$transaction(async (tx) => {
      await tx.trade.create({
        data: {
          userId,
          stockId,
          type: TradeType.BUY,
          quantity,
          price: stock.currentPrice,
        },
      });

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { balance: { decrement: totalCost } },
      });

      const existingPortfolio = await tx.portfolio.findUnique({
        where: { userId_stockId: { userId, stockId } },
      });

      let updatedPortfolio;
      if (existingPortfolio) {
        const newQuantity = existingPortfolio.quantity + quantity;
        const newAvgPrice =
          (existingPortfolio.avgPrice * existingPortfolio.quantity +
            stock.currentPrice * quantity) /
          newQuantity;

        updatedPortfolio = await tx.portfolio.update({
          where: { userId_stockId: { userId, stockId } },
          data: { quantity: newQuantity, avgPrice: newAvgPrice },
        });
      } else {
        updatedPortfolio = await tx.portfolio.create({
          data: {
            userId,
            stockId,
            quantity,
            avgPrice: stock.currentPrice,
          },
        });
      }

      return { updatedUser, updatedPortfolio };
    }, { isolationLevel: "Serializable" });

    const updatedStock = await prisma.stock.findUnique({ where: { id: stockId } });

    await prisma.$disconnect(); // Ensure transactions are committed properly

    res.json({
      message: "Stock purchased successfully",
      userBalance: updatedUser.updatedUser.balance,
      stock: updatedStock,
      portfolio: updatedUser.updatedPortfolio,
    });
  } catch (error) {
    console.error("Error buying stock:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Sell Stock Handler
 */
export const sellStock = async (req: Request, res: Response): Promise<void> => {
  const { userId, stockId, quantity } = req.body;

  if (!userId || !stockId || !quantity || quantity <= 0) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const stock = await prisma.stock.findUnique({ where: { id: stockId } });
    const portfolio = await prisma.portfolio.findUnique({
      where: { userId_stockId: { userId, stockId } },
    });

    if (!user || !stock || !portfolio) {
      res.status(404).json({ error: "User, Stock, or Portfolio not found" });
      return;
    }

    if (portfolio.quantity < quantity) {
      res.status(400).json({ error: "Insufficient shares to sell" });
      return;
    }

    const saleAmount = stock.currentPrice * quantity;

    const updatedUser = await prisma.$transaction(async (tx) => {
      await tx.trade.create({
        data: {
          userId,
          stockId,
          type: TradeType.SELL,
          quantity,
          price: stock.currentPrice,
        },
      });

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { balance: { increment: saleAmount } },
      });

      let updatedPortfolio;
      if (portfolio.quantity === quantity) {
        await tx.portfolio.delete({
          where: { userId_stockId: { userId, stockId } },
        });
      } else {
        updatedPortfolio = await tx.portfolio.update({
          where: { userId_stockId: { userId, stockId } },
          data: { quantity: { decrement: quantity } },
        });
      }

      return { updatedUser, updatedPortfolio };
    }, { isolationLevel: "Serializable" });

    const updatedStock = await prisma.stock.findUnique({ where: { id: stockId } });
    const profitLossPercentage = portfolio
      ? ((updatedStock!.currentPrice - portfolio.avgPrice) / portfolio.avgPrice) * 100
      : 0;

    await prisma.$disconnect(); // Ensure transactions are committed properly

    res.json({
      message: "Stock sold successfully",
      userBalance: updatedUser.updatedUser.balance,
      stock: updatedStock,
      portfolio: updatedUser.updatedPortfolio,
      profitLossPercentage,
    });
  } catch (error) {
    console.error("Error selling stock:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
