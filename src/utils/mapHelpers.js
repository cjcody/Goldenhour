/**
 * Utility functions for Google Maps iframe handling
 */

/**
 * Extracts the Google Maps embed URL from iframe HTML or validates a direct URL
 * @param {string} input - Either full iframe HTML or direct Google Maps embed URL
 * @returns {string} - Clean Google Maps embed URL or empty string if invalid
 */
export function extractGoogleMapsUrl(input) {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  // If it's already a Google Maps embed URL, return it
  if (input.includes('google.com/maps/embed')) {
    return input;
  }
  
  // Extract src from iframe HTML
  const match = input.match(/src=["']([^"']+)["']/);
  const extractedUrl = match ? match[1] : '';
  
  // Validate that it's a Google Maps embed URL
  if (extractedUrl && extractedUrl.includes('google.com/maps/embed')) {
    return extractedUrl;
  }
  
  return '';
}

/**
 * Validates if a string is a valid Google Maps embed URL
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid Google Maps embed URL
 */
export function isValidGoogleMapsUrl(url) {
  return url && url.includes('google.com/maps/embed');
}

/**
 * Creates a safe iframe element with consistent styling
 * @param {string} src - Google Maps embed URL
 * @returns {Object|null} - React iframe element or null if invalid
 */
export function createSafeMapIframe(src) {
  if (!isValidGoogleMapsUrl(src)) {
    return null;
  }
  
  return {
    title: "Our Location",
    src: src,
    width: "100%",
    height: "100%",
    style: { 
      border: 0, 
      width: '100%', 
      height: '100%', 
      display: 'block', 
      borderRadius: '0.75rem' 
    },
    allowFullScreen: "",
    loading: "lazy",
    referrerPolicy: "no-referrer-when-downgrade"
  };
}

/**
 * Instructions for clients on how to get the Google Maps embed URL
 * @returns {string} - Instructions text
 */
export function getMapUrlInstructions() {
  return `
To add a Google Maps embed to your contact page:

1. Go to Google Maps and search for your business location
2. Click "Share" and select "Embed a map"
3. Copy the URL from the iframe code (the part after src="...")
4. Paste just that URL into the "Contact Map url Location" field in your Google Sheet

Example URL format: https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d...

Do NOT paste the full iframe HTML code - just the URL part.
  `.trim();
} 