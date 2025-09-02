

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { COURSES, FACULTY_MEMBERS } from '../constants';
import type { FacultyMember } from '../types';

const SyllabusAccordion: React.FC<{ syllabus: { topic: string; details: string }[] }> = ({ syllabus }) => {
    const [openIndex, setOpenIndex] = React.useState<number | null>(0);

    const toggleItem = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="space-y-2">
            {syllabus.map((item, index) => (
                <div key={index} className="border rounded-md overflow-hidden">
                    <button
                        onClick={() => toggleItem(index)}
                        className="w-full flex justify-between items-center text-left p-4 bg-gray-50 hover:bg-gray-100 focus:outline-none"
                        aria-expanded={openIndex === index}
                        aria-controls={`syllabus-content-${index}`}
                    >
                        <span className="font-semibold text-brand-dark">{item.topic}</span>
                        <svg 
                            className={`w-5 h-5 text-brand-red transform transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <div
                        id={`syllabus-content-${index}`}
                        className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === index ? 'max-h-96' : 'max-h-0'}`}
                    >
                        <p className="p-4 text-gray-600 border-t">{item.details}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};


const FacultyCard: React.FC<{ member: FacultyMember }> = ({ member }) => (
    <div className="text-center bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
        <img src={member.imageUrl} alt={member.name} className="w-24 h-24 rounded-full mx-auto mb-3 border-4 border-white shadow-sm" />
        <h4 className="text-md font-bold">{member.name}</h4>
        <p className="text-brand-red text-sm">{member.qualification}</p>
    </div>
);


const CourseDetailPage: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const course = COURSES.find(c => c.id === courseId);
    
    if (!course) {
        return (
            <div className="container mx-auto px-6 py-20 text-center">
                <h1 className="text-3xl font-bold">Course Not Found</h1>
                <p className="mt-4">The course you are looking for does not exist.</p>
                <Link to="/courses" className="mt-6 inline-block bg-brand-red text-white px-6 py-2 rounded-md font-semibold hover:bg-red-700">
                    Back to Courses
                </Link>
            </div>
        );
    }
    
    const courseFaculty = FACULTY_MEMBERS.filter(member => course.facultyIds.includes(member.id));

    return (
        <div className="bg-white">
            <div className="bg-brand-dark text-white py-12 md:py-20">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold">{course.title}</h1>
                    <p className="mt-4 text-lg max-w-3xl mx-auto">{course.level}</p>
                </div>
            </div>

            <div className="container mx-auto px-6 py-12 md:py-20">
                <div className="grid lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2">
                        <section id="description" className="mb-12">
                             <h2 className="text-2xl md:text-3xl font-bold text-brand-dark mb-4 border-b-2 border-brand-red pb-2">Course Overview</h2>
                             <p className="text-gray-700 leading-relaxed">{course.description}</p>
                        </section>
                        
                        <section id="syllabus" className="mb-12">
                            <h2 className="text-2xl md:text-3xl font-bold text-brand-dark mb-4 border-b-2 border-brand-red pb-2">Syllabus</h2>
                            <SyllabusAccordion syllabus={course.syllabus} />
                        </section>

                        <section id="outcomes">
                            <h2 className="text-2xl md:text-3xl font-bold text-brand-dark mb-4 border-b-2 border-brand-red pb-2">Learning Outcomes</h2>
                            <ul className="list-disc list-inside space-y-2 text-gray-700 pl-4">
                                {course.learningOutcomes.map((outcome, index) => <li key={index}>{outcome}</li>)}
                            </ul>
                        </section>
                    </div>

                    <aside className="lg:col-span-1">
                        <div className="bg-brand-beige p-6 rounded-lg shadow-lg sticky top-28">
                            <h3 className="text-2xl font-bold text-brand-dark mb-4">Meet Your Instructors</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {courseFaculty.length > 0 ? (
                                    courseFaculty.map(member => <FacultyCard key={member.id} member={member} />)
                                ) : (
                                    <p className="col-span-2 text-gray-600">Instructor information coming soon.</p>
                                )}
                            </div>
                            <Link to="/admissions" className="mt-8 block w-full text-center bg-brand-red text-white py-3 rounded-md font-semibold hover:bg-red-700 transition-colors shadow-md">
                                Apply for this Course
                            </Link>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default CourseDetailPage;
