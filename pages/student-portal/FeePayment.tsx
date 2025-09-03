import React, { useState, useEffect, useMemo } from 'react';
import { STUDENTS } from '../../constants';
import type { Student, PaymentHistoryItem } from '../../types';
import { useStudent } from '../StudentPortalPage';

const paymentMethods: PaymentHistoryItem['method'][] = ['eSewa', 'Khalti', 'Mobile Banking', 'ConnectIPS'];

const getStudentsFromStorage = (): Student[] => {
    try {
        const stored = localStorage.getItem('students');
        return stored ? JSON.parse(stored) : STUDENTS;
    } catch {
        return STUDENTS;
    }
};

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

const FeePayment: React.FC = () => {
    const { student: loggedInStudent } = useStudent();
    
    const [allStudents, setAllStudents] = useState<Student[]>(getStudentsFromStorage);
    const [selectedOnlineMethod, setSelectedOnlineMethod] = useState<PaymentHistoryItem['method']>('eSewa');
    const [amount, setAmount] = useState('');
    const [remarks, setRemarks] = useState('');
    const [screenshot, setScreenshot] = useState<File | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);

    useEffect(() => {
        localStorage.setItem('students', JSON.stringify(allStudents));
    }, [allStudents]);

    const student = useMemo(() => allStudents.find(s => s.id === loggedInStudent.id), [allStudents, loggedInStudent.id]);

    const { totalFee, discount, paidAmount, outstandingBalance } = useMemo(() => {
        if (!student) return { totalFee: 0, discount: 0, paidAmount: 0, outstandingBalance: 0 };
        const total = student.totalFee || 0;
        const disc = student.discount || 0;
        const netFee = total - disc;
        const paid = student.paymentHistory?.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0) || 0;
        return { totalFee: total, discount: disc, paidAmount: paid, outstandingBalance: netFee - paid };
    }, [student]);

    useEffect(() => {
        if (outstandingBalance > 0) {
            setAmount(outstandingBalance.toString());
        } else {
            setAmount('');
        }
    }, [outstandingBalance]);

    const handleSubmitPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        
        const paymentAmount = parseFloat(amount);
        if (isNaN(paymentAmount) || paymentAmount <= 0) {
            setMessage({ type: 'error', text: 'Please enter a valid payment amount.' });
            return;
        }
        if (!remarks.trim()) {
            setMessage({ type: 'error', text: 'Remarks are mandatory.' });
            return;
        }
        if (!screenshot) {
            setMessage({ type: 'error', text: 'Please upload a payment screenshot for verification.' });
            return;
        }

        const screenshotUrl = await fileToBase64(screenshot);

        const newPayment: PaymentHistoryItem = {
            invoiceId: `INV-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            amount: paymentAmount,
            status: 'Pending Verification',
            method: selectedOnlineMethod,
            remarks: remarks.trim(),
            screenshotUrl,
        };

        setAllStudents(prev => prev.map(s => 
            s.id === loggedInStudent.id ? { ...s, paymentHistory: [newPayment, ...(s.paymentHistory || [])] } : s
        ));

        setMessage({ type: 'success', text: `Your payment of NPR ${paymentAmount.toLocaleString()} has been submitted for verification.` });
        setAmount('');
        setRemarks('');
        setScreenshot(null);
        const fileInput = document.getElementById('screenshot') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    };

    if (!student) return <div>Error: Student not found.</div>;

    const netFee = totalFee - discount;

    return (
        <div>
            <h1 className="text-4xl font-bold text-brand-dark mb-8">Fee Payment</h1>
            {message && (
                <div className={`mb-6 p-4 text-sm rounded-md ${
                    message.type === 'success' ? 'bg-green-100 text-green-800' :
                    message.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                }`}>
                    {message.text}
                </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                        <h2 className="text-xl font-bold text-brand-dark mb-4">Your Fee Summary</h2>
                        <div className="space-y-4">
                            <DetailRow label="Total Fee" value={`NPR ${totalFee.toLocaleString()}`} />
                            <DetailRow label="Discount" value={`- NPR ${discount.toLocaleString()}`} color="text-gray-600" />
                            <DetailRow label="Net Fee Payable" value={`NPR ${netFee.toLocaleString()}`} isBold={true} />
                            <DetailRow label="Amount Paid (Verified)" value={`NPR ${paidAmount.toLocaleString()}`} color="text-green-600" />
                            <hr/>
                            <DetailRow label="Outstanding Balance" value={`NPR ${outstandingBalance.toLocaleString()}`} color="text-brand-red" isBold={true} />
                        </div>
                         {student.feeRemarks && (
                            <div className="mt-4 pt-4 border-t">
                                <p className="text-sm font-medium text-gray-500">Admin Remarks</p>
                                <p className="text-sm text-gray-700 italic">"{student.feeRemarks}"</p>
                            </div>
                        )}
                    </div>
                    {outstandingBalance > 0 && (
                        <div className="bg-white p-6 rounded-lg shadow-md">
                             <h2 className="text-xl font-bold text-brand-dark mb-4">Make an Online Payment</h2>
                             <form onSubmit={handleSubmitPayment} className="space-y-4">
                                <div>
                                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount to Pay (NPR)</label>
                                    <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} required min="1" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red bg-white" />
                                </div>
                                 <div>
                                    <label htmlFor="method" className="block text-sm font-medium text-gray-700">Online Method</label>
                                    <select id="method" value={selectedOnlineMethod} onChange={(e) => setSelectedOnlineMethod(e.target.value as PaymentHistoryItem['method'])} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm">
                                        {paymentMethods.map(method => <option key={method} value={method}>{method}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="screenshot" className="block text-sm font-medium text-gray-700">Upload Screenshot</label>
                                    <input type="file" id="screenshot" onChange={e => setScreenshot(e.target.files ? e.target.files[0] : null)} required accept="image/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-brand-red hover:file:bg-red-100" />
                                </div>
                                 <div>
                                    <label htmlFor="remarks" className="block text-sm font-medium text-gray-700">Remarks</label>
                                    <textarea id="remarks" value={remarks} onChange={e => setRemarks(e.target.value)} rows={2} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red bg-white" placeholder="e.g., Payment for August installment"></textarea>
                                </div>
                                
                                <button type="submit" className="w-full bg-brand-red text-white py-3 px-4 rounded-md font-semibold hover:bg-red-700 transition-colors">
                                    Submit for Verification
                                </button>
                             </form>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-2">
                     <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold text-brand-dark mb-4">Payment History</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left min-w-[600px]">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="p-3 font-semibold text-sm text-gray-600 uppercase">Date</th>
                                        <th className="p-3 font-semibold text-sm text-gray-600 uppercase">Method</th>
                                        <th className="p-3 font-semibold text-sm text-gray-600 uppercase">Remarks</th>
                                        <th className="p-3 font-semibold text-sm text-gray-600 uppercase text-right">Amount (NPR)</th>
                                        <th className="p-3 font-semibold text-sm text-gray-600 uppercase text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {student.paymentHistory && student.paymentHistory.length > 0 ? student.paymentHistory.map(item => (
                                        <tr key={item.invoiceId} className="hover:bg-gray-50">
                                            <td className="p-3 text-sm">{item.date}</td>
                                            <td className="p-3 text-sm">{item.method}</td>
                                            <td className="p-3 text-sm text-gray-600 italic">{item.remarks || '-'}</td>
                                            <td className="p-3 text-right font-mono text-sm">{item.amount.toLocaleString()}</td>
                                            <td className="p-3 text-center">
                                                <div className="flex flex-col items-center">
                                                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                                                        item.status === 'Paid' ? 'bg-green-100 text-green-700' :
                                                        item.status === 'Pending Verification' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                                    }`}>{item.status}</span>
                                                    {item.status === 'Paid' && item.verifiedBy && (
                                                        <p className="text-xs text-gray-500 mt-1">by {item.verifiedBy}</p>
                                                    )}
                                                    {item.screenshotUrl && item.status !== 'Paid' && (
                                                        <a href={item.screenshotUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-1">View Proof</a>
                                                    )}
                                                    {item.rejectionReason && (
                                                        <p className="text-xs text-red-600 mt-1 italic max-w-[150px]">{item.rejectionReason}</p>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={5} className="text-center p-8 text-gray-500">No payment history found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DetailRow = ({ label, value, color, isBold }: { label: string, value: string, color?: string, isBold?: boolean }) => (
    <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className={`text-xl ${isBold ? 'font-black' : 'font-bold'} ${color || 'text-brand-dark'}`}>{value}</p>
    </div>
);


export default FeePayment;