
import React from 'react';
import { FACULTY_MEMBERS } from '../constants';

const AboutPage: React.FC = () => {
    return (
        <div className="bg-white">
            <div className="bg-brand-dark text-white py-12 md:py-20">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold">About Reliant Learners Academy</h1>
                    <p className="mt-4 text-lg max-w-3xl mx-auto">Nurturing the next generation of accounting and finance leaders since 2010.</p>
                </div>
            </div>

            <div className="container mx-auto px-6 py-12 md:py-20">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-brand-red mb-4">Our Vision & Mission</h2>
                        <p className="text-gray-600 mb-4">
                            <strong>Vision:</strong> To be the most respected institution for professional accounting education, recognized for our commitment to excellence, integrity, and student success.
                        </p>
                        <p className="text-gray-600">
                            <strong>Mission:</strong> To provide a dynamic and supportive learning environment that equips students with the knowledge, skills, and ethical grounding to excel in the global finance industry. We are dedicated to innovative teaching, personalized mentorship, and fostering a community of lifelong learners.
                        </p>
                    </div>
                    <div>
                        <img src="https://picsum.photos/seed/mission/600/400" alt="Our Mission" className="rounded-lg shadow-lg" />
                    </div>
                </div>
            </div>

            <div className="bg-brand-beige py-12 md:py-20">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold">Meet Our Expert Faculty</h2>
                        <p className="text-gray-600 mt-2">Learn from the best in the industry.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                        {FACULTY_MEMBERS.map(member => (
                            <div key={member.id} className="text-center bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                                <img src={member.imageUrl} alt={member.name} className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-brand-red" />
                                <h3 className="text-xl font-bold">{member.name}</h3>
                                <p className="text-brand-red mb-2">{member.qualification}</p>
                                <p className="text-sm text-gray-600">{member.bio}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
             <div className="py-12 md:py-20">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">ACCA Gold Approved Learning Partner</h2>
                     <p className="text-gray-600 max-w-3xl mx-auto">We are proud to be recognized by ACCA as a Gold Approved Learning Partner, a testament to our high-quality tuition, exceptional student support, and consistently high pass rates.</p>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
