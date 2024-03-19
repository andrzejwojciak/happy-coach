/*
  Warnings:

  - Made the column `isAdmin` on table `User` required. This step will fail if there are existing NULL values in that column.

*/

UPDATE "User" SET "isAdmin" = false WHERE "isAdmin" IS NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "display_name" TEXT,
ADD COLUMN     "image_24" TEXT,
ADD COLUMN     "image_32" TEXT,
ADD COLUMN     "image_48" TEXT,
ADD COLUMN     "image_72" TEXT,
ALTER COLUMN "isAdmin" SET NOT NULL,
ALTER COLUMN "isAdmin" SET DEFAULT false;
