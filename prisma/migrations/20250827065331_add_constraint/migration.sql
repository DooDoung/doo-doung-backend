/*
  Warnings:

  - You are about to alter the column `email` on the `account` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(50)`.
  - You are about to alter the column `course_name` on the `course` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(50)`.
  - You are about to drop the `admin` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."admin" DROP CONSTRAINT "admin_account_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."report" DROP CONSTRAINT "report_admin_id_fkey";

-- AlterTable
ALTER TABLE "public"."account" ALTER COLUMN "email" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "public"."course" ALTER COLUMN "course_name" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "public"."report" ALTER COLUMN "report_status" SET DEFAULT 'pending';

-- DropTable
DROP TABLE "public"."admin";

-- AddForeignKey
ALTER TABLE "public"."report" ADD CONSTRAINT "report_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "public"."account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Add checking review score constraint
ALTER TABLE "review"
ADD CONSTRAINT score_check CHECK (score >= 1 AND score <= 5);