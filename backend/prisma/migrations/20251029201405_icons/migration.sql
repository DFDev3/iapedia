/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Tool` table. All the data in the column will be lost.
  - Added the required column `iconUrl` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Category` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `iconUrl` to the `Tool` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "bannerUrl" TEXT,
ADD COLUMN     "iconUrl" TEXT NOT NULL,
ALTER COLUMN "description" SET NOT NULL;

-- AlterTable
ALTER TABLE "Tool" DROP COLUMN "imageUrl",
ADD COLUMN     "bannerUrl" TEXT,
ADD COLUMN     "iconUrl" TEXT NOT NULL;
