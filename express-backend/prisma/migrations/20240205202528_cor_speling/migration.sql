/*
  Warnings:

  - You are about to drop the `Memebers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Oraganizatins` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Memebers" DROP CONSTRAINT "Memebers_authorId_fkey";

-- DropTable
DROP TABLE "Memebers";

-- DropTable
DROP TABLE "Oraganizatins";

-- CreateTable
CREATE TABLE "Organizations" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "Organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Members" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "Members_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Members" ADD CONSTRAINT "Members_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
