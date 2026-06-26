const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8085/api/v1.0";
export const api = {
    
    PRODUCT_ALL: () => `${BASE_URL}/products/all`,
    LICENSE_USER: (userEmail) => `${BASE_URL}/licenses/users/${userEmail}`,
    CREATE_ORDER: () => `${BASE_URL}/payments/create-order`,
    PAYMENT_VERIFY: () => `${BASE_URL}/payments/verify`,

};


