


import React, { useState } from 'react';

const AdmissionsPage: React.FC = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        program: 'ACCA Applied Knowledge',
        document: null as File | null,
        photo: null as File | null,
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically handle form submission, e.g., send to an API
        console.log(formData);
        setIsSubmitted(true);
    };

    return (
        <div className="bg-white">
            <div className="bg-brand-dark text-white py-12 md:py-20">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold">Admissions</h1>
                    <p className="mt-4 text-lg max-w-3xl mx-auto">Start your journey with Reliant Learners Academy today.</p>
                </div>
            </div>

            <div className="container mx-auto px-6 py-12 md:py-20">
                <div className="grid md:grid-cols-2 gap-12">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-brand-red mb-6">Online Application Form</h2>
                        {isSubmitted ? (
                            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4" role="alert">
                                <p className="font-bold">Application Submitted!</p>
                                <p>Thank you for applying. Our admissions team will review your application and contact you shortly.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input type="text" name="fullName" id="fullName" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red bg-white" onChange={handleChange} />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                    <input type="email" name="email" id="email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red bg-white" onChange={handleChange} />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                                    <input type="tel" name="phone" id="phone" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red bg-white" onChange={handleChange} />
                                </div>
                                <div>
                                    <label htmlFor="program" className="block text-sm font-medium text-gray-700">Program of Interest</label>
                                    <select name="program" id="program" required className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red" onChange={handleChange} value={formData.program}>
                                        <option>ACCA Applied Knowledge</option>
                                        <option>ACCA Applied Skills</option>
                                        <option>ACCA Strategic Professional</option>
                                    </select>
                                </div>
                                 <div>
                                    <label htmlFor="photo" className="block text-sm font-medium text-gray-700">Upload Your Photo</label>
                                    <input type="file" name="photo" id="photo" accept="image/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-brand-red hover:file:bg-red-100" onChange={handleFileChange} />
                                </div>
                                <div>
                                    <label htmlFor="document" className="block text-sm font-medium text-gray-700">Upload Transcript/Certificate</label>
                                    <input type="file" name="document" id="document" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-brand-red hover:file:bg-red-100" onChange={handleFileChange} />
                                </div>
                                <div>
                                    <button type="submit" className="w-full bg-brand-red text-white py-3 px-4 rounded-md font-semibold hover:bg-opacity-80 transition-colors">Submit Application</button>
                                </div>
                            </form>
                        )}
                    </div>
                     <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-brand-dark mb-6">Admission Process</h2>
                        <ol className="space-y-4">
                            <li className="flex items-start">
                                <div className="bg-brand-red text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">1</div>
                                <div>
                                    <h4 className="font-bold">Submit Application</h4>
                                    <p className="text-gray-600">Fill out the online application form with all the required details and upload your documents.</p>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <div className="bg-brand-red text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">2</div>
                                <div>
                                    <h4 className="font-bold">Application Review</h4>
                                    <p className="text-gray-600">Our admissions team will review your application to ensure all criteria are met.</p>
                                </div>
                            </li>
                             <li className="flex items-start">
                                <div className="bg-brand-red text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">3</div>
                                <div>
                                    <h4 className="font-bold">Receive Offer Letter</h4>
                                    <p className="text-gray-600">Successful candidates will receive an offer letter via email with details for the next steps.</p>
                                </div>
                            </li>
                             <li className="flex items-start">
                                <div className="bg-brand-red text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">4</div>
                                <div>
                                    <h4 className="font-bold">Pay Admission Fee</h4>
                                    <p className="text-gray-600">Secure your place by paying the admission fee through our online portal.</p>
                                </div>
                            </li>
                        </ol>
                        <div className="mt-8 bg-brand-beige p-6 rounded-lg">
                            <h3 className="font-bold text-lg mb-2">Important Dates</h3>
                            <p><strong>September Intake Deadline:</strong> August 15, {new Date().getFullYear()}</p>
                            <p><strong>Classes Begin:</strong> September 5, {new Date().getFullYear()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdmissionsPage;
