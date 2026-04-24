/**
 * Central API configuration
 * Handles:
 * - Base URL resolution
 * - API endpoint URL
 * - Safe image URL generation (prevents broken images)
 */

// 🔹 Base URL for backend (images/static)
export const BASE_URL =
  import.meta.env.VITE_API_URL?.replace('/api', '') ||
  (import.meta.env.DEV
    ? 'http://localhost:5000'
    : 'https://ruhya-backend.onrender.com');

// 🔹 API URL (for axios calls)
export const API_URL = `${BASE_URL}/api`;

/**
 * 🔥 Bulletproof image URL handler
 * Prevents:
 * - "undefined", "null", ""
 * - broken URLs
 * - malformed paths
 */
export const getImageUrl = (url) => {
  try {
    // ❌ Reject falsy values
    if (!url) return null;

    // 🔹 Normalize input
    const cleaned = String(url).trim();

    // ❌ Reject garbage values from backend
    if (
      cleaned === '' ||
      cleaned.toLowerCase() === 'undefined' ||
      cleaned.toLowerCase() === 'null'
    ) {
      return null;
    }

    // ✅ If already absolute (Cloudinary, S3, etc.)
    if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
      return cleaned;
    }

    // 🔹 Ensure proper path format
    let normalized = cleaned;

    // Add leading slash if missing
    if (!normalized.startsWith('/')) {
      normalized = `/${normalized}`;
    }

    // Remove duplicate slashes (just in case)
    normalized = normalized.replace(/\/+/g, '/');

    // ✅ Final safe URL
    return `${BASE_URL}${normalized}`;
  } catch (err) {
    console.error('getImageUrl error:', err);
    return null;
  }
};

export default {
  BASE_URL,
  API_URL,
  getImageUrl
};