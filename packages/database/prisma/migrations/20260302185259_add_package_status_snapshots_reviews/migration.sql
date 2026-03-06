/*
  Warnings:

  - Added the required column `price_at_time` to the `package_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_name_ar_at_time` to the `package_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_name_en_at_time` to the `package_items` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PackageStatus" AS ENUM ('ACTIVE', 'PAUSED');

-- AlterTable
ALTER TABLE "package_items" ADD COLUMN     "price_at_time" DECIMAL(10,3) NOT NULL,
ADD COLUMN     "product_name_ar_at_time" TEXT NOT NULL,
ADD COLUMN     "product_name_en_at_time" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "packages" ADD COLUMN     "status" "PackageStatus" NOT NULL DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "body" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "reviews_product_id_idx" ON "reviews"("product_id");

-- CreateIndex
CREATE INDEX "reviews_user_id_idx" ON "reviews"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_product_id_user_id_key" ON "reviews"("product_id", "user_id");

-- CreateIndex
CREATE INDEX "packages_status_idx" ON "packages"("status");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
