
import React from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import type { UserRole } from '../types';

const LoginPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const role = (searchParams.get('role') as UserRole) || 'student';

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you'd perform authentication here.
        // For this prototype, we'll just navigate to the correct portal.
        switch (role) {
            case 'student':
                navigate('/student-portal/dashboard');
                break;
            case 'faculty':
                navigate('/faculty-portal/dashboard');
                break;
            case 'admin':
                navigate('/admin-portal/dashboard');
                break;
            default:
                navigate('/');
        }
    };

    const roleConfig = {
        student: {
            title: 'Student Portal Login',
            idLabel: 'Student ID',
            idDefault: 'S12345',
            switchRoleLink: '/login?role=faculty',
            switchRoleText: 'Faculty Login'
        },
        faculty: {
            title: 'Faculty Portal Login',
            idLabel: 'Faculty Email',
            idDefault: 'jane.smith@learners.edu',
            switchRoleLink: '/login?role=student',
            switchRoleText: 'Student Login'
        },
        admin: {
            title: 'Admin Portal Login',
            idLabel: 'Admin Email',
            idDefault: 'admin@learners.edu',
            switchRoleLink: '/',
            switchRoleText: ''
        },
    };
    
    const { title, idLabel, idDefault, switchRoleLink, switchRoleText } = roleConfig[role];

    return (
         <div className="flex flex-col items-center justify-center min-h-screen bg-brand-beige">
            <div className="mb-8 text-center">
                <img src="https://scontent.fbhr4-1.fna.fbcdn.net/v/t39.30808-1/529317458_122176712906516643_1248331585587425416_n.jpg?stp=c0.64.1920.1920a_dst-jpg_s200x200_tt6&_nc_cat=104&ccb=1-7&_nc_sid=2d3e12&_nc_ohc=8I2ZS1q_ApEQ7kNvwF37wvl&_nc_oc=Adk2uluXqsn0dXjNMJpxHVBzFmuM74GjLpn7Zg0eLcUG_ywlNUVVs9RvDUpUtNg3-5c&_nc_zt=24&_nc_ht=scontent.fbhr4-1.fna&_nc_gid=ZaRJb_SfrkngjBjjwD8OZQ&oh=00_AfVsUL--_a_dYIsmX724ZUV8imcA4h9Iz6UjupURWsH2AA&oe=68BC2CE7" alt="Learners Academy Logo" className="h-20 w-auto mx-auto" />
                <h1 className="text-2xl font-bold text-brand-dark mt-4">Reliant Learners Academy</h1>
            </div>
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-center mb-6">{title}</h2>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="id" className="block text-sm font-medium text-gray-700">{idLabel}</label>
                        <input type="text" name="id" id="id" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red bg-white" defaultValue={idDefault} />
                    </div>
                    <div>
                        <label htmlFor="password"className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" name="password" id="password" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red bg-white" defaultValue="password" />
                    </div>
                    <button type="submit" className="w-full bg-brand-red text-white py-3 px-4 rounded-md font-semibold hover:bg-red-700 transition-colors">Login</button>
                    {role !== 'admin' && (
                        <p className="text-center text-sm text-gray-600">
                           <Link to={switchRoleLink} className="font-medium text-brand-red hover:underline">{switchRoleText}</Link>
                        </p>
                    )}
                     <p className="text-center text-xs text-gray-500 mt-4">
                        <Link to="/" className="hover:underline">← Back to Main Site</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
