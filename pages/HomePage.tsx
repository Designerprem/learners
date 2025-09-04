

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { COURSES, TESTIMONIALS, BLOG_POSTS, FACULTY_MEMBERS, HERO_SLIDES, STUDENTS } from '../constants';
import AIAssistant from '../components/AIAssistant';
import PopupNotificationManager from '../components/PopupNotification';

const Hero = () => {
    const [slides, setSlides] = useState(HERO_SLIDES);
    const [currentIndex, setCurrentIndex] = useState(0);
    
    useEffect(() => {
        try {
            const storedData = localStorage.getItem('siteContent');
            if (storedData) {
                const content = JSON.parse(storedData);
                if (content.banners && content.banners.length > 0) {
                    setSlides(content.banners);
                }
            }
        } catch (error) {
            console.error("Failed to parse hero slides from localStorage", error);
        }
    }, []);

    if (slides.length === 0) return null;

    const currentSlide = slides[currentIndex];

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastSlide = currentIndex === slides.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };
    
    useEffect(() => {
        const timer = setTimeout(goToNext, 7000);
        return () => clearTimeout(timer);
    }, [currentIndex, slides.length]);

    return (
        <>
            <style>{`
                @keyframes hero-fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .hero-content-container > * {
                    opacity: 0; /* Start invisible */
                    animation: hero-fade-in-up 0.8s ease-out forwards;
                }
                /* Staggered delays */
                .hero-content-container > h1 {
                    animation-delay: 0.2s;
                }
                .hero-content-container > p {
                    animation-delay: 0.4s;
                }
                .hero-content-container > div {
                    animation-delay: 0.6s;
                }
            `}</style>
            <div className="relative bg-brand-dark h-[50vh] md:h-[70vh] w-full group">
                {/* Background Images */}
                <div className="w-full h-full">
                    {slides.map((slide, slideIndex) => (
                         <div key={slideIndex} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${slideIndex === currentIndex ? 'opacity-30' : 'opacity-0'}`}>
                            <img src={slide.url} alt={slide.alt} className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                     <div key={currentIndex} className="relative container mx-auto px-6 py-16 md:py-32 text-center text-white hero-content-container">
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-4">
                            {currentSlide.title.main}<br/> <span className="text-red-400">{currentSlide.title.highlighted}</span>
                        </h1>
                        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-gray-200">
                            {currentSlide.subtitle}
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                            {currentSlide.buttons.map((button) => (
                                <Link 
                                    key={button.to + button.text} 
                                    to={button.to} 
                                    className={`${
                                        button.variant === 'primary' 
                                            ? 'bg-brand-red text-white hover:bg-red-700' 
                                            : 'bg-white text-brand-dark hover:bg-gray-200'
                                    } px-8 py-3 rounded-md font-semibold transition-transform hover:scale-105 shadow-lg`}
                                >
                                    {button.text}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Navigation Arrows */}
                <button onClick={goToPrevious} className="absolute top-1/2 left-5 transform -translate-y-1/2 p-2 bg-black bg-opacity-30 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-opacity-50 z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button onClick={goToNext} className="absolute top-1/2 right-5 transform -translate-y-1/2 p-2 bg-black bg-opacity-30 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-opacity-50 z-10">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>

                {/* Dot Indicators */}
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                    {slides.map((_, slideIndex) => (
                        <button key={slideIndex} onClick={() => setCurrentIndex(slideIndex)} className={`w-3 h-3 rounded-full transition-colors duration-300 ${currentIndex === slideIndex ? 'bg-white' : 'bg-white bg-opacity-50'}`}></button>
                    ))}
                </div>
            </div>
        </>
    );
};


const WhyChooseUs = () => {
    const features = [
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mx-auto text-brand-red"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.67c.12-.24.232-.487.34-.737m-4.118 6.075c.62-1.299 1.154-2.697 1.6-4.125m.001-3.75v.01c0 .218.01.437.028.65m-3.75 0c.056.126.118.25.185.375m-3.75 0a9.348 9.348 0 019-5.334c1.5 0 2.896.398 4.121.952A4.125 4.125 0 009 12.348M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
            title: 'Expert Faculty',
            description: 'Learn from seasoned professionals and passionate ACCA tutors.'
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mx-auto text-brand-red"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182.553-.44 1.282-.659 2.003-.659c.768 0 1.536.219 2.228.659l.879.659M7.536 18.243A5.002 5.002 0 0112 15c1.45 0 2.757.622 3.716 1.644m-7.432 0A5.002 5.002 0 0112 15c-1.45 0-2.757.622-3.716 1.644" /></svg>,
            title: 'Affordable Excellence',
            description: "High-quality ACCA education that is both flexible and student-friendly."
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mx-auto text-brand-red"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>,
            title: 'Resource-Rich',
            description: "Access a wealth of practice questions, revision notes, and study aids."
        },
         {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mx-auto text-brand-red"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.952a4.5 4.5 0 011.13-1.853a4.5 4.5 0 011.853-1.13M18 18.72v-7.5M18 18.72c-3.181 0-5.714-2.533-5.714-5.714M12 12.572A4.5 4.5 0 0113.87 11.13a4.5 4.5 0 011.13 1.853M12 12.572v-7.5M12 12.572c-3.181 0-5.714-2.533-5.714-5.714M8.43 18.72c3.181 0 5.714-2.533 5.714-5.714" /></svg>,
            title: 'Community Support',
            description: "Join a supportive community and connect via webinars, workshops, and events."
        },
    ];
    return (
        <section className="py-8 md:py-16 bg-white">
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

const StatCounter = ({ end, duration = 2000, label, suffix = '' }: { end: number; duration?: number; label: string; suffix?: string; }) => {
    const [count, setCount] = useState(0);
    const countRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        let start = 0;
        const endValue = end;
        if (start === endValue) return;

        const totalFrames = Math.round(duration / (1000 / 60));
        const increment = (endValue - start) / totalFrames;

        let currentFrame = 0;
        let animationFrameId: number;

        const counter = () => {
            currentFrame += 1;
            const newCount = Math.round(start + (increment * currentFrame));
            
            if (currentFrame < totalFrames) {
                setCount(newCount);
                animationFrameId = requestAnimationFrame(counter);
            } else {
                setCount(endValue);
            }
        };
        
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                animationFrameId = requestAnimationFrame(counter);
                observer.disconnect();
            }
        }, { threshold: 0.1 });

        if (countRef.current) {
            observer.observe(countRef.current);
        }
        
        return () => {
            cancelAnimationFrame(animationFrameId);
            observer.disconnect();
        }

    }, [end, duration]);

    return (
        <div className="text-center">
            <span ref={countRef} className="text-4xl md:text-5xl font-black text-brand-red">
                {count.toLocaleString()}{suffix}
            </span>
            <p className="mt-2 text-lg text-gray-300">{label}</p>
        </div>
    );
};

const ProvenRecords = () => (
    <section className="py-12 md:py-20 bg-brand-dark">
        <div className="container mx-auto px-6">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white">Our Proven Records</h2>
                <p className="text-gray-400 mt-2 max-w-2xl mx-auto">Decades of dedication, reflected in numbers.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8">
                <StatCounter end={95} suffix="%" label="High Pass Rate" />
                <StatCounter end={5000} suffix="+" label="Successful Alumni" />
                <StatCounter end={10} suffix="+" label="Years of Excellence" />
                <StatCounter end={98} suffix="%" label="Student Satisfaction" />
            </div>
        </div>
    </section>
);


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

const LatestBlogPosts = () => {
    const [latestPosts, setLatestPosts] = useState(() => BLOG_POSTS.slice(0, 3));
    const facultyMap = new Map(FACULTY_MEMBERS.map(f => [f.id, f]));
    const studentMap = new Map(STUDENTS.map(s => [s.id, s]));
    
    useEffect(() => {
        try {
            const storedData = localStorage.getItem('siteContent');
            if (storedData) {
                const content = JSON.parse(storedData);
                if (content.blogs && content.blogs.length > 0) {
                    setLatestPosts(content.blogs.slice(0, 3));
                }
            }
        } catch (error) {
            console.error("Failed to parse blogs from localStorage", error);
        }
    }, []);


    return (
        <section className="py-12 md:py-20 bg-brand-beige">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold">From Our Blog</h2>
                    <p className="text-gray-600 mt-2">Get the latest insights, tips, and news from our experts.</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {latestPosts.map(post => {
                        const author = post.authorType === 'student'
                            ? studentMap.get(post.authorId)
                            : facultyMap.get(post.authorId);
                        const authorName = author ? author.name : 'Learners Academy';
                        const authorImageUrl = author ? ('imageUrl' in author ? author.imageUrl : author.avatarUrl) : '';

                        return (
                            <div key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col group">
                                <img src={post.imageUrl.replace('/1200/800', '/800/600')} alt={post.title} className="w-full h-56 object-cover" />
                                <div className="p-6 flex flex-col flex-grow">
                                    <div>
                                        <p className="text-sm text-brand-red font-semibold">{post.tags.join(', ')}</p>
                                        <h3 className="text-xl font-bold mt-2 mb-3 group-hover:text-brand-red transition-colors min-h-[3.5rem] line-clamp-2">{post.title}</h3>
                                        <p className="text-gray-600 text-sm line-clamp-3">{post.excerpt}</p>
                                    </div>
                                    <div className="mt-auto pt-6">
                                        <div className="border-t pt-4 flex items-center">
                                            {author && <img src={authorImageUrl.replace('/400/400', '/100/100')} alt={authorName} className="w-10 h-10 rounded-full mr-3" />}
                                            <div>
                                                <p className="font-semibold text-sm">{authorName}</p>
                                                <p className="text-xs text-gray-500">{new Date(post.publicationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                            </div>
                                        </div>
                                        <Link to={`/blog/${post.id}`} className="mt-4 font-semibold text-brand-red self-start block">Read More &rarr;</Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="text-center mt-12">
                    <Link to="/blog" className="bg-brand-dark text-white px-8 py-3 rounded-md font-semibold hover:bg-opacity-80 transition-transform hover:scale-105 shadow-lg">View All Posts</Link>
                </div>
            </div>
        </section>
    );
};

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
            <ProvenRecords />
            <ACCAPrograms />
            <Testimonials />
            <LatestBlogPosts />
            <CallToAction />
            <AIAssistant />
            <PopupNotificationManager />
        </div>
    );
};

export default HomePage;