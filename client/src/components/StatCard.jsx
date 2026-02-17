import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const colorMap = {
    accent: { bg: 'bg-accent/10', text: 'text-accent' },
    success: { bg: 'bg-success/10', text: 'text-success' },
    danger: { bg: 'bg-danger/10', text: 'text-danger' },
    warning: { bg: 'bg-warning/10', text: 'text-warning' },
};

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = "accent" }) => {
    const isPositive = trend === 'up';
    const colorClasses = colorMap[color] || colorMap.accent;

    return (
        <div className="bg-card border border-cardBorder rounded-xl p-6 shadow-lg backdrop-blur-sm hover:border-accent/30 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${colorClasses.bg} ${colorClasses.text}`}>
                    {Icon && <Icon size={24} />}
                </div>
                {trendValue && (
                    <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-success' : 'text-danger'}`}>
                        {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                        <span>{trendValue}</span>
                    </div>
                )}
            </div>

            <div>
                <h3 className="text-muted text-sm font-medium mb-1">{title}</h3>
                <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
            </div>
        </div>
    );
};

export default StatCard;
