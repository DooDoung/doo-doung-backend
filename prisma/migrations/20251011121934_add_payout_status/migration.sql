/*
  Warnings:

  - Added the required column `balance` to the `prophet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount` to the `transaction` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PayoutStatus" AS ENUM ('pending_payout', 'paid_out');

-- AlterTable
ALTER TABLE "prophet" ADD COLUMN     "balance" DECIMAL(10,2) NOT NULL;

-- AlterTable
ALTER TABLE "transaction" ADD COLUMN     "amount" DECIMAL(10,2) NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "PayoutStatus" NOT NULL;

-- DropEnum
DROP TYPE "public"."TransactionStatus";
