
import React, { useState, useEffect } from 'react';
import { COURSES } from '../../constants';
import { Link } from 'react-router-dom';
import type { Course } from '../../types';
import CourseEditModal from '../../components/admin-portal/CourseEditModal';

const ManageCourses: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>(() => {
        try {
            const saved = localStorage.getItem('courses');
            return saved ? JSON.parse(saved) : COURSES;
        } catch {
            return COURSES;
        }
    });

    const [editingCourse, setEditingCourse] = useState<Course | null>(null);

    useEffect(() => {
        localStorage.setItem('courses', JSON.stringify(courses));
    }, [courses]);

    const handleDeleteCourse = (courseId: string) => {
        if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
            setCourses(prev => prev.filter(c => c.id !== courseId));
        }
    };

    const handleSaveCourse = (updatedCourse: Course) => {
        if (editingCourse) {
             setCourses(prev => prev.map(c => c.id === updatedCourse.id ? updatedCourse : c));
        }
        // Add new course logic can be added here if needed
        setEditingCourse(null);
    };


    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl md:text-4xl font-bold text-brand-dark">Manage Courses</h1>
                <button className="bg-brand-red text-white font-semibold px-4 py-2 rounded-md hover:bg-red-700 transition-colors w-full md:w-auto" disabled>
                    Add New Course (Not Implemented)
                </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[700px]">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 font-semibold text-sm text-gray-600 uppercase">Course Title</th>
                                <th className="p-4 font-semibold text-sm text-gray-600 uppercase">Level</th>
                                <th className="p-4 font-semibold text-sm text-gray-600 uppercase">Papers</th>
                                <th className="p-4 font-semibold text-sm text-gray-600 uppercase text-center">Enrolled</th>
                                <th className="p-4 font-semibold text-sm text-gray-600 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {courses.map(course => (
                                <tr key={course.id} className="hover:bg-gray-50">
                                    <td className="p-4">
                                        <p className="font-medium">{course.title}</p>
                                    </td>
                                    <td className="p-4 text-sm">{course.level}</td>
                                    <td className="p-4 text-sm">{course.papers.length}</td>
                                    <td className="p-4 text-center font-mono">{course.studentIds.length}</td>
                                    <td className="p-4 space-x-2 whitespace-nowrap">
                                        <Link to={`/courses/${course.id}`} className="text-sm font-semibold text-blue-600 hover:underline">View</Link>
                                        <button onClick={() => setEditingCourse(course)} className="text-sm font-semibold text-yellow-600 hover:underline">Edit</button>
                                        <button onClick={() => handleDeleteCourse(course.id)} className="text-sm font-semibold text-brand-red hover:underline">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {editingCourse && (
                <CourseEditModal
                    isOpen={!!editingCourse}
                    onClose={() => setEditingCourse(null)}
                    courseToEdit={editingCourse}
                    onSave={handleSaveCourse}
                />
            )}
        </div>
    );
};

export default ManageCourses;
