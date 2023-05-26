/*
  Warnings:

  - Added the required column `teamLogo` to the `Teams` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Teams" ADD COLUMN     "teamLogo" TEXT NOT NULL,
ADD COLUMN     "teamMembers" TEXT[];
