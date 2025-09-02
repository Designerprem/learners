

import React, { useState, useEffect, useRef, useMemo } from 'react';
import type { FacultyMember, CalendarEvent } from '../../types';
import { CALENDAR_EVENTS, TEACHER_RATINGS } from '../../constants';

interface FacultyDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    faculty: FacultyMember;
}

type Tab = 'Overview' | 'Teaching Schedule' | 'Student Reviews';

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

const FacultyDetailModal: React.FC<FacultyDetailModalProps> = ({ isOpen, onClose, faculty }) => {
    const [activeTab, setActiveTab] = useState<Tab>('Overview');
    const modalRef = useRef<HTMLDivElement>(null);

    const teachingSchedule = useMemo(() => {
        return CALENDAR_EVENTS
            .filter(event => event.instructor === faculty.name && event.type === 'class')
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [faculty.name]);

    const studentReviews = useMemo(() => {
        return TEACHER_RATINGS
            .filter(rating => rating.teacherId === faculty.id)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [faculty.id]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            setActiveTab('Overview');
        }
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Overview':
                return (
                    <div className="space-y-6">
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                            <DetailRow label="Full Name" value={faculty.name} />
                            <DetailRow label="Qualification" value={faculty.qualification} />
                            <DetailRow label="Email Address" value={faculty.email} />
                            <DetailRow label="Phone Number" value={faculty.phone} />
                        </dl>
                        <div>
                             <h3 className="font-semibold text-lg mb-2 text-brand-dark border-b pb-2">Biography</h3>
                             <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{faculty.bio}</p>
                        </div>
                         <div>
                            <h3 className="font-semibold text-lg mb-2 text-brand-dark border-b pb-2">Assigned Papers</h3>
                            <ul className="list-disc list-inside bg-gray-50 p-4 rounded-md space-y-1">
                                {faculty.assignedPapers.map(paper => <li key={paper}>{paper}</li>)}
                            </ul>
                        </div>
                    </div>
                );
            case 'Teaching Schedule':
                return (
                     <div>
                        {teachingSchedule.length > 0 ? (
                            <div className="border rounded-md overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="p-3 text-left font-semibold">Date</th>
                                            <th className="p-3 text-left font-semibold">Time</th>
                                            <th className="p-3 text-left font-semibold">Paper</th>
                                            <th className="p-3 text-left font-semibold">Topic</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {teachingSchedule.map(event => (
                                            <tr key={event.id}>
                                                <td className="p-3 font-mono">{event.date}</td>
                                                <td className="p-3">{event.startTime} - {event.endTime}</td>
                                                <td className="p-3">{event.paper}</td>
                                                <td className="p-3">{event.title}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 py-8">No classes found in the schedule.</p>
                        )}
                    </div>
                );
            case 'Student Reviews':
                return (
                     <div>
                        {studentReviews.length > 0 ? (
                            <div className="space-y-4">
                                {studentReviews.map(review => (
                                    <div key={review.id} className="bg-gray-50 p-4 rounded-lg border">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-semibold text-brand-dark">Feedback from {review.studentName}</p>
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
                            <p className="text-center text-gray-500 py-8">No feedback submitted for this faculty member yet.</p>
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
                        <img src={faculty.imageUrl} alt={faculty.name} className="w-16 h-16 rounded-full border-2 border-brand-red" />
                        <div>
                            <h2 className="text-2xl font-bold text-brand-dark">{faculty.name}</h2>
                            <p className="text-gray-500">{faculty.qualification}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl" aria-label="Close modal">&times;</button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="border-b border-gray-200 mb-6">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            {(['Overview', 'Teaching Schedule', 'Student Reviews'] as Tab[]).map(tab => (
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

export default FacultyDetailModal;