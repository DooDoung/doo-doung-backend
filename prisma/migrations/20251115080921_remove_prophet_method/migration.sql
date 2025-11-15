/*
  Warnings:

  - You are about to drop the column `horoscope_method_id` on the `course` table. All the data in the column will be lost.
  - You are about to drop the `horoscope_method` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `prophet_method` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `horoscope_method_name` to the `course` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "course" DROP CONSTRAINT "course_horoscope_method_id_fkey";

-- DropForeignKey
ALTER TABLE "prophet_method" DROP CONSTRAINT "prophet_method_method_id_fkey";

-- DropForeignKey
ALTER TABLE "prophet_method" DROP CONSTRAINT "prophet_method_prophet_id_fkey";

-- DropIndex
DROP INDEX "course_horoscope_method_id_idx";

-- AlterTable
ALTER TABLE "course" DROP COLUMN "horoscope_method_id",
ADD COLUMN     "horoscope_method" VARCHAR(64) NOT NULL;

-- DropTable
DROP TABLE "horoscope_method";

-- DropTable
DROP TABLE "prophet_method";
