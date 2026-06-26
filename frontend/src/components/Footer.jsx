import React from 'react';
import { ShoppingBag, Code, Globe, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';


const Footer = () => {
  return(
    < footer className = "bg-white border-gray-400 border-t mt-20">
        <div className="container mx-auto px-6 py-3">
          {/*top section*/}

          <div  className="flex items-center flex-col md:flex-row justify-between border border-b border-gray-100 pb-3 mb-1">

            {/*Logo & slogan */}
            <div className="flex items-center space-x-2 text-indigo-600 font-extrabold text-sl mb-4 md:mb-0">
              <ShoppingBag className="w-6 h-6" />
              <span>Creator <span className="text-gray-800">Hub</span></span>
            </div>

            {/* Quick Link */}
  
          <div className="flex space-x-6 text-sm font-semibold text-gray-500">
            <Link to="/" className="hover:text-indigo-600 transition-colors">Marketplace</Link>
            <Link to="/purchases" className="hover:text-indigo-600 transition-colors">My Purchases</Link>
            <Link to="/dashboard" className="hover:text-indigo-600 transition-colors">Dashboard</Link>
          </div>

          </div>
           {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between text-xs text-gray-400">
          
          {/* Copyright text */}
          <p>© {new Date().getFullYear()} CreatorHub. All rights reserved.</p>
          {/* Social Links */}
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-indigo-600 transition-colors">
              <Globe className="w-4 h-4" />
            </a>
            <a href="#" className="hover:text-indigo-600 transition-colors">
              <Code className="w-4 h-4" />
            </a>
            <a href="mailto:support@creatorhub.com" className="hover:text-indigo-600 transition-colors">
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>
     
        </div>
    </footer>
  )
};

export default Footer;