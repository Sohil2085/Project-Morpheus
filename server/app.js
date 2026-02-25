import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import kycRoutes from './routes/kyc.routes.js';
import lenderRoutes from './routes/lender.routes.js';
import adminRoutes from './routes/admin.routes.js';
import featureRoutes from './routes/feature.routes.js';
import errorHandler from './middleware/error.middleware.js';
import cookieParser from 'cookie-parser';

const app = express();

// Middleware
app.set("trust proxy", 1); // 🔥 Required for Render
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", // Use environment variable for frontend origin
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
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
app.use('/api/lender', lenderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/features', featureRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('API is running...');
});
app.get("/health", (req, res) => {
    res.status(200).json({ status: "running" });
});

app.use(errorHandler);

export default app;
