import { PrismaClient, RiskLevel } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Calculates credit score for an invoice and saves it to the database.
 * 
 * Logic:
 * - Start with base 100
 * - Deduct: fraudScore * 0.4
 * - Deduct: businessAge < 1 year (-15)
 * - Deduct: invoiceAmount > 20L (-10)
 * - Deduct: user has > 2 flagged invoices (-20)
 * - Bonus: businessAge > 3 years (+10)
 * - Bonus: previous invoices settled > 5 (+5)
 * 
 * Risk Levels:
 * - 80-100 : LOW
 * - 50-79 : MEDIUM
 * - < 50 : HIGH
 * 
 * @param {Object} params
 * @param {string} params.invoiceId - The unique ID of the invoice
 * @param {number} params.amount - The invoice amount
 * @param {number} params.businessAge - The user's business age in months
 * @param {number} params.fraudRiskScore - The calculated fraud risk score (0-100)
 * @param {string} params.userId - User ID for history checks
 * @returns {Promise<{ score: number, riskLevel: RiskLevel }>}
 */
export const calculateCreditScore = async ({ invoiceId, amount, businessAge, fraudRiskScore, userId }) => {
    try {
        let score = 100;

        // --- Deductions ---

        // 1. Fraud Score Impact
        // Deduct fraudScore * 0.4
        score -= (fraudRiskScore * 0.4);

        // 2. Business Age Penalty (< 1 year)
        if (businessAge < 12) {
            score -= 15;
        }

        // 3. High Value Invoice Penalty (> 20L)
        // 20L = 2,000,000
        if (amount > 2000000) {
            score -= 10;
        }

        // 4. Flagged Invoice History
        // if user has more than 2 flagged invoices -> -20
        const flaggedCount = await prisma.fraudFlag.count({
            where: { userId: userId }
        });

        if (flaggedCount > 2) {
            score -= 20;
        }


        // --- Bonuses ---

        // 1. Established Business Bonus (> 3 years)
        if (businessAge > 36) {
            score += 10;
        }

        // 2. Successful Settlement History
        // +5 if previous invoices settled successfully > 5
        const settledCount = await prisma.invoice.count({
            where: {
                user_id: userId,
                status: 'SETTLED'
            }
        });

        if (settledCount > 5) {
            score += 5;
        }

        // --- Finalize ---

        // Clamp score 0-100
        score = Math.round(Math.max(0, Math.min(100, score)));

        // Determine Risk Level
        let riskLevel;
        if (score >= 80) {
            riskLevel = RiskLevel.LOW;
        } else if (score >= 50) {
            riskLevel = RiskLevel.MEDIUM;
        } else {
            riskLevel = RiskLevel.HIGH;
        }

        // Save result to CreditScore table
        // Use upsert to handle potential re-runs safely, though create is standard for new invoice
        await prisma.creditScore.upsert({
            where: { invoice_id: invoiceId },
            update: {
                score: score,
                risk_level: riskLevel,
            },
            create: {
                invoice_id: invoiceId,
                score: score,
                risk_level: riskLevel,
            }
        });

        return {
            score,
            riskLevel
        };

    } catch (error) {
        console.error("Credit Score Calculation Error:", error);
        throw new Error(`Failed to calculate credit score: ${error.message}`);
    }
};
