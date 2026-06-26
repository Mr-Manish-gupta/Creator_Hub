import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // Removed Router from imports
import { useUser } from '@clerk/clerk-react';

// Logged-in Components & Pages
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Dashboard from './pages/Dashboard';
import MyParchases from './pages/MyParchases';

// Guest Components
import GuestNavbar from './guest/GuestNavbar';
import GuestLanding from './guest/GuestLanding';

function App() {
  const { isSignedIn, user } = useUser();

  // User database sync hook (Login hote hi back-end database me automatic register)
  useEffect(() => {
    if (isSignedIn && user) {
      const syncUser = async () => {
        try {
          await fetch("http://localhost:8085/api/v1.0/users/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              clerkId: user.id,
              email: user.primaryEmailAddress?.emailAddress,
              name: user.fullName || user.username || "CreatorUser"
            })
          });
        } catch (error) {
          console.error("Database User Sync Error:", error);
        }
      };
      syncUser();
    }
  }, [isSignedIn, user]);

  // 🔴 1. BINA LOGIN WALA LAYOUT (Guest Section)
  if (!isSignedIn) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 text-sm text-gray-800">
        <GuestNavbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          {/* Guest ko sirf ye landing page dikhega */}
          <GuestLanding />
        </main>
        <Footer />
      </div>
    );
  }

  // 🟢 2. LOGIN WALA LAYOUT (Creator/Buyer Section - Router removed)
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-sm text-gray-800">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/purchases" element={<MyParchases />} />
          {/* Redirect any other path to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
