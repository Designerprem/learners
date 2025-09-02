

import React, { useState } from 'react';
import { STUDENT_FEE_RECORDS } from '../../constants';
import type { StudentFeeRecord } from '../../types';

const statusStyles: { [key in StudentFeeRecord['status']]: string } = {
    Verified: 'bg-green-100 text-green-700',
    'Pending Verification': 'bg-yellow-100 text-yellow-700',
    Overdue: 'bg-red-100 text-red-700',
    Paid: 'bg-blue-100 text-blue-700', // Paid but not yet verified
};

const ManageFees: React.FC = () => {
    const [feeRecords, setFeeRecords] = useState<StudentFeeRecord[]>(STUDENT_FEE_RECORDS);
    const [message, setMessage] = useState('');

    const handleVerifyPayment = (id: number) => {
        setFeeRecords(prev => prev.map(record => {
            if (record.id === id && record.status === 'Pending Verification') {
                setMessage(`Payment for ${record.studentName} has been verified.`);
                setTimeout(() => setMessage(''), 3000);
                return { ...record, status: 'Verified', outstandingBalance: 0 };
            }
            return record;
        }));
    };
    
    return (
        <div>
            <h1 className="text-3xl md:text-4xl font-bold text-brand-dark mb-2">Fee Management</h1>
            <p className="text-gray-600 mb-8">Review and manage student fee payment statuses.</p>

            {message && <div className="mb-4 p-3 bg-green-100 text-green-800 text-sm rounded-md" role="alert">{message}</div>}

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 font-semibold text-sm text-gray-600 uppercase">Student Name</th>
                                <th className="p-4 font-semibold text-sm text-gray-600 uppercase">Student ID</th>
                                <th className="p-4 font-semibold text-sm text-gray-600 uppercase text-right">Outstanding (NPR)</th>
                                <th className="p-4 font-semibold text-sm text-gray-600 uppercase">Due Date</th>
                                <th className="p-4 font-semibold text-sm text-gray-600 uppercase text-center">Status</th>
                                <th className="p-4 font-semibold text-sm text-gray-600 uppercase text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {feeRecords.map(record => (
                                <tr key={record.id} className="hover:bg-gray-50">
                                    <td className="p-4 font-medium whitespace-nowrap">{record.studentName}</td>
                                    <td className="p-4 text-sm font-mono">{record.studentId}</td>
                                    <td className="p-4 text-right font-mono">{record.outstandingBalance.toLocaleString()}</td>
                                    <td className="p-4 text-sm whitespace-nowrap">{record.dueDate}</td>
                                    <td className="p-4 text-center">
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${statusStyles[record.status]}`}>
                                            {record.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        {record.status === 'Pending Verification' ? (
                                            <button 
                                                onClick={() => handleVerifyPayment(record.id)}
                                                className="text-xs font-semibold text-green-600 hover:text-green-800 bg-green-100 px-3 py-2 rounded-md transition-colors whitespace-nowrap"
                                            >
                                                Verify Payment
                                            </button>
                                        ) : (
                                            <span className="text-xs text-gray-400">-</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageFees;
