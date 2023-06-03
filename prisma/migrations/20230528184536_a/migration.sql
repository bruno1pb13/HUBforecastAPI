-- CreateTable
CREATE TABLE "DisplayNewsFeed" (
    "id" TEXT NOT NULL,
    "panelId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "icon" TEXT NOT NULL,

    CONSTRAINT "DisplayNewsFeed_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DisplayNewsFeed" ADD CONSTRAINT "DisplayNewsFeed_panelId_fkey" FOREIGN KEY ("panelId") REFERENCES "panels"("id") ON DELETE CASCADE ON UPDATE CASCADE;
