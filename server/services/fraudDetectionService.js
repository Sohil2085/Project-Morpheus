import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Detects fraud risk based on transaction details and history.
 * 
 * @param {Object} params
 * @param {number} params.amount - Invoice amount
 * @param {number} params.businessAge - User business age in months
 * @param {string} params.buyerGSTIN - Buyer's GSTIN
 * @param {string} params.userId - User ID
 * @param {string} params.invoiceId - Invoice ID (optional, for logging)
 * @returns {Promise<{ flagged: boolean, riskScore: number, reasonString: string, reasons: string[] }>}
 */
export const detectFraud = async ({ amount, businessAge, buyerGSTIN, userId, invoiceId }) => {
    try {
        let riskScore = 0;
        let reasons = [];

        // --- 1. Invoice Amount Risk ---
        // < 1L -> +5
        // 1L–5L -> +20
        // 5L–20L -> +50
        // >20L -> +80
        if (amount < 100000) {
            riskScore += 5;
            reasons.push("Small Invoice Amount (+5)");
        } else if (amount >= 100000 && amount < 500000) {
            riskScore += 20;
            reasons.push("Moderate Invoice Amount (+20)");
        } else if (amount >= 500000 && amount < 2000000) {
            riskScore += 50;
            reasons.push("High Invoice Amount (+50)");
        } else {
            riskScore += 80;
            reasons.push("Critical Invoice Amount (+80)");
        }

        // --- 2. Business Age Risk ---
        // < 6 months -> +25
        // 6–12 months -> +15
        // > 1 year -> +0
        if (businessAge < 6) {
            riskScore += 25;
            reasons.push("New Business Risk (< 6 months) (+25)");
        } else if (businessAge >= 6 && businessAge < 12) {
            riskScore += 15;
            reasons.push("Young Business Risk (6-12 months) (+15)");
        }

        // --- 3. Buyer GST Frequency Risk ---
        // Same buyer GST > 3 times in last 30 days -> +10
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const buyerFrequency = await prisma.invoice.count({
            where: {
                user_id: userId,
                buyer_gstin: buyerGSTIN,
                created_at: {
                    gte: thirtyDaysAgo
                }
            }
        });

        // check > 3 (excluding current if it was already inserted? Controller inserts first usually? 
        // The requirements say "when uploading", usually implies before or during. 
        // If controller creates invoice first, count will include current one. 
        // Requirement: > 3 times. If current is 4th, it matches. 
        // Let's assume we are checking history. If 4 exist including current, that's > 3 if we count this one as part of the pattern.
        // Actually, safer to check count. If > 3, add risk.
        if (buyerFrequency > 3) {
            riskScore += 10;
            reasons.push("Frequent Buyer Interactions (>3 in 30 days) (+10)");
        }

        // --- 4. Invoice Frequency Risk ---
        // More than 10 invoices uploaded in 1 week -> +15
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const weeklyInvoiceCount = await prisma.invoice.count({
            where: {
                user_id: userId,
                created_at: {
                    gte: oneWeekAgo
                }
            }
        });

        if (weeklyInvoiceCount > 10) {
            riskScore += 15;
            reasons.push("High Upload Volume (>10 in 7 days) (+15)");
        }

        // Cap score at 100
        riskScore = Math.min(riskScore, 100);

        // Determine flagged status (flagged if fraudScore >= 70)
        const flagged = riskScore >= 70;

        const reasonString = reasons.length > 0 ? reasons.join(", ") : "Low Risk";

        // If flagged, save to FraudFlag table
        if (flagged) {
            await prisma.fraudFlag.create({
                data: {
                    userId: userId,
                    reason: reasonString,
                    riskScore: riskScore,
                    invoiceId: invoiceId || null
                }
            });
        }

        return {
            flagged,
            riskScore, // returning as riskScore to match controller expectation
            reasons,
            reasonString
        };

    } catch (error) {
        console.error("Fraud detection error:", error);
        // Default to high risk on error to be safe, or throw
        throw new Error(`Fraud detection failed: ${error.message}`);
    }
};
