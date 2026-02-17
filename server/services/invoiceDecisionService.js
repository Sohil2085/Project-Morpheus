import { InvoiceStatus, RiskLevel } from '@prisma/client';

/**
 * Determines the final status of the invoice based on fraud and credit scores.
 * 
 * Logic:
 * - If fraudScore >= 80 -> REVIEW
 * - If creditScore < 40 -> REVIEW
 * - Else -> VERIFIED
 * 
 * @param {Object} params
 * @param {number} params.fraudScore
 * @param {number} params.creditScore
 * @returns {InvoiceStatus}
 */
export const determineInvoiceStatus = ({ fraudScore, creditScore }) => {
    if (fraudScore >= 80) {
        return 'PENDING'; // Using PENDING as 'REVIEW' since Schema only has PENDING, VERIFIED, FUNDED, SETTLED. 
        // Or we might need to assume PENDING acts as Review. 
        // User requested "REVIEW" status but Schema enum is PENDING | VERIFIED | FUNDED | SETTLED.
        // I will check if I can map REVIEW to PENDING or if I should assume VERIFIED is the goal.
        // WAIT: The prompt says "If fraudScore >= 80 -> status = REVIEW".
        // Schema Enum: PENDING, VERIFIED, FUNDED, SETTLED.
        // I cannot add a new Enum value easily without migration.
        // Ideally I should stick to schema.
        // Proposal: PENDING = Review/Initial State. VERIFIED = Approved.
        // So if check fails, stay PENDING (or maybe we need a REJECTED? but schema doesn't have it).
        // Let's stick to PENDING for 'REVIEW' cases, and VERIFIED for success.

        // Actually, user explicitly asked for logic: "If fraudScore >= 80 -> status = REVIEW".
        // If I strictly follow instructions, I should probably return a string 'REVIEW' 
        // but the controller needs to save it to DB which expects Enum.
        // I'll stick to 'PENDING' for the database persistence if it fails checks, 
        // effectively meaning it needs manual review.
    }

    if (creditScore < 40) {
        return 'PENDING';
    }

    return 'VERIFIED';
};

/**
 * Calculates the maximum funding eligibility percent based on risk level.
 * 
 * Rules:
 * - LOW: 85%
 * - MEDIUM: 70%
 * - HIGH: 50%
 * 
 * @param {RiskLevel} riskLevel
 * @returns {number} - Percentage (e.g., 85)
 */
export const calculateMaxFundingStats = (riskLevel) => {
    switch (riskLevel) {
        case RiskLevel.LOW:
            return 85;
        case RiskLevel.MEDIUM:
            return 70;
        case RiskLevel.HIGH:
            return 50;
        default:
            return 50; // Fallback
    }
};
