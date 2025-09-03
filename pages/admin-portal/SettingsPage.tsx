
import React, { useState } from 'react';

const SettingsPage: React.FC = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        // NOTE: In a real app, this would involve an API call to a secure backend.
        // For this simulation, we check against the hardcoded password.
        if (currentPassword !== 'password') {
            setError("Incorrect current password.");
            return;
        }

        if (newPassword.length < 6) {
            setError("New password must be at least 6 characters long.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match.");
            return;
        }

        // Simulate a successful password change
        console.log("Admin password changed successfully (simulation). New password would be:", newPassword);
        setSuccessMessage("Your password has been changed successfully. Please use it for your next login.");
        
        // Clear form fields
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');

        setTimeout(() => setSuccessMessage(''), 5000);
    };

    return (
        <div>
            <h1 className="text-3xl md:text-4xl font-bold text-brand-dark mb-8">Admin Settings</h1>

            <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
                <h2 className="text-2xl font-bold text-brand-dark mb-4 border-b pb-4">Change Password</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <p className="text-sm text-red-600 p-3 bg-red-50 rounded-md">{error}</p>}
                    {successMessage && <p className="text-sm text-green-600 p-3 bg-green-50 rounded-md">{successMessage}</p>}

                    <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
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
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
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
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
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
                         <button type="submit" className="bg-brand-red text-white font-semibold px-6 py-2 rounded-md hover:bg-red-700 transition-colors">
                            Update Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SettingsPage;
