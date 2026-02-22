import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getPendingKyc = async (req, res, next) => {
    try {
        const pendingKycList = await prisma.kYC.findMany({
            where: { status: 'IN_PROGRESS' },
            include: {
                user: {
                    select: { id: true, name: true, email: true, riskScore: true }
                }
            }
        });

        res.status(200).json({
            success: true,
            message: 'Pending KYC requests fetched successfully',
            data: pendingKycList
        });
    } catch (error) {
        next(error);
    }
};

export const approveKyc = async (req, res, next) => {
    try {
        const kycId = req.params.id;

        const result = await prisma.$transaction(async (tx) => {
            const kyc = await tx.kYC.update({
                where: { id: kycId },
                data: {
                    status: 'VERIFIED',
                    reviewedAt: new Date()
                }
            });

            await tx.user.update({
                where: { id: kyc.userId },
                data: { kycStatus: 'VERIFIED' }
            });

            return kyc;
        });

        res.status(200).json({
            success: true,
            message: 'KYC Approved Successfully',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const rejectKyc = async (req, res, next) => {
    try {
        const kycId = req.params.id;
        const { adminRemark } = req.body;

        if (!adminRemark) {
            const error = new Error('Admin remark is required for rejection');
            error.name = 'ValidationError';
            throw error;
        }

        const result = await prisma.$transaction(async (tx) => {
            const kyc = await tx.kYC.update({
                where: { id: kycId },
                data: {
                    status: 'REJECTED',
                    adminRemark,
                    reviewedAt: new Date()
                }
            });

            await tx.user.update({
                where: { id: kyc.userId },
                data: { kycStatus: 'REJECTED' }
            });

            return kyc;
        });

        res.status(200).json({
            success: true,
            message: 'KYC Rejected Successfully',
            data: result
        });
    } catch (error) {
        next(error);
    }
};
