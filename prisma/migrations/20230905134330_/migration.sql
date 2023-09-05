/*
  Warnings:

  - You are about to drop the column `cardPassword` on the `creditCards` table. All the data in the column will be lost.
  - You are about to drop the column `numberCard` on the `creditCards` table. All the data in the column will be lost.
  - You are about to drop the `sessions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `number` to the `creditCards` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `creditCards` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_userId_fkey";

-- AlterTable
ALTER TABLE "creditCards" DROP COLUMN "cardPassword",
DROP COLUMN "numberCard",
ADD COLUMN     "number" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL;

-- DropTable
DROP TABLE "sessions";

-- DropEnum
DROP TYPE "CreditCardType";
