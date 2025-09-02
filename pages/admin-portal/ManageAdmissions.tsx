


import React, { useState } from 'react';
import { PENDING_APPLICATIONS } from '../../constants';
import type { Application } from '../../types';
import AddStudentModal from '../../components/admin-portal/AddStudentModal';
import ApplicationDetailModal from '../../components/admin-portal/ApplicationDetailModal';

type Tab = 'Pending' | 'Approved' | 'Rejected';

const ManageAdmissions: React.FC = () => {
    const [pending, setPending] = useState<Application[]>(PENDING_APPLICATIONS);
    const [approved, setApproved] = useState<Application[]>([]);
    const [rejected, setRejected] = useState<Application[]>([]);
    const [activeTab, setActiveTab] = useState<Tab>('Pending');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
    
    const handleAction = (id: number, newStatus: 'Approved' | 'Rejected') => {
        const application = pending.find(app => app.id === id);
        if (application) {
            setPending(pending.filter(app => app.id !== id));
            if (newStatus === 'Approved') {
                setApproved(prev => [{ ...application, status: 'Approved' }, ...prev]);
            } else {
                setRejected(prev => [{ ...application, status: 'Rejected' }, ...prev]);
            }
        }
        setSelectedApplication(null); // Close modal after action
    };

    const handleAddStudent = (newApplication: Application) => {
        setApproved(prev => [newApplication, ...prev]);
        setIsAddModalOpen(false);
    };

    const tabs: { name: Tab, count: number }[] = [
        { name: 'Pending', count: pending.length },
        { name: 'Approved', count: approved.length },
        { name: 'Rejected', count: rejected.length },
    ];
    
    const currentList = {
        Pending: pending,
        Approved: approved,
        Rejected: rejected
    }[activeTab];

    return (
         <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl md:text-4xl font-bold text-brand-dark">Manage Admissions</h1>
                 <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-brand-red text-white font-semibold px-4 py-2 rounded-md hover:bg-red-700 transition-colors w-full md:w-auto"
                >
                    Manual Admission
                </button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                 <div className="border-b border-gray-200 mb-4">
                    <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto" aria-label="Tabs">
                        {tabs.map(tab => (
                            <button
                                key={tab.name}
                                onClick={() => setActiveTab(tab.name)}
                                className={`${
                                    activeTab === tab.name
                                        ? 'border-brand-red text-brand-red'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                {tab.name} <span className="bg-gray-200 text-gray-800 ml-2 py-0.5 px-2 rounded-full text-xs">{tab.count}</span>
                            </button>
                        ))}
                    </nav>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[700px]">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 font-semibold text-sm text-gray-600 uppercase">Applicant</th>
                                <th className="p-4 font-semibold text-sm text-gray-600 uppercase">Contact</th>
                                <th className="p-4 font-semibold text-sm text-gray-600 uppercase">Program</th>
                                <th className="p-4 font-semibold text-sm text-gray-600 uppercase">Submitted On</th>
                                <th className="p-4 font-semibold text-sm text-gray-600 uppercase text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {currentList.length > 0 ? currentList.map(app => (
                                <tr key={app.id} className="hover:bg-gray-50">
                                    <td className="p-4 font-medium flex items-center">
                                         <img src={app.photoUrl || 'https://via.placeholder.com/40'} alt={app.fullName} className="w-10 h-10 rounded-full mr-3 object-cover" />
                                        {app.fullName}
                                    </td>
                                    <td className="p-4 text-sm">
                                        <div>{app.email}</div>
                                        <div className="font-mono text-xs text-gray-600">{app.phone || 'N/A'}</div>
                                    </td>
                                    <td className="p-4 text-sm">{app.program}</td>
                                    <td className="p-4 text-sm font-mono">{app.submittedDate}</td>
                                    <td className="p-4 text-center space-x-2 whitespace-nowrap">
                                        {app.status === 'Pending' ? (
                                            <button onClick={() => setSelectedApplication(app)} className="text-sm font-semibold text-blue-600 hover:underline">
                                                View Details
                                            </button>
                                        ) : (
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${app.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {app.status}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="text-center p-8 text-gray-500">No applications in this category.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
             <AddStudentModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAddStudent={handleAddStudent}
            />
            {selectedApplication && (
                <ApplicationDetailModal
                    application={selectedApplication}
                    onClose={() => setSelectedApplication(null)}
                    onApprove={() => handleAction(selectedApplication.id, 'Approved')}
                    onReject={() => handleAction(selectedApplication.id, 'Rejected')}
                />
            )}
        </div>
    );
};

export default ManageAdmissions;
