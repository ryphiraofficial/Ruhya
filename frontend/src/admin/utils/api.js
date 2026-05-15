import axios from 'axios';
import { API_URL } from '../../config/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Required: sends httpOnly cookie on cross-origin requests (Safari/Mac)
});

// Request interceptor — attach Bearer token from localStorage
// This is the primary auth method for Chrome/Firefox
// Safari uses the httpOnly cookie as fallback (sent automatically via withCredentials)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('ruhiya_admin_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor — handle expired/invalid tokens
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const currentPath = window.location.pathname;
            // Only auto-redirect on admin pages (not public routes or login page)
            if (currentPath.startsWith('/admin') && currentPath !== '/admin/login') {
                localStorage.removeItem('ruhiya_admin_token');
                window.location.href = '/admin/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
