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
    Download,
    ChevronRight
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
            <div className="min-h-screen relative overflow-hidden bg-slate-950">
                {/* Glow Blobs */}
                <div className="absolute top-0 right-1/4 w-[480px] h-[480px] bg-blue-600 rounded-full -z-10 blur-3xl opacity-[0.12] pointer-events-none"></div>
                <div className="absolute bottom-1/4 -left-24 w-[400px] h-[400px] bg-cyan-500 rounded-full -z-10 blur-3xl opacity-[0.08] pointer-events-none"></div>
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/40 to-slate-950 -z-10 pointer-events-none"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-pulse">
                    {/* Hero Header Skeleton */}
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
                        <div>
                            <div className="h-6 w-32 bg-white/10 rounded-full mb-4"></div>
                            <div className="h-10 w-72 md:w-96 bg-white/10 rounded-xl"></div>
                            <div className="h-4 w-56 bg-white/5 rounded-md mt-2"></div>
                        </div>
                        <div className="shrink-0 h-10 w-36 bg-white/10 rounded-xl"></div>
                    </div>

                    {/* KPI Cards Skeleton */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="p-6 rounded-2xl border border-white/10 bg-white/5 flex flex-col justify-between h-32">
                                <div className="flex justify-between items-start">
                                    <div className="h-4 w-24 bg-white/10 rounded"></div>
                                    <div className="h-10 w-10 bg-white/10 rounded-xl"></div>
                                </div>
                                <div className="h-8 w-32 bg-white/10 rounded"></div>
                            </div>
                        ))}
                    </div>

                    {/* Charts Section Skeleton */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-6">
                            <div className="flex justify-between items-center mb-6">
                                <div className="h-5 w-24 bg-white/10 rounded"></div>
                                <div className="h-6 w-24 bg-white/5 rounded-full"></div>
                            </div>
                            <div className="h-60 bg-white/5 rounded-xl"></div>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                            <div className="flex justify-between items-center mb-6">
                                <div className="h-5 w-32 bg-white/10 rounded"></div>
                                <div className="h-6 w-20 bg-white/5 rounded-full"></div>
                            </div>
                            <div className="h-60 rounded-xl flex items-center justify-center">
                                <div className="h-40 w-40 rounded-full border-[12px] border-white/5"></div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions Skeleton */}
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                        <div className="h-5 w-32 bg-white/10 rounded mb-5"></div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="p-5 rounded-2xl border border-white/5 bg-white/5/50">
                                    <div className="flex justify-between mb-4">
                                        <div className="h-10 w-10 bg-white/10 rounded-xl"></div>
                                        <div className="h-4 w-4 bg-white/5 rounded mt-1"></div>
                                    </div>
                                    <div className="h-4 w-24 bg-white/10 rounded mb-2"></div>
                                    <div className="h-3 w-36 bg-white/5 rounded"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative overflow-hidden bg-slate-950">
            {/* Glow Blobs */}
            <div className="absolute top-0 right-1/4 w-[480px] h-[480px] bg-blue-600 rounded-full -z-10 blur-3xl opacity-[0.12] pointer-events-none"></div>
            <div className="absolute bottom-1/4 -left-24 w-[400px] h-[400px] bg-cyan-500 rounded-full -z-10 blur-3xl opacity-[0.08] pointer-events-none"></div>
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/40 to-slate-950 -z-10 pointer-events-none"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
                {/* Hero Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium mb-4">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                            MSME Dashboard
                        </div>
                        <h1 className="text-4xl font-semibold text-white tracking-tight">
                            Welcome back,{' '}
                            <span className="text-blue-400">{user?.name || 'Partner'}</span>
                        </h1>
                        <p className="text-white/60 mt-2 text-sm">Here's what's happening with your business today.</p>
                    </div>
                    <button
                        onClick={() => navigate('/upload-invoice')}
                        className="shrink-0 inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 text-sm"
                    >
                        <Plus size={15} />
                        Create Invoice
                    </button>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
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
                        value={user?.business_started_date ? `${new Date().getFullYear() - new Date(user.business_started_date).getFullYear()} Yrs` : "N/A"}
                        icon={Briefcase}
                        color="accent2"
                    />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Revenue Graph */}
                    <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 min-w-0">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-base font-semibold text-white">Revenue Trend</h2>
                            <span className="text-xs text-white/40 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">Last 6 months</span>
                        </div>
                        <div className="h-60">
                            {stats?.revenueData && stats.revenueData.length > 0 && stats.revenueData.some(d => d.revenue > 0) ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={stats.revenueData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={1} />
                                        <XAxis dataKey="name" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0c1526', borderColor: '#1e293b', color: '#fff', borderRadius: '12px', fontSize: '13px' }}
                                            itemStyle={{ color: '#93c5fd' }}
                                            labelStyle={{ color: '#ffffff', fontWeight: 600 }}
                                        />
                                        <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#3b82f6', strokeWidth: 0 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center gap-2 text-white/30">
                                    <FileText size={28} />
                                    <p className="text-sm">No revenue data available yet</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Risk Distribution */}
                    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 min-w-0">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-base font-semibold text-white">Risk Distribution</h2>
                            <span className="text-xs text-white/40 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">All time</span>
                        </div>
                        <div className="h-60 relative">
                            {stats?.totalInvoices > 0 ? (
                                <>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={stats.riskData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={52}
                                                outerRadius={82}
                                                paddingAngle={4}
                                                dataKey="value"
                                            >
                                                {stats.riskData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#0c1526', borderColor: '#1e293b', color: '#fff', borderRadius: '12px', fontSize: '13px' }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <span className="text-2xl font-bold text-white">{stats.totalInvoices}</span>
                                        <span className="text-xs text-white/40 mt-0.5">invoices</span>
                                    </div>
                                </>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center gap-2 text-white/30">
                                    <ShieldAlert size={28} />
                                    <p className="text-sm">No risk data calculated</p>
                                </div>
                            )}
                        </div>
                        {stats?.totalInvoices > 0 && (
                            <div className="flex flex-wrap justify-center gap-3 mt-4">
                                {stats.riskData.map((item) => (
                                    <div key={item.name} className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                                        <span className="text-xs text-white/50">{item.name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                    <h2 className="text-base font-semibold text-white mb-5">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                            onClick={() => navigate('/upload-invoice')}
                            className="group text-left p-5 rounded-2xl border border-white/10 bg-transparent hover:bg-white/5 hover:-translate-y-0.5 transition-all duration-200"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="h-10 w-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                                    <Plus size={18} />
                                </div>
                                <ChevronRight size={15} className="text-white/20 group-hover:text-white/50 transition-colors mt-1" />
                            </div>
                            <h3 className="font-medium text-white text-sm mb-1">Create Invoice</h3>
                            <p className="text-xs text-white/50 leading-relaxed">Submit a new invoice for financing</p>
                        </button>

                        <button
                            onClick={() => navigate('/invoices')}
                            className="group text-left p-5 rounded-2xl border border-white/10 bg-transparent hover:bg-white/5 hover:-translate-y-0.5 transition-all duration-200"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="h-10 w-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                                    <FileSearch size={18} />
                                </div>
                                <ChevronRight size={15} className="text-white/20 group-hover:text-white/50 transition-colors mt-1" />
                            </div>
                            <h3 className="font-medium text-white text-sm mb-1">View All Invoices</h3>
                            <p className="text-xs text-white/50 leading-relaxed">Check status and history</p>
                        </button>

                        <button className="group text-left p-5 rounded-2xl border border-white/10 bg-transparent hover:bg-white/5 hover:-translate-y-0.5 transition-all duration-200">
                            <div className="flex items-start justify-between mb-4">
                                <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                                    <Download size={18} />
                                </div>
                                <ChevronRight size={15} className="text-white/20 group-hover:text-white/50 transition-colors mt-1" />
                            </div>
                            <h3 className="font-medium text-white text-sm mb-1">Export Report</h3>
                            <p className="text-xs text-white/50 leading-relaxed">Download monthly summary</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MSMEDashboard;
