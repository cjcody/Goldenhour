/**
 * Simple cache utility for session-based data caching
 * Uses sessionStorage to cache data for 5 minutes
 */

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Get cached data for a given key
 * @param {string} key - Cache key
 * @returns {any|null} - Cached data or null if not found/expired
 */
export const getCachedData = (key) => {
  try {
    const cached = sessionStorage.getItem(`cache_${key}`);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    const now = Date.now();

    // Check if cache is expired
    if (now - timestamp > CACHE_DURATION) {
      sessionStorage.removeItem(`cache_${key}`);
      return null;
    }

    return data;
  } catch (error) {
    console.warn('Error reading from cache:', error);
    return null;
  }
};

/**
 * Set cached data for a given key
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 */
export const setCachedData = (key, data) => {
  try {
    const cacheEntry = {
      data,
      timestamp: Date.now()
    };
    sessionStorage.setItem(`cache_${key}`, JSON.stringify(cacheEntry));
  } catch (error) {
    console.warn('Error writing to cache:', error);
  }
};

/**
 * Clear cached data for a given key
 * @param {string} key - Cache key
 */
export const clearCachedData = (key) => {
  try {
    sessionStorage.removeItem(`cache_${key}`);
  } catch (error) {
    console.warn('Error clearing cache:', error);
  }
};

/**
 * Clear all cached data
 */
export const clearAllCache = () => {
  try {
    const keys = Object.keys(sessionStorage);
    keys.forEach(key => {
      if (key.startsWith('cache_')) {
        sessionStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.warn('Error clearing all cache:', error);
  }
}; 