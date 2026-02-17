import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Filter } from 'lucide-react';
import { getInvoices } from '../api/invoiceApi';
import InvoiceTable from '../components/InvoiceTable';
import toast from 'react-hot-toast';

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
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Invoices</h1>
                    <p className="text-muted mt-1">Manage and track your invoice submissions</p>
                </div>
                <button
                    onClick={() => navigate('/upload-invoice')}
                    className="btn-primary px-6 py-2.5 flex items-center gap-2"
                >
                    <Plus size={20} />
                    <span>Create Invoice</span>
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                    <input
                        type="text"
                        placeholder="Search by ID or Buyer GSTIN..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-input pl-10"
                    />
                </div>
                <button className="px-4 py-2 border border-cardBorder rounded-lg bg-card text-muted hover:text-white hover:border-accent/50 transition-colors flex items-center gap-2">
                    <Filter size={18} />
                    <span>Filter</span>
                </button>
            </div>

            {/* Content */}
            {loading ? (
                <div className="grid place-items-center h-64">
                    <div className="spinner h-8 w-8 border-t-accent"></div>
                </div>
            ) : (
                <InvoiceTable invoices={filteredInvoices} onCreate={() => navigate('/upload-invoice')} />
            )}
        </div>
    );
};

export default InvoiceList;
