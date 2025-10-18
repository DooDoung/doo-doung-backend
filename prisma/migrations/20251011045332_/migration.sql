/*
  Warnings:

  - You are about to drop the column `end_time` on the `prophet_availability` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[prophet_id,date,start_time]` on the table `prophet_availability` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."prophet_availability_prophet_id_date_start_time_end_time_key";

-- AlterTable
ALTER TABLE "prophet_availability" DROP COLUMN "end_time";

-- CreateIndex
CREATE UNIQUE INDEX "prophet_availability_prophet_id_date_start_time_key" ON "prophet_availability"("prophet_id", "date", "start_time");
