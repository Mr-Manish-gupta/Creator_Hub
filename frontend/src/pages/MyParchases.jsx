import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Download, Key, Calendar, ShoppingBag } from "lucide-react";
import { api } from "../util/api";


const MyPurchases = () =>{
  const { isLoaded, isSignedIn, user } = useUser(); 
  const [purchases, setPurchases] = useState([]);
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect (() =>{
    const fetchPurchasesAndProducts = async () =>{
      if(!user) 
        return;
      try{
        const userEmail = user.primaryEmailAddress?.emailAddress;


        const licenseRes = await fetch(api.LICENSE_USER(userEmail))
        const licenseData = await licenseRes.json();

        const productRes = await fetch(api.PRODUCT_ALL());
        const productData = await productRes.json();


        setPurchases(licenseData);
        setProducts(productData);

      }catch(error ){
        console.error("Fetching error nhi hau fir se try kare. " , error);
      }finally{
        setLoading(false);
      }

    };
    fetchPurchasesAndProducts();

  },[user]);

  const getProductInfo = (productId) =>{
    const found = products.find( p => p.id === productId);
    return found ? found : {title: "Digital product" , price: " 0.00 "};
  };


  if(loading){
        return (
          <div className="text-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-400 mx-auto">
              </div>
              <p className="text-gray-700 font-bold flex items-center justify-between mt-3 text-2xl ">Loading your purchase....</p>
          </div>
        )
  }

  return(
    <div className="max-w-4xl mx-auto py-6 px2">
        <div className="flex items-center jutify-between mb-8 pb-4 border-b border-gray-200">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-600 flex items-center space-x-2">
                <ShoppingBag className="w-8 h-8" />
                <span>Purchase Items</span>
              </h1>
              <p className="text-gray-500 text-sm">Apke sabho Kharide hue products aur active license keys.</p>
            </div>
        </div>


        {/**Purchases itmees list */}
       
        {/* Purchased Items List */}
      {purchases.length > 0 ? (
        <div className="space-y-6">
          {purchases.map((item) => {
            const productInfo = getProductInfo(item.productId);
            
            return (
              <div key={item.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
                
                {/* Product Info */}
                <div className="space-y-2 flex-grow">
                  <h3 className="font-extrabold text-lg text-gray-900">{productInfo.title}</h3>
                  
                  {/* Meta details */}
                  <div className="flex flex-wrap gap-4 text-xs font-semibold text-gray-400">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Issued: {new Date(item.createdAt).toLocaleDateString()}</span>
                    </span>
                    <span className="text-indigo-600">Price Paid: ₹{productInfo.price}</span>
                  </div>
                  {/* License Key Section */}
                  <div className="mt-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 flex items-center justify-between w-fit max-w-full">
                    <div className="flex items-center space-x-2 text-sm text-gray-700 font-medium">
                      <Key className="w-4 h-4 text-indigo-500" />
                      <span>License Key:</span>
                      <code className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold tracking-wider">{item.licenseKey}</code>
                    </div>
                    <span className="ml-4 bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Active
                    </span>
                  </div>
                </div>
                {/* Download Button */}
                               {/* Download Button */}
                <div className="flex md:flex-col gap-3 w-full md:w-auto">
                  <a
                    href={`http://localhost:8085/api/v1.0/products/download/${item.productId}?buyerId=${user.primaryEmailAddress?.emailAddress}`}
                    download
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-3 rounded-xl shadow-sm transition-colors flex items-center justify-center space-x-2 text-sm w-full md:w-40"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download File</span>
                  </a>
                </div>
                
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-500 font-medium text-lg">Aapne abhi tak koi product nahi kharida hai.</p>
        </div>
      )}

    </div>
  )
}



export default MyPurchases;