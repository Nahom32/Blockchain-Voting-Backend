/*
  Warnings:

  - Added the required column `authorId` to the `Memebers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Memebers" ADD COLUMN     "authorId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Memebers" ADD CONSTRAINT "Memebers_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Oraganizatins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
