import AdminLayout from '../components/admin/AdminLayout';
import KPICard from '../components/admin/KPICard';
import RecentActivity from '../components/admin/RecentActivity';
import RiskAlerts from '../components/admin/RiskAlerts';
import AdminTables from '../components/admin/AdminTables';
import {
    Building2,
    Briefcase,
    FileText,
    TrendingUp,
} from 'lucide-react';

const AdminDashboard = () => {
    // Mock KPI data
    const kpiData = [
        {
            title: 'Total MSMEs',
            value: '1,284',
            icon: Building2,
            subtitle: 'Active businesses',
            trend: { text: '+12% this month', positive: true },
        },
        {
            title: 'Total Lenders',
            value: '567',
            icon: Briefcase,
            subtitle: 'Investment partners',
            trend: { text: '+8% this month', positive: true },
        },
        {
            title: 'Total Invoices',
            value: '5,421',
            icon: FileText,
            subtitle: 'Uploaded & tracked',
            trend: { text: '-3% this month', positive: false },
        },
        {
            title: 'Total Funding',
            value: '₹45.2Cr',
            icon: TrendingUp,
            subtitle: 'Disbursed amount',
            trend: { text: '+24% this month', positive: true },
        },
    ];

    return (
        <AdminLayout title="Overview">
            {/* KPI Cards */}
            <section className="admin-section">
                <div className="kpi-grid">
                    {kpiData.map((kpi) => (
                        <KPICard
                            key={kpi.title}
                            title={kpi.title}
                            value={kpi.value}
                            icon={kpi.icon}
                            subtitle={kpi.subtitle}
                            trend={kpi.trend}
                        />
                    ))}
                </div>
            </section>

            {/* Activity & Alerts Section */}
            <section className="admin-section">
                <div className="two-column-grid">
                    <RecentActivity />
                    <RiskAlerts />
                </div>
            </section>

            {/* Tables Section */}
            <section className="admin-section">
                <AdminTables />
            </section>
        </AdminLayout>
    );
};

export default AdminDashboard;
