


import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, Link, Navigate, Outlet } from 'react-router-dom';
import StudentSidebar from '../components/student-portal/StudentSidebar';
import Dashboard from './student-portal/Dashboard';
import MyCourses from './student-portal/MyCourses';
import Results from './student-portal/Results';
import Profile from './student-portal/Profile';
import Community from './student-portal/Community';
import LiveClasses from './student-portal/LiveClasses';
import FeePayment from './student-portal/FeePayment';
import SchedulePage from './student-portal/SchedulePage';
import type { Notification } from '../types';
import { NOTIFICATIONS } from '../constants';

const StudentPortalLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS);
    const notificationRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleNotificationClick = (id: number) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <StudentSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className="flex-1 flex flex-col lg:ml-64">
                <header className="bg-white shadow-sm p-4 flex justify-between lg:justify-end items-center sticky top-0 z-20 border-b">
                    <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-brand-red">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                    </button>
                    <div className="relative" ref={notificationRef}>
                        <button 
                            onClick={() => setIsNotificationsOpen(prev => !prev)}
                            className="text-gray-500 hover:text-brand-red relative" 
                            aria-label="View notifications"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                            </svg>
                             {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-4 w-4 bg-brand-red text-white text-xs items-center justify-center">{unreadCount}</span>
                                </span>
                            )}
                        </button>
                        {isNotificationsOpen && (
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border z-30 animate-fade-in-down">
                                <div className="p-3 border-b flex justify-between items-center">
                                    <h3 className="font-bold text-gray-800">Notifications</h3>
                                    <button onClick={() => setNotifications(prev => prev.map(n => ({...n, read: true})))} className="text-xs text-brand-red font-semibold hover:underline">Mark all as read</button>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.length > 0 ? notifications.map(notification => (
                                        <div 
                                            key={notification.id}
                                            onClick={() => handleNotificationClick(notification.id)}
                                            className={`p-3 flex items-start hover:bg-gray-50 cursor-pointer border-b last:border-b-0 ${!notification.read ? 'bg-red-50' : ''}`}
                                        >
                                            <div className={`w-2 h-2 rounded-full mt-1.5 mr-3 flex-shrink-0 ${!notification.read ? 'bg-brand-red' : 'bg-gray-300'}`}></div>
                                            <div>
                                                <p className="font-semibold text-sm text-gray-800">{notification.title}</p>
                                                <p className="text-sm text-gray-600">{notification.message}</p>
                                                <p className="text-xs text-gray-400 mt-1">{notification.timestamp}</p>
                                            </div>
                                        </div>
                                    )) : <p className="p-4 text-center text-gray-500">No new notifications.</p>}
                                </div>
                                <div className="p-2 border-t text-center bg-gray-50 rounded-b-lg">
                                    <Link to="#" className="text-sm font-semibold text-brand-red hover:underline">View all</Link>
                                </div>
                                <style>{`
                                    @keyframes fade-in-down {
                                        0% { opacity: 0; transform: translateY(-10px); }
                                        100% { opacity: 1; transform: translateY(0); }
                                    }
                                    .animate-fade-in-down { animation: fade-in-down 0.3s ease-out forwards; }
                                `}</style>
                            </div>
                        )}
                    </div>
                </header>
                <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

const StudentPortalPage: React.FC = () => {
    // In a real app, you'd have a check here to see if the user is authenticated.
    // For this prototype, we'll assume they are and render the portal directly.
    return (
        <Routes>
            <Route path="/" element={<StudentPortalLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="courses" element={<MyCourses />} />
                <Route path="classes" element={<LiveClasses />} />
                <Route path="schedule" element={<SchedulePage />} />
                <Route path="fee-payment" element={<FeePayment />} />
                <Route path="results" element={<Results />} />
                <Route path="profile" element={<Profile />} />
                <Route path="community" element={<Community />} />
            </Route>
        </Routes>
    );
};

export default StudentPortalPage;
