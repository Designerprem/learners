

import React, { useState } from 'react';
import { FACULTY_MEMBERS, STUDENTS } from '../../constants';
import type { Student } from '../../types';

const Grading: React.FC = () => {
    const facultyMember = FACULTY_MEMBERS[0]; // Dr. Jane Smith
    const [selectedPaper, setSelectedPaper] = useState(facultyMember.assignedPapers[0]);
    const [studentGrades, setStudentGrades] = useState<Student[]>(
        STUDENTS.filter(student => student.enrolledPapers.some(p => selectedPaper.startsWith(p)))
    );
    const [message, setMessage] = useState('');

    const handlePaperChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const paper = e.target.value;
        setSelectedPaper(paper);
        setStudentGrades(
            STUDENTS.filter(student => student.enrolledPapers.some(p => paper.startsWith(p)))
        );
    };

    const handleGradeChange = (studentId: number, paperCode: string, value: string) => {
        const score = value === '' ? null : parseInt(value, 10);
        setStudentGrades(prev => prev.map(student => {
            if (student.id === studentId) {
                return { ...student, grades: { ...student.grades, [paperCode]: score } };
            }
            return student;
        }));
    };

    const handleSaveChanges = () => {
        // In a real app, this would send an API request to save the updated grades.
        // For this demo, we'll just show a success message.
        console.log("Saving grades:", studentGrades);
        setMessage('Grades have been saved successfully!');
        setTimeout(() => setMessage(''), 3000);
    };

    const paperCode = selectedPaper.split(':')[0].trim();

    return (
        <div>
            <h1 className="text-3xl md:text-4xl font-bold text-brand-dark mb-8">Grading &amp; Results</h1>

            <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                    <label htmlFor="paperSelect" className="block text-sm font-medium text-gray-700">Select Paper</label>
                    <select
                        id="paperSelect"
                        value={selectedPaper}
                        onChange={handlePaperChange}
                        className="mt-1 block w-full max-w-sm pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-red focus:border-brand-red sm:text-sm rounded-md shadow-sm"
                    >
                        {facultyMember.assignedPapers.map(paper => <option key={paper} value={paper}>{paper}</option>)}
                    </select>
                </div>
                 {message && <div className="p-2 text-sm bg-green-100 text-green-700 rounded-md">{message}</div>}
                <button
                    onClick={handleSaveChanges}
                    className="bg-brand-red text-white font-semibold px-6 py-2 rounded-md hover:bg-red-700 transition-colors w-full sm:w-auto"
                >
                    Save Changes
                </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[600px]">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 font-semibold text-sm text-gray-600 uppercase">Student Name</th>
                                <th className="p-4 font-semibold text-sm text-gray-600 uppercase">Student ID</th>
                                <th className="p-4 font-semibold text-sm text-gray-600 uppercase text-center w-40">Mock Exam Score</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {studentGrades.map(student => (
                                <tr key={student.id} className="hover:bg-gray-50">
                                    <td className="p-4 flex items-center">
                                        <img src={student.avatarUrl} alt={student.name} className="w-10 h-10 rounded-full mr-3" />
                                        <span className="font-medium">{student.name}</span>
                                    </td>
                                    <td className="p-4 font-mono text-sm">{student.studentId}</td>
                                    <td className="p-4 text-center">
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={student.grades?.[paperCode] ?? ''}
                                            onChange={(e) => handleGradeChange(student.id, paperCode, e.target.value)}
                                            className="w-24 p-2 border border-gray-300 rounded-md text-center focus:ring-brand-red focus:border-brand-red"
                                            placeholder="N/A"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Grading;
