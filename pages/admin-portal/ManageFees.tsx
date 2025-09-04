import React, { useState, useEffect, useMemo, useRef } from 'react';
import { STUDENTS, COURSES } from '../../constants';
import type { Student, PaymentHistoryItem } from '../../types';
import StudentDetailModal from '../../components/admin-portal/StudentDetailModal';

// Storage helper
const getStudentsFromStorage = (): Student[] => {
    try {
        const stored = localStorage.getItem('students');
        return stored ? JSON.parse(stored) : STUDENTS;
    } catch {
        return STUDENTS;
    }
};

// Fee calculation helper
const calculateFeeDetails = (student: Student | null) => {
    if (!student) return { paidAmount: 0, outstandingBalance: 0, isOverdue: false, lastPaymentDate: 'N/A' };
    const netFee = (student.totalFee || 0) - (student.discount || 0);
    const paidAmount = student.paymentHistory?.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0) || 0;
    const outstandingBalance = netFee - paidAmount;
    
    let isOverdue = false;
    if (outstandingBalance > 0 && student.dueDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        isOverdue = new Date(student.dueDate) < today;
    }

    const lastPayment = student.paymentHistory?.filter(p => p.status === 'Paid').sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    return { paidAmount, outstandingBalance, isOverdue, lastPaymentDate: lastPayment?.date || 'N/A' };
};

// Get student status for badge
const getStudentFeeStatus = (student: Student) => {
    if (!student.totalFee || student.totalFee === 0) {
        return { text: 'Fee Not Set', color: 'bg-gray-100 text-gray-800' };
    }
    if (student.paymentHistory?.some(p => p.status === 'Pending Verification')) {
        return { text: 'Pending Verification', color: 'bg-yellow-100 text-yellow-800' };
    }
    const { outstandingBalance, isOverdue } = calculateFeeDetails(student);
    if (outstandingBalance > 0) {
        return { text: isOverdue ? 'Overdue' : 'Outstanding', color: 'bg-red-100 text-red-800' };
    }
    return { text: 'Paid', color: 'bg-green-100 text-green-800' };
};

// Get student status for filter logic
const getStudentFeeStatusForFilter = (student: Student): string => {
    if (!student.totalFee || student.totalFee === 0) return 'Fee Not Set';
    if (student.paymentHistory?.some(p => p.status === 'Pending Verification')) return 'Pending Verification';
    const { outstandingBalance } = calculateFeeDetails(student);
    if (outstandingBalance > 0) return 'Outstanding';
    return 'Paid';
};


// Modal Component
const FeeManagementModal: React.FC<{ student: Student; onClose: () => void; onSave: (s: Student) => void; }> = ({ student: initialStudent, onClose, onSave }) => {
    const [student, setStudent] = useState<Student>(initialStudent);
    const [activeTab, setActiveTab] = useState('Fee Structure');
    const [newCharge, setNewCharge] = useState({ amount: '', remarks: '' });
    const [cashPayment, setCashPayment] = useState({ amount: '', remarks: '', date: new Date().toISOString().split('T')[0] });
    const [rejectionReason, setRejectionReason] = useState('');
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (initialStudent) {
            // If feeItems doesn't exist or is empty, create it from totalFee for backward compatibility
            if (!initialStudent.feeItems || initialStudent.feeItems.length === 0) {
                setStudent({
                    ...initialStudent,
                    feeItems: [{ description: 'Base Fee', amount: initialStudent.totalFee || 0 }]
                });
            } else {
                setStudent(initialStudent);
            }
        }
    }, [initialStudent]);

    const handleGenericChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const isNumeric = name === 'discount';
        setStudent(prev => ({ ...prev, [name]: isNumeric ? parseFloat(value) || 0 : value }));
    };

    const handleFeeItemChange = (index: number, field: 'description' | 'amount', value: string | number) => {
        const newFeeItems = [...(student.feeItems || [])];
        newFeeItems[index] = { ...newFeeItems[index], [field]: field === 'amount' ? (typeof value === 'number' ? value : parseFloat(value)) || 0 : value };
        const newTotalFee = newFeeItems.reduce((sum, item) => sum + (item.amount || 0), 0);
        setStudent(prev => ({ ...prev, feeItems: newFeeItems, totalFee: newTotalFee }));
    };

    const addFeeItem = () => {
        setStudent(prev => ({ ...prev, feeItems: [...(prev.feeItems || []), { description: '', amount: 0 }] }));
    };

    const removeFeeItem = (index: number) => {
        const newFeeItems = (student.feeItems || []).filter((_, i) => i !== index);
        const newTotalFee = newFeeItems.reduce((sum, item) => sum + (item.amount || 0), 0);
        setStudent(prev => ({ ...prev, feeItems: newFeeItems, totalFee: newTotalFee }));
    };

    const handleAddCharge = () => {
        const amount = parseFloat(newCharge.amount);
        if (isNaN(amount) || amount <= 0 || !newCharge.remarks.trim()) {
            alert('Please enter a valid amount and remark for the charge.');
            return;
        }
        setStudent(prev => ({
            ...prev,
            totalFee: (prev.totalFee || 0) + amount,
            feeRemarks: `${prev.feeRemarks || ''}\n[${new Date().toISOString().split('T')[0]}] Charge Added: ${newCharge.remarks} - NPR ${amount.toLocaleString()}`.trim(),
        }));
        setNewCharge({ amount: '', remarks: '' });
        alert('Charge added. Remember to save changes.');
    };
    
    const handleRecordCashPayment = () => {
        const amount = parseFloat(cashPayment.amount);
        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid amount for the cash payment.');
            return;
        }
        
        const newPayment: PaymentHistoryItem = {
            invoiceId: `CASH-${Date.now()}`,
            date: cashPayment.date,
            amount: amount,
            status: 'Paid',
            method: 'Cash',
            remarks: cashPayment.remarks.trim() || 'Cash payment received.',
            verifiedBy: 'Admin',
            verificationDate: new Date().toISOString().split('T')[0]
        };

        setStudent(prev => ({
            ...prev,
            paymentHistory: [newPayment, ...(prev.paymentHistory || [])],
        }));

        setCashPayment({ amount: '', remarks: '', date: new Date().toISOString().split('T')[0] });
        alert('Cash payment recorded. Please Save Changes to finalize.');
    };

    const handlePaymentStatus = (invoiceId: string, newStatus: 'Paid' | 'Rejected') => {
        if(newStatus === 'Rejected' && !rejectionReason.trim()){
            alert('Please provide a reason for rejection.');
            return;
        }
        setStudent(prev => ({
            ...prev,
            paymentHistory: prev.paymentHistory?.map(p => 
                p.invoiceId === invoiceId ? { 
                    ...p, 
                    status: newStatus, 
                    rejectionReason: newStatus === 'Rejected' ? rejectionReason : undefined,
                    verifiedBy: newStatus === 'Paid' ? 'Admin' : undefined,
                    verificationDate: newStatus === 'Paid' ? new Date().toISOString().split('T')[0] : undefined,
                 } : p
            ) || [],
        }));
        setRejectionReason('');
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div ref={modalRef} className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-2xl font-bold text-brand-dark">Manage Fees: {student.name}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <div className="border-b mb-4">
              {['Fee Structure', 'Add Charge', 'Record Cash Payment', 'Verify Payments', 'History'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`py-2 px-4 font-semibold ${activeTab === tab ? 'border-b-2 border-brand-red text-brand-red' : 'text-gray-500'}`}>{tab}</button>
              ))}
            </div>
            {activeTab === 'Fee Structure' && <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Fee Breakdown</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {(student.feeItems || []).map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <input type="text" value={item.description} onChange={(e) => handleFeeItemChange(index, 'description', e.target.value)} placeholder="Fee Description (e.g., Tuition)" className="flex-grow p-2 border rounded-md bg-white"/>
                            <input type="number" value={item.amount} onChange={(e) => handleFeeItemChange(index, 'amount', e.target.value)} placeholder="Amount" className="w-32 p-2 border rounded-md bg-white"/>
                            <button type="button" onClick={() => removeFeeItem(index)} className="text-red-500 hover:text-red-700 font-bold p-1 text-xl flex-shrink-0">&times;</button>
                        </div>
                    ))}
                </div>
                <button type="button" onClick={addFeeItem} className="text-sm font-semibold text-blue-600 hover:underline">+ Add Fee Item</button>
                
                <div className="mt-4 pt-4 border-t space-y-3">
                    <div className="flex justify-between items-center text-md">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-semibold">NPR {(student.totalFee || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <label htmlFor="discount" className="text-gray-600">Discount (NPR)</label>
                        <input id="discount" type="number" name="discount" value={student.discount} onChange={handleGenericChange} className="w-32 p-2 border rounded-md text-right bg-white"/>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
                        <span>Total Payable</span>
                        <span>NPR {((student.totalFee || 0) - (student.discount || 0)).toLocaleString()}</span>
                    </div>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                    <label className="block text-sm font-medium mb-1">Due Date</label>
                    <input type="date" name="dueDate" value={student.dueDate} onChange={handleGenericChange} className="w-full p-2 border rounded-md bg-white"/>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Fee Remarks</label>
                    <textarea name="feeRemarks" value={student.feeRemarks} onChange={handleGenericChange} rows={2} className="w-full p-2 border rounded-md bg-white"/>
                </div>
            </div>}
            {activeTab === 'Add Charge' && <div className="space-y-4">
                <p className="text-sm text-gray-600">Add ad-hoc charges like exam fees, book fees, or late penalties.</p>
                <div><label className="text-sm font-medium">Charge Amount (NPR)</label><input type="number" value={newCharge.amount} onChange={(e) => setNewCharge({...newCharge, amount: e.target.value})} className="mt-1 w-full p-2 border rounded-md bg-white"/></div>
                <div><label className="text-sm font-medium">Remarks for Charge</label><input type="text" value={newCharge.remarks} onChange={(e) => setNewCharge({...newCharge, remarks: e.target.value})} className="mt-1 w-full p-2 border rounded-md bg-white"/></div>
                <button onClick={handleAddCharge} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Add Charge to Total</button>
            </div>}
             {activeTab === 'Record Cash Payment' && <div className="space-y-4">
                <p className="text-sm text-gray-600">Manually record a cash payment received from the student.</p>
                <div><label className="text-sm font-medium">Amount Received (NPR)</label><input type="number" value={cashPayment.amount} onChange={(e) => setCashPayment({...cashPayment, amount: e.target.value})} className="mt-1 w-full p-2 border rounded-md bg-white"/></div>
                <div><label className="text-sm font-medium">Payment Date</label><input type="date" value={cashPayment.date} onChange={(e) => setCashPayment({...cashPayment, date: e.target.value})} className="mt-1 w-full p-2 border rounded-md bg-white"/></div>
                <div><label className="text-sm font-medium">Remarks</label><textarea value={cashPayment.remarks} onChange={(e) => setCashPayment({...cashPayment, remarks: e.target.value})} rows={2} className="mt-1 w-full p-2 border rounded-md bg-white"/></div>
                <button onClick={handleRecordCashPayment} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">Record Payment</button>
            </div>}
            {activeTab === 'Verify Payments' && <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {student.paymentHistory?.filter(p => p.status === 'Pending Verification').length > 0 ? student.paymentHistory?.filter(p => p.status === 'Pending Verification').map(p => (
                    <div key={p.invoiceId} className="p-4 border rounded-lg bg-yellow-50">
                        <p><strong>Date:</strong> {p.date} | <strong>Amount:</strong> NPR {p.amount.toLocaleString()}</p>
                        <p><strong>Method:</strong> {p.method} | <strong>Remarks:</strong> {p.remarks}</p>
                        {p.screenshotUrl && <a href={p.screenshotUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Screenshot</a>}
                        <div className="mt-2 space-y-2">
                           <div className="flex gap-2 items-center">
                            <input type="text" placeholder="Rejection reason (if any)" onChange={e=>setRejectionReason(e.target.value)} className="flex-grow p-1 border rounded bg-white" />
                            <button onClick={()=>handlePaymentStatus(p.invoiceId, 'Rejected')} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Reject</button>
                            <button onClick={()=>handlePaymentStatus(p.invoiceId, 'Paid')} className="bg-green-500 text-white px-3 py-1 rounded text-sm">Verify</button>
                           </div>
                        </div>
                    </div>
                )) : <p className="text-center text-gray-500 py-4">No payments pending verification.</p>}
            </div>}
            {activeTab === 'History' && <div className="max-h-96 overflow-y-auto">
                <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-gray-100"><tr className="border-b"><th className="p-2">Date</th><th className="p-2">Amount</th><th className="p-2">Status</th><th className="p-2">Remarks</th></tr></thead>
                    <tbody>
                    {student.paymentHistory && student.paymentHistory.length > 0 ? [...student.paymentHistory].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(p => (
                        <tr key={p.invoiceId} className="border-b"><td className="p-2">{p.date}</td><td className="p-2">NPR {p.amount.toLocaleString()}</td><td className="p-2">{p.status}</td><td className="p-2 italic text-gray-600">{p.remarks}</td></tr>
                    )) : <tr><td colSpan={4} className="text-center p-4">No history.</td></tr>}
                    </tbody>
                </table>
            </div>}
          </div>
          <div className="p-4 border-t bg-gray-50 flex justify-end gap-4">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
            <button onClick={() => { onSave(student); onClose(); }} className="bg-brand-red text-white font-semibold px-4 py-2 rounded-md hover:bg-red-700">Save Changes</button>
          </div>
        </div>
      </div>
    );
};

// Main Component
const ManageFees: React.FC = () => {
    // State management
    const [allStudents, setAllStudents] = useState<Student[]>(getStudentsFromStorage);
    const [selectedStudents, setSelectedStudents] = useState<Set<number>>(new Set());
    const [selectedStudentForManage, setSelectedStudentForManage] = useState<Student | null>(null);
    const [selectedStudentForDetailView, setSelectedStudentForDetailView] = useState<Student | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterLevel, setFilterLevel] = useState('All');
    const [filterPaper, setFilterPaper] = useState('All');
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
    const [isBulkUpdateModalOpen, setIsBulkUpdateModalOpen] = useState(false);
    const [bulkUpdateInfo, setBulkUpdateInfo] = useState({ amount: '', remarks: '' });

    // Persist student data to localStorage
    useEffect(() => {
        localStorage.setItem('students', JSON.stringify(allStudents));
    }, [allStudents]);

    const allPapers = useMemo(() => {
        const papersSet = new Set<string>();
        COURSES.forEach(course => {
            course.papers.forEach(paper => {
                const paperCode = paper.split(':')[0].trim();
                papersSet.add(paperCode);
            });
             if (course.options) {
                 course.options.forEach(paper => {
                    const paperCode = paper.split(':')[0].trim();
                    papersSet.add(paperCode);
                });
            }
        });
        return ['All', ...Array.from(papersSet).sort()];
    }, []);

    // Summary stats for dashboard
    const summaryStats = useMemo(() => {
        let totalOutstanding = 0;
        let totalCollected = 0;
        let pendingVerifications = 0;
        let studentsWithOverdue = 0;

        allStudents.forEach(student => {
            const details = calculateFeeDetails(student);
            totalOutstanding += details.outstandingBalance;
            totalCollected += details.paidAmount;
            if (student.paymentHistory?.some(p => p.status === 'Pending Verification')) {
                pendingVerifications++;
            }
            if (details.isOverdue) {
                studentsWithOverdue++;
            }
        });

        return { totalOutstanding, totalCollected, pendingVerifications, studentsWithOverdue };
    }, [allStudents]);

    // Filtered list of students for the table
    const filteredStudents = useMemo(() => {
        return allStudents
            .filter(student =>
                student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .filter(student => {
                if (filterStatus === 'All') return true;
                const status = getStudentFeeStatusForFilter(student);
                return status === filterStatus;
            })
            .filter(student => {
                if (filterLevel === 'All') return true;
                return student.currentLevel === filterLevel;
            })
            .filter(student => {
                if (filterPaper === 'All') return true;
                return student.enrolledPapers.includes(filterPaper);
            });
    }, [allStudents, searchTerm, filterStatus, filterLevel, filterPaper]);
    
    // Handlers
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const allIds = new Set(filteredStudents.map(s => s.id));
            setSelectedStudents(allIds);
        } else {
            setSelectedStudents(new Set());
        }
    };

    const handleSelectOne = (studentId: number) => {
        const newSelection = new Set(selectedStudents);
        if (newSelection.has(studentId)) {
            newSelection.delete(studentId);
        } else {
            newSelection.add(studentId);
        }
        setSelectedStudents(newSelection);
    };

    const openReminderModal = () => {
        if (selectedStudents.size > 0) {
            setIsReminderModalOpen(true);
        }
    };

    const confirmAndSendReminders = () => {
        setNotification({ type: 'success', message: `Fee reminders sent to ${selectedStudents.size} selected student(s).` });
        setSelectedStudents(new Set());
        setIsReminderModalOpen(false);
        setTimeout(() => setNotification(null), 3000);
    };

    const handleBulkUpdate = () => {
        const amount = parseFloat(bulkUpdateInfo.amount);
        if (isNaN(amount) || amount <= 0 || !bulkUpdateInfo.remarks.trim()) {
            alert('Please enter a valid amount and remark for the bulk update.');
            return;
        }

        setAllStudents(prev =>
            prev.map(student => {
                if (selectedStudents.has(student.id)) {
                    return {
                        ...student,
                        totalFee: (student.totalFee || 0) + amount,
                        feeRemarks: `${student.feeRemarks || ''}\n[${new Date().toISOString().split('T')[0]}] Bulk Update: ${bulkUpdateInfo.remarks} - NPR ${amount.toLocaleString()}`.trim(),
                    };
                }
                return student;
            })
        );
        
        setNotification({ type: 'success', message: `Bulk fee update applied to ${selectedStudents.size} student(s).` });
        setSelectedStudents(new Set());
        setIsBulkUpdateModalOpen(false);
        setBulkUpdateInfo({ amount: '', remarks: '' });
        setTimeout(() => setNotification(null), 3000);
    };


    const handleSaveStudent = (updatedStudent: Student) => {
        setAllStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    };

    const StatCard = ({ title, value, color, icon }: { title: string, value: string | number, color: string, icon: JSX.Element }) => (
        <div className="bg-white p-4 rounded-lg shadow-md flex items-start">
            <div className={`p-3 rounded-full mr-4 ${color.replace('text-', 'bg-').replace('600', '100')}`}>
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-500 font-medium uppercase">{title}</p>
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold text-brand-dark">Fee Management</h1>
            {notification && (
                <div className={`p-3 rounded-md text-sm ${notification.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{notification.message}</div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Outstanding" value={`NPR ${summaryStats.totalOutstanding.toLocaleString()}`} color="text-red-600" icon={<svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>} />
                <StatCard title="Total Collected" value={`NPR ${summaryStats.totalCollected.toLocaleString()}`} color="text-green-600" icon={<svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
                <StatCard title="Pending Verifications" value={summaryStats.pendingVerifications} color="text-yellow-600" icon={<svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                <StatCard title="Students Overdue" value={summaryStats.studentsWithOverdue} color="text-purple-600" icon={<svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="space-y-4">
                     <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex gap-2 flex-wrap">
                            <button onClick={openReminderModal} disabled={selectedStudents.size === 0} className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-sm">
                                Send Reminder ({selectedStudents.size})
                            </button>
                            <button onClick={() => setIsBulkUpdateModalOpen(true)} disabled={selectedStudents.size === 0} className="bg-yellow-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-yellow-700 disabled:bg-yellow-300 disabled:cursor-not-allowed text-sm">
                                Bulk Update ({selectedStudents.size})
                            </button>
                        </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border flex flex-col md:flex-row gap-4 items-center flex-wrap">
                        <span className="font-semibold text-gray-700 flex-shrink-0">Filter by:</span>
                        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="w-full md:w-auto p-2 border rounded-lg bg-white text-sm">
                            <option value="All">All Statuses</option>
                            <option value="Outstanding">Outstanding</option>
                            <option value="Paid">Paid</option>
                            <option value="Pending Verification">Pending Verification</option>
                            <option value="Fee Not Set">Fee Not Set</option>
                        </select>
                        <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)} className="w-full md:w-auto p-2 border rounded-lg bg-white text-sm">
                            <option value="All">All Levels</option>
                            <option value="Applied Knowledge">Applied Knowledge</option>
                            <option value="Applied Skills">Applied Skills</option>
                            <option value="Strategic Professional">Strategic Professional</option>
                        </select>
                        <select value={filterPaper} onChange={e => setFilterPaper(e.target.value)} className="w-full md:w-auto p-2 border rounded-lg bg-white text-sm">
                            {allPapers.map(p => <option key={p} value={p}>{p === 'All' ? 'All Papers' : p}</option>)}
                        </select>
                        <div className="relative md:ml-auto w-full md:w-auto">
                           <input type="text" placeholder="Search name or ID..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full md:w-64 p-2 pl-8 border rounded-lg bg-white text-sm" />
                           <svg className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto mt-4">
                    <table className="w-full text-left min-w-[800px]">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4"><input type="checkbox" onChange={handleSelectAll} checked={selectedStudents.size > 0 && selectedStudents.size === filteredStudents.length} /></th>
                                <th className="p-4 font-semibold text-sm text-gray-600 uppercase">Student</th>
                                <th className="p-4 font-semibold text-sm text-gray-600 uppercase">Status</th>
                                <th className="p-4 font-semibold text-sm text-gray-600 uppercase">Outstanding</th>
                                <th className="p-4 font-semibold text-sm text-gray-600 uppercase">Due Date</th>
                                <th className="p-4 font-semibold text-sm text-gray-600 uppercase">Last Payment</th>
                                <th className="p-4 font-semibold text-sm text-gray-600 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredStudents.map(student => {
                                const { outstandingBalance, lastPaymentDate } = calculateFeeDetails(student);
                                const status = getStudentFeeStatus(student);
                                return (
                                <tr key={student.id} className="hover:bg-gray-50">
                                    <td className="p-4"><input type="checkbox" checked={selectedStudents.has(student.id)} onChange={() => handleSelectOne(student.id)} /></td>
                                    <td className="p-4">
                                        <div className="flex items-center">
                                            <img src={student.avatarUrl} alt={student.name} className="w-10 h-10 rounded-full mr-3 object-cover"/>
                                            <div>
                                                <button onClick={() => setSelectedStudentForDetailView(student)} className="font-medium text-left hover:underline">{student.name}</button>
                                                <p className="text-sm text-gray-500">{student.studentId}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${status.color}`}>
                                            {status.text}
                                        </span>
                                    </td>
                                    <td className={`p-4 font-mono ${outstandingBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>{`NPR ${outstandingBalance.toLocaleString()}`}</td>
                                    <td className={`p-4 font-mono ${status.text === 'Overdue' ? 'text-red-600 font-bold' : ''}`}>{student.dueDate || 'N/A'}</td>
                                    <td className="p-4 font-mono">{lastPaymentDate}</td>
                                    <td className="p-4"><button onClick={() => setSelectedStudentForManage(student)} className="text-sm font-semibold text-blue-600 hover:underline">Manage</button></td>
                                </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedStudentForManage && (
                <FeeManagementModal student={selectedStudentForManage} onClose={() => setSelectedStudentForManage(null)} onSave={handleSaveStudent} />
            )}

            {selectedStudentForDetailView && (
                <StudentDetailModal
                    isOpen={!!selectedStudentForDetailView}
                    onClose={() => setSelectedStudentForDetailView(null)}
                    student={selectedStudentForDetailView}
                    onSave={(updatedStudent) => {
                        handleSaveStudent(updatedStudent);
                        setSelectedStudentForDetailView(null);
                    }}
                />
            )}

            {isReminderModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg">
                        <div className="p-4 border-b"><h3 className="text-lg font-bold">Confirm Reminders</h3></div>
                        <div className="p-6">
                            <p>Are you sure you want to send fee reminders to the following {selectedStudents.size} student(s)?</p>
                            <ul className="list-disc list-inside mt-2 text-sm max-h-40 overflow-y-auto bg-gray-50 p-2 rounded">
                                {allStudents.filter(s => selectedStudents.has(s.id)).map(s => <li key={s.id}>{s.name}</li>)}
                            </ul>
                        </div>
                        <div className="p-4 bg-gray-50 flex justify-end gap-2">
                            <button onClick={() => setIsReminderModalOpen(false)} className="bg-gray-200 px-4 py-2 rounded-md">Cancel</button>
                            <button onClick={confirmAndSendReminders} className="bg-blue-600 text-white px-4 py-2 rounded-md">Confirm & Send</button>
                        </div>
                    </div>
                </div>
            )}

            {isBulkUpdateModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg">
                        <div className="p-4 border-b"><h3 className="text-lg font-bold">Bulk Fee Update</h3></div>
                        <div className="p-6 space-y-4">
                            <p className="text-sm">This will add a charge to all {selectedStudents.size} selected students.</p>
                             <div>
                                <label className="block text-sm font-medium">Charge Amount (NPR)</label>
                                <input type="number" value={bulkUpdateInfo.amount} onChange={e => setBulkUpdateInfo({ ...bulkUpdateInfo, amount: e.target.value })} className="mt-1 w-full p-2 border rounded-md bg-white"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Remarks for Charge</label>
                                <input type="text" value={bulkUpdateInfo.remarks} onChange={e => setBulkUpdateInfo({ ...bulkUpdateInfo, remarks: e.target.value })} className="mt-1 w-full p-2 border rounded-md bg-white"/>
                            </div>
                        </div>
                         <div className="p-4 bg-gray-50 flex justify-end gap-2">
                            <button onClick={() => setIsBulkUpdateModalOpen(false)} className="bg-gray-200 px-4 py-2 rounded-md">Cancel</button>
                            <button onClick={handleBulkUpdate} className="bg-yellow-600 text-white px-4 py-2 rounded-md">Apply Update</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageFees;
