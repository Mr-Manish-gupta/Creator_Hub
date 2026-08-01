import React, { useState } from 'react';
import { api } from '../util/api';

const ProductPurchase = ({ productId, amount, buyerId, productName }) => {
    const [loading, setLoading] = useState(false);
    const [licenseKey, setLicenseKey] = useState("");

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        setLoading(true);

        const isScriptLoaded = await loadRazorpayScript();
        if (!isScriptLoaded) {
            alert("Razorpay SDK fail to load. Please check your internet connection.");
            setLoading(false);
            return;
        }

        try {
            // Step 1: Create Order
            const orderResponse = await fetch(api.CREATE_ORDER(), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    amount: amount,
                    buyerId: buyerId,
                    productId: productId
                })
            });

            const orderData = await orderResponse.json();
            if (!orderData.orderId) {
                throw new Error("Order ID generation failed");
            }

            // Step 2: Open Razorpay
            const options = {
                key: "rzp_test_SyhyMslzCo2vDT", 
                amount: amount * 100, 
                currency: "INR",
                name: "CreatorHub Store",
                description: `Purchase for ${productName}`,
                order_id: orderData.orderId,
                handler: async function (response) {
                    try {
                        // Step 3: Verify Payment
                        const verifyResponse = await fetch(api.PAYMENT_VERIFY(), {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                orderId: response.razorpay_order_id,
                                paymentId: response.razorpay_payment_id,
                                signature: response.razorpay_signature,
                                productId: productId,
                                buyerId: buyerId
                            })
                        });

                        const verifyData = await verifyResponse.json();

                        if (verifyData.success) {
                            alert("Payment Successful! License key issued.");
                            setLicenseKey(verifyData.licenseKey || "CH-SUCCESS-KEY");
                        } else {
                            alert("Payment verification failed!");
                        }
                    } catch (err) {
                        console.error(err);
                        alert("Verification error.");
                    }
                },
                prefill: {
                    email: buyerId
                },
                theme: {
                    color: "#4F46E5"
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error("Payment initiation error: ", error);
            alert("Payment start hone me error aayi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4 mt-2">
            <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-black text-gray-900">₹{amount}</span>
                <span className="text-gray-400 text-xs font-semibold">one-time payment</span>
            </div>
            
            <button 
                onClick={handlePayment} 
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-3.5 px-4 rounded-xl shadow-sm transition-all duration-200 disabled:bg-indigo-300 flex items-center justify-center space-x-2 text-sm cursor-pointer"
            >
                {loading ? "Processing..." : "Buy Now"}
            </button>

            {licenseKey && (
                <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl animate-in fade-in duration-300">
                    <strong className="block text-xs uppercase tracking-wider text-emerald-600 mb-1">Your License Key:</strong>
                    <code className="block bg-white border border-emerald-100 text-center font-mono font-bold py-2 rounded-lg text-emerald-950 tracking-wider select-all">{licenseKey}</code>
                </div>
            )}
        </div>
    );
};

export default ProductPurchase;