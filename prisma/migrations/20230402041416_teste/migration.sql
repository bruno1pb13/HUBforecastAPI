/*
  Warnings:

  - A unique constraint covering the columns `[socketId]` on the table `indirectLogin` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "indirectLogin_socketId_key" ON "indirectLogin"("socketId");
