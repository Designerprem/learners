
import React, { useState } from 'react';
import { FACULTY_MEMBERS, FACULTY_ANNOUNCEMENTS } from '../../constants';
import type { Announcement } from '../../types';

const Announcements: React.FC = () => {
    const facultyMember = FACULTY_MEMBERS[0];
    const [announcements, setAnnouncements] = useState<Announcement[]>(
        FACULTY_ANNOUNCEMENTS.filter(a => a.author === facultyMember.name)
    );
    const [isCreating, setIsCreating] = useState(false);
    
    const handleCreateAnnouncement = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newAnnouncement: Announcement = {
            id: Date.now(),
            title: formData.get('title') as string,
            content: formData.get('content') as string,
            audience: formData.get('audience') as string,
            author: facultyMember.name,
            date: new Date().toISOString().split('T')[0],
        };
        setAnnouncements(prev => [newAnnouncement, ...prev]);
        setIsCreating(false);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-brand-dark">Announcements</h1>
                <button
                    onClick={() => setIsCreating(prev => !prev)}
                    className="bg-brand-red text-white font-semibold px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                    {isCreating ? 'Cancel' : 'Create New'}
                </button>
            </div>

            {isCreating && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-2xl font-bold text-brand-dark mb-4">New Announcement</h2>
                    <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                            <input type="text" name="title" id="title" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red bg-white" />
                        </div>
                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
                            <textarea name="content" id="content" rows={4} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red bg-white"></textarea>
                        </div>
                         <div>
                            <label htmlFor="audience" className="block text-sm font-medium text-gray-700">Target Paper</label>
                            <select name="audience" id="audience" required className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red">
                                {facultyMember.assignedPapers.map(paper => <option key={paper} value={paper}>{paper}</option>)}
                            </select>
                        </div>
                        <div className="flex justify-end">
                             <button type="submit" className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-700">Post Announcement</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="space-y-6">
                {announcements.map(ann => (
                    <div key={ann.id} className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-start">
                             <div>
                                <h3 className="text-xl font-bold text-brand-dark">{ann.title}</h3>
                                <p className="text-sm text-gray-500">Posted on {ann.date} for <span className="font-semibold">{ann.audience}</span></p>
                            </div>
                            <div className="space-x-2">
                                <button className="text-xs font-semibold text-blue-600 hover:underline">Edit</button>
                                <button className="text-xs font-semibold text-brand-red hover:underline">Delete</button>
                            </div>
                        </div>
                        <p className="text-gray-700 mt-4">{ann.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Announcements;
