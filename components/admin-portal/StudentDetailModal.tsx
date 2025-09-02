

import React, { useState, useEffect, useRef, useMemo } from 'react';
import type { Student, StudentFeeRecord } from '../../types';
import { STUDENT_FEE_RECORDS, COURSES, TEACHER_RATINGS } from '../../constants';

interface StudentDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    student: Student;
}

type Tab = 'Overview' | 'Academics' | 'Finances' | 'Reviews';

const DetailRow = ({ label, value }: { label: string; value: string }) => (
    <div>
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-md text-gray-900">{value}</dd>
    </div>
);

const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex">
        {[...Array(5)].map((_, i) => (
            <svg key={i} className={`w-5 h-5 ${i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))}
    </div>
);


const StudentDetailModal: React.FC<StudentDetailModalProps> = ({ isOpen, onClose, student }) => {
    const [activeTab, setActiveTab] = useState<Tab>('Overview');
    const modalRef = useRef<HTMLDivElement>(null);

    const studentFeeRecord = STUDENT_FEE_RECORDS.find(record => record.studentId === student.studentId);

    const allPapersMap = useMemo(() => {
        const map = new Map<string, string>();
        COURSES.forEach(course => {
            course.papers.forEach(paper => {
                const code = paper.split(':')[0].trim();
                map.set(code, paper);
            });
        });
        return map;
    }, []);

    const getFullPaperName = (paperCode: string) => {
        return allPapersMap.get(paperCode) || paperCode;
    };
    
    const overallAttendance = useMemo(() => {
        if (!student.attendance || Object.keys(student.attendance).length === 0) {
            return 'N/A';
        }
        const attendanceValues = Object.values(student.attendance);
        const total = attendanceValues.reduce((sum, current) => sum + current, 0);
        const average = total / attendanceValues.length;
        return `${average.toFixed(1)}%`;
    }, [student.attendance]);

    const studentReviews = useMemo(() => {
        return TEACHER_RATINGS.filter(rating => rating.studentId === student.id);
    }, [student.id]);


    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            setActiveTab('Overview'); // Reset to first tab on open
        }
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Overview':
                return (
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                        <DetailRow label="Full Name" value={student.name} />
                        <DetailRow label="Student ID" value={student.studentId} />
                        <DetailRow label="Email Address" value={student.email} />
                        <DetailRow label="Phone Number" value={student.phone} />
                        <DetailRow label="Date of Birth" value={student.dob} />
                        <DetailRow label="Address" value={student.address} />
                        <DetailRow label="Enrollment Date" value={student.enrollmentDate} />
                        <DetailRow label="Current Level" value={student.currentLevel} />
                        <DetailRow label="Overall Attendance" value={overallAttendance} />
                    </dl>
                );
            case 'Academics':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold text-lg mb-2 text-brand-dark">Enrolled Papers</h3>
                            <ul className="list-disc list-inside bg-gray-50 p-4 rounded-md">
                                {student.enrolledPapers.map(code => <li key={code}>{getFullPaperName(code)}</li>)}
                            </ul>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold text-lg mb-2 text-brand-dark">Results</h3>
                                <div className="border rounded-md overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="p-2 text-left">Paper</th>
                                                <th className="p-2 text-center">Score</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {student.enrolledPapers.map(code => (
                                                <tr key={code}>
                                                    <td className="p-2">{code}</td>
                                                    <td className="p-2 text-center font-mono">{student.grades?.[code] ?? 'N/A'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                             <div>
                                <h3 className="font-semibold text-lg mb-2 text-brand-dark">Attendance</h3>
                                <div className="border rounded-md overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="p-2 text-left">Paper</th>
                                                <th className="p-2 text-center">Percentage</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {student.enrolledPapers.map(code => (
                                                <tr key={code}>
                                                    <td className="p-2">{code}</td>
                                                    <td className="p-2 text-center font-mono">{student.attendance?.[code] ? `${student.attendance[code]}%` : 'N/A'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'Finances':
                if (!studentFeeRecord) return <p className="text-gray-500">No fee record found for this student.</p>;
                return (
                    <div className="bg-brand-beige p-6 rounded-lg shadow-inner">
                        <h3 className="font-semibold text-xl mb-4 text-brand-dark border-b pb-2">Fee Summary</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500">Total Fees</p>
                                <p className="text-2xl font-bold">NPR {studentFeeRecord.totalFees.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Amount Paid</p>
                                <p className="text-2xl font-bold text-green-600">NPR {studentFeeRecord.paidAmount.toLocaleString()}</p>
                            </div>
                             <div>
                                <p className="text-sm text-gray-500">Outstanding Balance</p>
                                <p className="text-2xl font-bold text-brand-red">NPR {studentFeeRecord.outstandingBalance.toLocaleString()}</p>
                            </div>
                             <div>
                                <p className="text-sm text-gray-500">Due Date</p>
                                <p className="text-lg font-semibold">{studentFeeRecord.dueDate}</p>
                            </div>
                             <div>
                                <p className="text-sm text-gray-500">Status</p>
                                <p className="text-lg font-semibold">{studentFeeRecord.status}</p>
                            </div>
                        </div>
                    </div>
                );
            case 'Reviews':
                return (
                    <div>
                        {studentReviews.length > 0 ? (
                            <div className="space-y-4">
                                {studentReviews.map(review => (
                                    <div key={review.id} className="bg-gray-50 p-4 rounded-lg border">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-semibold text-brand-dark">Feedback for {review.teacherName}</p>
                                                <p className="text-sm text-gray-500">{review.classTopic}</p>
                                            </div>
                                            <div className="text-right flex-shrink-0 ml-4">
                                                <StarRating rating={review.rating} />
                                                <p className="text-xs text-gray-400 mt-1 font-mono">{review.date}</p>
                                            </div>
                                        </div>
                                        <p className="mt-2 text-gray-700 italic">"{review.feedback}"</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 py-8">No feedback submitted by this student.</p>
                        )}
                    </div>
                );
        }
    };
    
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div 
                ref={modalRef}
                className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 border-b flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <img src={student.avatarUrl} alt={student.name} className="w-16 h-16 rounded-full border-2 border-brand-red" />
                        <div>
                            <h2 className="text-2xl font-bold text-brand-dark">{student.name}</h2>
                            <p className="text-gray-500 font-mono">{student.studentId}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl" aria-label="Close modal">&times;</button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="border-b border-gray-200 mb-6">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            {(['Overview', 'Academics', 'Finances', 'Reviews'] as Tab[]).map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`${
                                        activeTab === tab
                                            ? 'border-brand-red text-brand-red'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div>
                        {renderTabContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDetailModal;