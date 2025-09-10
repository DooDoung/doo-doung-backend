-- CreateTable
CREATE TABLE "public"."reset_password_token" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "account_id" VARCHAR(16) NOT NULL,

    CONSTRAINT "reset_password_token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reset_password_token_token_key" ON "public"."reset_password_token"("token");

-- AddForeignKey
ALTER TABLE "public"."reset_password_token" ADD CONSTRAINT "reset_password_token_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
