
import React from 'react';
import { Link } from 'react-router-dom';
import { COURSES, TESTIMONIALS } from '../constants';
import NewsTicker from '../components/NewsTicker';
import AIAssistant from '../components/AIAssistant';

const Hero = () => (
    <div className="relative bg-brand-dark">
        <div className="absolute inset-0">
            <img src="https://picsum.photos/seed/hero/1920/1080" alt="Campus" className="w-full h-full object-cover opacity-30" />
        </div>
        <div className="relative container mx-auto px-6 py-16 md:py-32 text-center text-white">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-4">
                Shape Your Future in Finance with<br/> <span className="text-red-400">Reliant Learners Academy</span>
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-gray-200">
                Your premier destination for ACCA qualifications and professional accounting education.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/admissions" className="bg-brand-red text-white px-8 py-3 rounded-md font-semibold hover:bg-red-700 transition-transform hover:scale-105 shadow-lg">Apply Now</Link>
                <Link to="/courses" className="bg-white text-brand-dark px-8 py-3 rounded-md font-semibold hover:bg-gray-200 transition-transform hover:scale-105 shadow-lg">Explore Courses</Link>
            </div>
        </div>
    </div>
);

const WhyChooseUs = () => {
    const features = [
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mx-auto text-brand-red"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.67c.12-.24.232-.487.34-.737m-4.118 6.075c.62-1.299 1.154-2.697 1.6-4.125m.001-3.75v.01c0 .218.01.437.028.65m-3.75 0c.056.126.118.25.185.375m-3.75 0a9.348 9.348 0 019-5.334c1.5 0 2.896.398 4.121.952A4.125 4.125 0 009 12.348M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
            title: 'Expert Faculty',
            description: 'Learn from industry veterans and ACCA-qualified professionals.'
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mx-auto text-brand-red"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0l-.07.002z" /></svg>,
            title: 'ACCA Gold Partner',
            description: 'Officially recognized for high pass rates and excellent student support.'
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mx-auto text-brand-red"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-3.75-.625m3.75.625l-6.25 3.75M21.75 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
            title: 'Proven Pass Rates',
            description: 'Our structured curriculum is designed for your exam success.'
        },
         {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mx-auto text-brand-red"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.952a4.5 4.5 0 011.13-1.853a4.5 4.5 0 011.853-1.13M18 18.72v-7.5M18 18.72c-3.181 0-5.714-2.533-5.714-5.714M12 12.572A4.5 4.5 0 0113.87 11.13a4.5 4.5 0 011.13 1.853M12 12.572v-7.5M12 12.572c-3.181 0-5.714-2.533-5.714-5.714M8.43 18.72c3.181 0 5.714-2.533 5.714-5.714" /></svg>,
            title: 'Career Support',
            description: 'Dedicated placement assistance to launch your professional career.'
        },
    ];
    return (
        <section className="py-12 md:py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
                    {features.map(feature => (
                        <div key={feature.title}>
                            {feature.icon}
                            <h3 className="text-xl font-bold mt-4 mb-2">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};


const ACCAPrograms = () => (
     <section className="py-12 md:py-20 bg-brand-beige">
        <div className="container mx-auto px-6">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold">Your Pathway to ACCA Qualification</h2>
                <p className="text-gray-600 mt-2 max-w-2xl mx-auto">We provide a clear, structured path from foundational knowledge to professional expertise, ensuring you are exam-ready at every stage.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {COURSES.map(course => (
                    <div key={course.id} className="bg-white p-8 rounded-lg shadow-lg flex flex-col">
                        <h3 className="text-2xl font-bold text-brand-red mb-4">{course.title}</h3>
                        <p className="text-gray-600 mb-6 flex-grow">{course.description}</p>
                        <div className="border-t pt-4 space-y-2">
                             <p><strong>Duration:</strong> {course.duration}</p>
                             <p><strong>Eligibility:</strong> {course.eligibility}</p>
                        </div>
                        <Link to={`/courses/${course.id}`} className="mt-6 font-semibold text-brand-red hover:text-brand-dark self-start">Learn More &rarr;</Link>
                    </div>
                ))}
            </div>
        </div>
    </section>
);


const Testimonials = () => (
     <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-6">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold">What Our Students Say</h2>
                <p className="text-gray-600 mt-2">Real stories from our successful alumni.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 pt-12">
                {TESTIMONIALS.map(t => (
                    <div key={t.id} className="bg-brand-beige p-8 rounded-lg text-center shadow-lg relative">
                        <img src={t.imageUrl} alt={t.name} className="w-24 h-24 rounded-full mx-auto absolute -top-12 left-1/2 -translate-x-1/2 border-4 border-white shadow-md" />
                        <div className="mt-14">
                             <p className="text-gray-700 italic mb-4">"{t.quote}"</p>
                            <p className="font-bold text-lg text-brand-dark">{t.name}</p>
                            <p className="text-brand-red font-semibold">{t.program}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const CallToAction = () => (
    <section className="bg-brand-red text-white">
        <div className="container mx-auto px-6 py-16 text-center">
            <h2 className="text-3xl font-bold mb-2">Ready to Start Your ACCA Journey?</h2>
            <p className="mb-6 max-w-2xl mx-auto">Join hundreds of successful students who chose Reliant Learners Academy for their professional accounting career. Apply today to secure your spot for the next intake.</p>
            <Link to="/admissions" className="bg-white text-brand-red px-10 py-3 rounded-md font-bold hover:bg-gray-200 transition-transform hover:scale-105 shadow-lg">Apply Now</Link>
        </div>
    </section>
);


const HomePage: React.FC = () => {
    return (
        <div>
            <Hero />
            <WhyChooseUs />
            <NewsTicker />
            <ACCAPrograms />
            <Testimonials />
            <CallToAction />
            <AIAssistant />
        </div>
    );
};

export default HomePage;
