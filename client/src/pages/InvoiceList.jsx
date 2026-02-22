import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Filter } from 'lucide-react';
import { getInvoices } from '../api/invoiceApi';
import InvoiceTable from '../components/InvoiceTable';
import toast from 'react-hot-toast';

const INNER = 'relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8';

// ── Skeleton loader ───────────────────────────────────────────────────────────
const SkeletonRow = () => (
    <tr className="border-b border-white/5">
        {[...Array(6)].map((_, i) => (
            <td key={i} className="px-4 py-3.5">
                <div className="h-3.5 rounded-full bg-white/8 animate-pulse" style={{ width: `${55 + (i * 13) % 40}%` }} />
            </td>
        ))}
    </tr>
);

const InvoiceListLoading = () => (
    <div className={INNER}>
        {/* Header skeleton */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
            <div className="space-y-2.5">
                <div className="h-8 w-32 rounded-xl bg-white/8 animate-pulse" />
                <div className="h-3.5 w-56 rounded-full bg-white/5 animate-pulse" />
            </div>
            <div className="h-10 w-36 rounded-xl bg-white/8 animate-pulse shrink-0" />
        </div>

        {/* Toolbar skeleton */}
        <div className="flex flex-col sm:flex-row gap-3">
            <div className="h-10 flex-1 max-w-sm rounded-xl bg-white/5 animate-pulse" />
            <div className="h-10 w-24 rounded-xl bg-white/5 animate-pulse" />
        </div>

        {/* Table skeleton */}
        <div className="rounded-2xl border border-white/8 overflow-hidden bg-white/[0.03] backdrop-blur-sm">
            {/* thead */}
            <div className="flex gap-4 px-4 py-3 border-b border-white/8 bg-white/[0.02]">
                {[30, 22, 18, 14, 14, 16].map((w, i) => (
                    <div key={i} className="h-3 rounded-full bg-white/10 animate-pulse" style={{ width: `${w}%` }} />
                ))}
            </div>
            {/* rows */}
            <table className="w-full">
                <tbody>
                    {[...Array(7)].map((_, i) => <SkeletonRow key={i} />)}
                </tbody>
            </table>
        </div>

        {/* Scan-line glow overlay */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
            <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent animate-scan" />
        </div>
    </div>
);

const InvoicesContent = ({ invoices, searchTerm, onSearchChange, onNavigate }) => (
    <div className={INNER}>
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
            <div>
                <h1 className="text-4xl font-semibold text-white tracking-tight">Invoices</h1>
                <p className="text-white/60 mt-1 text-sm">Manage and track your invoice submissions</p>
            </div>
            <button
                onClick={() => onNavigate('/upload-invoice')}
                className="shrink-0 inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 text-sm"
            >
                <Plus size={15} />
                <span>Create Invoice</span>
            </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={15} />
                <input
                    type="text"
                    placeholder="Search by ID or Buyer GSTIN..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400/60 transition"
                />
            </div>
            <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm">
                <Filter size={15} />
                <span>Filter</span>
            </button>
        </div>

        {/* Table */}
        <InvoiceTable invoices={invoices} onCreate={() => onNavigate('/upload-invoice')} />
    </div>
);

// ── Page ──────────────────────────────────────────────────────────────────────
const InvoiceList = () => {
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const data = await getInvoices();
            setInvoices(data);
        } catch (error) {
            toast.error('Could not load invoices');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const filteredInvoices = invoices.filter(invoice =>
        invoice.buyerGstin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.id?.toString().includes(searchTerm)
    );

    return (
        <div className="min-h-screen relative overflow-hidden bg-slate-950">
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600 rounded-full -z-10 blur-3xl opacity-[0.10] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/40 to-slate-950 -z-10 pointer-events-none" />
            {loading ? (
                <InvoiceListLoading />
            ) : (
                <InvoicesContent
                    invoices={filteredInvoices}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    onNavigate={navigate}
                />
            )}
        </div>
    );
};

export default InvoiceList;
