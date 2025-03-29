/*
  Warnings:

  - You are about to drop the column `price` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `StockPriceHistory` table. All the data in the column will be lost.
  - Added the required column `currentPrice` to the `Stock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Stock` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "StockPriceHistory" DROP CONSTRAINT "StockPriceHistory_stockId_fkey";

-- DropIndex
DROP INDEX "StockPriceHistory_stockId_key";

-- AlterTable
ALTER TABLE "Stock" DROP COLUMN "price",
ADD COLUMN     "currentPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "StockPriceHistory" DROP COLUMN "date",
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "StockPriceHistory_stockId_timestamp_idx" ON "StockPriceHistory"("stockId", "timestamp");

-- AddForeignKey
ALTER TABLE "StockPriceHistory" ADD CONSTRAINT "StockPriceHistory_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock"("id") ON DELETE CASCADE ON UPDATE CASCADE;
