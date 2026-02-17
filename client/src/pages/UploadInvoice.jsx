import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, ShieldCheck } from 'lucide-react';
import { createInvoice } from '../api/invoiceApi';
import toast from 'react-hot-toast';

const UploadInvoice = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        buyerGstin: '',
        amount: '',
        dueDate: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.buyerGstin || !formData.amount || !formData.dueDate) {
            toast.error('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            await createInvoice({
                ...formData,
                amount: parseFloat(formData.amount)
            });
            toast.success('Invoice created successfully!');
            navigate('/invoices'); // Redirect to list
        } catch (error) {
            toast.error(error.toString());
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 md:p-8 max-w-3xl mx-auto animate-fade-in">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-muted hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft size={18} />
                <span>Back</span>
            </button>

            <div className="bg-card border border-cardBorder rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm">
                <div className="p-6 md:p-8 border-b border-cardBorder bg-bg1/30">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-accent/10 text-accent">
                            <ShieldCheck size={24} />
                        </div>
                        <h1 className="text-2xl font-bold text-white">Create New Invoice</h1>
                    </div>
                    <p className="text-muted ml-12">Submit invoice details for fraud assessment and financing.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="form-group">
                            <label className="block text-sm font-medium text-muted mb-2">Buyer GSTIN</label>
                            <input
                                type="text"
                                name="buyerGstin"
                                value={formData.buyerGstin}
                                onChange={handleChange}
                                placeholder="e.g. 27AAAAA0000A1Z5"
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="form-group">
                                <label className="block text-sm font-medium text-muted mb-2">Amount (₹)</label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    className="form-input"
                                    min="1"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="block text-sm font-medium text-muted mb-2">Due Date</label>
                                <input
                                    type="date"
                                    name="dueDate"
                                    value={formData.dueDate}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-6 py-2.5 rounded-lg text-muted hover:text-white hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full md:w-auto px-8"
                        >
                            {loading ? (
                                <div className="spinner h-5 w-5 border-white/30 border-t-white"></div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Save size={18} />
                                    <span>Create Invoice</span>
                                </div>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadInvoice;
