import { PrismaClient } from "@prisma/client";
import cron from "node-cron";
import { generateRandomStockPrice } from "../utils/stockPriceGenerator";

const prisma = new PrismaClient();

// Function to update stock prices
async function updateStockPrices() {
  console.log("Updating stock prices...");

  const stocks = await prisma.stock.findMany();
  for (const stock of stocks) {
    const newPrice = generateRandomStockPrice(stock.currentPrice);

    // Update current price in `Stock` table
    await prisma.stock.update({
      where: { id: stock.id },
      data: { currentPrice: newPrice },
    });

    // Store historical price in `StockPriceHistory`
    await prisma.stockPriceHistory.create({
      data: {
        stockId: stock.id,
        price: newPrice,
      },
    });
  }

  console.log("Stock prices updated.");
}

// Schedule the job to run every 1 minute
cron.schedule("* * * * *", updateStockPrices);

export default updateStockPrices;
