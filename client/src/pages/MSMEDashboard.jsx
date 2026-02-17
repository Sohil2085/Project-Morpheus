import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import {
    Briefcase,
    DollarSign,
    FileText,
    ShieldAlert,
    Plus,
    FileSearch,
    Download
} from 'lucide-react';
import StatCard from '../components/StatCard';
import { getInvoiceStats } from '../api/invoiceApi';
import { useAuth } from '../context/AuthContext';
import '../styles/landing.css';

const MSMEDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const data = await getInvoiceStats();
                setStats(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg0">
                <div className="spinner h-12 w-12 border-4 border-accent border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in pb-20">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">
                    Welcome back, {user?.name || 'Partner'}
                </h1>
                <p className="text-muted mt-1">Here's what's happening with your business today.</p>
            </div>

            {/* Business Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value={stats?.totalRevenue}
                    icon={DollarSign}
                    trend={stats?.totalRevenue !== '₹0' ? "up" : null}
                    color="success"
                />
                <StatCard
                    title="Total Invoices"
                    value={stats?.totalInvoices}
                    icon={FileText}
                    trend={stats?.totalInvoices > 0 ? "up" : null}
                    color="accent"
                />
                <StatCard
                    title="Avg Credit Score"
                    value={stats?.avgRiskScore}
                    icon={ShieldAlert}
                    color={stats?.avgRiskScore >= 80 ? "success" : stats?.avgRiskScore >= 50 ? "warning" : "danger"}
                />
                <StatCard
                    title="Business Age"
                    value={user?.business_age ? `${user.business_age} Yrs` : "N/A"}
                    icon={Briefcase}
                    color="accent2"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Graph */}
                <div className="lg:col-span-2 bg-card border border-cardBorder rounded-xl p-6 shadow-lg backdrop-blur-sm min-w-0">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold text-white">Revenue Trend</h2>
                    </div>
                    <div className="h-64">
                        {stats?.revenueData && stats.revenueData.length > 0 && stats.revenueData.some(d => d.revenue > 0) ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={stats.revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-muted">
                                <FileText className="mb-2 opacity-50" size={32} />
                                <p>No revenue data available yet</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Fraud Analytics (Risk Distribution) */}
                <div className="bg-card border border-cardBorder rounded-xl p-6 shadow-lg backdrop-blur-sm min-w-0">
                    <h2 className="text-lg font-semibold text-white mb-6">Fraud Risk Distribution</h2>
                    <div className="h-64 relative">
                        {stats?.totalInvoices > 0 ? (
                            <>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={stats.riskData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {stats.riskData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-2xl font-bold text-white">{stats.totalInvoices}</span>
                                    <span className="text-xs text-muted">Total</span>
                                </div>
                            </>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-muted">
                                <ShieldAlert className="mb-2 opacity-50" size={32} />
                                <p>No risk data calculated</p>
                            </div>
                        )}
                    </div>
                    {stats?.totalInvoices > 0 && (
                        <div className="flex justify-center gap-4 mt-4">
                            {stats.riskData.map((item) => (
                                <div key={item.name} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                    <span className="text-xs text-muted">{item.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card border border-cardBorder rounded-xl p-6 shadow-lg backdrop-blur-sm">
                <h2 className="text-lg font-semibold text-white mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => navigate('/upload-invoice')}
                        className="p-4 rounded-xl bg-accent/5 border border-accent/20 hover:bg-accent/10 hover:border-accent/40 transition-all group text-left"
                    >
                        <div className="h-10 w-10 rounded-lg bg-accent/20 text-accent flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <Plus size={20} />
                        </div>
                        <h3 className="font-semibold text-white">Create Invoice</h3>
                        <p className="text-xs text-muted mt-1">Submit new invoice for financing</p>
                    </button>

                    <button
                        onClick={() => navigate('/invoices')}
                        className="p-4 rounded-xl bg-bg0 border border-cardBorder hover:border-muted/30 transition-all group text-left"
                    >
                        <div className="h-10 w-10 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <FileSearch size={20} />
                        </div>
                        <h3 className="font-semibold text-white">View All Invoices</h3>
                        <p className="text-xs text-muted mt-1">Check status and history</p>
                    </button>

                    <button className="p-4 rounded-xl bg-bg0 border border-cardBorder hover:border-muted/30 transition-all group text-left">
                        <div className="h-10 w-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <Download size={20} />
                        </div>
                        <h3 className="font-semibold text-white">Export Report</h3>
                        <p className="text-xs text-muted mt-1">Download monthly summary</p>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MSMEDashboard;
