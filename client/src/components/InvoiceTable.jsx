import React from 'react';
import RiskBadge from './RiskBadge';
import { Eye, ShieldAlert } from 'lucide-react';

const InvoiceTable = ({ invoices, onCreate }) => {
    if (!invoices || invoices.length === 0) {
        return (
            <div className="bg-card border border-cardBorder rounded-xl p-8 text-center">
                <ShieldAlert className="mx-auto h-12 w-12 text-muted mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-white">No invoices found</h3>
                <p className="text-muted mt-1 mb-6">Get started by creating your first invoice.</p>
                {onCreate && (
                    <button onClick={onCreate} className="btn-primary mx-auto w-fit px-6">
                        Create Invoice
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="bg-card border border-cardBorder rounded-xl overflow-hidden shadow-lg backdrop-blur-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-cardBorder bg-bg1/50">
                            <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Invoice ID</th>
                            <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Buyer GSTIN</th>
                            <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Credit Score</th>
                            <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Risk Level</th>
                            <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                            {/* <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Actions</th> */}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-cardBorder">
                        {invoices.map((invoice) => (
                            <tr key={invoice.id} className="hover:bg-accent/5 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                    #{invoice.id.toString().slice(-6)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                                    {invoice.buyerGstin}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-white">
                                    ₹{Number(invoice.amount).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                                    {new Date(invoice.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="w-16 bg-bg1 rounded-full h-1.5 mr-2 overflow-hidden">
                                            {/* Normalize 0-100 score to % width */}
                                            <div
                                                className={`h-1.5 rounded-full ${invoice.creditScore >= 80 ? 'bg-success' :
                                                    invoice.creditScore >= 50 ? 'bg-warning' : 'bg-danger'
                                                    }`}
                                                style={{ width: `${invoice.creditScore}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-xs text-muted">{invoice.creditScore}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <RiskBadge
                                        level={invoice.riskLevel}
                                        score={invoice.creditScore}
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`text-xs px-2 py-1 rounded-full ${invoice.status === 'VERIFIED' ? 'bg-green-500/10 text-green-500' :
                                            invoice.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' :
                                                'bg-gray-500/10 text-gray-500'
                                        }`}>
                                        {invoice.status}
                                    </span>
                                </td>
                                {/* <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-accent hover:text-accent2 transition-colors">
                                        <Eye size={18} />
                                    </button>
                                </td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InvoiceTable;
