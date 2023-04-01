/*
  Warnings:

  - A unique constraint covering the columns `[socketId]` on the table `connectedDevices` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "connectedDevices_socketId_key" ON "connectedDevices"("socketId");
