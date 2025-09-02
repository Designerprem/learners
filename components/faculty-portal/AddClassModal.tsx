

import React, { useState, useEffect, useRef } from 'react';
import type { CalendarEvent } from '../../types';

interface AddClassModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaveClass: (eventData: Omit<CalendarEvent, 'type'> & { id?: number | string }) => void;
    assignedPapers: string[];
    eventToEdit: CalendarEvent | null;
}

const AddClassModal: React.FC<AddClassModalProps> = ({ isOpen, onClose, onSaveClass, assignedPapers, eventToEdit }) => {
    const initialState = {
        paper: assignedPapers[0] || '',
        title: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '11:00',
        joinLink: '',
    };

    const [formData, setFormData] = useState(initialState);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            if (eventToEdit) {
                 setFormData({
                    paper: eventToEdit.paper || '',
                    title: eventToEdit.title,
                    date: eventToEdit.date,
                    startTime: eventToEdit.startTime || '09:00',
                    endTime: eventToEdit.endTime || '11:00',
                    joinLink: eventToEdit.joinLink || '',
                });
            } else {
                 setFormData(initialState); // Reset form when modal opens for new class
            }
        }
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, eventToEdit, onClose]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSaveClass({
            ...formData,
            id: eventToEdit?.id, // Pass id if we are editing
        });
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
                    <h2 className="text-2xl font-bold text-brand-dark">{eventToEdit ? 'Edit Class' : 'Schedule New Class'}</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div>
                            <label htmlFor="paper" className="block text-sm font-medium text-gray-700">Paper</label>
                            <select 
                                name="paper" 
                                id="paper" 
                                required 
                                value={formData.paper}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red"
                            >
                                {assignedPapers.map(paper => (
                                    <option key={paper} value={paper}>{paper}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Class Topic</label>
                            <input 
                                type="text" 
                                name="title" 
                                id="title" 
                                required 
                                value={formData.title} 
                                onChange={handleChange} 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red bg-white" 
                            />
                        </div>
                         <div>
                            <label htmlFor="joinLink" className="block text-sm font-medium text-gray-700">Zoom/Meeting Link (Optional)</label>
                            <input 
                                type="url" 
                                name="joinLink" 
                                id="joinLink" 
                                value={formData.joinLink} 
                                onChange={handleChange} 
                                placeholder="https://zoom.us/j/..."
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red bg-white" 
                            />
                        </div>
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                            <input 
                                type="date" 
                                name="date" 
                                id="date" 
                                required 
                                value={formData.date} 
                                onChange={handleChange} 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red bg-white" 
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
                                <input 
                                    type="time" 
                                    name="startTime" 
                                    id="startTime" 
                                    required 
                                    value={formData.startTime} 
                                    onChange={handleChange} 
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red bg-white" 
                                />
                            </div>
                            <div>
                                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
                                <input 
                                    type="time" 
                                    name="endTime" 
                                    id="endTime" 
                                    required 
                                    value={formData.endTime} 
                                    onChange={handleChange} 
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red bg-white" 
                                />
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border-t bg-gray-50 flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="bg-brand-red text-white font-semibold px-4 py-2 rounded-md hover:bg-red-700">{eventToEdit ? 'Update Class' : 'Schedule Class'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddClassModal;