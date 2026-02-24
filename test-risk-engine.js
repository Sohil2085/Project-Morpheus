import { calculateCreditScore } from './server/services/creditScoreService.js';
import { calculateFraudScore } from './server/services/fraudDetectionService.js';

console.log("=========================================");
console.log("   FINBRIDGE RISK ENGINE TEST SCRIPT     ");
console.log("=========================================\n");

// --- TEST 1: IDEAL SCENARIO (Low Risk) ---
console.log("--- TEST 1: IDEAL LOW RISK MSME ---");
const test1Credit = calculateCreditScore({
    businessAge: 6,           // > 5 yrs (+25)
    annualTurnover: 20000000, // 2Cr (> 1Cr) (+30)
    gstVerified: true,        // Verified
    gstActiveYears: 6,        // >= 1 active (+15)
    invoiceAmount: 500000     // 5L / 2Cr = 2.5% (< 5%) (+30)
});
// Total Expected: 25 + 30 + 15 + 30 = 100

const test1Fraud = calculateFraudScore({
    invoiceAmount: 500000,
    annualTurnover: 20000000, // Ratio: 2.5% (+0)
    businessAge: 6,
    last6Invoices: [400000, 500000, 450000, 480000, 520000, 500000], // Avg ~4.75L (Spike 1.05x -> +0)
    invoiceHistory: [
        { amount: 500000 },
        { amount: 480000 },
        { amount: 450000 }
    ], // Not all round pattern (+5 maybe if 10000 divides nicely)
    hasDuplicate: false       // (+0)
});
// Total Expected Fraud: 0 (Ratio) + 0 (Spike) + 0 (Age Mismatch) + 5 (Round: 5L % 10k == 0) + 0 (Dup) = 5

console.log("CREDIT:", test1Credit.score);
console.log("FRAUD:", test1Fraud.score);
console.log("PROBABILITY:", test1Fraud.probability);
console.log("FINAL ADJUSTED:", Math.round(test1Credit.score * (1 - test1Fraud.probability)));
console.log("\n");

// --- TEST 2: HIGH FRAUD RISK, NEW BUSINESS ---
console.log("--- TEST 2: FRAUDULENT SPIKE, NEW BUSINESS ---");
const test2Credit = calculateCreditScore({
    businessAge: 0.5,         // < 1 yr (+5)
    annualTurnover: 800000,   // 8L (< 10L) (+5)
    gstVerified: true,
    gstActiveYears: 0.5,      // < 1 active (+10)
    invoiceAmount: 400000     // 4L / 8L = 50% (> 30%) (+5)
});
// Total Expected: 5 + 5 + 10 + 5 = 25

const test2Fraud = calculateFraudScore({
    invoiceAmount: 400000,
    annualTurnover: 800000,   // Ratio: 50% (+30)
    businessAge: 0.5,         // Safe limit: 0.5 * 10L = 5L. 4L < 5L (+0)
    last6Invoices: [20000, 30000, 15000, 25000, 20000, 30000], // Avg ~23k (Spike > 17x -> +20)
    invoiceHistory: [
        { amount: 20000 },
        { amount: 30000 },
        { amount: 10000 }
    ], // All multiples of 10000. History count = 3. Multiple instance -> +15
    hasDuplicate: true        // (+15)
});
// Total Expected Fraud: 30 (Ratio) + 20 (Spike) + 15 (Round pattern) + 0 (Mismatch) + 15 (Dup) = 80!

console.log("CREDIT:", test2Credit.score);
console.log("FRAUD:", test2Fraud.score);
console.log("PROBABILITY:", test2Fraud.probability);
console.log("FINAL ADJUSTED:", Math.round(test2Credit.score * (1 - test2Fraud.probability)));
console.log("FRAUD BREAKDOWN:", test2Fraud.breakdown);
console.log("\n");
