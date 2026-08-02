import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText, LayoutDashboard, Download, Library, Menu, X } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-white border-b border-gray-300 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 md:px-7 h-16 flex items-center justify-between">
         
         {/* Brand Logo */}
         <Link to="/" className="flex items-center space-x-2 text-indigo-600 font-extrabold text-xl md:text-2xl tracking-wide shrink-0">
            <FileText className="w-6 h-6 md:w-8 md:h-8" />
            <span> Share <span className="text-gray-800">Doc</span> </span>
         </Link>

         {/* Desktop Navigation */}
         <div className="hidden md:flex items-center space-x-6">
           <Link
             to="/"
             className={`flex items-center space-x-1.5 font-medium transition-colors duration-200 ${
               isActive('/') ? 'text-indigo-600 font-semibold' : 'text-gray-600 hover:text-indigo-600'
             }`}
           >
             <Library className="w-5 h-5" />
             <span>Marketplace</span>
           </Link>

           <Link
             to="/purchases"
             className={`flex items-center space-x-1.5 font-medium transition-colors duration-200 ${
               isActive('/purchases') ? 'text-indigo-600 font-semibold' : 'text-gray-600 hover:text-indigo-600'
             }`}
           >
             <Download className="w-5 h-5" />
             <span>My Purchases</span>
           </Link>

           <Link
             to="/dashboard"
             className={`flex items-center space-x-1.5 font-medium transition-colors duration-200 ${
               isActive('/dashboard') ? 'text-indigo-600 font-semibold' : 'text-gray-600 hover:text-indigo-600'
             }`}
           >
             <LayoutDashboard className="w-5 h-5" />
             <span>Dashboard</span>
           </Link>

           {/* CLERK AUTH BUTTONS AREA */}
           <div className="border-l border-gray-250 pl-4 h-6 flex items-center ml-2">
             <SignedOut>
               <SignInButton mode="modal">
                 <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer">
                   Sign In
                 </button>
               </SignInButton>
             </SignedOut>

             <SignedIn>
               <UserButton afterSignOutUrl="/" />
             </SignedIn>
           </div>
         </div>

         {/* Mobile Menu Button & User Profile Button */}
         <div className="flex md:hidden items-center space-x-3">
           <SignedIn>
             <UserButton afterSignOutUrl="/" />
           </SignedIn>

           <button
             onClick={toggleMenu}
             className="text-gray-600 hover:text-indigo-600 focus:outline-none p-1.5 rounded-lg hover:bg-gray-50 transition-colors"
           >
             {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
           </button>
         </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-4 space-y-3 shadow-inner">
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl font-medium transition-all ${
              isActive('/') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Library className="w-5 h-5" />
            <span>Marketplace</span>
          </Link>

          <Link
            to="/purchases"
            onClick={() => setIsMenuOpen(false)}
            className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl font-medium transition-all ${
              isActive('/purchases') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Download className="w-5 h-5" />
            <span>My Purchases</span>
          </Link>

          <Link
            to="/dashboard"
            onClick={() => setIsMenuOpen(false)}
            className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl font-medium transition-all ${
              isActive('/dashboard') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>

          <SignedOut>
            <div className="pt-2">
              <SignInButton mode="modal">
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3 rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  Sign In
                </button>
              </SignInButton>
            </div>
          </SignedOut>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
