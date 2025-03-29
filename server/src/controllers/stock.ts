import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import updateStockPrices from "../cron/updateStockPrices";

const prisma = new PrismaClient();

export const getStocks = async (req: Request, res: Response) => {
  try {
    await updateStockPrices(); // Trigger price update before responding

    const stocks = await prisma.stock.findMany({
      include: {
        history: { orderBy: { timestamp: "desc" }, take: 2 }, // Fetch last two prices
      },
    });

    const stocksWithChange = stocks.map((stock) => {
      const [latest, previous] = stock.history;

      const changePercentage =
        previous && previous.price > 0
          ? ((latest.price - previous.price) / previous.price) * 100
          : 0;

      return {
        ...stock,
        changePercentage: changePercentage.toFixed(2), // Format to 2 decimal places
      };
    });

    res.json(stocksWithChange);
  } catch (error) {
    console.error("Error fetching stocks:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
