import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, LayoutDashboard, Download, Library } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

const Navbar = () => {

  const location = useLocation();
   const isActive = (path) => location.pathname === path;

   return(

    <nav className="bg-white border-b border-gray-300 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-7 h-16 flex items-center justify-between">
         
         {/*Brond ka logo */}
         <Link to="/" className="flex items-center space-x-2 text-indigo-600 font-extrabold text-2xl tracking-wide">
            <ShoppingBag className="w-8 h-8" />
            <span> Creator <span className="text-gray-800">Hub</span> </span>
         </Link>


         {/*Navigation items (links) */}
         <div className="flex items-center space-x-6">
               <Link
            to="/"
            className={`flex items-center space-x-1.5 font-medium transition-colors duration-200 ${
              isActive('/') ? 'text-indigo-600 font-semibold' : 'text-gray-600 hover:text-indigo-600'
            }`}
          >
            <Library className="w-5 h-5" />
            <span>Marketplace</span>
          </Link>

           {/* My Purchases Link (Mapped with correct path '/purchases') */}
          <Link
            to="/purchases"
            className={`flex items-center space-x-1.5 font-medium transition-colors duration-200 ${
              isActive('/purchases') ? 'text-indigo-600 font-semibold' : 'text-gray-600 hover:text-indigo-600'
            }`}
          >
            <Download className="w-5 h-5" />
            <span>My Purchases</span>
          </Link>

          {/* Dashboard Link */}
                   {/* Dashboard Link */}
          <Link
            to="/dashboard"
            className={`flex items-center space-x-1.5 font-medium transition-colors duration-200 ${
              isActive('/dashboard') ? 'text-indigo-600 font-semibold' : 'text-gray-600 hover:text-indigo-600'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link> {/* ✅ Link yahan band hona chahiye */}

          {/* 🔐 CLERK AUTH BUTTONS AREA (Link ke bahar) */}
          <div className="border-l border-gray-250 pl-4 h-6 flex items-center ml-2">
            
            {/* Jab User Logout ho */}
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>

            {/* Jab User Login ho */}
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>

          </div>
         </div>
      </div>
    </nav>
   )
  
};

export default Navbar;
