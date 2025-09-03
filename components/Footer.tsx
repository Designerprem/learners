import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => (
     <Link to="/" className="flex items-center">
       <img src="https://scontent.fbhr4-1.fna.fbcdn.net/v/t39.30808-1/529317458_122176712906516643_1248331585587425416_n.jpg?stp=c0.64.1920.1920a_dst-jpg_s200x200_tt6&_nc_cat=104&ccb=1-7&_nc_sid=2d3e12&_nc_ohc=8I2ZS1q_ApEQ7kNvwF37wvl&_nc_oc=Adk2uluXqsn0dXjNMJpxHVBzFmuM74GjLpn7Zg0eLcUG_ywlNUVVs9RvDUpUtNg3-5c&_nc_zt=24&_nc_ht=scontent.fbhr4-1.fna&_nc_gid=ZaRJb_SfrkngjBjjwD8OZQ&oh=00_AfVsUL--_a_dYIsmX724ZUV8imcA4h9Iz6UjupURWsH2AA&oe=68BC2CE7" alt="Learners Academy Logo" className="h-12 w-auto" />
    </Link>
);

const Footer: React.FC = () => {
    return (
        <footer className="bg-brand-dark text-white">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Column 1: Brand */}
                    <div className="col-span-1 md:col-span-1">
                         <Logo />
                        <p className="mt-4 text-gray-400 text-sm">Your gateway to a successful career in accounting and finance.</p>
                        <div className="mt-4">
                            <Link to="/login?role=admin" className="text-xs text-gray-500 hover:text-white">Admin Login</Link>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="font-semibold tracking-wider uppercase">Quick Links</h3>
                        <ul className="mt-4 space-y-2">
                            <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                            <li><Link to="/courses" className="text-gray-400 hover:text-white transition-colors">Courses</Link></li>
                            <li><Link to="/gallery" className="text-gray-400 hover:text-white transition-colors">Gallery</Link></li>
                            <li><Link to="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
                            <li><Link to="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Portals */}
                     <div>
                        <h3 className="font-semibold tracking-wider uppercase">Portals</h3>
                        <ul className="mt-4 space-y-2">
                            <li><Link to="/login?role=student" className="text-gray-400 hover:text-white transition-colors">Student Portal</Link></li>
                            <li><Link to="/login?role=faculty" className="text-gray-400 hover:text-white transition-colors">Faculty Portal</Link></li>
                            <li><Link to="/admissions" className="text-gray-400 hover:text-white transition-colors">Apply Now</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Contact */}
                    <div>
                        <h3 className="font-semibold tracking-wider uppercase">Contact Us</h3>
                        <ul className="mt-4 space-y-2 text-gray-400">
                            <li>Kathmandu, 44600, Nepal</li>
                            <li>Email: learnersaccademynp@gmail.com</li>
                            <li>Phone: +977-9802394518</li>
                             <li>Phone: +977-9802394519</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Reliant Learners Academy. All Rights Reserved.</p>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                       <a href="#" className="hover:text-white transition-colors">Facebook</a>
                       <a href="#" className="hover:text-white transition-colors">Twitter</a>
                       <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
