import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { SignInButton } from '@clerk/clerk-react';

const GuestNavbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center space-x-2 text-indigo-600 font-extrabold text-xl md:text-2xl tracking-wide">
          <ShoppingBag className="w-6 h-6 md:w-8 md:h-8" />
          <span>Creator<span className="text-gray-800">Hub</span></span>
        </div>

        {/* Login Button */}
        <SignInButton mode="modal">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer">
            Sign In
          </button>
        </SignInButton>

      </div>
    </nav>
  );
};

export default GuestNavbar;
