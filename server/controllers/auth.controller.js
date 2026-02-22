import * as authService from '../services/auth.service.js';

export const signup = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            const error = new Error('Name, email, and password are required');
            error.name = 'ValidationError';
            throw error;
        }

        const { user, token } = await authService.signup({ name, email, password });

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
