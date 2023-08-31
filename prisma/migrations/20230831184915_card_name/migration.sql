/*
  Warnings:

  - You are about to drop the column `nameUserCard` on the `creditCards` table. All the data in the column will be lost.
  - Added the required column `cardName` to the `creditCards` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameOnCard` to the `creditCards` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "creditCards" DROP COLUMN "nameUserCard",
ADD COLUMN     "cardName" TEXT NOT NULL,
ADD COLUMN     "nameOnCard" TEXT NOT NULL;
