-- CreateTable
CREATE TABLE "Oraganizatins" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "Oraganizatins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Memebers" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,

    CONSTRAINT "Memebers_pkey" PRIMARY KEY ("id")
);
