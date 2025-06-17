import { useState, useEffect } from 'react';

/**
 * Custom hook for page-level data loading
 * @param {Array} dataSources - Array of async functions that return data
 * @param {Array} dataNames - Array of names for each data source
 * @returns {Object} - { loading, error, data, refresh }
 */
export const usePageData = (dataSources, dataNames) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({});

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

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
    fetchAllData();
  }, []); // Empty dependency array means this runs once on mount

  const refresh = () => {
    fetchAllData();
  };

  return { loading, error, data, refresh };
}; 