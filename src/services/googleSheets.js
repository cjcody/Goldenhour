// Generic Google Sheets Service
// Handles fetching and parsing CSV data from published Google Sheets

/**
 * Fetches CSV data from a published Google Sheet
 * @param {string} url - The published CSV URL
 * @returns {Promise<string>} - Raw CSV data
 */
export const fetchSheetData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch sheet data: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    throw error;
  }
};

/**
 * Parses CSV data into an array of objects (row-based format)
 * @param {string} csvData - Raw CSV data
 * @param {Object} columnMapping - Mapping of column names
 * @returns {Array} - Array of parsed objects
 */
export const parseCSVData = (csvData, columnMapping) => {
  try {
    // Split CSV into lines and remove empty lines
    const lines = csvData.trim().split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      return [];
    }

    // Parse header row with proper CSV handling
    const headers = parseCSVLine(lines[0]);
    
    // Create reverse mapping from display names to internal names
    const reverseMapping = {};
    Object.entries(columnMapping).forEach(([internalName, displayName]) => {
      reverseMapping[displayName] = internalName;
    });

    // Parse data rows
    const data = [];
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      const row = {};
      
      headers.forEach((header, index) => {
        const internalName = reverseMapping[header];
        if (internalName && values[index] !== undefined) {
          row[internalName] = values[index];
        }
      });
      
      // Only add rows that have at least some data
      if (Object.keys(row).length > 0) {
        data.push(row);
      }
    }

    return data;
  } catch (error) {
    console.error('Error parsing CSV data:', error);
    throw error;
  }
};

/**
 * Parses column-based CSV data into an array of objects
 * @param {string} csvData - Raw CSV data
 * @param {Object} columnMapping - Mapping of row names to internal names
 * @returns {Array} - Array of parsed objects (one per category column)
 */
export const parseColumnBasedCSVData = (csvData, columnMapping) => {
  try {
    // Split CSV into lines and remove empty lines
    const lines = csvData.trim().split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      return [];
    }

    // Parse all lines
    const parsedLines = lines.map(line => parseCSVLine(line));
    
    // First line contains category names (column headers)
    const categoryNames = parsedLines[0];
    
    // Create reverse mapping from display names to internal names
    const reverseMapping = {};
    Object.entries(columnMapping).forEach(([internalName, displayName]) => {
      reverseMapping[displayName] = internalName;
    });

    // Process each category column (starting from index 1, skipping the first column which is row labels)
    const data = [];
    for (let colIndex = 1; colIndex < categoryNames.length; colIndex++) {
      const categoryName = categoryNames[colIndex]?.trim();
      if (!categoryName) continue; // Skip empty columns

      const categoryData = {
        category: categoryName,
        items: []
      };

      // Process each row for this category
      for (let rowIndex = 1; rowIndex < parsedLines.length; rowIndex++) {
        const rowLabel = parsedLines[rowIndex][0]?.trim();
        const value = parsedLines[rowIndex][colIndex]?.trim();
        
        if (!rowLabel) continue; // Skip empty rows
        
        const internalName = reverseMapping[rowLabel];
        if (internalName && value !== undefined) {
          categoryData[internalName] = value;
        }
      }

      // Only add categories that have at least some data
      if (Object.keys(categoryData).length > 1) { // More than just 'category'
        data.push(categoryData);
      }
    }

    return data;
  } catch (error) {
    console.error('Error parsing column-based CSV data:', error);
    throw error;
  }
};

/**
 * Parses a single CSV line, properly handling quoted fields with commas
 * @param {string} line - CSV line to parse
 * @returns {Array} - Array of field values
 */
export const parseCSVLine = (line) => {
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
 * Generic function to fetch and parse sheet data
 * @param {string} sheetType - Type of sheet (MENU, PRODUCTS, etc.)
 * @param {Object} columnMapping - Column mapping for the sheet
 * @returns {Promise<Array>} - Parsed sheet data
 */
export const getSheetData = async (sheetType, columnMapping) => {
  try {
    const { getSheetUrl } = await import('./sheetConfig.js');
    const url = getSheetUrl(sheetType);
    
    if (!url) {
      throw new Error(`No URL configured for sheet type: ${sheetType}`);
    }

    const csvData = await fetchSheetData(url);
    return parseCSVData(csvData, columnMapping);
  } catch (error) {
    console.error(`Error getting sheet data for ${sheetType}:`, error);
    throw error;
  }
}; 