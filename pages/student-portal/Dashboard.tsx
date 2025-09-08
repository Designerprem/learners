import React, { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Student, Announcement, GradeEntry, LiveClass, CalendarEvent, MockTest } from '../../types.ts';
import { useStudent } from '../StudentPortalPage.tsx';
import { getItems } from '../../services/dataService.ts';
import { GLOBAL_ANNOUNCEMENTS } from '../../constants.ts';
import RatingModal from '../../components/student-portal/RatingModal.tsx';

const StatCard = ({ title, value, colorClass = 'text-green-600', icon }: {title: string, value: string | number, colorClass?: string, icon: React.ReactNode}) => (
     <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
        <div className={`mr-4 p-3 rounded-full ${colorClass.replace('text-', 'bg-').replace('600', '100')}`}>
            {icon}
        </div>
        <div>
            <h3 className="text-gray-500 text-sm font-medium uppercase">{title}</h3>
            <p className={`text-3xl font-bold mt-1 ${colorClass}`}>{value}</p>
        </div>
    </div>
);

const ProgressBar = ({ label, percentage }: { label: string, percentage: number }) => (
    <div>
        <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">{label}</span>
            <span className="text-sm font-medium text-gray-700">{percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-brand-red h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
        </div>
    </div>
);

const QuickLink = ({ to, icon, text }: { to: string, icon: JSX.Element, text: string }) => (
    <Link to={to} className="flex items-center p-3 w-full text-left bg-gray-50 hover:bg-gray-100 rounded-md transition-colors group">
        {icon}
        <span className="ml-3 font-medium text-gray-700 group-hover:text-brand-red">{text}</span>
    </Link>
);

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
};

const FeeStatusCard = ({ student }: { student: Student }) => {
    if (!student) return null;

    const netFee = (student.totalFee || 0) - (student.discount || 0);
    const paidAmount = student.paymentHistory?.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0) || 0;
    const outstandingBalance = netFee - paidAmount;
    const { dueDate } = student;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-xl text-brand-dark mb-4">Fee Status</h3>
            <div className="space-y-3 mb-4">
                <div>
                    <p className="text-sm text-gray-500">Outstanding Balance</p>
                    <p className={`text-2xl font-bold ${outstandingBalance > 0 ? 'text-brand-red' : 'text-green-600'}`}>
                        NPR {outstandingBalance.toLocaleString()}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Next Due Date</p>
                    <p className="font-semibold">{dueDate}</p>
                </div>
            </div>
             {outstandingBalance > 0 ? (
                <Link to="/student-portal/fee-payment" className="w-full block text-center bg-brand-red text-white py-2 px-4 rounded-md font-semibold hover:bg-red-700 transition-colors">
                    Pay Now
                </Link>
            ) : (
                 <p className="w-full block text-center bg-green-600 text-white py-2 px-4 rounded-md font-semibold">
                    Fees Cleared
                </p>
            )}
        </div>
    );
};

const TodaysAgenda = ({ student }: { student: Student }) => {
    const navigate = useNavigate();
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
    const [ratingTarget, setRatingTarget] = useState<{ teacherName: string; classTopic: string } | null>(null);
    const [agendaItems, setAgendaItems] = useState<any[]>([]);

    const parseTime = (timeStr: string): Date => {
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (modifier === 'PM' && hours !== 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;
        const classTime = new Date();
        classTime.setHours(hours, minutes, 0, 0);
        return classTime;
    };
    
    useEffect(() => {
        const updateAgenda = () => {
            const liveClasses: LiveClass[] = getItems('liveClasses', []);
            const calendarEvents: CalendarEvent[] = getItems('calendarEvents', []);
            const mockTests: MockTest[] = getItems('mockTests', []);
            
            const studentPaperCodes = new Set(student.enrolledPapers);
            
            const today = new Date();
            const todayString = today.toISOString().split('T')[0];

            const classes = liveClasses
                .filter(cls => studentPaperCodes.has(cls.paper.split(':')[0].trim()))
                .map(cls => ({
                    id: `class-${cls.id}`,
                    type: 'class',
                    title: cls.topic,
                    paper: cls.paper,
                    time: cls.startTime,
                    dateTime: parseTime(cls.startTime),
                    status: cls.status,
                    joinLink: cls.joinLink,
                    instructor: cls.instructor
                }));

            const deadlines = calendarEvents
                .filter(event => event.type === 'deadline' && event.paper && event.date === todayString && studentPaperCodes.has(event.paper.split(':')[0].trim()))
                .map(event => ({
                    id: `deadline-${event.id}`,
                    type: 'deadline',
                    title: event.title,
                    paper: event.paper,
                    time: 'All Day',
                    dateTime: new Date(new Date().setHours(23, 59, 59, 999))
                }));

            const exams = mockTests
                .filter(test => test.status === 'Published' && test.scheduledStartTime && test.scheduledStartTime.startsWith(todayString) && studentPaperCodes.has(test.paper.split(':')[0].trim()))
                .map(test => ({
                    id: `exam-${test.id}`,
                    type: 'exam',
                    title: test.title,
                    paper: test.paper,
                    time: new Date(test.scheduledStartTime!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    dateTime: new Date(test.scheduledStartTime!),
                    isLocked: test.isLocked
                }));
            
            const combined = [...classes, ...deadlines, ...exams];
            combined.sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());
            setAgendaItems(combined);
        };
        
        updateAgenda();
        const interval = setInterval(updateAgenda, 30 * 1000); // Refresh every 30 seconds
        window.addEventListener('storage', updateAgenda);
        return () => {
            clearInterval(interval);
            window.removeEventListener('storage', updateAgenda);
        };
    }, [student]);


    const handleOpenRatingModal = (teacherName: string, classTopic: string) => {
        setRatingTarget({ teacherName, classTopic });
        setIsRatingModalOpen(true);
    };

    const handleRatingSubmit = (rating: number, feedback: string) => {
        console.log(`Submitted rating: ${rating} stars. Feedback: "${feedback}"`, ratingTarget);
    };
    
    const eventIcons = {
        class: <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>,
        exam: <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>,
        deadline: <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>,
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-xl text-brand-dark mb-4">Today's Agenda</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {agendaItems.length > 0 ? agendaItems.map(item => {
                    const now = new Date();
                    const isLive = item.type === 'class' && item.status === 'Live';
                    const isUpcoming = (item.type === 'class' || item.type === 'exam') && item.dateTime > now;
                    const timeDiff = isUpcoming ? (item.dateTime.getTime() - now.getTime()) / (1000 * 60) : 0;
                    const isStartingSoon = isUpcoming && timeDiff <= 10;
                    const isExamAvailable = item.type === 'exam' && now >= item.dateTime;

                    return (
                        <div key={item.id} className={`p-4 border rounded-lg flex items-center transition-all ${isLive || isStartingSoon ? 'bg-red-50 border-brand-red' : 'bg-gray-50'}`}>
                            <div className="mr-4">{eventIcons[item.type as keyof typeof eventIcons]}</div>
                            <div className="flex-grow">
                                <p className="font-bold capitalize">{item.type}: {item.title}</p>
                                <p className="text-sm text-gray-500">{item.paper} - {item.time}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                {isLive && (
                                    <span className="flex items-center text-sm font-bold text-brand-red animate-pulse">
                                        <span className="relative flex h-3 w-3 mr-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-brand-red"></span></span>
                                        LIVE
                                    </span>
                                )}
                                {item.type === 'class' && (
                                    <button
                                        onClick={() => {
                                            handleOpenRatingModal(item.instructor, item.title);
                                            window.open(item.joinLink, '_blank', 'noopener,noreferrer');
                                        }}
                                        disabled={!isLive}
                                        className={'font-semibold text-sm px-4 py-2 rounded-md transition-colors ' + (isLive ? 'bg-brand-red text-white hover:bg-red-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed')}
                                    >
                                        {isLive ? 'Join Now' : 'Upcoming'}
                                    </button>
                                )}
                                {item.type === 'exam' && (
                                    <button
                                        onClick={() => navigate('/student-portal/mock-tests')}
                                        disabled={!isExamAvailable || item.isLocked}
                                        className={'font-semibold text-sm px-4 py-2 rounded-md transition-colors ' + (isExamAvailable && !item.isLocked ? 'bg-yellow-500 text-white hover:bg-yellow-600' : 'bg-gray-200 text-gray-500 cursor-not-allowed')}
                                    >
                                        {item.isLocked ? 'Locked' : isExamAvailable ? 'Go to Test' : 'Upcoming'}
                                    </button>
                                )}
                                {item.type === 'deadline' && (
                                     <span className="text-sm font-semibold text-red-600">Due Today</span>
                                )}
                            </div>
                        </div>
                    );
                }) : <p className="text-gray-500 text-center py-4">No classes, exams, or deadlines scheduled for today.</p>}
            </div>
             {ratingTarget && (
                <RatingModal
                    isOpen={isRatingModalOpen}
                    onClose={() => {
                        setIsRatingModalOpen(false);
                        setRatingTarget(null);
                    }}
                    onSubmit={handleRatingSubmit}
                    teacherName={ratingTarget.teacherName}
                    classTopic={ratingTarget.classTopic}
                />
            )}
        </div>
    );
};


const Dashboard: React.FC = () => {
    const { student } = useStudent();

    const recentAnnouncements = useMemo(() => {
        const allAnnouncements: Announcement[] = getItems('globalAnnouncements', GLOBAL_ANNOUNCEMENTS);
        return allAnnouncements
            .filter(ann => ann.audience.includes('Student'))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 3);
    }, []);

    const overallAttendance = useMemo(() => {
        if (!student?.attendance || Object.keys(student.attendance).length === 0) return 'N/A';
        const values = Object.values(student.attendance);
        const avg = values.reduce((sum, v: number) => sum + v, 0) / values.length;
        return `${avg.toFixed(1)}%`;
    }, [student]);
    
    const overallScore = useMemo(() => {
        if (!student?.grades || Object.keys(student.grades).length === 0) return 'N/A';
        const allGrades = Object.values(student.grades).flat();
        if (allGrades.length === 0) return 'N/A';
        const avg = allGrades.reduce((sum, g: GradeEntry) => sum + g.score, 0) / allGrades.length;
        return `${avg.toFixed(1)}%`;
    }, [student]);


    if (!student) {
        return <div>Student not found.</div>;
    }

    return (
        <div>
            <h1 className="text-4xl font-bold text-brand-dark mb-2">{getGreeting()}, {student.name.split(' ')[0]}!</h1>
            <p className="text-gray-600 mb-8">Here's a summary of your academic progress.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                 <StatCard title="Overall Attendance" value={overallAttendance} icon={<svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                 <StatCard title="Overall Score" value={overallScore} colorClass="text-yellow-600" icon={<svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-12v4m-2-2h4m5 12v4m-2-2h4M17 3l4 4M3 17l4 4M17 21l4-4M3 7l4-4" /></svg>} />
                 <StatCard title="Courses Enrolled" value={student.enrolledPapers.length} colorClass="text-blue-600" icon={<svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 grid grid-cols-1 gap-8">
                    <TodaysAgenda student={student} />
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="font-bold text-xl text-brand-dark mb-4">Recent Announcements</h3>
                         {recentAnnouncements.length > 0 ? (
                            <ul className="space-y-4">
                                {recentAnnouncements.map(ann => (
                                    <li key={ann.id} className="border-l-4 border-brand-red pl-4">
                                        <p className="font-semibold">{ann.title}</p>
                                        <p className="text-sm text-gray-500">{ann.content}</p>
                                        <p className="text-xs text-gray-400 mt-1">Posted on {ann.date}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                             <p className="text-center text-gray-500 py-4">No recent announcements.</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 content-start">
                    <FeeStatusCard student={student} />
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="font-bold text-xl text-brand-dark mb-4">Quick Links</h3>
                        <div className="space-y-3">
                            <QuickLink to="/student-portal/courses" icon={<svg className="w-5 h-5 text-gray-500 group-hover:text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>} text="View My Courses" />
                            <QuickLink to="/student-portal/results" icon={<svg className="w-5 h-5 text-gray-500 group-hover:text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>} text="Check My Results" />
                            <QuickLink to="/student-portal/schedule" icon={<svg className="w-5 h-5 text-gray-500 group-hover:text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>} text="View My Schedule" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;