/*
  Warnings:

  - Added the required column `course_id` to the `report` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "course" ADD COLUMN     "course_description" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "report" ADD COLUMN     "course_id" VARCHAR(16) NOT NULL,
ADD COLUMN     "prophet_id" VARCHAR(16);
