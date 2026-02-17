/*
  Warnings:

  - You are about to drop the `FraudFlag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FraudFlag" DROP CONSTRAINT "FraudFlag_invoiceId_fkey";

-- DropTable
DROP TABLE "FraudFlag";

-- CreateTable
CREATE TABLE "fraud_flags" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT,
    "userId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "riskScore" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fraud_flags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "fraud_flags_userId_idx" ON "fraud_flags"("userId");

-- CreateIndex
CREATE INDEX "fraud_flags_invoiceId_idx" ON "fraud_flags"("invoiceId");

-- AddForeignKey
ALTER TABLE "fraud_flags" ADD CONSTRAINT "fraud_flags_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fraud_flags" ADD CONSTRAINT "fraud_flags_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
