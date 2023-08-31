/*
  Warnings:

  - A unique constraint covering the columns `[userId,cardName]` on the table `creditCards` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "creditCards_userId_numberCard_key";

-- CreateIndex
CREATE UNIQUE INDEX "creditCards_userId_cardName_key" ON "creditCards"("userId", "cardName");
