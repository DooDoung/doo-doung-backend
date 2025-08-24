-- CreateEnum
CREATE TYPE "public"."Sex" AS ENUM ('male', 'female', 'lgbtq_plus', 'undefined');

-- CreateEnum
CREATE TYPE "public"."HoroscopeSector" AS ENUM ('love', 'work', 'study', 'money', 'luck', 'family');

-- CreateEnum
CREATE TYPE "public"."BookingStatus" AS ENUM ('scheduled', 'completed', 'failed');

-- CreateEnum
CREATE TYPE "public"."TransactionStatus" AS ENUM ('processing', 'completed', 'failed');

-- CreateEnum
CREATE TYPE "public"."ReportType" AS ENUM ('course_issue', 'prophet_issue', 'payment_issue', 'website_issue', 'other');

-- CreateEnum
CREATE TYPE "public"."ReportStatus" AS ENUM ('pending', 'fixing', 'done');

-- CreateEnum
CREATE TYPE "public"."ZodiacSign" AS ENUM ('aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces');

-- CreateEnum
CREATE TYPE "public"."Bank" AS ENUM ('bbl', 'ktb', 'kbank', 'scb', 'bay', 'ttb', 'cimb', 'uob', 'gsb', 'baac');

-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('prophet', 'customer', 'admin');

-- CreateTable
CREATE TABLE "public"."account" (
    "id" VARCHAR(16) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "username" VARCHAR(30) NOT NULL,
    "password_hash" VARCHAR(72) NOT NULL,
    "role" "public"."Role" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_detail" (
    "id" SERIAL NOT NULL,
    "account_id" VARCHAR(16) NOT NULL,
    "name" VARCHAR(45) NOT NULL,
    "lastname" VARCHAR(45) NOT NULL,
    "profile_url" VARCHAR(255),
    "phone_number" VARCHAR(20) NOT NULL,
    "gender" "public"."Sex" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."customer" (
    "id" VARCHAR(16) NOT NULL,
    "account_id" VARCHAR(16) NOT NULL,
    "birth_date" DATE NOT NULL,
    "birth_time" TIME NOT NULL,
    "zodiac_sign" "public"."ZodiacSign" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."prophet" (
    "id" VARCHAR(16) NOT NULL,
    "account_id" VARCHAR(16) NOT NULL,
    "line_id" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prophet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."prophet_availability" (
    "id" SERIAL NOT NULL,
    "prophet_id" VARCHAR(16) NOT NULL,
    "date" DATE NOT NULL,
    "start_time" TIME NOT NULL,
    "end_time" TIME NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prophet_availability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."horoscope_method" (
    "id" SERIAL NOT NULL,
    "slug" VARCHAR(32) NOT NULL,
    "name" VARCHAR(64) NOT NULL,

    CONSTRAINT "horoscope_method_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."prophet_method" (
    "prophet_id" VARCHAR(16) NOT NULL,
    "method_id" INTEGER NOT NULL,

    CONSTRAINT "prophet_method_pkey" PRIMARY KEY ("prophet_id","method_id")
);

-- CreateTable
CREATE TABLE "public"."course" (
    "id" VARCHAR(16) NOT NULL,
    "prophet_id" VARCHAR(16) NOT NULL,
    "course_name" VARCHAR(100) NOT NULL,
    "horoscope_method_id" INTEGER NOT NULL,
    "horoscope_sector" "public"."HoroscopeSector" NOT NULL,
    "duration_min" INTEGER NOT NULL,
    "price" DECIMAL(7,2) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."booking" (
    "id" VARCHAR(16) NOT NULL,
    "customer_id" VARCHAR(16) NOT NULL,
    "course_id" VARCHAR(16) NOT NULL,
    "prophet_id" VARCHAR(16) NOT NULL,
    "start_datetime" TIMESTAMP(3) NOT NULL,
    "end_datetime" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "public"."BookingStatus" NOT NULL,

    CONSTRAINT "booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."transaction" (
    "id" VARCHAR(16) NOT NULL,
    "booking_id" VARCHAR(16) NOT NULL,
    "status" "public"."TransactionStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."transaction_account" (
    "id" VARCHAR(16) NOT NULL,
    "prophet_id" VARCHAR(16) NOT NULL,
    "account_name" VARCHAR(45) NOT NULL,
    "account_number" VARCHAR(20) NOT NULL,
    "bank" "public"."Bank" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transaction_account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."review" (
    "id" VARCHAR(16) NOT NULL,
    "customer_id" VARCHAR(16) NOT NULL,
    "booking_id" VARCHAR(16) NOT NULL,
    "score" INTEGER NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."admin" (
    "id" VARCHAR(16) NOT NULL,
    "account_id" VARCHAR(16) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."report" (
    "id" VARCHAR(16) NOT NULL,
    "customer_id" VARCHAR(16) NOT NULL,
    "admin_id" VARCHAR(16),
    "report_type" "public"."ReportType" NOT NULL,
    "topic" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "report_status" "public"."ReportStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "account_email_key" ON "public"."account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "account_username_key" ON "public"."account"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_detail_account_id_key" ON "public"."user_detail"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "customer_account_id_key" ON "public"."customer"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "prophet_account_id_key" ON "public"."prophet"("account_id");

-- CreateIndex
CREATE INDEX "prophet_availability_prophet_id_date_idx" ON "public"."prophet_availability"("prophet_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "prophet_availability_prophet_id_date_start_time_end_time_key" ON "public"."prophet_availability"("prophet_id", "date", "start_time", "end_time");

-- CreateIndex
CREATE UNIQUE INDEX "horoscope_method_slug_key" ON "public"."horoscope_method"("slug");

-- CreateIndex
CREATE INDEX "prophet_method_method_id_idx" ON "public"."prophet_method"("method_id");

-- CreateIndex
CREATE INDEX "course_prophet_id_idx" ON "public"."course"("prophet_id");

-- CreateIndex
CREATE INDEX "course_horoscope_method_id_idx" ON "public"."course"("horoscope_method_id");

-- CreateIndex
CREATE INDEX "booking_customer_id_idx" ON "public"."booking"("customer_id");

-- CreateIndex
CREATE INDEX "booking_prophet_id_start_datetime_end_datetime_status_idx" ON "public"."booking"("prophet_id", "start_datetime", "end_datetime", "status");

-- CreateIndex
CREATE UNIQUE INDEX "booking_prophet_id_start_datetime_end_datetime_key" ON "public"."booking"("prophet_id", "start_datetime", "end_datetime");

-- CreateIndex
CREATE UNIQUE INDEX "transaction_booking_id_key" ON "public"."transaction"("booking_id");

-- CreateIndex
CREATE INDEX "transaction_account_prophet_id_idx" ON "public"."transaction_account"("prophet_id");

-- CreateIndex
CREATE UNIQUE INDEX "transaction_account_prophet_id_bank_account_number_key" ON "public"."transaction_account"("prophet_id", "bank", "account_number");

-- CreateIndex
CREATE UNIQUE INDEX "review_booking_id_key" ON "public"."review"("booking_id");

-- CreateIndex
CREATE INDEX "review_booking_id_idx" ON "public"."review"("booking_id");

-- CreateIndex
CREATE UNIQUE INDEX "admin_account_id_key" ON "public"."admin"("account_id");

-- CreateIndex
CREATE INDEX "report_report_status_idx" ON "public"."report"("report_status");

-- CreateIndex
CREATE INDEX "report_report_type_idx" ON "public"."report"("report_type");

-- AddForeignKey
ALTER TABLE "public"."user_detail" ADD CONSTRAINT "user_detail_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."customer" ADD CONSTRAINT "customer_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."prophet" ADD CONSTRAINT "prophet_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."prophet_availability" ADD CONSTRAINT "prophet_availability_prophet_id_fkey" FOREIGN KEY ("prophet_id") REFERENCES "public"."prophet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."prophet_method" ADD CONSTRAINT "prophet_method_prophet_id_fkey" FOREIGN KEY ("prophet_id") REFERENCES "public"."prophet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."prophet_method" ADD CONSTRAINT "prophet_method_method_id_fkey" FOREIGN KEY ("method_id") REFERENCES "public"."horoscope_method"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."course" ADD CONSTRAINT "course_prophet_id_fkey" FOREIGN KEY ("prophet_id") REFERENCES "public"."prophet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."course" ADD CONSTRAINT "course_horoscope_method_id_fkey" FOREIGN KEY ("horoscope_method_id") REFERENCES "public"."horoscope_method"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."booking" ADD CONSTRAINT "booking_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."booking" ADD CONSTRAINT "booking_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."booking" ADD CONSTRAINT "booking_prophet_id_fkey" FOREIGN KEY ("prophet_id") REFERENCES "public"."prophet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transaction" ADD CONSTRAINT "transaction_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "public"."booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transaction_account" ADD CONSTRAINT "transaction_account_prophet_id_fkey" FOREIGN KEY ("prophet_id") REFERENCES "public"."prophet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."review" ADD CONSTRAINT "review_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."review" ADD CONSTRAINT "review_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "public"."booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."admin" ADD CONSTRAINT "admin_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."report" ADD CONSTRAINT "report_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."report" ADD CONSTRAINT "report_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "public"."admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
