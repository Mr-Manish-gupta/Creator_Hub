import React from 'react';
import { useClerk } from '@clerk/clerk-react';
import { Upload, ShieldCheck, DollarSign, ArrowRight } from 'lucide-react';

const GuestLanding = () => {
  const { openSignIn } = useClerk();

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      
      {/* Hero Header Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between mb-12">
        <div className="mb-6 md:mb-0 md:max-w-xl">
          <span className="bg-indigo-500 bg-opacity-25 text-indigo-100 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Explore CreatorHub
          </span>
          <h1 className="text-4xl md:text-5xl font-black mt-4 tracking-tight leading-tight">
            Apne Digital Products Bechein Aur Earn Karin!
          </h1>
          <p className="mt-4 text-indigo-100 text-lg">
            CreatorHub ek digital marketplace aur licensing platform hai jahan creators apne codes, scripts aur templates secure bechte hain aur buyers automatic license keys pate hain.
          </p>
        </div>
        <div>
          <button
            onClick={() => openSignIn()}
            className="bg-white hover:bg-gray-100 text-indigo-600 font-extrabold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center space-x-2 text-lg whitespace-nowrap cursor-pointer"
          >
            <span>Get Started Now</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Website Info Details Grid */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-gray-900">Humare Features Aur Services</h2>
        <p className="text-gray-500 mt-2">Apne software ya digital assets ko monetize karne ka sabse aasan tarika.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm text-center">
          <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full w-fit mx-auto mb-4">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-lg mb-2">Easy File Upload</h3>
          <p className="text-gray-500 text-sm">Apne files secure zip me upload karein aur price define karein.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm text-center">
          <div className="bg-purple-100 text-purple-600 p-3 rounded-full w-fit mx-auto mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-lg mb-2">Automated Licensing</h3>
          <p className="text-gray-500 text-sm">Payment hote hi user ke liye license key banegi aur use email mil jayega.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm text-center">
          <div className="bg-emerald-100 text-emerald-600 p-3 rounded-full w-fit mx-auto mb-4">
            <DollarSign className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-lg mb-2">Secure Payments</h3>
          <p className="text-gray-500 text-sm">Razorpay payment verification lagaya gaya hai fraud aur spam rokne ke liye.</p>
        </div>
      </div>

    </div>
  );
};

export default GuestLanding;
