/*
  Warnings:

  - You are about to drop the column `iconUrl` on the `Tool` table. All the data in the column will be lost.
  - Added the required column `imageUrl` to the `Tool` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tool" DROP COLUMN "iconUrl",
ADD COLUMN     "imageUrl" TEXT NOT NULL;
