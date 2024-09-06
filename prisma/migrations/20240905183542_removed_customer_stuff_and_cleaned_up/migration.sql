/*
  Warnings:

  - You are about to drop the column `customerId` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "customerId";

-- AlterTable
ALTER TABLE "OrderItem" ALTER COLUMN "color" DROP NOT NULL,
ALTER COLUMN "variant" DROP NOT NULL;
