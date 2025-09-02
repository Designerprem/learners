
import React, { useState } from 'react';
import { FACULTY_MEMBERS } from '../../constants';
import type { FacultyMember } from '../../types';

const ChangePasswordCard = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match.");
            return;
        }
        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }
        if (currentPassword !== 'password') { 
            setError("Incorrect current password.");
            return;
        }

        console.log("Password updated successfully!");
        setSuccessMessage("Your password has been changed successfully.");
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setSuccessMessage(''), 5000);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mt-8">
            <h2 className="text-xl font-bold mb-4 border-b pb-4">Change Password</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                 {error && <p className="text-sm text-red-600 p-3 bg-red-50 rounded-md">{error}</p>}
                 {successMessage && <p className="text-sm text-green-600 p-3 bg-green-50 rounded-md">{successMessage}</p>}
                <div>
                    <label htmlFor="currentPassword"className="block text-sm font-medium text-gray-700">Current Password</label>
                    <input 
                        type="password" 
                        id="currentPassword" 
                        required 
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red bg-white" 
                    />
                </div>
                 <div>
                    <label htmlFor="newPassword"className="block text-sm font-medium text-gray-700">New Password</label>
                    <input 
                        type="password" 
                        id="newPassword" 
                        required 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red bg-white" 
                    />
                </div>
                 <div>
                    <label htmlFor="confirmPassword"className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                    <input 
                        type="password" 
                        id="confirmPassword" 
                        required 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red bg-white" 
                    />
                </div>
                <div className="flex justify-end">
                     <button type="submit" className="bg-brand-red text-white font-semibold px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
                        Update Password
                    </button>
                </div>
            </form>
        </div>
    );
};


const Profile: React.FC = () => {
    const [facultyInfo, setFacultyInfo] = useState<FacultyMember>(FACULTY_MEMBERS[0]);
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setFacultyInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveChanges = () => {
        // In a real app, this would send an API request to update the profile.
        console.log("Saving profile:", facultyInfo);
        setMessage('Profile updated successfully!');
        setIsEditing(false);
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <div>
            <h1 className="text-4xl font-bold text-brand-dark mb-8">My Profile</h1>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-col md:flex-row items-center">
                    <img src={facultyInfo.imageUrl} alt={facultyInfo.name} className="w-32 h-32 rounded-full border-4 border-brand-red mb-4 md:mb-0 md:mr-6" />
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-3xl font-bold">{facultyInfo.name}</h2>
                        <p className="text-brand-red font-semibold">{facultyInfo.qualification}</p>
                    </div>
                </div>

                <div className="mt-8 border-t pt-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-brand-dark">Biography</h3>
                        {!isEditing && (
                            <button onClick={() => setIsEditing(true)} className="text-sm font-semibold text-blue-600 hover:underline">
                                Edit
                            </button>
                        )}
                    </div>
                    {isEditing ? (
                        <div>
                            <textarea
                                name="bio"
                                value={facultyInfo.bio}
                                onChange={handleInputChange}
                                rows={5}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-red focus:border-brand-red"
                            />
                            <div className="flex justify-end gap-4 mt-4">
                                <button onClick={() => setIsEditing(false)} className="bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
                                <button onClick={handleSaveChanges} className="bg-brand-red text-white font-semibold px-4 py-2 rounded-md hover:bg-red-700">Save Changes</button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-700 leading-relaxed">{facultyInfo.bio}</p>
                    )}
                    {message && <p className="text-sm text-green-600 mt-2">{message}</p>}
                </div>
                 <div className="mt-8 border-t pt-6">
                     <h3 className="text-xl font-bold text-brand-dark mb-4">Assigned Papers</h3>
                     <ul className="space-y-2">
                        {facultyInfo.assignedPapers.map(paper => (
                            <li key={paper} className="p-3 bg-brand-beige rounded-md font-medium">{paper}</li>
                        ))}
                     </ul>
                 </div>
            </div>
             <ChangePasswordCard />
        </div>
    );
};

export default Profile;
