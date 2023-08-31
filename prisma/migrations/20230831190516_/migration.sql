/*
  Warnings:

  - You are about to drop the column `cardName` on the `creditCards` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,title]` on the table `creditCards` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `title` to the `creditCards` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "creditCards_userId_cardName_key";

-- AlterTable
ALTER TABLE "creditCards" DROP COLUMN "cardName",
ADD COLUMN     "title" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "creditCards_userId_title_key" ON "creditCards"("userId", "title");
