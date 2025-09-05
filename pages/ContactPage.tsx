import React, { useState } from 'react';
import AnimatedSection from '../components/AnimatedSection.tsx';

const ContactPage: React.FC = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);
    };

    return (
        <div className="bg-white">
            <div className="bg-brand-dark text-white py-12 md:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-20 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold">Contact Us</h1>
                    <p className="mt-4 text-lg max-w-3xl mx-auto">We're here to help. Reach out to us with any questions or inquiries.</p>
                </div>
            </div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-20 py-12 md:py-20">
                <AnimatedSection className="grid md:grid-cols-2 gap-12">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-brand-red mb-6">Send us a Message</h2>
                         {isSubmitted ? (
                            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4" role="alert">
                                <p className="font-bold">Message Sent!</p>
                                <p>Thank you for contacting us. We will get back to you soon.</p>
                            </div>
                        ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input type="text" name="name" id="name" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red bg-white" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <input type="email" name="email" id="email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red bg-white" />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                                <textarea name="message" id="message" rows={4} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red bg-white"></textarea>
                            </div>
                            <button type="submit" className="w-full bg-brand-red text-white py-3 px-4 rounded-md font-semibold hover:bg-opacity-80 transition-colors">Send Message</button>
                        </form>
                        )}
                    </div>
                    <div className="bg-brand-beige p-6 md:p-8 rounded-lg">
                        <h2 className="text-2xl md:text-3xl font-bold text-brand-dark mb-6">Contact Information</h2>
                        <div className="space-y-4 text-gray-700">
                             <p><strong>Address:</strong> Kathmandu, 44600, Nepal</p>
                             <p><strong>Phone:</strong> +977-9802394518 / +977-9802394519</p>
                             <p><strong>Email:</strong> learnersaccademynp@gmail.com</p>
                             <p><strong>Office Hours:</strong> Sun - Fri, 9:00 AM - 5:00 PM</p>
                        </div>
                        <div className="mt-8">
                             <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3533.921319084803!2d85.3421384!3d27.6865647!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb197a9e0f9951%3A0xee204fd90d8a685c!2sACCA%20%40%20Learners%20Academy!5e0!3m2!1sen!2snp!4v1626882298218!5m2!1sen!2snp"
                                className="w-full h-64 rounded-md border-0"
                                allowFullScreen={true}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Learners Academy Location"
                            ></iframe>
                        </div>
                    </div>
                </AnimatedSection>
            </div>
        </div>
    );
};

export default ContactPage;