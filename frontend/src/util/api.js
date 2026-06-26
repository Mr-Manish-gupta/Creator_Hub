const BASE_URL = "http://localhost:8085/api/v1.0";
export const api = {
    
    PRODUCT_ALL: () => `${BASE_URL}/products/all`,
    LICENSE_USER: (userEmail) => `${BASE_URL}/licenses/users/${userEmail}`,
    CREATE_ORDER: () => `${BASE_URL}/payments/create-order`,
    PAYMENT_VERIFY: () => `${BASE_URL}/payments/verify`,

};



{/*}
export const apiEndpoint = {
    FETCH_FILES: `${BASE_URL}/files/my`,
    GET_CREDITS: `${BASE_URL}/users/credits`,
    TOGGLE_FILE: (id) => `${BASE_URL}/files/${id}/toggle-public`,
    DOWNLOAD_FILE: (id) => `${BASE_URL}/files/download/${id}`,
    DELETE_FILE: (id) => `${BASE_URL}/files/${id}`,
    VIEW_FILE: (id) => `${BASE_URL}/files/view/${id}`,
    UPLOAD_FILES: `${BASE_URL}/files/upload`,
    CREATE_ORDER: `${BASE_URL}/payments/create-order`,
    VERIFY_PAYMENT: `${BASE_URL}/payments/verify-payment`,
    TRANSACTIONS_HISTORY:` ${BASE_URL}/payments/transactions`
}  */}