import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Search, Compass, ArrowRight } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dynamic Products State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from Spring Boot API on page load
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || "https://creator-hub-gkhl.onrender.com"}/api/v1.0/products/all`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          console.error("Failed to load products from database");
        }
      } catch (error) {
        console.error("Error connecting to backend API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Search filter logic
  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6">
      
      {/* Discover Banner */}
      <div className="text-center py-12 px-4 bg-white rounded-3xl border border-gray-150 shadow-sm mb-12">
        <span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider inline-flex items-center space-x-1 mb-4">
          <Compass className="w-4 h-4" />
          <span>Discover Digital Resources</span>
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight max-w-2xl mx-auto leading-tight">
          Find the Best Digital Products by Top Creators
        </h1>
        <p className="mt-4 text-gray-500 text-lg max-w-lg mx-auto">
          Apne projects ko fast banayein pre-built templates, softwares, aur secure scripts ke sath.
        </p>

        {/* Search Bar */}
        <div className="mt-8 max-w-md mx-auto relative">
          <input
            type="text"
            placeholder="Search templates, scripts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow bg-gray-50 hover:bg-white focus:bg-white"
          />
          <Search className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
        </div>
      </div>

      {/* Creator Dashboard Promotion */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-md flex flex-col md:flex-row items-center justify-between mb-12">
        <div className="mb-4 md:mb-0">
          <h2 className="text-2xl font-black">Kya aap ek Creator hain?</h2>
          <p className="text-indigo-100 text-sm mt-1">Apne products yahan list karein aur automatic revenue earn karein.</p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-white text-indigo-600 font-extrabold px-6 py-3 rounded-xl shadow-md hover:bg-gray-100 transition-all flex items-center space-x-2 text-sm whitespace-nowrap cursor-pointer"
        >
          <span>Open Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Products Grid Title */}
      <div className="mb-6 flex items-center justify-between px-2">
        <h2 className="text-2xl font-extrabold text-gray-900">Featured Products</h2>
        {loading ? (
          <span className="text-sm text-gray-400">Loading products...</span>
        ) : (
          <span className="text-sm text-gray-500 font-semibold">{filteredProducts.length} items found</span>
        )}
      </div>

      {/* Loading Spin or Grid Display */}
      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-gray-500 mt-3 text-sm font-semibold">Connecting to database...</p>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-500 font-medium text-lg">Koi products nahi mile. Try another keyword!</p>
        </div>
      )}

    </div>
  );
};

export default Home;