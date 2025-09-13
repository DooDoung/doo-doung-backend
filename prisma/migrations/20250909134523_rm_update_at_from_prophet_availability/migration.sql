/*
  Warnings:

  - You are about to drop the column `updated_at` on the `prophet_availability` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."prophet_availability" DROP COLUMN "updated_at";
