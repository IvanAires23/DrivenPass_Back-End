-- CreateEnum
CREATE TYPE "CreditCardType" AS ENUM ('CREDIT', 'DEBIT', 'CREDITDEBIT');

-- CreateTable
CREATE TABLE "credentials" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "credentialName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "credentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "creditCards" (
    "id" SERIAL NOT NULL,
    "numberCard" TEXT NOT NULL,
    "nameUserCard" TEXT NOT NULL,
    "cvv" INTEGER NOT NULL,
    "expirationDate" TIMESTAMP(3) NOT NULL,
    "cardPassword" INTEGER NOT NULL,
    "isVirtual" BOOLEAN NOT NULL,
    "type" "CreditCardType" NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "creditCards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "securityNotes" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "noteName" TEXT NOT NULL,
    "note" TEXT NOT NULL,

    CONSTRAINT "securityNotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "credentials_userId_credentialName_key" ON "credentials"("userId", "credentialName");

-- CreateIndex
CREATE UNIQUE INDEX "creditCards_userId_numberCard_key" ON "creditCards"("userId", "numberCard");

-- CreateIndex
CREATE UNIQUE INDEX "securityNotes_userId_noteName_key" ON "securityNotes"("userId", "noteName");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "credentials" ADD CONSTRAINT "credentials_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "creditCards" ADD CONSTRAINT "creditCards_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "securityNotes" ADD CONSTRAINT "securityNotes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
