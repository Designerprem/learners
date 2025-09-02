import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const navLinksList = [
    { to: "/", text: "Home" },
    { to: "/about", text: "About" },
    { to: "/courses", text: "Courses" },
    { to: "/admissions", text: "Admissions" },
    { to: "/gallery", text: "Gallery" },
    { to: "/faq", text: "FAQ" },
    { to: "/blog", text: "Blog" },
    { to: "/contact", text: "Contact" },
];

const Logo = () => (
     <NavLink to="/" className="flex items-center">
        <img src="https://scontent.fbhr4-1.fna.fbcdn.net/v/t39.30808-1/529317458_122176712906516643_1248331585587425416_n.jpg?stp=c0.64.1920.1920a_dst-jpg_s200x200_tt6&_nc_cat=104&ccb=1-7&_nc_sid=2d3e12&_nc_ohc=8I2ZS1q_ApEQ7kNvwF37wvl&_nc_oc=Adk2uluXqsn0dXjNMJpxHVBzFmuM74GjLpn7Zg0eLcUG_ywlNUVVs9RvDUpUtNg3-5c&_nc_zt=24&_nc_ht=scontent.fbhr4-1.fna&_nc_gid=ZaRJb_SfrkngjBjjwD8OZQ&oh=00_AfVsUL--_a_dYIsmX724ZUV8imcA4h9Iz6UjupURWsH2AA&oe=68BC2CE7" alt="Learners Academy Logo" className="h-14 w-auto" />
    </NavLink>
);

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="bg-white sticky top-0 z-50 shadow-md border-b border-gray-100">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Logo />
                
                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-6">
                    {navLinksList.map(link => (
                        <NavLink 
                            key={link.to} 
                            to={link.to} 
                            className={({ isActive }) => 
                                `font-medium text-brand-dark transition-colors duration-300 ${isActive ? 'text-brand-red pb-1 border-b-2 border-brand-red' : 'hover:text-brand-red'}`
                            }
                        >
                            {link.text}
                        </NavLink>
                    ))}
                     <NavLink to="/login?role=student" className="bg-brand-red text-white ml-4 px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-300 text-sm font-semibold">Login</NavLink>
                </nav>

                {/* Mobile menu button */}
                <div className="md:hidden">
                    <button onClick={() => setIsOpen(!isOpen)} className="text-brand-dark focus:outline-none">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
             {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-200">
                    <nav className="px-6 pt-2 pb-4 flex flex-col space-y-2 text-brand-dark">
                        {navLinksList.map(link => (
                             <NavLink key={link.to} to={link.to} onClick={() => setIsOpen(false)} className="hover:text-brand-red py-2">{link.text}</NavLink>
                        ))}
                        <NavLink to="/login?role=student" onClick={() => setIsOpen(false)} className="bg-brand-red text-white text-center mt-2 px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-300 font-semibold">Login</NavLink>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;