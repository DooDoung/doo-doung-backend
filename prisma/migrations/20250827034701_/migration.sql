/*
  Warnings:

  - The values [fixing] on the enum `ReportStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."ReportStatus_new" AS ENUM ('pending', 'done', 'discard');
ALTER TABLE "public"."report" ALTER COLUMN "report_status" TYPE "public"."ReportStatus_new" USING ("report_status"::text::"public"."ReportStatus_new");
ALTER TYPE "public"."ReportStatus" RENAME TO "ReportStatus_old";
ALTER TYPE "public"."ReportStatus_new" RENAME TO "ReportStatus";
DROP TYPE "public"."ReportStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "public"."customer" ADD COLUMN     "is_public" BOOLEAN NOT NULL DEFAULT true;
