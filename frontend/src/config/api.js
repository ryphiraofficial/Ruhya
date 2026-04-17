/**
 * Central API configuration
 * Change the values here to update the backend connection site-wide
 */

// Base URL for the backend server (used for images/static files)
export const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || (import.meta.env.DEV ? 'http://localhost:5000' : 'https://ruhya-backend.onrender.com');

// API URL (used for data fetching)
export const API_URL = `${BASE_URL}/api`;

// Helper to safely format image URLs (handles both local paths and absolute Cloudinary URLs)
export const getImageUrl = (url) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `${BASE_URL}${url}`;
};

export default {
    BASE_URL,
    API_URL,
    getImageUrl
};
