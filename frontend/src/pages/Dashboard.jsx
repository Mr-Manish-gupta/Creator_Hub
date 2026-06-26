import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Upload, DollarSign, Lock, CheckCircle, HeartHandshake, Package ,EditIcon } from 'lucide-react';


const Dashboard = () => {
  const { user } = useUser();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const [myProducts, setMyProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

   // Edit Modal States (aligned with 'Modal' spelling)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // 1. Open Edit Modal with pre-filled details
  const openEditModal = (product) => {
    setEditingProduct(product);
    setEditTitle(product.title);
    setEditPrice(product.price);
    setEditDescription(product.description || '');
    setIsEditModalOpen(true);
  };

  // 2. Submit updates to backend
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editTitle || !editPrice) {
      alert("Please fill all mandatory fields!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8085/api/v1.0/products/${editingProduct.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: editTitle,
          price: parseFloat(editPrice),
          description: editDescription
        })
      });

      if (response.ok) {
        const updatedProduct = await response.json(); // 👈 Fixed: lowercase .json()
        
        // Update product in local state instantly without page reload
        setMyProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
        
        setIsEditModalOpen(false);
        setEditingProduct(null);
        alert("Product updated successfully!");
      } else {
        const err = await response.text();
        alert("Update failed: " + err);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Network error. Please try again.");
    }
  };

  const stats = {
    totalEarning: 150042.00,
    totalSales: 55,
    activeProducts: myProducts.length
  };

  // Fetch creator's products on load
  useEffect(() => {
    const fetchMyProducts = async () => {
      if (!user) return;
      try {
        const response = await fetch(`http://localhost:8085/api/v1.0/products/creator/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setMyProducts(data);
        }
      } catch (error) {
        console.error("Error fetching creator products:", error);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchMyProducts();
  }, [user]);

  const handleFileUpload = async (e) => {
    e.preventDefault();
    
    if (!title || !price || !file) {
      alert("Please fill all mandatory fields!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", parseFloat(price));
      formData.append("creatorId", user.id); // Clerk User ID mapping
      formData.append("file", file); // File binary upload

      const response = await fetch("http://localhost:8085/api/v1.0/products/upload", {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        const savedProduct = await response.json();
        setUploadMessage(`Product "${savedProduct.title}" successfully uploaded and saved!`);
        
        // Add new product directly to state list to update UI instantly
        setMyProducts(prev => [savedProduct, ...prev]);

        setTitle('');
        setPrice('');
        setDescription('');
        setFile(null);
      } else {
        const errorText = await response.text();
        alert("Upload failed: " + errorText);
      }

    } catch (error) {
      console.error("Upload error:", error);
      alert("Product upload failed due to network connection issues.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      
      {/* Top Title Section */}
      <div className="mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-extrabold text-gray-900">Creator Dashboard</h1>
        <p className="text-gray-500">Apne uploads aur sales report yahan manage karein.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Total Earnings</p>
            <h3 className="text-3xl font-black text-indigo-600 mt-1">₹{stats.totalEarning}</h3>
          </div>
          <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600">
            <DollarSign className="w-8 h-8" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Total Sales</p>
            <h3 className="text-3xl font-black text-purple-600 mt-1">{stats.totalSales} units</h3>
          </div>
          <div className="bg-purple-50 p-4 rounded-2xl text-purple-600">
            <CheckCircle className="w-8 h-8" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Active Products</p>
            <h3 className="text-3xl font-black text-emerald-600 mt-1">{stats.activeProducts} items</h3>
          </div>
          <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600">
            <Upload className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Upload Section and Guidelines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Upload Form */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center space-x-2">
            <Upload className="w-5 h-5 text-indigo-600" />
            <span>Upload New Digital Product</span>
          </h2>

          {uploadMessage && (
            <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>{uploadMessage}</span>
            </div>
          )}

          <form onSubmit={handleFileUpload} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Product Title *</label>
              <input
                type="text"
                placeholder="Example: E-Commerce REST API Template"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Price (INR) *</label>
                <input
                  type="number"
                  placeholder="e.g. 499"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Product File (.zip, .pdf) *</label>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="w-full px-2 py-2.5 rounded-xl border border-gray-200 text-gray-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
              <textarea
                rows="4"
                placeholder="Product ke features aur details ke baare me batayein..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-all duration-200 cursor-pointer"
            >
              Publish Product
            </button>
          </form>
        </div>

        {/* Guidelines */}
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center space-x-2">
              <HeartHandshake className="w-5 h-5 text-purple-600" />
              <span>Creator Guidelines</span>
            </h3>
            <ul className="space-y-4 text-sm text-gray-600">
              <li className="flex items-start space-x-2">
                <span className="text-emerald-500 font-bold">✔</span>
                <span>Apna main resource zip folder me compress karke upload karein.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-500 font-bold">✔</span>
                <span>Price minimum ₹99 aur maximum ₹9999 rakh sakte hain.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-500 font-bold">✔</span>
                <span>Description me setup instructions zaroor likhein.</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 p-4 bg-indigo-50 rounded-xl border border-indigo-100 text-center">
            <Lock className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
            <p className="text-xs text-indigo-900 font-medium">
              Aapki file transfers secure local server par save hoti hain.
            </p>
          </div>
        </div>
      </div>

      {/* 🟢 Published Products List Table */}
      <div className="mt-12 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center space-x-2">
          <Package className="w-5 h-5 text-indigo-600" />
          <span>My Published Products</span>
        </h2>

        {loadingProducts ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading your products...</p>
          </div>
        ) : myProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 font-semibold uppercase text-xs">
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Date Published</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Edit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {myProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-gray-800">{prod.title}</td>
                    <td className="py-3.5 px-4 text-indigo-600 font-extrabold">₹{prod.price}</td>
                    <td className="py-3.5 px-4 text-gray-500">
                      {prod.uploadedAt ? new Date(prod.uploadedAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3.5 px-4">
                  
                      <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase">
                        Live
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                       <button
                        onClick={() => openEditModal(prod)}
                        className='text-gray-400 hover:text-indigo-700 cursor-pointer'>
                      {prod.Edit}
                      <EditIcon className='w-4 h-4 cursor-pointer'/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-gray-500">Aapne abhi tak koi product publish nahi kiya hai.</p>
          </div>
        )}
      </div>


          {/**Edit product model overlay */}
              
      {isEditModalOpen  && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            
            <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center space-x-2">
              <Package className="w-6 h-6 text-indigo-600" />
              <span>Edit Product Details</span>
            </h3>

            <form onSubmit={handleUpdateProduct} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Price (INR) *</label>
                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  rows="4"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                ></textarea>
              </div>

              <div className="flex space-x-4 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition-all duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-md transition-all duration-200 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;