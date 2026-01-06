import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Auth API functions
export const authAPI = {
    // Sign up a new user
    signup: async (fullName: string, email: string, password: string, role: 'farmer' | 'landowner' | 'admin') => {
        try {
            const response = await api.post('/auth/signup', {
                fullName,
                email,
                password,
                role,
            });

            if (response.data.success && response.data.token) {
                localStorage.setItem('authToken', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }

            return response.data;
        } catch (error: any) {
            throw error.response?.data || { success: false, message: 'Network error' };
        }
    },

    // Login user
    login: async (email: string, password: string, role: 'farmer' | 'landowner' | 'admin') => {
        try {
            const response = await api.post('/auth/login', {
                email,
                password,
                role,
            });

            if (response.data.success && response.data.token) {
                localStorage.setItem('authToken', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }

            return response.data;
        } catch (error: any) {
            throw error.response?.data || { success: false, message: 'Network error' };
        }
    },

    // Verify token
    verifyToken: async () => {
        try {
            const response = await api.get('/auth/verify');
            return response.data;
        } catch (error: any) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            throw error.response?.data || { success: false, message: 'Network error' };
        }
    },

    // Logout
    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    },

    // Get current user from localStorage
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('authToken');
    },
};

// Profile API functions
export const profileAPI = {
    // Get user profile
    getProfile: async () => {
        try {
            const response = await api.get('/profile');
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { success: false, message: 'Network error' };
        }
    },

    // Update user profile
    updateProfile: async (profileData: {
        name?: string;
        email?: string;
        phone?: string;
        location?: string;
        profilePicture?: string;
    }) => {
        try {
            const response = await api.put('/profile', profileData);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { success: false, message: 'Network error' };
        }
    },
};

// Lands API functions
export const landsAPI = {
    // Get all lands for the authenticated user
    getLands: async () => {
        try {
            const response = await api.get('/lands');
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { success: false, message: 'Network error' };
        }
    },

    // Browse all lands from all landowners (for farmers)
    browseLands: async () => {
        try {
            const response = await api.get('/lands/browse');
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { success: false, message: 'Network error' };
        }
    },

    // Add a new land
    addLand: async (landData: {
        landType: string;
        cropType: string;
        duration: number;
        location: string;
        phoneNumber: string;
        email: string;
        soilType: string;
        waterSource: string;
        acres: number;
        landImage?: string;
    }) => {
        try {
            const response = await api.post('/lands', landData);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { success: false, message: 'Network error' };
        }
    },

    // Update a land
    updateLand: async (id: string, landData: {
        landType?: string;
        cropType?: string;
        duration?: number;
        location?: string;
        phoneNumber?: string;
        email?: string;
        soilType?: string;
        waterSource?: string;
        acres?: number;
        landImage?: string;
    }) => {
        try {
            const response = await api.put(`/lands/${id}`, landData);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { success: false, message: 'Network error' };
        }
    },

    // Delete a land
    deleteLand: async (id: string) => {
        try {
            const response = await api.delete(`/lands/${id}`);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { success: false, message: 'Network error' };
        }
    },
};

// Help API functions
export const helpAPI = {
    // Submit a help request
    submitRequest: async (data: { subject: string; message: string }) => {
        try {
            const response = await api.post('/help', data);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { success: false, message: 'Network error' };
        }
    },

    // Get all help requests (Admin)
    getRequests: async () => {
        try {
            const response = await api.get('/help');
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { success: false, message: 'Network error' };
        }
    },
};

// Products API functions
export const productsAPI = {
    // Get all products
    getProducts: async () => {
        try {
            const response = await api.get('/products');
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { success: false, message: 'Network error' };
        }
    },

    // Add a new product
    addProduct: async (productData: any) => {
        try {
            const response = await api.post('/products', productData);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { success: false, message: 'Network error' };
        }
    },

    // Delete a product
    deleteProduct: async (id: string) => {
        try {
            const response = await api.delete(`/products/${id}`);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { success: false, message: 'Network error' };
        }
    },
};

// Orders API functions
export const ordersAPI = {
    // Place an order
    createOrder: async (orderData: any) => {
        try {
            const response = await api.post('/orders', orderData);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { success: false, message: 'Network error' };
        }
    },

    // Get user orders
    getOrders: async () => {
        try {
            const response = await api.get('/orders');
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { success: false, message: 'Network error' };
        }
    },

    // Get all orders (Admin)
    getAllOrders: async () => {
        try {
            const response = await api.get('/orders/all');
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { success: false, message: 'Network error' };
        }
    },

    // Update order status
    updateOrderStatus: async (id: string, updates: { status?: string, deliveryDate?: string }) => {
        try {
            const response = await api.put(`/orders/${id}/status`, updates);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { success: false, message: 'Network error' };
        }
    },
};

export default api;
