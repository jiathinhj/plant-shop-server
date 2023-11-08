/*
  Warnings:

  - Added the required column `pictureId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pictureUrl` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "pictureId" TEXT NOT NULL,
ADD COLUMN     "pictureUrl" TEXT NOT NULL;
