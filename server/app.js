import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import kycRoutes from './routes/kyc.routes.js';
import adminRoutes from './routes/admin.routes.js';
import featureRoutes from './routes/feature.routes.js';
import errorHandler from './middleware/error.middleware.js';
const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || '*', // Set CLIENT_URL in Render to your Vercel URL
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug Middleware to log request details
app.use((req, res, next) => {
    console.log(`\n[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Body:', req.body);
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/features', featureRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use(errorHandler);

export default app;
