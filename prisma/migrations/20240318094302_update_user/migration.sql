/*
  Warnings:

  - The `firstLoginDate` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `lastLoginDate` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dataFetched" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "firstLoginDate",
ADD COLUMN     "firstLoginDate" TIMESTAMP(3),
DROP COLUMN "lastLoginDate",
ADD COLUMN     "lastLoginDate" TIMESTAMP(3);
