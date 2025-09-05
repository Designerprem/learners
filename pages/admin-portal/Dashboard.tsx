

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { STUDENTS, FACULTY_MEMBERS, COURSES, BLOG_POSTS } from '../../constants';
import type { Student, FacultyMember, Application, BlogPost } from '../../types';

const StatCard = ({ title, value, linkTo, icon, colorClass }: { title: string; value: string | number; linkTo: string; icon: JSX.Element; colorClass: string }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
        <div className={`mr-4 p-3 rounded-full ${colorClass}`}>
            {icon}
        </div>
        <div>
            <h3 className="text-gray-500 text-sm font-medium uppercase">{title}</h3>
            <p className="text-3xl font-bold mt-1 text-brand-dark">{value}</p>
            <Link to={linkTo} className="text-sm font-semibold text-brand-red hover:underline mt-2 inline-block">Manage &rarr;</Link>
        </div>
    </div>
);

interface Activity {
    id: string | number;
    type: 'Application' | 'Blog Post';
    text: string;
    date: Date;
    link: string;
}


const Dashboard: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [faculty, setFaculty] = useState<FacultyMember[]>([]);
    const [recentActivities, setRecentActivities] = useState<Activity[]>([]);

    useEffect(() => {
        const loadData = () => {
            const storedStudents = localStorage.getItem('students');
            const studentData = storedStudents ? JSON.parse(storedStudents) : STUDENTS;
            setStudents(studentData);

            const storedFaculty = localStorage.getItem('faculty');
            const facultyData = storedFaculty ? JSON.parse(storedFaculty) : FACULTY_MEMBERS;
            setFaculty(facultyData);

            const storedApplications = localStorage.getItem('pendingApplications');
            const appData: Application[] = storedApplications ? JSON.parse(storedApplications) : [];

            const storedBlogs = localStorage.getItem('blogs');
            const blogData: BlogPost[] = storedBlogs ? JSON.parse(storedBlogs) : BLOG_POSTS;

            const appActivities: Activity[] = appData.map(app => ({
                id: app.id,
                type: 'Application',
                text: `${app.fullName} applied for ${app.program}.`,
                date: new Date(app.submittedDate),
                link: '/admin-portal/admissions'
            }));

            const blogActivities: Activity[] = blogData.filter(b => b.status === 'Published').map(blog => ({
                id: blog.id,
                type: 'Blog Post',
                text: `New post published: "${blog.title}"`,
                date: new Date(blog.publicationDate),
                link: `/admin-portal/content`
            }));
            
            const allActivities = [...appActivities, ...blogActivities].sort((a, b) => b.date.getTime() - a.date.getTime());
            setRecentActivities(allActivities.slice(0, 5));
        };

        loadData();
        window.addEventListener('storage', loadData);
        return () => window.removeEventListener('storage', loadData);
    }, []);


    return (
        <div>
            <h1 className="text-4xl font-bold text-brand-dark mb-8">Admin Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard 
                    title="Total Students" 
                    value={students.length} 
                    linkTo="/admin-portal/students"
                    colorClass="bg-blue-100"
                    icon={<svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                />
                 <StatCard 
                    title="Total Faculty" 
                    value={faculty.length} 
                    linkTo="/admin-portal/faculty"
                    colorClass="bg-green-100"
                    icon={<svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.67c.12-.24.232-.487.34-.737m-4.118 6.075c.62-1.299 1.154-2.697 1.6-4.125m.001-3.75v.01c0 .218.01.437.028.65m-3.75 0c.056.126.118.25.185.375m-3.75 0a9.348 9.348 0 019-5.334c1.5 0 2.896.398 4.121.952A4.125 4.125 0 009 12.348M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                />
                <StatCard 
                    title="Total Courses" 
                    value={COURSES.length} 
                    linkTo="/courses"
                    colorClass="bg-yellow-100"
                    icon={<svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>}
                />
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-brand-dark mb-4">Recent Activity</h2>
                {recentActivities.length > 0 ? (
                    <ul className="space-y-3">
                        {recentActivities.map(activity => (
                            <li key={activity.id} className="flex items-center p-2 bg-gray-50 rounded-md">
                                <span className={`mr-3 px-2 py-0.5 text-xs font-semibold rounded-full ${
                                    activity.type === 'Application' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                                }`}>{activity.type}</span>
                                <span className="flex-grow text-sm text-gray-700">{activity.text}</span>
                                <Link to={activity.link} className="text-xs font-semibold text-brand-red hover:underline ml-4">View</Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-600">No recent activity to show.</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
