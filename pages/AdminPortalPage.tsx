import React, { useState, useEffect } from 'react';
// FIX: Changed import to react-router-dom to resolve module export errors.
// FIX: Switched to namespace import for react-router-dom to fix module resolution issues.
import * as ReactRouterDOM from 'react-router-dom';
import AdminSidebar from '../components/admin-portal/AdminSidebar';
import Dashboard from './admin-portal/Dashboard';
import ManageStudents from './admin-portal/ManageStudents';
import ManageFaculty from './admin-portal/ManageFaculty';
import ManageCourses from './admin-portal/ManageCourses';
import ManageAdmissions from './admin-portal/ManageAdmissions';
import ManageAnnouncements from './admin-portal/ManageAnnouncements';
import ManageFees from './admin-portal/ManageFees.tsx';
import TeacherRatings from './admin-portal/TeacherRatings';
import ManageContentPage from './admin-portal/ManageContentPage';
import MockTestsSubmissions from './admin-portal/MockTestsSubmissions.tsx';
import SettingsPage from './admin-portal/SettingsPage';
import ManageSalary from './admin-portal/ManageSalary';
import { getLoggedInUser } from '../services/authService.ts';
import LiveDateTime from '../components/LiveDateTime.tsx';
import { ADMIN_USER } from '../constants.ts';

const AdminPortalLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = ReactRouterDOM.useNavigate();
    const admin = ADMIN_USER;

    useEffect(() => {
        const { user, role } = getLoggedInUser();
        if (role !== 'admin' || !user) {
            navigate('/login?role=admin', { replace: true });
        }
    }, [navigate]);

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* FIX: Corrected the prop name from 'setIsOpen' to 'setIsSidebarOpen' to match the state setter function from useState. */}
            <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-y-auto lg:ml-64">
                 <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-20 border-b">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-brand-red">
                           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                       </button>
                       <LiveDateTime />
                    </div>
                    <div></div>
                </header>
                <main className="flex-1 p-4 sm:p-6 lg:p-10">
                    <ReactRouterDOM.Outlet />
                </main>
            </div>
        </div>
    );
};

const AdminPortalPage: React.FC = () => {
    // This component assumes the admin is already logged in.
    return (
        <ReactRouterDOM.Routes>
            <ReactRouterDOM.Route element={<AdminPortalLayout />}>
                <ReactRouterDOM.Route index element={<ReactRouterDOM.Navigate to="dashboard" replace />} />
                <ReactRouterDOM.Route path="dashboard" element={<Dashboard />} />
                <ReactRouterDOM.Route path="students" element={<ManageStudents />} />
                <ReactRouterDOM.Route path="faculty" element={<ManageFaculty />} />
                <ReactRouterDOM.Route path="courses" element={<ManageCourses />} />
                <ReactRouterDOM.Route path="admissions" element={<ManageAdmissions />} />
                <ReactRouterDOM.Route path="announcements" element={<ManageAnnouncements />} />
                <ReactRouterDOM.Route path="fees" element={<ManageFees />} />
                <ReactRouterDOM.Route path="salary" element={<ManageSalary />} />
                <ReactRouterDOM.Route path="mock-tests" element={<MockTestsSubmissions />} />
                <ReactRouterDOM.Route path="ratings" element={<TeacherRatings />} />
                <ReactRouterDOM.Route path="content" element={<ManageContentPage />} />
                <ReactRouterDOM.Route path="settings" element={<SettingsPage />} />
            </ReactRouterDOM.Route>
        </ReactRouterDOM.Routes>
    );
};

export default AdminPortalPage;