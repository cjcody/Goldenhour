// Menu Service
// Handles fetching and transforming menu data from Google Sheets

import { getSheetData, parseColumnBasedCSVData, fetchSheetData } from './googleSheets.js';
import { getColumnMapping } from './sheetConfig.js';

// Cache for menu data
let menuCache = null;
let menuCacheTimestamp = null;
const MENU_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Transforms column-based sheet data into menu categories format
 * @param {Array} rawData - Raw data from Google Sheets (column-based format)
 * @returns {Array} - Formatted menu categories
 */
const transformMenuData = (rawData) => {
  // Group items by category name
  const categoryMap = new Map();

  rawData.forEach(categoryData => {
    const category = categoryData.category?.trim();
    const categoryDescription = categoryData.categoryDescription?.trim();
    
    if (!category) return; // Skip categories without names

    // Create category if it doesn't exist
    if (!categoryMap.has(category)) {
      categoryMap.set(category, {
        title: category,
        description: categoryDescription || ``,
        items: []
      });
    } else {
      // If category exists but this column has a different description, update it
      // (This handles cases where the same category has different descriptions)
      const existingCategory = categoryMap.get(category);
      if (categoryDescription && categoryDescription !== existingCategory.description) {
        existingCategory.description = categoryDescription;
      }
    }

    // Create item for this category column
    const item = {
      name: categoryData.itemName?.trim() || 'Unnamed Item',
      price: categoryData.price?.trim() || '$0.00',
      description: categoryData.description?.trim() || '',
      popular: categoryData.popular?.toLowerCase() === 'true',
      onSale: categoryData.onSale?.toLowerCase() === 'true',
      seasonal: categoryData.seasonal?.toLowerCase() === 'true',
      orderButtonText: categoryData.orderButtonText?.trim() || 'Order',
      orderLink: categoryData.orderLink?.trim() || null,
      photos: categoryData.photos ? categoryData.photos.split(',').map(url => url.trim()).filter(url => url) : []
    };

    // Debug photo processing (preserving existing logic)
    if (categoryData.photos) {
      console.log(`Photos for ${item.name}:`, {
        rawPhotos: categoryData.photos,
        processedPhotos: item.photos
      });
    }

    // Add item to the appropriate category
    categoryMap.get(category).items.push(item);
  });

  // Convert map to array
  return Array.from(categoryMap.values());
};

/**
 * Fetches menu data from Google Sheets and transforms it
 * @returns {Promise<Array>} - Formatted menu categories
 */
export const getMenuData = async () => {
  try {
    // Check cache first
    const now = Date.now();
    if (menuCache && menuCacheTimestamp && (now - menuCacheTimestamp) < MENU_CACHE_DURATION) {
      console.log('Using cached menu data');
      return menuCache;
    }

    console.log('Fetching fresh menu data');
    const columnMapping = getColumnMapping('MENU');
    const { getSheetUrl } = await import('./sheetConfig.js');
    const url = getSheetUrl('MENU');
    
    if (!url) {
      throw new Error('No URL configured for MENU sheet');
    }

    // Fetch raw CSV data
    const csvData = await fetchSheetData(url);
    
    // Parse using column-based format
    const rawData = parseColumnBasedCSVData(csvData, columnMapping);
    
    if (!rawData || rawData.length === 0) {
      console.log('No menu data found in Google Sheets');
      return [];
    }

    const menuData = transformMenuData(rawData);
    
    // Cache the result
    menuCache = menuData;
    menuCacheTimestamp = now;
    
    return menuData;
  } catch (error) {
    console.error('Error fetching menu data:', error);
    
    // Use cached data if available, even if expired
    if (menuCache) {
      console.log('Using expired menu cache due to error');
      return menuCache;
    }
    
    // Return empty array on error so the component can show empty state
    return [];
  }
};

/**
 * Refreshes menu data (clears cache and fetches fresh data)
 * @returns {Promise<Array>} - Fresh menu data
 */
export const refreshMenuData = async () => {
  try {
    console.log('Refreshing menu data');
    
    // Clear cache
    menuCache = null;
    menuCacheTimestamp = null;
    
    const columnMapping = getColumnMapping('MENU');
    const { getSheetUrl } = await import('./sheetConfig.js');
    const url = getSheetUrl('MENU');
    
    if (!url) {
      throw new Error('No URL configured for MENU sheet');
    }

    // Fetch raw CSV data
    const csvData = await fetchSheetData(url);
    
    // Parse using column-based format
    const rawData = parseColumnBasedCSVData(csvData, columnMapping);
    
    if (!rawData || rawData.length === 0) {
      console.log('No menu data found in Google Sheets');
      return [];
    }

    const menuData = transformMenuData(rawData);
    
    // Cache the result
    menuCache = menuData;
    menuCacheTimestamp = Date.now();
    
    return menuData;
  } catch (error) {
    console.error('Error refreshing menu data:', error);
    return [];
  }
};

/**
 * Validates menu data structure
 * @param {Array} menuData - Menu data to validate
 * @returns {boolean} - True if valid
 */
export const validateMenuData = (menuData) => {
  if (!Array.isArray(menuData)) return false;
  
  return menuData.every(category => 
    category.title && 
    category.description && 
    Array.isArray(category.items) &&
    category.items.every(item => 
      item.name && 
      item.price && 
      item.description
    )
  );
}; 