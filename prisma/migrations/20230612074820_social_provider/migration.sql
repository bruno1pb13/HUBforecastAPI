/*
  Warnings:

  - You are about to drop the column `socialPlatform` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SocialProvider" AS ENUM ('GOOGLE', 'GITHUB');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "socialPlatform",
ADD COLUMN     "socialProvider" "SocialProvider";
