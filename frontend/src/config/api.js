/**
 * Central API configuration
 * Change the values here to update the backend connection site-wide
 */

// Base URL for the backend server (used for images/static files)
export const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

// API URL (used for data fetching)
export const API_URL = `${BASE_URL}/api`;

export default {
    BASE_URL,
    API_URL
};
