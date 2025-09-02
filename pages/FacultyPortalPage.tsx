


import React, { useState } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import FacultySidebar from '../components/faculty-portal/FacultySidebar';
import Dashboard from './faculty-portal/Dashboard';
import MyClasses from './faculty-portal/MyClasses';
import Grading from './faculty-portal/Grading';
import Announcements from './faculty-portal/Announcements';
import Schedule from './faculty-portal/Schedule';
import Profile from './faculty-portal/Profile';
import StudentQuestions from './faculty-portal/StudentQuestions';

const FacultyPortalLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <FacultySidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-y-auto lg:ml-64">
                <header className="bg-white shadow-sm p-4 flex justify-between lg:justify-end items-center sticky top-0 z-20 border-b">
                     <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-brand-red">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                    </button>
                    <h1 className="text-lg font-semibold lg:hidden">Faculty Portal</h1>
                    <div />
                </header>
                <main className="flex-1 p-4 sm:p-6 lg:p-10">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

const FacultyPortalPage: React.FC = () => {
    // This component assumes the faculty member is already logged in.
    return (
        <Routes>
            <Route element={<FacultyPortalLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="classes" element={<MyClasses />} />
                <Route path="grading" element={<Grading />} />
                <Route path="announcements" element={<Announcements />} />
                <Route path="schedule" element={<Schedule />} />
                <Route path="profile" element={<Profile />} />
                <Route path="student-questions" element={<StudentQuestions />} />
            </Route>
        </Routes>
    );
};

export default FacultyPortalPage;
