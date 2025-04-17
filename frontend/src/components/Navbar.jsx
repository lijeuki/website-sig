// Navbar.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="bg-green-800 px-4 py-4 shadow-md">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo */}
                <div>
                    <Link to="/" className="text-white font-bold text-xl">
                    Bandung Green Space
                    </Link>
                </div>

                {/* Desktop Navigation Links - Right Aligned */}
                <div className="hidden md:flex items-center space-x-8">
                    <Link to="/" className="text-white hover:text-gray-300 font-medium">
                        Home
                    </Link>
                    <Link to="/peta" className="text-white hover:text-gray-300 font-medium">
                        Peta
                    </Link>
                    <Link to="/data" className="text-white hover:text-gray-300 font-medium">
                        Data
                    </Link>
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden">
                    <button
                        onClick={toggleMenu}
                        className="flex items-center p-1 rounded-md text-white focus:outline-none"
                    >
                        {isOpen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden mt-2">
                    <div className="flex flex-col space-y-2 pt-2 pb-3 border-t border-blue-800">
                        <Link to="/" className="text-white hover:bg-blue-800 px-3 py-2 rounded-md font-medium">
                            Home
                        </Link>
                        <Link to="/peta" className="text-white hover:bg-blue-800 px-3 py-2 rounded-md font-medium">
                            Peta
                        </Link>
                        <Link to="/data" className="text-white hover:bg-blue-800 px-3 py-2 rounded-md font-medium">
                            Data
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;