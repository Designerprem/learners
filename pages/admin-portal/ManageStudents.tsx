


import React, { useState } from 'react';
import { STUDENTS } from '../../constants';
import type { Student } from '../../types';
import StudentDetailModal from '../../components/admin-portal/StudentDetailModal';

const ManageStudents: React.FC = () => {
    const [students, setStudents] = useState<Student[]>(STUDENTS);
    const [searchTerm, setSearchTerm] = useState('');
    const [levelFilter, setLevelFilter] = useState('All');
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    const filteredStudents = students
        .filter(student =>
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter(student =>
            levelFilter === 'All' || student.currentLevel === levelFilter
        );

    const handleViewDetails = (student: Student) => {
        setSelectedStudent(student);
    };

    const handleCloseModal = () => {
        setSelectedStudent(null);
    };


    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl md:text-4xl font-bold text-brand-dark">Manage Students</h1>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    <div className="relative w-full sm:w-auto">
                        <input
                            type="text"
                            placeholder="Search students..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border rounded-lg w-full sm:w-64 bg-white"
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <div className="relative w-full sm:w-auto">
                         <select
                            value={levelFilter}
                            onChange={e => setLevelFilter(e.target.value)}
                            className="w-full appearance-none border rounded-lg py-2 pl-3 pr-10 bg-white"
                        >
                            <option value="All">All Levels</option>
                            <option value="Applied Knowledge">Applied Knowledge</option>
                            <option value="Applied Skills">Applied Skills</option>
                            <option value="Strategic Professional">Strategic Professional</option>
                        </select>
                        <svg className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[700px]">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 font-semibold text-sm text-gray-600 uppercase">Student Name</th>
                                <th className="p-4 font-semibold text-sm text-gray-600 uppercase">Student ID</th>
                                <th className="p-4 font-semibold text-sm text-gray-600 uppercase">Email</th>
                                <th className="p-4 font-semibold text-sm text-gray-600 uppercase">Level</th>
                                <th className="p-4 font-semibold text-sm text-gray-600 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredStudents.map(student => (
                                <tr key={student.id} className="hover:bg-gray-50">
                                    <td className="p-4 flex items-center">
                                        <img src={student.avatarUrl} alt={student.name} className="w-10 h-10 rounded-full mr-3" />
                                        <span className="font-medium">{student.name}</span>
                                    </td>
                                    <td className="p-4 font-mono text-sm">{student.studentId}</td>
                                    <td className="p-4 text-sm">{student.email}</td>
                                    <td className="p-4 text-sm">{student.currentLevel}</td>
                                    <td className="p-4">
                                        <button onClick={() => handleViewDetails(student)} className="text-sm font-semibold text-blue-600 hover:underline">View Details</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedStudent &&
                <StudentDetailModal
                    isOpen={!!selectedStudent}
                    onClose={handleCloseModal}
                    student={selectedStudent}
                />
            }
        </div>
    );
};

export default ManageStudents;
