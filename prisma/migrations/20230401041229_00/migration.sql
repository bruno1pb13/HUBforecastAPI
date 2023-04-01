-- CreateTable
CREATE TABLE "connectedDevices" (
    "id" TEXT NOT NULL,
    "panelId" TEXT NOT NULL,
    "socketId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "connectedDevices_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "connectedDevices" ADD CONSTRAINT "connectedDevices_panelId_fkey" FOREIGN KEY ("panelId") REFERENCES "panels"("id") ON DELETE CASCADE ON UPDATE CASCADE;
