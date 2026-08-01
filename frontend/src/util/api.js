const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://creator-hub-gkhl.onrender.com";
export const api = {
    
    PRODUCT_ALL: () => `${BASE_URL}/products/all`,
    LICENSE_USER: (userEmail) => `${BASE_URL}/licenses/users/${userEmail}`,
    CREATE_ORDER: () => `${BASE_URL}/payments/create-order`,
    PAYMENT_VERIFY: () => `${BASE_URL}/payments/verify`,
    USER_SYNC: () => `${BASE_URL}/users/sync`,
};


