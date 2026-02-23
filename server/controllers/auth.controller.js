import * as authService from '../services/auth.service.js';

export const signup = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            const error = new Error('Name, email, and password are required');
            error.name = 'ValidationError';
            throw error;
        }

        const validRoles = ['MSME', 'LENDER'];
        const assignedRole = role && validRoles.includes(role.toUpperCase())
            ? role.toUpperCase()
            : 'MSME';

        const { user, token } = await authService.signup({ name, email, password, role: assignedRole });

        res.status(201).json({
            success: true,
            user,
            token,
            message: 'User created successfully',
        });
    } catch (error) {
        if (error.message === 'User already exists') {
            error.name = 'ValidationError';
        }
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            const error = new Error('Email and password are required');
            error.name = 'ValidationError';
            throw error;
        }

        const { user, token } = await authService.login(email, password);

        res.status(200).json({
            success: true,
            user,
            token,
            message: 'Logged in successfully',
        });
    } catch (error) {
        if (error.message === 'Invalid email or password') {
            error.name = 'UnauthorizedError';
        }
        next(error);
    }
};

export const getMe = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { PrismaClient } = await import('@prisma/client');
        const prisma = new PrismaClient();

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                kycStatus: true,
                riskScore: true,
                business_age: true,
                gstin: true,
                kyc: {
                    select: { gstNumber: true }
                }
            }
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Prefer gstin on user row; fall back to KYC record (covers pre-fix submissions)
        const { kyc, ...userFields } = user;
        const resolvedUser = {
            ...userFields,
            gstin: userFields.gstin || kyc?.gstNumber || null,
        };

        res.status(200).json({ success: true, user: resolvedUser });
    } catch (error) {
        next(error);
    }
};
