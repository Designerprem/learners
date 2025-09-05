import React, { useState, useRef, useEffect } from 'react';
// FIX: Split react-router-dom imports to resolve module export errors.
import { Link } from 'react-router-dom';
import { Routes, Route, Navigate, Outlet, useNavigate, useOutletContext } from 'react-router';
import StudentSidebar from '../components/student-portal/StudentSidebar.tsx';
import Dashboard from './student-portal/Dashboard.tsx';
import MyCourses from './student-portal/MyCourses.tsx';
import Results from './student-portal/Results.tsx';
import Profile from './student-portal/Profile.tsx';
import Community from './student-portal/Community.tsx';
import LiveClasses from './student-portal/LiveClasses.tsx';
import FeePayment from './student-portal/FeePayment.tsx';
import SchedulePage from './student-portal/SchedulePage.tsx';
import type { Notification, Announcement, Student } from '../types.ts';
import { NOTIFICATIONS, GLOBAL_ANNOUNCEMENTS } from '../constants.ts';
import AnnouncementPopup from '../components/AnnouncementPopup.tsx';
import { getLoggedInUser } from '../services/authService.ts';

const StudentPortalLayout = () => {
    const [student, setStudent] = useState<Student | null>(null);
    const navigate = useNavigate();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS);
    const [announcementPopup, setAnnouncementPopup] = useState<Announcement | null>(null);
    const notificationRef = useRef<HTMLDivElement>(null);

     useEffect(() => {
        const { user, role } = getLoggedInUser();
        if (role === 'student' && user) {
            setStudent(user as Student);
        } else {
            navigate('/login?role=student', { replace: true });
        }
    }, [navigate]);

    useEffect(() => {
        if (!student) return;

        try {
            const storedAnnouncements: Announcement[] = JSON.parse(localStorage.getItem('globalAnnouncements') || JSON.stringify(GLOBAL_ANNOUNCEMENTS));
            const studentAnnouncements = storedAnnouncements.filter(
                ann => ann.audience === 'All Students' || ann.audience === 'All Students & Faculty'
            ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            const seenPopups: number[] = JSON.parse(localStorage.getItem('seenAnnouncementPopups') || '[]');
            const firstUnseenPopup = studentAnnouncements.find(ann => !seenPopups.includes(ann.id));
            if (firstUnseenPopup) {
                setAnnouncementPopup(firstUnseenPopup);
            }

            const announcementNotifications: Notification[] = studentAnnouncements.map(ann => ({
                id: ann.id,
                type: 'announcement',
                title: ann.title,
                message: ann.content,
                timestamp: new Date(ann.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                read: false,
            }));

            setNotifications(prev => {
                const existingNotificationIds = new Set(prev.map(n => n.id));
                const newNotifications = announcementNotifications.filter(ann => !existingNotificationIds.has(ann.id));
                return [...newNotifications, ...prev];
            });
        } catch (error) {
            console.error("Failed to process announcements:", error);
        }
    }, [student]);

    const handleClosePopup = () => {
        if (announcementPopup) {
            try {
                const seenPopups: number[] = JSON.parse(localStorage.getItem('seenAnnouncementPopups') || '[]');
                localStorage.setItem('seenAnnouncementPopups', JSON.stringify([...seenPopups, announcementPopup.id]));
            } catch (error) {
                console.error("Failed to update seen popups:", error);
            }
            setAnnouncementPopup(null);
        }
    };

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

    if (!student) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>; // Or a spinner
    }

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <StudentSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} student={student} />
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
                    <Outlet context={{ student }} />
                </main>
                {announcementPopup && <AnnouncementPopup announcement={announcementPopup} onClose={handleClosePopup} />}
            </div>
        </div>
    );
};

export function useStudent() {
    return useOutletContext<{ student: Student }>();
}

const StudentPortalPage: React.FC = () => {
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