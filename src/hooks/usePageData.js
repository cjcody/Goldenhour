import { useState, useEffect } from 'react';
import { getCachedData, setCachedData } from '../utils/simpleCache';

/**
 * Custom hook for page-level data loading with simple caching
 * @param {Array} dataSources - Array of async functions that return data
 * @param {Array} dataNames - Array of names for each data source
 * @returns {Object} - { loading, error, data, refresh }
 */
export const usePageData = (dataSources, dataNames) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({});

  const fetchAllData = async (useCache = true) => {
    try {
      setLoading(true);
      setError(null);

      // Create a cache key based on data sources
      const cacheKey = dataNames.join('_');

      // Check cache first if enabled
      if (useCache) {
        const cachedData = getCachedData(cacheKey);
        if (cachedData) {
          console.log('Using cached data for:', cacheKey);
          setData(cachedData);
          setLoading(false);
          return;
        }
      }

      console.log('Fetching fresh data for:', cacheKey);

      // Fetch all data sources in parallel
      const results = await Promise.all(
        dataSources.map(async (source, index) => {
          try {
            const result = await source();
            return { name: dataNames[index], data: result, success: true };
          } catch (err) {
            console.error(`Error fetching ${dataNames[index]}:`, err);
            return { name: dataNames[index], error: err.message, success: false };
          }
        })
      );

      // Organize results into data object
      const dataObject = {};
      const errors = [];

      results.forEach(result => {
        if (result.success) {
          dataObject[result.name] = result.data;
        } else {
          errors.push(`${result.name}: ${result.error}`);
        }
      });

      setData(dataObject);

      // Cache the successful data
      if (Object.keys(dataObject).length > 0) {
        setCachedData(cacheKey, dataObject);
      }

      // Set error if any data sources failed
      if (errors.length > 0) {
        setError(`Some data failed to load: ${errors.join(', ')}`);
      }
    } catch (err) {
      console.error('Error in usePageData:', err);
      setError('Failed to load page data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData(true); // Use cache by default
  }, []); // Empty dependency array means this runs once on mount

  const refresh = () => {
    fetchAllData(false); // Skip cache on refresh
  };

  return { loading, error, data, refresh };
}; 