-- AlterTable
ALTER TABLE "booking" ALTER COLUMN "status" SET DEFAULT 'scheduled';

-- AlterTable
ALTER TABLE "transaction" ALTER COLUMN "status" SET DEFAULT 'pending_payout';
