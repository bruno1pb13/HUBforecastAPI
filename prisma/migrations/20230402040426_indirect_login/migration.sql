-- CreateTable
CREATE TABLE "indirectLogin" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "socketId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "indirectLogin_pkey" PRIMARY KEY ("id")
);
