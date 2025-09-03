

import React, { useState } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin-portal/AdminSidebar';
import Dashboard from './admin-portal/Dashboard';
import ManageStudents from './admin-portal/ManageStudents';
import ManageFaculty from './admin-portal/ManageFaculty';
import ManageCourses from './admin-portal/ManageCourses';
import ManageAdmissions from './admin-portal/ManageAdmissions';
import ManageAnnouncements from './admin-portal/ManageAnnouncements';
import ManageFees from './admin-portal/ManageFees';
import TeacherRatings from './admin-portal/TeacherRatings';
import ManageContentPage from './admin-portal/ManageContentPage';
import MockResults from './admin-portal/MockResults';
import SettingsPage from './admin-portal/SettingsPage';

const AdminPortalLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-y-auto lg:ml-64">
                 <header className="bg-white shadow-sm p-4 flex justify-between lg:justify-end items-center sticky top-0 z-20 border-b">
                     <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-brand-red">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                    </button>
                    <h1 className="text-lg font-semibold lg:hidden">Admin Portal</h1>
                    <div />
                </header>
                <main className="flex-1 p-4 sm:p-6 lg:p-10">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

const AdminPortalPage: React.FC = () => {
    // This component assumes the admin is already logged in.
    return (
        <Routes>
            <Route element={<AdminPortalLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="students" element={<ManageStudents />} />
                <Route path="faculty" element={<ManageFaculty />} />
                <Route path="courses" element={<ManageCourses />} />
                <Route path="admissions" element={<ManageAdmissions />} />
                <Route path="announcements" element={<ManageAnnouncements />} />
                <Route path="fees" element={<ManageFees />} />
                <Route path="mock-results" element={<MockResults />} />
                <Route path="ratings" element={<TeacherRatings />} />
                <Route path="content" element={<ManageContentPage />} />
                <Route path="settings" element={<SettingsPage />} />
            </Route>
        </Routes>
    );
};

export default AdminPortalPage;