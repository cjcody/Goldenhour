// Website Configuration Service
// Handles fetching and processing website configuration from Google Sheets

import { fetchSheetData } from './googleSheets.js';
import { getColumnMapping } from './sheetConfig.js';

/**
 * Fetches website configuration data from Google Sheets
 * @returns {Promise<Object>} - Website configuration object
 */
export const getWebsiteConfig = async () => {
  try {
    const { getSheetUrl } = await import('./sheetConfig.js');
    const url = getSheetUrl('WEBSITE');
    
    if (!url) {
      throw new Error('No URL configured for WEBSITE sheet');
    }

    console.log('Fetching website config from:', url); // Debug log

    // Fetch raw CSV data
    const csvData = await fetchSheetData(url);
    console.log('Raw CSV data:', csvData.substring(0, 200) + '...'); // Debug log
    
    // Parse using dedicated website config parser
    const rawData = parseWebsiteConfigCSV(csvData);
    console.log('Parsed raw data:', rawData); // Debug log
    
    if (!rawData || Object.keys(rawData).length === 0) {
      console.log('No website configuration found in Google Sheets');
      return getDefaultConfig();
    }

    // Transform raw data into organized configuration object
    return transformWebsiteConfig(rawData);
  } catch (error) {
    console.error('Error fetching website configuration:', error);
    // Return default configuration on error
    return getDefaultConfig();
  }
};

/**
 * Parses CSV data specifically for website configuration
 * @param {string} csvData - Raw CSV data
 * @returns {Object} - Parsed configuration object
 */
const parseWebsiteConfigCSV = (csvData) => {
  try {
    // Split CSV into lines and remove empty lines
    const lines = csvData.trim().split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      return {};
    }

    console.log('CSV lines:', lines); // Debug log

    // Parse each line manually for column-based structure
    const config = {};
    
    lines.forEach((line, index) => {
      // Split by comma, but handle quoted values
      const values = parseCSVLine(line);
      console.log(`Line ${index}:`, values); // Debug log
      
      if (values.length >= 2) {
        const header = values[0]?.trim();
        const value = values[1]?.trim();
        
        if (header && value !== undefined) {
          config[header] = value;
        }
      }
    });

    console.log('Final config object:', config); // Debug log
    return config;
  } catch (error) {
    console.error('Error parsing website config CSV:', error);
    return {};
  }
};

/**
 * Parses a single CSV line, properly handling quoted fields with commas
 * @param {string} line - CSV line to parse
 * @returns {Array} - Array of field values
 */
const parseCSVLine = (line) => {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add the last field
  result.push(current.trim());
  
  return result;
};

/**
 * Transforms raw sheet data into organized website configuration
 * @param {Object} rawData - Raw data from Google Sheets (already parsed as object)
 * @returns {Object} - Organized website configuration
 */
const transformWebsiteConfig = (rawData) => {
  // rawData is already an object with headers as keys and values as values
  console.log('Raw config from Google Sheets:', rawData); // Debug log

  // Organize into logical sections
  return {
    navigation: {
      logoImage: rawData['Nav Logo Image'] || '',
      companyName: rawData['Nav Company Name'] || 'Artisanal Baking',
      home: rawData['Nav Home'] || 'Home',
      about: rawData['Nav About'] || 'About',
      menu: rawData['Nav Menu'] || 'Menu',
      contact: rawData['Nav Contact'] || 'Contact',
      customOrder: rawData['Nav Custom Order'] || 'Custom Order'
    },
    
    footer: {
      companyName: rawData['Footer Company Name'] || 'Artisanal Baking',
      companyDescription: rawData['Footer Company Description'] || 'Crafting delicious memories one bake at a time.',
      copyrightText: rawData['Footer Copyright Text'] || '',
      home: rawData['Footer Home'] || 'Home',
      aboutUs: rawData['Footer About Us'] || 'About Us',
      ourMenu: rawData['Footer Our Menu'] || 'Our Menu',
      contactUs: rawData['Footer Contact Us'] || 'Contact Us',
      customOrder: rawData['Footer Custom Order'] || 'Custom Order'
    },
    
    socialMedia: {
      x: rawData['X url'] || '',
      facebook: rawData['Facebook url'] || '',
      pinterest: rawData['Pinterest url'] || '',
      instagram: rawData['Instagram url'] || '',
      youtube: rawData['Youtube url'] || '',
      linkedin: rawData['Linkedin url'] || '',
      tiktok: rawData['Tiktok url'] || ''
    },
    
    services: [
      rawData['Services Line1'] || '',
      rawData['Services Line2'] || '',
      rawData['Services Line3'] || '',
      rawData['Services Line4'] || '',
      rawData['Services Line5'] || ''
    ].filter(service => service.trim() !== ''), // Remove empty services
    
    metadata: {
      faviconImage: rawData['Favicon Image'] || '',
      browserPageTitle: rawData['Browser Page Title'] || ''
    }
  };
};

/**
 * Returns default configuration when Google Sheets is unavailable
 * @returns {Object} - Default website configuration
 */
const getDefaultConfig = () => {
  return {
    navigation: {
      logoImage: '',
      companyName: 'Artisanal Baking',
      home: 'Home',
      about: 'About',
      menu: 'Menu',
      contact: 'Contact',
      customOrder: 'Custom Order'
    },
    
    footer: {
      companyName: 'Artisanal Baking',
      companyDescription: 'Crafting delicious memories one bake at a time.',
      copyrightText: '© 2024 Artisanal Baking. All rights reserved.',
      home: 'Home',
      aboutUs: 'About Us',
      ourMenu: 'Our Menu',
      contactUs: 'Contact Us',
      customOrder: 'Custom Order'
    },
    
    socialMedia: {
      x: '',
      facebook: '',
      pinterest: '',
      instagram: '',
      youtube: '',
      linkedin: '',
      tiktok: ''
    },
    
    services: [
      'Wedding Cakes',
      'Birthday Cakes',
      'Artisan Breads',
      'Pastries',
      'Bulk Orders'
    ],
    
    metadata: {
      faviconImage: '',
      browserPageTitle: 'Artisanal Baking'
    }
  };
};

/**
 * Updates the browser page title
 * @param {string} title - Page title to set
 */
export const updatePageTitle = (title) => {
  if (title && title.trim() !== '') {
    document.title = title.trim();
  }
  // If no title provided, don't set anything - let client's HTML handle it
};

/**
 * Sets up favicon
 * @param {string} faviconUrl - URL of the favicon
 */
export const setupFavicon = (faviconUrl) => {
  if (faviconUrl && faviconUrl.trim() !== '') {
    // Remove existing favicon links
    const existingLinks = document.querySelectorAll('link[rel*="icon"]');
    existingLinks.forEach(link => link.remove());
    
    // Add new favicon
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = faviconUrl.trim();
    link.type = 'image/x-icon';
    document.head.appendChild(link);
  }
};

/**
 * Updates all SEO meta tags dynamically based on website configuration
 * @param {Object} config - Website configuration object
 */
export const updateSEOMetaTags = (config) => {
  if (!config) return;

  const companyName = config.navigation?.companyName || config.footer?.companyName || 'Your Business';
  const companyDescription = config.footer?.companyDescription || 'Professional business website - Discover our services, products, and commitment to quality. Contact us today for personalized solutions.';
  const pageTitle = config.metadata?.browserPageTitle || `${companyName} - Professional Services`;
  const currentUrl = window.location.href;
  const ogImage = config.metadata?.faviconImage || '/og-image.jpg';

  // Update meta description
  updateMetaTag('description', companyDescription);
  
  // Update Open Graph tags
  updateMetaTag('og:title', pageTitle, 'property');
  updateMetaTag('og:description', companyDescription, 'property');
  updateMetaTag('og:image', ogImage, 'property');
  updateMetaTag('og:url', currentUrl, 'property');
  updateMetaTag('og:site_name', companyName, 'property');
  
  // Update Twitter Card tags
  updateMetaTag('twitter:title', pageTitle, 'name');
  updateMetaTag('twitter:description', companyDescription, 'name');
  updateMetaTag('twitter:image', ogImage, 'name');
  
  // Update canonical URL
  updateCanonicalUrl(currentUrl);
  
  // Update author
  updateMetaTag('author', companyName);
};

/**
 * Updates a specific meta tag
 * @param {string} name - Meta tag name or property
 * @param {string} content - Meta tag content
 * @param {string} attribute - Attribute type ('name' or 'property')
 */
const updateMetaTag = (name, content, attribute = 'name') => {
  if (!content || content.trim() === '') return;
  
  let metaTag = document.querySelector(`meta[${attribute}="${name}"]`);
  
  if (!metaTag) {
    metaTag = document.createElement('meta');
    metaTag.setAttribute(attribute, name);
    document.head.appendChild(metaTag);
  }
  
  metaTag.setAttribute('content', content.trim());
};

/**
 * Updates the canonical URL
 * @param {string} url - Canonical URL
 */
const updateCanonicalUrl = (url) => {
  if (!url || url.trim() === '') return;
  
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.rel = 'canonical';
    document.head.appendChild(canonicalLink);
  }
  
  canonicalLink.href = url.trim();
};

/**
 * Sets up structured data for local business (JSON-LD)
 * @param {Object} config - Website configuration object
 */
export const setupStructuredData = (config) => {
  if (!config) return;

  const companyName = config.navigation?.companyName || config.footer?.companyName || 'Your Business';
  const companyDescription = config.footer?.companyDescription || 'Professional business services';
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": companyName,
    "description": companyDescription,
    "url": window.location.origin,
    "sameAs": [
      config.socialMedia?.facebook,
      config.socialMedia?.instagram,
      config.socialMedia?.x,
      config.socialMedia?.linkedin
    ].filter(url => url && url.trim() !== ''),
    "potentialAction": {
      "@type": "ContactPage",
      "target": `${window.location.origin}/contact`
    }
  };

  // Remove existing structured data
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }

  // Add new structured data
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(structuredData);
  document.head.appendChild(script);
}; 