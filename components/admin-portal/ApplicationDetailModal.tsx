
import React, { useEffect, useRef } from 'react';
import type { Application } from '../../types';

interface ApplicationDetailModalProps {
    application: Application;
    onClose: () => void;
    onApprove: () => void;
    onReject: () => void;
}

const DetailRow = ({ label, value }: { label: string; value?: string }) => (
    <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="mt-1 text-md text-gray-900">{value || 'N/A'}</p>
    </div>
);

const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({ application, onClose, onApprove, onReject }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div
                ref={modalRef}
                className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-brand-dark">Application Details</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl" aria-label="Close modal">&times;</button>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        <img 
                            src={application.photoUrl || 'https://via.placeholder.com/150'} 
                            alt={application.fullName} 
                            className="w-32 h-32 rounded-lg object-cover border-2 border-gray-200"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 flex-1">
                            <DetailRow label="Full Name" value={application.fullName} />
                            <DetailRow label="Email Address" value={application.email} />
                            <DetailRow label="Phone Number" value={application.phone} />
                            <DetailRow label="Submitted On" value={application.submittedDate} />
                            <div className="sm:col-span-2">
                                <DetailRow label="Program of Interest" value={application.program} />
                            </div>
                            <div className="sm:col-span-2">
                                <p className="text-sm font-medium text-gray-500">Uploaded Certificate/Transcript</p>
                                {application.documentUrl ? (
                                    <a 
                                        href={application.documentUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="mt-1 text-md text-blue-600 hover:underline inline-flex items-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                                        View Document
                                    </a>
                                ) : (
                                    <p className="mt-1 text-md text-gray-900">No document uploaded.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-4 border-t bg-gray-50 flex justify-end gap-4">
                    <button 
                        onClick={onReject}
                        className="bg-red-100 text-red-700 font-semibold px-6 py-2 rounded-md hover:bg-red-200"
                    >
                        Reject
                    </button>
                    <button 
                        onClick={onApprove}
                        className="bg-green-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-green-700"
                    >
                        Approve
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApplicationDetailModal;
