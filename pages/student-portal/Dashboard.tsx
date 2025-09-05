import React from 'react';
import { Link } from 'react-router-dom';
import type { Student } from '../../types.ts';
import { useStudent } from '../StudentPortalPage.tsx';

const StatCard = ({ title, value, colorClass = 'text-green-600' }: {title: string, value: string | number, colorClass?: string}) => (
     <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-gray-500 text-sm font-medium uppercase">{title}</h3>
        <p className={`text-2xl font-bold mt-1 ${colorClass}`}>{value}</p>
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
    <Link to={to} className="flex items-center p-3 w-full text-left bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
        {icon}
        <span className="ml-3 font-medium text-gray-700">{text}</span>
    </Link>
);

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
};

const calculateFeeDetails = (student: Student) => {
    const netFee = student.totalFee - student.discount;
    
    const paidAmount = student.paymentHistory
        ?.filter(p => p.status === 'Paid')
        .reduce((sum, p) => sum + p.amount, 0) || 0;

    const outstandingBalance = netFee - paidAmount;
    
    return { outstandingBalance, dueDate: student.dueDate };
};


const FeeStatusCard = ({ student }: { student: Student }) => {
    if (!student) return null;

    const { outstandingBalance, dueDate } = calculateFeeDetails(student);

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
                    <p className="text-sm text-gray-500">Due Date</p>
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


const Dashboard: React.FC = () => {
    const { student } = useStudent();

    if (!student) {
        return <div>Student not found.</div>;
    }

    return (
        <div>
            <h1 className="text-4xl font-bold text-brand-dark mb-2">{getGreeting()}, {student.name.split(' ')[0]}!</h1>
            <p className="text-gray-600 mb-8">Here's a summary of your academic progress.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                 <StatCard title="Overall Attendance" value="95%" />
                 <StatCard title="Overall Score" value="81.5%" />
                 <StatCard title="Courses Enrolled" value={student.enrolledPapers.length} colorClass="text-blue-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 grid grid-cols-1 gap-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="font-bold text-xl text-brand-dark mb-4">Recent Announcements</h3>
                        <ul className="space-y-3">
                             <li className="border-l-4 border-brand-red pl-3">
                                <p className="font-semibold">Mock Exams for PM</p>
                                <p className="text-sm text-gray-500">The mock exam schedule has been posted. Please check the 'My Courses' section.</p>
                            </li>
                             <li className="border-l-4 border-yellow-500 pl-3">
                                <p className="font-semibold">Fee Payment Reminder</p>
                                <p className="text-sm text-gray-500">The deadline for the next installment is August 15th. Please pay on time.</p>
                            </li>
                        </ul>
                    </div>
                     <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="font-bold text-xl text-brand-dark mb-4">Course Progress</h3>
                        <div className="space-y-4">
                            <ProgressBar label="Financial Reporting (FR)" percentage={75} />
                            <ProgressBar label="Performance Management (PM)" percentage={60} />
                            <ProgressBar label="Audit and Assurance (AA)" percentage={45} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 content-start">
                    <FeeStatusCard student={student} />
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="font-bold text-xl text-brand-dark mb-4">Quick Links</h3>
                        <div className="space-y-3">
                            <QuickLink to="/student-portal/courses" icon={<svg className="w-5 h-5 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>} text="View My Courses" />
                            <QuickLink to="/student-portal/results" icon={<svg className="w-5 h-5 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>} text="Check My Results" />
                            <QuickLink to="/student-portal/schedule" icon={<svg className="w-5 h-5 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>} text="View My Schedule" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;