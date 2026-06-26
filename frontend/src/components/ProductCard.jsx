import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Tag } from 'lucide-react';

const ProductCard = ({product}) =>{
  return (
    <div className="bg-white rounded-2xl border border-gray-300 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col justify-between h-full">
        <div className="h-40 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center border-b border-gray-150">
            <div className="bg-indigo-100 text-indigo-500 p-4 rounded-full">
               <Tag className="w-5 h-5" />
            </div>
        </div>


        <div className="p-5 flex-grow flex-flex col justify-between">
          <div>
            <h3 className="font-extrabold text-gray-700 text-lg line-clamp-1 mb-1">
              {product.title}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-2 mb-4">
              {product.description || "No description provided."}
            </p>
          </div>

          <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-100">
            <div>
              <span className="text-gray-600 font-semibold text-xs ">Price :</span>
              <span className="text-purple-600 font-extrabold text-3xl line-clamp-2 mb-2">{product.price} </span>
            </div>

            {/**view details link */}
            <Link 
               to={`/product/${product.id}`}
               className="bg-indigo-100 hover:bg-indigo-600 text-indigo-700 hover:text-white font-bold px-4 py-2 rounded-2xl transition-colors duration-200 flex items-center space-x-2 text-sm cursor-pointer">
                <span>Details</span>
                <ExternalLink className='w-4 h-4' />
               </Link>
          </div>
        </div>
    </div>
  )
}

export default ProductCard;