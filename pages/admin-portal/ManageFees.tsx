import React, { useState, useEffect, useMemo, useRef } from 'react';
import { STUDENTS } from '../../constants';
import type { Student, PaymentHistoryItem } from '../../types';

const getStudentsFromStorage = (): Student[] => {
    try {
        const stored = localStorage.getItem('students');
        return stored ? JSON.parse(stored) : STUDENTS;
    } catch {
        return STUDENTS;
    }
};

type FeeStatus = 'Paid' | 'Pending Verification' | 'Overdue' | 'Partial' | 'Unpaid' | 'Fee Not Set';

const statusStyles: { [key in FeeStatus]: string } = {
    Paid: 'bg-green-100 text-green-700',
    'Pending Verification': 'bg-yellow-100 text-yellow-700',
    Overdue: 'bg-red-100 text-red-700',
    Partial: 'bg-blue-100 text-blue-700',
    Unpaid: 'bg-gray-100 text-gray-700',
    'Fee Not Set': 'bg-purple-100 text-purple-700',
};


const FeeManagementModal = ({ student, onClose, onSave, onRecordPayment, onReviewPayment }: { student: Student; onClose: () => void; onSave: (studentId: number, totalFee: number, discount: number, feeRemarks: string) => void; onRecordPayment: (studentId: number, amount: number, remarks: string) => void; onReviewPayment: (payment: PaymentHistoryItem) => void; }) => {
    const [totalFee, setTotalFee] = useState(student.totalFee || 0);
    const [discount, setDiscount] = useState(student.discount || 0);
    const [feeRemarks, setFeeRemarks] = useState(student.feeRemarks || '');
    const [cashAmount, setCashAmount] = useState('');
    const [cashRemarks, setCashRemarks] = useState('');
    const [activeTab, setActiveTab] = useState('setFee');
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const handleSaveFee = () => {
        onSave(student.id, totalFee, discount, feeRemarks);
        onClose();
    };
    
    const handleRecordCash = () => {
        const amount = parseFloat(cashAmount);
        if (!isNaN(amount) && amount > 0) {
            onRecordPayment(student.id, amount, cashRemarks);
            setCashAmount('');
            setCashRemarks('');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div ref={modalRef} className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b">
                    <h2 className="text-2xl font-bold text-brand-dark">Manage Fees for {student.name}</h2>
                </div>
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-4 px-4" aria-label="Tabs">
                        <button onClick={() => setActiveTab('setFee')} className={`${activeTab === 'setFee' ? 'border-brand-red text-brand-red' : 'border-transparent text-gray-500'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}>Set Fee</button>
                        <button onClick={() => setActiveTab('recordPayment')} className={`${activeTab === 'recordPayment' ? 'border-brand-red text-brand-red' : 'border-transparent text-gray-500'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}>Record Payment</button>
                        <button onClick={() => setActiveTab('history')} className={`${activeTab === 'history' ? 'border-brand-red text-brand-red' : 'border-transparent text-gray-500'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}>History & Verification</button>
                    </nav>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === 'setFee' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Total Fee (NPR)</label>
                                <input type="number" value={totalFee} onChange={e => setTotalFee(Number(e.target.value))} className="mt-1 block w-full p-2 border rounded-md bg-white"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Discount (NPR)</label>
                                <input type="number" value={discount} onChange={e => setDiscount(Number(e.target.value))} className="mt-1 block w-full p-2 border rounded-md bg-white"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Fee Remarks (e.g., Scholarship details)</label>
                                <textarea value={feeRemarks} onChange={e => setFeeRemarks(e.target.value)} rows={2} className="mt-1 block w-full p-2 border rounded-md bg-white"/>
                            </div>
                             <div className="p-4 border-t mt-4 text-right">
                                <button onClick={handleSaveFee} className="bg-brand-red text-white font-semibold px-4 py-2 rounded-md">Save Fee Structure</button>
                            </div>
                        </div>
                    )}
                    {activeTab === 'recordPayment' && (
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg">Record Cash Payment</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Amount Received (NPR)</label>
                                <input type="number" value={cashAmount} onChange={e => setCashAmount(e.target.value)} className="mt-1 block w-full p-2 border rounded-md bg-white"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Remarks</label>
                                <textarea value={cashRemarks} onChange={e => setCashRemarks(e.target.value)} rows={2} placeholder="e.g., First installment received" className="mt-1 block w-full p-2 border rounded-md bg-white"/>
                            </div>
                             <div className="p-4 border-t mt-4 text-right">
                                <button onClick={handleRecordCash} className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md">Record Cash Payment</button>
                            </div>
                        </div>
                    )}
                    {activeTab === 'history' && (
                        <div className="space-y-4">
                            {student.paymentHistory?.map(p => (
                                <div key={p.invoiceId} className="p-3 border rounded-md">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold">NPR {p.amount.toLocaleString()}</p>
                                            <p className="text-sm text-gray-500">{p.date} - <span className="font-semibold">{p.method}</span></p>
                                            <p className="text-sm italic text-gray-600 mt-1">"{p.remarks || 'No remarks'}"</p>
                                        </div>
                                        <div className="text-right">
                                             <span className={`px-2 py-1 text-xs font-bold rounded-full ${p.status === 'Paid' ? 'bg-green-100 text-green-700' : p.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{p.status}</span>
                                            {p.screenshotUrl && <a href={p.screenshotUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 block mt-1 hover:underline">View Proof</a>}
                                            {p.rejectionReason && <p className="text-xs text-red-600 mt-1 italic max-w-[150px]">{p.rejectionReason}</p>}
                                        </div>
                                    </div>
                                    {p.status === 'Pending Verification' && (
                                        <div className="text-right mt-2 border-t pt-2">
                                            <button onClick={() => onReviewPayment(p)} className="bg-blue-600 text-white font-semibold text-xs px-3 py-1 rounded-md">Review Payment</button>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {(!student.paymentHistory || student.paymentHistory.length === 0) && <p className="text-center text-gray-500">No payment history.</p>}
                        </div>
                    )}
                </div>
                <div className="p-4 border-t bg-gray-50 text-right">
                    <button onClick={onClose} className="bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-md">Close</button>
                </div>
            </div>
        </div>
    );
};

const PaymentReviewModal = ({ isOpen, onClose, student, payment, onApprove, onReject }: { isOpen: boolean; onClose: () => void; student: Student; payment: PaymentHistoryItem; onApprove: () => void; onReject: (reason: string) => void; }) => {
    const [rejectionReason, setRejectionReason] = useState('');
    const [isRejecting, setIsRejecting] = useState(false);

    const handleReject = () => {
        if (!rejectionReason.trim()) {
            alert('Please provide a reason for rejection.');
            return;
        }
        onReject(rejectionReason);
    };

    if (!isOpen) return null;

    return (
         <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[60] p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b">
                    <h2 className="text-2xl font-bold text-brand-dark">Review Payment for {student.name}</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <p><span className="font-semibold">Amount:</span> NPR {payment.amount.toLocaleString()}</p>
                        <p><span className="font-semibold">Method:</span> {payment.method}</p>
                        <p><span className="font-semibold">Date:</span> {payment.date}</p>
                        <p className="md:col-span-2"><span className="font-semibold">Student Remarks:</span> {payment.remarks || 'None'}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Payment Screenshot</h3>
                        {payment.screenshotUrl ? <img src={payment.screenshotUrl} alt="Payment Screenshot" className="rounded-lg border max-w-full h-auto"/> : <p>No screenshot uploaded.</p>}
                    </div>
                    {isRejecting && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                            <label htmlFor="rejectionReason" className="block text-sm font-medium text-red-800">Reason for Rejection</label>
                            <textarea id="rejectionReason" value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} rows={3} className="mt-1 block w-full p-2 border rounded-md border-red-300" required/>
                        </div>
                    )}
                </div>
                <div className="p-4 border-t bg-gray-50 flex justify-end gap-4">
                    <button onClick={onClose} className="bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-md">Cancel</button>
                    {isRejecting ? (
                         <button onClick={handleReject} className="bg-red-700 text-white font-semibold px-4 py-2 rounded-md">Confirm Rejection</button>
                    ) : (
                        <>
                            <button onClick={() => setIsRejecting(true)} className="bg-red-100 text-red-800 font-semibold px-4 py-2 rounded-md">Reject</button>
                            <button onClick={onApprove} className="bg-green-600 text-white font-semibold px-4 py-2 rounded-md">Approve Payment</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};


const ManageFees: React.FC = () => {
    const [allStudents, setAllStudents] = useState<Student[]>(getStudentsFromStorage);
    const [message, setMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [reviewingPayment, setReviewingPayment] = useState<{ student: Student, payment: PaymentHistoryItem } | null>(null);

    useEffect(() => {
        localStorage.setItem('students', JSON.stringify(allStudents));
    }, [allStudents]);

    const feeRecords = useMemo(() => {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        return allStudents.map(student => {
            const totalFee = student.totalFee || 0;
            const netFee = totalFee - (student.discount || 0);
            const paidAmount = student.paymentHistory?.filter(p => p.status === 'Paid').reduce((s, p) => s + p.amount, 0) || 0;
            const hasPending = student.paymentHistory?.some(p => p.status === 'Pending Verification') || false;
            let status: FeeStatus;

            if (totalFee === 0 && !student.paymentHistory?.length) {
                status = 'Fee Not Set';
            } else if (hasPending) {
                status = 'Pending Verification';
            } else if (paidAmount >= netFee) {
                status = 'Paid';
            } else if (paidAmount > 0) {
                status = 'Partial';
            } else if (new Date(student.dueDate) < today && netFee > 0) {
                status = 'Overdue';
            } else {
                status = 'Unpaid';
            }
            return { student, outstanding: netFee - paidAmount, status };
        });
    }, [allStudents]);
    
    const filteredRecords = useMemo(() => {
        return feeRecords.filter(({ student, status }) => 
            (statusFilter === 'All' || status === statusFilter) &&
            (searchTerm === '' || student.name.toLowerCase().includes(searchTerm.toLowerCase()) || student.studentId.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [feeRecords, searchTerm, statusFilter]);

    const showMessage = (msg: string) => {
        setMessage(msg);
        setTimeout(() => setMessage(''), 3000);
    };

    const handleSaveFeeStructure = (studentId: number, totalFee: number, discount: number, feeRemarks: string) => {
        setAllStudents(prev => prev.map(s => s.id === studentId ? { ...s, totalFee, discount, feeRemarks } : s));
        showMessage("Fee structure updated successfully.");
    };

    const handleRecordPayment = (studentId: number, amount: number, remarks: string) => {
        setAllStudents(prev => prev.map(s => {
            if (s.id === studentId) {
                const newPayment: PaymentHistoryItem = {
                    invoiceId: `CASH-${Date.now()}`,
                    date: new Date().toISOString().split('T')[0],
                    amount,
                    remarks,
                    method: 'Cash',
                    status: 'Paid',
                    verifiedBy: 'Admin',
                    verificationDate: new Date().toISOString().split('T')[0],
                };
                const updatedHistory = [newPayment, ...(s.paymentHistory || [])];
                return { ...s, paymentHistory: updatedHistory };
            }
            return s;
        }));
        setSelectedStudent(prev => prev ? {...prev, paymentHistory: [{invoiceId: `CASH-${Date.now()}`, date: new Date().toISOString().split('T')[0], amount, remarks, method: 'Cash', status: 'Paid'}, ...(prev.paymentHistory || [])] } : null);
        showMessage("Cash payment recorded.");
    };
    
    const handleUpdatePaymentStatus = (studentId: number, invoiceId: string, newStatus: 'Paid' | 'Rejected', reason?: string) => {
         setAllStudents(prev => prev.map(s => {
            if (s.id === studentId) {
                const updatedHistory = s.paymentHistory?.map(p => 
                    p.invoiceId === invoiceId 
                        ? { ...p, status: newStatus, rejectionReason: reason, verifiedBy: 'Admin', verificationDate: new Date().toISOString().split('T')[0] } 
                        : p
                ) || [];
                return { ...s, paymentHistory: updatedHistory };
            }
            return s;
        }));
        setReviewingPayment(null);
        showMessage(`Payment has been ${newStatus.toLowerCase()}.`);
    };
    
    const handleReviewPayment = (payment: PaymentHistoryItem) => {
        if(selectedStudent) {
            setReviewingPayment({ student: selectedStudent, payment });
            setSelectedStudent(null);
        }
    }

    return (
        <div>
            <h1 className="text-3xl md:text-4xl font-bold text-brand-dark mb-2">Fee Management</h1>
            <p className="text-gray-600 mb-8">Set fees, record payments, and verify online transactions.</p>
            {message && <div className="mb-4 p-3 bg-green-100 text-green-800 text-sm rounded-md">{message}</div>}
            
             <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700">Search by Student/ID</label>
                        <input type="text" id="search" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="mt-1 block w-full p-2 border rounded-md bg-white"/>
                    </div>
                    <div>
                        <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700">Filter by Status</label>
                        <select id="statusFilter" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="mt-1 block w-full p-2 border rounded-md bg-white">
                            <option value="All">All Statuses</option>
                            <option value="Paid">Paid</option>
                            <option value="Pending Verification">Pending Verification</option>
                            <option value="Overdue">Overdue</option>
                            <option value="Partial">Partial</option>
                            <option value="Unpaid">Unpaid</option>
                            <option value="Fee Not Set">Fee Not Set</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 font-semibold text-sm">Student</th>
                                <th className="p-4 font-semibold text-sm text-right">Outstanding (NPR)</th>
                                <th className="p-4 font-semibold text-sm text-center">Status</th>
                                <th className="p-4 font-semibold text-sm text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredRecords.map(({ student, outstanding, status }) => (
                                <tr key={student.id} className="hover:bg-gray-50">
                                    <td className="p-4 flex items-center">
                                        <img src={student.avatarUrl} alt={student.name} className="w-10 h-10 rounded-full mr-3" />
                                        <div>
                                            <p className="font-medium">{student.name}</p>
                                            <p className="text-xs text-gray-500 font-mono">{student.studentId}</p>
                                        </div>
                                    </td>
                                    <td className={`p-4 text-right font-mono ${outstanding > 0 ? 'text-brand-red' : 'text-green-600'}`}>{outstanding.toLocaleString()}</td>
                                    <td className="p-4 text-center">
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${statusStyles[status]}`}>{status}</span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <button onClick={() => setSelectedStudent(student)} className="text-sm font-semibold text-blue-600 hover:underline">Manage</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {filteredRecords.length === 0 && <p className="text-center py-8 text-gray-500">No records match filters.</p>}
                </div>
            </div>
            {selectedStudent && <FeeManagementModal student={selectedStudent} onClose={() => setSelectedStudent(null)} onSave={handleSaveFeeStructure} onRecordPayment={handleRecordPayment} onReviewPayment={handleReviewPayment} />}
            {reviewingPayment && <PaymentReviewModal isOpen={!!reviewingPayment} onClose={() => setReviewingPayment(null)} student={reviewingPayment.student} payment={reviewingPayment.payment} onApprove={() => handleUpdatePaymentStatus(reviewingPayment.student.id, reviewingPayment.payment.invoiceId, 'Paid')} onReject={(reason) => handleUpdatePaymentStatus(reviewingPayment.student.id, reviewingPayment.payment.invoiceId, 'Rejected', reason)} />}
        </div>
    );
};

export default ManageFees;