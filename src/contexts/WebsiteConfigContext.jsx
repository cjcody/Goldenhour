import React, { createContext, useContext, useState, useEffect } from 'react';
import { getWebsiteConfig, updatePageTitle, setupFavicon, updateSEOMetaTags, setupStructuredData } from '../services/websiteConfigService.js';

// Create context
const WebsiteConfigContext = createContext();

// Custom hook to use the context
export const useWebsiteConfig = () => {
  const context = useContext(WebsiteConfigContext);
  if (!context) {
    throw new Error('useWebsiteConfig must be used within a WebsiteConfigProvider');
  }
  return context;
};

// Cache for website configuration
let configCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Provider component
export const WebsiteConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch website configuration on component mount
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        
        // Check cache first
        const now = Date.now();
        if (configCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
          console.log('Using cached website configuration');
          setConfig(configCache);
          
          // Update page title and favicon from cache
          if (configCache.metadata) {
            updatePageTitle(configCache.metadata.browserPageTitle);
            setupFavicon(configCache.metadata.faviconImage);
          }
          
          setLoading(false);
          return;
        }

        console.log('Fetching fresh website configuration');
        const websiteConfig = await getWebsiteConfig();
        
        // Cache the result
        configCache = websiteConfig;
        cacheTimestamp = now;
        
        setConfig(websiteConfig);
        
        // Update page title and favicon
        if (websiteConfig.metadata) {
          updatePageTitle(websiteConfig.metadata.browserPageTitle);
          setupFavicon(websiteConfig.metadata.faviconImage);
        }
        
        // Update SEO meta tags and structured data
        updateSEOMetaTags(websiteConfig);
        setupStructuredData(websiteConfig);
        
        setError(null);
      } catch (err) {
        console.error('Error loading website configuration:', err);
        setError(err.message);
        
        // Use cached config if available, even if expired
        if (configCache) {
          console.log('Using expired cache due to error');
          setConfig(configCache);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  // Refresh configuration (useful for development)
  const refreshConfig = async () => {
    try {
      setLoading(true);
      
      // Clear cache
      configCache = null;
      cacheTimestamp = null;
      
      const websiteConfig = await getWebsiteConfig();
      
      // Cache the result
      configCache = websiteConfig;
      cacheTimestamp = Date.now();
      
      setConfig(websiteConfig);
      
      // Update page title and favicon
      if (websiteConfig.metadata) {
        updatePageTitle(websiteConfig.metadata.browserPageTitle);
        setupFavicon(websiteConfig.metadata.faviconImage);
      }
      
      // Update SEO meta tags and structured data
      updateSEOMetaTags(websiteConfig);
      setupStructuredData(websiteConfig);
      
      setError(null);
    } catch (err) {
      console.error('Error refreshing website configuration:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    config,
    loading,
    error,
    refreshConfig
  };

  return (
    <WebsiteConfigContext.Provider value={value}>
      {children}
    </WebsiteConfigContext.Provider>
  );
}; 