

import React, { useState } from 'react';

const mockResults = [
    { id: 1, paper: 'AB: Accountant in Business', score: 85, grade: 'Pass', date: '2023-12-15' },
    { id: 2, paper: 'MA: Management Accounting', score: 78, grade: 'Pass', date: '2023-12-18' },
    { id: 3, paper: 'FA: Financial Accounting', score: 92, grade: 'Pass', date: '2024-03-12' },
    { id: 4, paper: 'LW: Corporate and Business Law', score: 68, grade: 'Pass', date: '2024-06-10' },
    { id: 5, paper: 'PM: Performance Management', score: 45, grade: 'Fail', date: '2024-06-13' },
    { id: 6, paper: 'PM: Performance Management (Retake)', score: 71, grade: 'Pass', date: '2024-09-15' },
];

const ResultsSummary = () => {
    const papersAttempted = mockResults.length;
    const papersPassed = mockResults.filter(r => r.grade === 'Pass').length;
    const passRate = papersAttempted > 0 ? ((papersPassed / papersAttempted) * 100).toFixed(1) : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <h3 className="text-gray-500 text-sm font-medium uppercase">Papers Attempted</h3>
                <p className="text-3xl font-bold mt-1 text-blue-600">{papersAttempted}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <h3 className="text-gray-500 text-sm font-medium uppercase">Papers Passed</h3>
                <p className="text-3xl font-bold mt-1 text-green-600">{papersPassed}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <h3 className="text-gray-500 text-sm font-medium uppercase">Overall Pass Rate</h3>
                <p className="text-3xl font-bold mt-1 text-yellow-600">{passRate}%</p>
            </div>
        </div>
    );
};

const Results: React.FC = () => {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = () => {
        setIsDownloading(true);
        // Simulate download
        setTimeout(() => {
            alert('Transcript download started!');
            setIsDownloading(false);
        }, 1000);
    };

    return (
         <div>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl md:text-4xl font-bold text-brand-dark">My Results</h1>
                <button 
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="bg-brand-red text-white font-semibold px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center disabled:bg-red-300 w-full sm:w-auto"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    {isDownloading ? 'Preparing...' : 'Download Transcript'}
                </button>
            </div>
            <ResultsSummary />
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[600px]">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 font-semibold text-sm text-gray-600 uppercase">Paper</th>
                                <th className="p-4 font-semibold text-sm text-gray-600 uppercase text-center">Score</th>
                                <th className="p-4 font-semibold text-sm text-gray-600 uppercase text-center">Grade</th>
                                <th className="p-4 font-semibold text-sm text-gray-600 uppercase text-right">Exam Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {mockResults.slice().reverse().map(result => (
                                <tr key={result.id} className="hover:bg-gray-50">
                                    <td className="p-4 font-medium">{result.paper}</td>
                                    <td className="p-4 text-center font-mono">{result.score}/100</td>
                                    <td className="p-4 text-center">
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                                            result.grade === 'Pass' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>{result.grade}</span>
                                    </td>
                                    <td className="p-4 text-right text-gray-600 font-mono">{result.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Results;
