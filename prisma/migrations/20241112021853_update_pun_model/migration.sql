/*
  Warnings:

  - You are about to drop the `EmailSubmission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Submission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `puns` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "EmailSubmission";

-- DropTable
DROP TABLE "Submission";

-- DropTable
DROP TABLE "puns";

-- CreateTable
CREATE TABLE "Pun" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "upVotes" INTEGER NOT NULL DEFAULT 0,
    "downVotes" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Pun_pkey" PRIMARY KEY ("id")
);
