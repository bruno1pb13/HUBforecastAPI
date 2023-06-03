/*
  Warnings:

  - Added the required column `title` to the `DisplayNewsFeed` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DisplayNewsFeed" ADD COLUMN     "title" TEXT NOT NULL;
