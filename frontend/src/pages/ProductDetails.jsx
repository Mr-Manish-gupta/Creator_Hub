import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Shield, CreditCard, Sparkles } from 'lucide-react';
import ProductPurchase from '../components/ProductPurchase';
import { useUser } from '@clerk/clerk-react';
import { api } from '../util/api';


const ProductDetails = () =>{
   const {id} = useParams();
   const {user} = useUser();
   const buyerEmail = user?.primaryEmailAddress?.emailAddress || "buyer_demo_email@gamil.com";


   const [product , setProduct] = useState(null);
   const [loading, setLoading] = useState(true);


   useEffect (() =>{
      const fetchProductDetails = async () =>{
        try{
          const response = await fetch(api.PRODUCT_ALL());
          if(response.ok){
            const allProducts = await response.json();

            const foundProduct = allProducts.find(p => p.id ==parseInt(id));
            setProduct(foundProduct);
          }
        }catch (error){
          console.error ("Error fetching product details : " , error)
        }finally{
          setLoading(false);
        }
      };

      fetchProductDetails();
   },[id]);

   if(loading){
        return (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-10 w-20 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="text-gray-600 font-semibold text-sm-mt-3">Loading details...</p>
          </div>
        );
   }


   if(!product){
    return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold flex text-gray-600">Product Not Foun!</h2>
            <p className="text-gray-500 mt-2 text-xl">Humare database me ye projecet available nhi hai </p>
            <Link to="/" className='text-indigo-600 font-bold hover:underline mt-4 inline-block'>
              Marketplace par wapas jayein
            </Link>
          </div>
  );
 }

 return (
    <div className="max-w-4xl mx-auto py-6 px-4 md:px-6">
      
      {/* Back button */}
      <Link to="/" className="flex items-center space-x-2 text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors mb-6 w-fit">
        <ArrowLeft className="w-4 h-4" />
        <span>Marketplace par wapas jayein</span>
      </Link>
      {/* Main Detail Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Product Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
            
            <div className="flex items-center space-x-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified Asset</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 leading-tight">
              {product.title}
            </h1>
            
            <p className="text-gray-600 leading-relaxed">
              {product.description || "No description provided."}
            </p>
            {/* Highlights */}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <h4 className="font-bold text-sm text-gray-800">What's included:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-500">
                <span className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Lifetime Access</span>
                </span>
                <span className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Free Future Updates</span>
                </span>
                <span className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Instant Source Code</span>
                </span>
                <span className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Automated License Key</span>
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Right Column: Checkout / Purchase Panel */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-sm text-gray-400 uppercase tracking-wider mb-2">Purchase License</h3>
            
            {/* Direct Buy Now component */}
            <ProductPurchase
              productId={product.id}
              amount={product.price}
              buyerId={buyerEmail} 
              productName={product.title}
            />
            {/* Security assurance info */}
            <div className="mt-6 pt-4 border-t border-gray-100 space-y-3 text-xs text-gray-400">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                <span>Verified Secure Checkout</span>
              </div>
              <div className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                <span>Processed via Razorpay</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;