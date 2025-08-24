/*
  Warnings:

  - The primary key for the `Account` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `account_id` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Account` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password_hash` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Sex" AS ENUM ('Male', 'Female', 'LGBTQ_Plus', 'Undefined');

-- CreateEnum
CREATE TYPE "public"."HoroscopeSector" AS ENUM ('love', 'work', 'study', 'money', 'luck', 'family');

-- CreateEnum
CREATE TYPE "public"."BookingStatus" AS ENUM ('SCHEDULED', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "public"."TransactionStatus" AS ENUM ('PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "public"."ReportType" AS ENUM ('Course_issue', 'Prophet_issue', 'Payment_issue', 'Website_issue', 'Other');

-- CreateEnum
CREATE TYPE "public"."ReportStatus" AS ENUM ('PENDING', 'FIXING', 'DONE');

-- CreateEnum
CREATE TYPE "public"."ZodiacSign" AS ENUM ('aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces');

-- CreateEnum
CREATE TYPE "public"."Bank" AS ENUM ('BBL', 'KTB', 'KBANK', 'SCB', 'BAY', 'TTB', 'CIMB', 'UOB', 'GSB', 'BAAC');

-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('prophet', 'customer', 'admin');

-- AlterTable
ALTER TABLE "public"."Account" DROP CONSTRAINT "Account_pkey",
DROP COLUMN "account_id",
DROP COLUMN "password",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" VARCHAR(100) NOT NULL,
ADD COLUMN     "id" VARCHAR(16) NOT NULL,
ADD COLUMN     "password_hash" VARCHAR(72) NOT NULL,
ADD COLUMN     "role" "public"."Role" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "username" SET DATA TYPE VARCHAR(30),
ADD CONSTRAINT "Account_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "public"."UserDetail" (
    "id" SERIAL NOT NULL,
    "accountId" VARCHAR(16) NOT NULL,
    "name" VARCHAR(45) NOT NULL,
    "lastname" VARCHAR(45) NOT NULL,
    "profile_url" TEXT,
    "phone_number" VARCHAR(20) NOT NULL,
    "gender" "public"."Sex" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Customer" (
    "id" VARCHAR(16) NOT NULL,
    "accountId" VARCHAR(16) NOT NULL,
    "birth_date" DATE NOT NULL,
    "birth_time" TIME NOT NULL,
    "zodiacSign" "public"."ZodiacSign" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Prophet" (
    "id" VARCHAR(16) NOT NULL,
    "accountId" VARCHAR(16) NOT NULL,
    "line_id" VARCHAR(20) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prophet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProphetAvailability" (
    "id" SERIAL NOT NULL,
    "prophetId" VARCHAR(16) NOT NULL,
    "date" DATE NOT NULL,
    "start_time" TIME NOT NULL,
    "end_time" TIME NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProphetAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."HoroscopeMethod" (
    "id" SERIAL NOT NULL,
    "slug" VARCHAR(32) NOT NULL,
    "name" VARCHAR(64) NOT NULL,

    CONSTRAINT "HoroscopeMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProphetMethod" (
    "prophetId" VARCHAR(16) NOT NULL,
    "methodId" INTEGER NOT NULL,

    CONSTRAINT "ProphetMethod_pkey" PRIMARY KEY ("prophetId","methodId")
);

-- CreateTable
CREATE TABLE "public"."Course" (
    "id" VARCHAR(16) NOT NULL,
    "prophetId" VARCHAR(16) NOT NULL,
    "course_name" VARCHAR(100) NOT NULL,
    "horoscope_method_id" INTEGER NOT NULL,
    "horoscopeSector" "public"."HoroscopeSector" NOT NULL,
    "duration_min" INTEGER NOT NULL,
    "price" DECIMAL(7,2) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Booking" (
    "id" VARCHAR(16) NOT NULL,
    "customerId" VARCHAR(16) NOT NULL,
    "courseId" VARCHAR(16) NOT NULL,
    "start_datetime" TIMESTAMP(3) NOT NULL,
    "end_datetime" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "public"."BookingStatus" NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Transaction" (
    "id" VARCHAR(16) NOT NULL,
    "bookingId" VARCHAR(16) NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "public"."TransactionStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TransactionAccount" (
    "id" VARCHAR(16) NOT NULL,
    "prophetId" VARCHAR(16) NOT NULL,
    "account_name" VARCHAR(45) NOT NULL,
    "account_number" VARCHAR(20) NOT NULL,
    "bank" "public"."Bank" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransactionAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Review" (
    "id" VARCHAR(16) NOT NULL,
    "customerId" VARCHAR(16) NOT NULL,
    "bookingId" VARCHAR(16) NOT NULL,
    "score" INTEGER NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "courseId" VARCHAR(16),

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Admin" (
    "id" VARCHAR(16) NOT NULL,
    "accountId" VARCHAR(16) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Report" (
    "id" VARCHAR(16) NOT NULL,
    "customerId" VARCHAR(16) NOT NULL,
    "adminId" VARCHAR(16),
    "reportType" "public"."ReportType" NOT NULL,
    "topic" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "reportStatus" "public"."ReportStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserDetail_accountId_key" ON "public"."UserDetail"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_accountId_key" ON "public"."Customer"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "Prophet_accountId_key" ON "public"."Prophet"("accountId");

-- CreateIndex
CREATE INDEX "ProphetAvailability_prophetId_date_idx" ON "public"."ProphetAvailability"("prophetId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "HoroscopeMethod_slug_key" ON "public"."HoroscopeMethod"("slug");

-- CreateIndex
CREATE INDEX "ProphetMethod_methodId_idx" ON "public"."ProphetMethod"("methodId");

-- CreateIndex
CREATE INDEX "Course_prophetId_idx" ON "public"."Course"("prophetId");

-- CreateIndex
CREATE INDEX "Course_horoscope_method_id_idx" ON "public"."Course"("horoscope_method_id");

-- CreateIndex
CREATE INDEX "Course_is_active_idx" ON "public"."Course"("is_active");

-- CreateIndex
CREATE INDEX "Booking_customerId_idx" ON "public"."Booking"("customerId");

-- CreateIndex
CREATE INDEX "Booking_courseId_idx" ON "public"."Booking"("courseId");

-- CreateIndex
CREATE INDEX "Booking_status_idx" ON "public"."Booking"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_bookingId_key" ON "public"."Transaction"("bookingId");

-- CreateIndex
CREATE INDEX "TransactionAccount_prophetId_idx" ON "public"."TransactionAccount"("prophetId");

-- CreateIndex
CREATE UNIQUE INDEX "TransactionAccount_prophetId_bank_account_number_key" ON "public"."TransactionAccount"("prophetId", "bank", "account_number");

-- CreateIndex
CREATE INDEX "Review_bookingId_idx" ON "public"."Review"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_customerId_bookingId_key" ON "public"."Review"("customerId", "bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_accountId_key" ON "public"."Admin"("accountId");

-- CreateIndex
CREATE INDEX "Report_reportStatus_idx" ON "public"."Report"("reportStatus");

-- CreateIndex
CREATE INDEX "Report_reportType_idx" ON "public"."Report"("reportType");

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "public"."Account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_username_key" ON "public"."Account"("username");

-- AddForeignKey
ALTER TABLE "public"."UserDetail" ADD CONSTRAINT "UserDetail_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Customer" ADD CONSTRAINT "Customer_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Prophet" ADD CONSTRAINT "Prophet_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProphetAvailability" ADD CONSTRAINT "ProphetAvailability_prophetId_fkey" FOREIGN KEY ("prophetId") REFERENCES "public"."Prophet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProphetMethod" ADD CONSTRAINT "ProphetMethod_prophetId_fkey" FOREIGN KEY ("prophetId") REFERENCES "public"."Prophet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProphetMethod" ADD CONSTRAINT "ProphetMethod_methodId_fkey" FOREIGN KEY ("methodId") REFERENCES "public"."HoroscopeMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Course" ADD CONSTRAINT "Course_prophetId_fkey" FOREIGN KEY ("prophetId") REFERENCES "public"."Prophet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Course" ADD CONSTRAINT "Course_horoscope_method_id_fkey" FOREIGN KEY ("horoscope_method_id") REFERENCES "public"."HoroscopeMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "public"."Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TransactionAccount" ADD CONSTRAINT "TransactionAccount_prophetId_fkey" FOREIGN KEY ("prophetId") REFERENCES "public"."Prophet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "public"."Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Admin" ADD CONSTRAINT "Admin_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Report" ADD CONSTRAINT "Report_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Report" ADD CONSTRAINT "Report_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "public"."Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
