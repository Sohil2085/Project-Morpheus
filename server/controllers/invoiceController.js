import { PrismaClient } from '@prisma/client';
import { validateInvoice } from '../validators/invoiceValidator.js';
import { detectFraud } from '../services/fraudDetectionService.js';
import { calculateCreditScore } from '../services/creditScoreService.js';
import { determineInvoiceStatus, calculateMaxFundingStats } from '../services/invoiceDecisionService.js';

const prisma = new PrismaClient();

/**
 * Create a new invoice with fraud detection and credit scoring
 */
export const createInvoice = async (req, res) => {
    try {
        // 1. Validate request body
        const validation = validateInvoice(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: 'Validation Error', details: validation.errors });
        }

        const { amount, dueDate, buyerGSTIN } = validation.data;
        const userId = req.user.id;
        const userRole = req.user.role;

        // 2. Ensure user role is MSME
        if (userRole !== 'MSME') {
            return res.status(403).json({ error: 'Access Denied', message: 'Only MSME users can create invoices' });
        }

        // Get user's business age and KYC status for services
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { business_age: true, kycStatus: true }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.kycStatus !== 'VERIFIED') {
            return res.status(403).json({ error: 'Access Denied', message: 'You must complete and verify your KYC before creating invoices' });
        }

        // Use business age directly from schema
        let businessAge = user.business_age || 0;

        // 3. Create invoice with initial status PENDING
        // We create it first to have an ID for linking flags/scores
        // We will update its status after running checks
        const invoice = await prisma.invoice.create({
            data: {
                user_id: userId,
                amount,
                due_date: dueDate,
                buyer_gstin: buyerGSTIN,
                status: 'PENDING',
            }
        });

        // 4. Run Fraud Detection Service
        const fraudResult = await detectFraud({
            amount,
            businessAge,
            buyerGSTIN,
            userId,
            invoiceId: invoice.id
        });

        // 5. Run Credit Score Service
        const creditResult = await calculateCreditScore({
            invoiceId: invoice.id,
            amount,
            businessAge,
            fraudRiskScore: fraudResult.riskScore,
            userId: userId
        });

        // 6. Decide Final Status & Eligibility
        const decidedStatus = determineInvoiceStatus({
            fraudScore: fraudResult.riskScore,
            creditScore: creditResult.score
        });

        const maxFundingPercent = calculateMaxFundingStats(creditResult.riskLevel);

        // 7. Update Invoice with final decision
        const updatedInvoice = await prisma.invoice.update({
            where: { id: invoice.id },
            data: {
                status: decidedStatus,
            },
            include: {
                credit_score: true,
                fraud_flags: true
            }
        });

        // 8. Return structured response
        // 8. Return structured response
        // IMPORTANT: Frontend expects 'invoice' object in response
        res.status(201).json({
            message: 'Invoice processed successfully',
            invoice: {
                ...updatedInvoice,
                fraudScore: fraudResult.riskScore,
                creditScore: creditResult.score,
                riskLevel: creditResult.riskLevel
            },
            // Keep top-level fields for easy debugging/logging if needed
            invoiceId: updatedInvoice.id,
            fraudScore: fraudResult.riskScore,
            creditScore: creditResult.score,
            riskLevel: creditResult.riskLevel,
            status: decidedStatus,
            maxFundingPercent: maxFundingPercent,
            details: {
                flagged: fraudResult.flagged,
                reasons: fraudResult.reasons
            }
        });

    } catch (error) {
        console.error("Create Invoice Error:", error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
};

/**
 * Get all invoices for the logged-in user
 */
export const getMyInvoices = async (req, res) => {
    try {
        const userId = req.user.id;

        const invoices = await prisma.invoice.findMany({
            where: { user_id: userId },
            include: {
                credit_score: true,
                transactions: true,
                // b/c fraud_flags relation is optional
                fraud_flags: true
            },
            orderBy: { created_at: 'desc' }
        });

        res.json(invoices);
    } catch (error) {
        console.error("Get My Invoices Error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/**
 * Get a single invoice by ID
 */
export const getInvoiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const invoice = await prisma.invoice.findUnique({
            where: { id },
            include: {
                credit_score: true,
                transactions: true,
                fraud_flags: true,
                bids: true
            }
        });

        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        // Ensure user owns the invoice (or is Admin - logic depends on requirements)
        if (invoice.user_id !== userId && req.user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Access Denied' });
        }

        res.json(invoice);
    } catch (error) {
        console.error("Get Invoice By ID Error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
