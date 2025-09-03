

import React, { useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import type { FacultyMember } from '../../types';
import { logout } from '../../services/authService';

const icons = {
    dashboard: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>,
    classes: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>,
    grading: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>,
    profile: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>,
    logout: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>,
    announcements: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.277 0 7.423-4.586 6.357-8.455A4.002 4.002 0 0118 4v6c0 .635-.21 1.223-.592 1.699l-2.147 6.15a1.76 1.76 0 01-3.417-.592V5.882z"></path></svg>,
    schedule: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>,
    questions: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>,
    students: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
};

const SidebarLink = ({ to, icon, children, onClick }: { to: string; icon: JSX.Element; children: React.ReactNode; onClick?: () => void }) => (
    <NavLink
        to={to}
        end
        onClick={onClick}
        className={({ isActive }) =>
            `flex items-center px-4 py-3 space-x-3 rounded-lg transition-colors duration-200 ${
            isActive
                ? 'bg-brand-red text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`
        }
    >
        {icon}
        <span className="font-medium">{children}</span>
    </NavLink>
);

interface FacultySidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    facultyMember: FacultyMember;
}

const FacultySidebar: React.FC<FacultySidebarProps> = ({ isOpen, setIsOpen, facultyMember }) => {
    const navigate = useNavigate();
    const sidebarRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setIsOpen]);

    const handleLogoutClick = () => {
        logout();
        setIsOpen(false);
        navigate('/login?role=faculty');
    };
    
    const handleLinkClick = () => {
        setIsOpen(false);
    }

    return (
        <>
            <div className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)}></div>
            <aside
                ref={sidebarRef}
                className={`fixed top-0 left-0 h-full w-64 bg-brand-dark text-white flex flex-col p-4 z-40 transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:fixed`}
            >
                <div className="flex items-center mb-10 px-2">
                    <img src={facultyMember.imageUrl} alt={`${facultyMember.name}'s profile picture`} className="w-10 h-10 rounded-full" />
                    <div className="ml-3">
                        <p className="text-lg font-bold leading-tight">{facultyMember.name}</p>
                        <p className="text-xs text-gray-400">Faculty</p>
                    </div>
                </div>
                <nav className="flex-1 space-y-2">
                    <SidebarLink to="/faculty-portal/dashboard" icon={icons.dashboard} onClick={handleLinkClick}>Dashboard</SidebarLink>
                    <SidebarLink to="/faculty-portal/classes" icon={icons.classes} onClick={handleLinkClick}>My Classes</SidebarLink>
                    <SidebarLink to="/faculty-portal/my-students" icon={icons.students} onClick={handleLinkClick}>My Students</SidebarLink>
                    <SidebarLink to="/faculty-portal/grading" icon={icons.grading} onClick={handleLinkClick}>Grading &amp; Results</SidebarLink>
                    <SidebarLink to="/faculty-portal/announcements" icon={icons.announcements} onClick={handleLinkClick}>Announcements</SidebarLink>
                    <SidebarLink to="/faculty-portal/schedule" icon={icons.schedule} onClick={handleLinkClick}>My Schedule</SidebarLink>
                    <SidebarLink to="/faculty-portal/student-questions" icon={icons.questions} onClick={handleLinkClick}>Student Questions</SidebarLink>
                    <SidebarLink to="/faculty-portal/profile" icon={icons.profile} onClick={handleLinkClick}>My Profile</SidebarLink>
                </nav>
                <div>
                    <button
                        onClick={handleLogoutClick}
                        className="flex items-center w-full px-4 py-3 space-x-3 rounded-lg text-gray-300 hover:bg-red-800 hover:text-white transition-colors duration-200"
                    >
                        {icons.logout}
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default FacultySidebar;