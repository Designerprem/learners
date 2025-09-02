
import React from 'react';
import { Link } from 'react-router-dom';
import { FACULTY_MEMBERS, STUDENTS, LIVE_CLASSES } from '../../constants';

const StatCard = ({ title, value, colorClass = 'text-green-600' }: {title: string, value: string | number, colorClass?: string}) => (
     <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-gray-500 text-sm font-medium uppercase">{title}</h3>
        <p className={`text-3xl font-bold mt-1 ${colorClass}`}>{value}</p>
    </div>
);

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
};

const Dashboard: React.FC = () => {
    const facultyMember = FACULTY_MEMBERS[0]; // Dr. Jane Smith
    const assignedPapers = facultyMember.assignedPapers;
    
    // Filter students who are in the papers assigned to this faculty member.
    const myStudentIds = new Set<number>();
    STUDENTS.forEach(student => {
        const studentPapersShort = student.enrolledPapers.map(p => p.split(':')[0].trim());
        const facultyPapersShort = assignedPapers.map(p => p.split(':')[0].trim());
        if (studentPapersShort.some(sp => facultyPapersShort.includes(sp))) {
            myStudentIds.add(student.id);
        }
    });

    const myClassesToday = LIVE_CLASSES.filter(c => c.instructor === facultyMember.name);

    return (
        <div>
            <h1 className="text-4xl font-bold text-brand-dark mb-2">{getGreeting()}, {facultyMember.name.split(' ')[0]}!</h1>
            <p className="text-gray-600 mb-8">Here is your teaching summary for today.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                 <StatCard title="Assigned Papers" value={assignedPapers.length} colorClass="text-blue-600" />
                 <StatCard title="Total Students" value={myStudentIds.size} colorClass="text-yellow-600" />
                 <StatCard title="Classes Today" value={myClassesToday.length} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-bold text-xl text-brand-dark mb-4">Today's Schedule</h3>
                    {myClassesToday.length > 0 ? (
                        <ul className="space-y-3">
                            {myClassesToday.map(c => (
                                 <li key={c.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                    <div>
                                        <p className="font-semibold">{c.paper}: <span className="font-normal">{c.topic}</span></p>
                                         <p className={`text-sm font-bold ${c.status === 'Live' ? 'text-brand-red' : 'text-gray-500'}`}>{c.status}</p>
                                    </div>
                                     <span className="text-sm font-semibold text-brand-dark bg-gray-200 px-3 py-1 rounded-full">{c.startTime}</span>
                                </li>
                            ))}
                        </ul>
                    ) : <p className="text-gray-500">No classes scheduled for today.</p>}
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                     <h3 className="font-bold text-xl text-brand-dark mb-4">Quick Links</h3>
                     <div className="space-y-3">
                        <Link to="/faculty-portal/classes" className="flex items-center p-3 w-full text-left bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
                            <svg className="w-5 h-5 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                            <span className="ml-3 font-medium text-gray-700">Manage My Classes</span>
                        </Link>
                         <button className="flex items-center p-3 w-full text-left bg-gray-50 hover:bg-gray-100 rounded-md transition-colors text-gray-400 cursor-not-allowed">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <span className="ml-3 font-medium">Enter Grades (Coming Soon)</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
