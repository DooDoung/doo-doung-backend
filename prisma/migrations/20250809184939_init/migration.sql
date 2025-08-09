-- CreateTable
CREATE TABLE "public"."Account" (
    "account_id" VARCHAR(16) NOT NULL,
    "username" VARCHAR(16) NOT NULL,
    "password" VARCHAR(45) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("account_id")
);
