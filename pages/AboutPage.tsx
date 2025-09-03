
import React from 'react';
import { FACULTY_MEMBERS } from '../constants';

const AboutPage: React.FC = () => {
    
    const whatSetsUsApart = [
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mx-auto text-brand-red"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182.553-.44 1.282-.659 2.003-.659c.768 0 1.536.219 2.228.659l.879.659m-5.462-1.284a5.002 5.002 0 00-4.486 2.029l-1.047 1.745A5.002 5.002 0 002.25 12c0 .25.017.495.05.738l.04.225A5.002 5.002 0 006.75 17.25l1.047-1.745a5.002 5.002 0 00-4.486-2.029m13.498-2.029a5.002 5.002 0 00-4.486-2.029l-1.047-1.745A5.002 5.002 0 0017.25 6c-2.406 0-4.438 1.62-4.943 3.826l.04-.225A5.002 5.002 0 0012 9c-2.76 0-5 2.24-5 5s2.24 5 5 5c.25 0 .495-.017.738-.05l.225-.04A5.002 5.002 0 0017.25 18c2.406 0 4.438-1.62 4.943-3.826l-.04.225A5.002 5.002 0 0021.75 12c0-.25-.017-.495-.05-.738z" /></svg>,
            title: 'Affordable Excellence',
            description: "We believe that cost shouldn't stand in the way of quality education. Our transparent fee structure is student-friendly."
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mx-auto text-brand-red"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
            title: 'Comprehensive Offerings',
            description: "We cover the full ACCA syllabus, from foundational to advanced levels, with a focus on clarity and efficiency."
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mx-auto text-brand-red"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0l-.07.002z" /></svg>,
            title: 'Registered & Accredited',
            description: "Operated under global ACCA guidelines, Learners Academy is fully registered and committed to transparency and credibility."
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mx-auto text-brand-red"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>,
            title: 'Resource-Rich',
            description: 'Enjoy access to practice questions, revision notes, interactive modules, and downloadable study aids.'
        },
    ];

    return (
        <div className="bg-white">
            <div className="bg-brand-dark text-white py-12 md:py-20">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold">About Learners Academy</h1>
                    <p className="mt-4 text-lg max-w-3xl mx-auto">A leading ACCA tutoring institute dedicated to empowering students to succeed in the ACCA qualification — on their first attempt.</p>
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
                            <strong>Mission:</strong> To deliver top-tier ACCA education by combining expert instruction with affordable pricing. We strive to enhance learning for students in business, finance, and accounting through personalized coaching and modern pedagogical methods.
                        </p>
                    </div>
                    <div>
                        <img src="https://picsum.photos/seed/vision-mission/600/400" alt="Our Mission" className="rounded-lg shadow-lg" />
                    </div>
                </div>
            </div>

            <div className="bg-brand-beige py-12 md:py-20">
                 <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold">What Sets Us Apart</h2>
                        <p className="text-gray-600 mt-2 max-w-3xl mx-auto">We're more than just an ACCA coaching center — we're your partner in a journey toward professional excellence.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                         {whatSetsUsApart.map(feature => (
                            <div key={feature.title} className="text-center bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                                {feature.icon}
                                <h3 className="text-xl font-bold mt-4 mb-2">{feature.title}</h3>
                                <p className="text-sm text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="py-12 md:py-20">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold">Meet the Team</h2>
                        <p className="text-gray-600 mt-2">Our leadership and faculty comprise seasoned professionals passionate about ACCA education.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                        {FACULTY_MEMBERS.map(member => (
                            <div key={member.id} className="text-center bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border">
                                <img src={member.imageUrl} alt={member.name} className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-brand-red" />
                                <h3 className="text-xl font-bold">{member.name}</h3>
                                <p className="text-brand-red mb-2 text-sm font-semibold">{member.qualification}</p>
                                <p className="text-sm text-gray-600">{member.bio}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
