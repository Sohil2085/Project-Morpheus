import React from 'react';
import RiskBadge from './RiskBadge';
import { ShieldAlert, Plus } from 'lucide-react';

const riskPill = (level) => {
    const l = (level || '').toLowerCase();
    if (l === 'low') return 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20';
    if (l === 'medium') return 'bg-amber-500/15 text-amber-300 border border-amber-500/20';
    if (l === 'high') return 'bg-rose-500/15 text-rose-300 border border-rose-500/20';
    return 'bg-white/10 text-white/50 border border-white/10';
};

const statusPill = (status) => {
    if (status === 'VERIFIED') return 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20';
    if (status === 'PENDING')  return 'bg-amber-500/15 text-amber-300 border border-amber-500/20';
    if (status === 'REJECTED') return 'bg-rose-500/15 text-rose-300 border border-rose-500/20';
    return 'bg-white/10 text-white/50 border border-white/10';
};

const InvoiceTable = ({ invoices, onCreate }) => {
    if (!invoices || invoices.length === 0) {
        return (
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-12 text-center">
                <div className="mx-auto h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                    <ShieldAlert className="text-white/30" size={22} />
                </div>
                <h3 className="text-base font-medium text-white mb-1">No invoices found</h3>
                <p className="text-white/40 text-sm mb-6">Get started by creating your first invoice.</p>
                {onCreate && (
                    <button
                        onClick={onCreate}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium text-sm px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/20"
                    >
                        <Plus size={15} />
                        Create Invoice
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[900px]">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                            <th className="px-6 py-4 text-xs font-semibold text-white/40 uppercase tracking-widest">Invoice ID</th>
                            <th className="px-6 py-4 text-xs font-semibold text-white/40 uppercase tracking-widest">Buyer GSTIN</th>
                            <th className="px-6 py-4 text-xs font-semibold text-white/40 uppercase tracking-widest">Amount</th>
                            <th className="px-6 py-4 text-xs font-semibold text-white/40 uppercase tracking-widest">Date</th>
                            <th className="px-6 py-4 text-xs font-semibold text-white/40 uppercase tracking-widest">Credit Score</th>
                            <th className="px-6 py-4 text-xs font-semibold text-white/40 uppercase tracking-widest">Risk</th>
                            <th className="px-6 py-4 text-xs font-semibold text-white/40 uppercase tracking-widest">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.05]">
                        {invoices.map((invoice) => (
                            <tr key={invoice.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm font-mono font-medium text-white/80">#{invoice.id.toString().slice(-6)}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm text-white/60 font-mono">{invoice.buyerGstin}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm font-semibold text-white">₹{Number(invoice.amount).toLocaleString()}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm text-white/50">{new Date(invoice.createdAt).toLocaleDateString()}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <div className="w-14 bg-white/10 rounded-full h-1 overflow-hidden">
                                            <div
                                                className={`h-1 rounded-full ${
                                                    invoice.creditScore >= 80 ? 'bg-emerald-400' :
                                                    invoice.creditScore >= 50 ? 'bg-amber-400' : 'bg-rose-400'
                                                }`}
                                                style={{ width: `${invoice.creditScore}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-white/40 tabular-nums">{invoice.creditScore}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full capitalize ${riskPill(invoice.riskLevel)}`}>
                                        {(invoice.riskLevel || 'N/A').toLowerCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${statusPill(invoice.status)}`}>
                                        {invoice.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InvoiceTable;
