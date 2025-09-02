
import React, { useState, useEffect, useRef } from 'react';
import type { Application } from '../../types';
import { COURSES } from '../../constants';

interface AddStudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddStudent: (newApplication: Application) => void;
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({ isOpen, onClose, onAddStudent }) => {
    const initialState = {
        fullName: '',
        email: '',
        phone: '',
        program: COURSES[0].title,
        password: '',
    };
    const [formData, setFormData] = useState(initialState);
    const [documentFile, setDocumentFile] = useState<File | null>(null);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            setFormData(initialState); // Reset form when modal opens
            setDocumentFile(null);
            setPhotoFile(null);
            setPhotoPreviewUrl(null);
        }
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === 'document') {
            setDocumentFile(e.target.files ? e.target.files[0] : null);
        } else if (e.target.name === 'photo') {
            if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                setPhotoFile(file);
                setPhotoPreviewUrl(URL.createObjectURL(file));
            } else {
                setPhotoFile(null);
                setPhotoPreviewUrl(null);
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { password, ...applicationData } = formData;
        console.log(`Creating student ${applicationData.fullName} with password: ${password}`); // Handle password securely in a real app

        const newApplication: Application = {
            id: Date.now(),
            ...applicationData,
            submittedDate: new Date().toISOString().split('T')[0],
            status: 'Approved',
            documentUrl: documentFile ? '#' : undefined, // Placeholder URL
            photoUrl: photoPreviewUrl || `https://picsum.photos/seed/${formData.fullName}/200/200`
        };
        onAddStudent(newApplication);
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div 
                ref={modalRef}
                className="bg-white rounded-lg shadow-2xl w-full max-w-lg"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-4 border-b">
                    <h2 className="text-2xl font-bold text-brand-dark">Manual Student Admission</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input 
                                type="text" 
                                name="fullName" 
                                id="fullName" 
                                required 
                                value={formData.fullName} 
                                onChange={handleChange} 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red bg-white" 
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input 
                                type="email" 
                                name="email" 
                                id="email" 
                                required 
                                value={formData.email} 
                                onChange={handleChange} 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red bg-white" 
                            />
                        </div>
                        <div>
                            <label htmlFor="password"className="block text-sm font-medium text-gray-700">Set Initial Password</label>
                            <input 
                                type="password" 
                                name="password" 
                                id="password" 
                                required 
                                value={formData.password}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red bg-white" 
                            />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <input 
                                type="tel" 
                                name="phone" 
                                id="phone" 
                                required 
                                value={formData.phone} 
                                onChange={handleChange} 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red bg-white" 
                            />
                        </div>
                        <div>
                            <label htmlFor="program" className="block text-sm font-medium text-gray-700">Program</label>
                            <select 
                                name="program" 
                                id="program" 
                                required 
                                value={formData.program}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red"
                            >
                                {COURSES.map(course => (
                                    <option key={course.id} value={course.title}>{course.title}</option>
                                ))}
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Student Photo</label>
                            <div className="mt-1 flex items-center gap-4">
                                <img src={photoPreviewUrl || 'https://via.placeholder.com/100'} alt="Photo preview" className="w-20 h-20 rounded-full object-cover border" />
                                <input 
                                    type="file" 
                                    name="photo" 
                                    id="photo"
                                    accept="image/*" 
                                    onChange={handleFileChange}
                                    className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-brand-red hover:file:bg-red-100"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="document" className="block text-sm font-medium text-gray-700">Upload Transcript/Certificate (Optional)</label>
                            <input 
                                type="file" 
                                name="document" 
                                id="document" 
                                onChange={handleFileChange}
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-brand-red hover:file:bg-red-100"
                            />
                        </div>
                    </div>
                    <div className="p-4 border-t bg-gray-50 flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="bg-brand-red text-white font-semibold px-4 py-2 rounded-md hover:bg-red-700">Admit Student</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStudentModal;
