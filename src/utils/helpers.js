// Helper functions for the application

// Format date to DD-MM-YYYY
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    
    // Create date parts using UTC methods to avoid timezone issues
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    
    return `${day}-${month}-${year}`;
  } catch (error) {
    console.error('Error formatting date:', error, dateString);
    return 'Invalid Date';
  }
};

// Generate a unique scheme code
export const generateSchemeCode = () => {
  const prefix = 'SCHM';
  const randomNum = Math.floor(10000000 + Math.random() * 90000000);
  return `${prefix}${randomNum}`;
};

// Calculate discount percentage
export const calculateDiscountPercentage = (mrp, discountPrice) => {
  if (!mrp || !discountPrice) return 0;
  const discount = ((mrp - discountPrice) / mrp) * 100;
  return Math.round(discount * 100) / 100; // Round to 2 decimal places
};

// Format currency
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '';
  return `₹${parseFloat(amount).toFixed(2)}`;
};

// Filter schemes by status
export const filterSchemesByStatus = (schemes, status) => {
  if (!status) return schemes;
  return schemes.filter(scheme => scheme.status === status);
};

// Search schemes by text
export const searchSchemes = (schemes, searchText) => {
  if (!searchText) return schemes;
  
  const lowerCaseSearch = searchText.toLowerCase();
  return schemes.filter(scheme => 
    (scheme.id && scheme.id.toLowerCase().includes(lowerCaseSearch)) ||
    (scheme.schemeCode && scheme.schemeCode.toLowerCase().includes(lowerCaseSearch)) ||
    (scheme.salesDescription && scheme.salesDescription.toLowerCase().includes(lowerCaseSearch)) ||
    (scheme.itemName && scheme.itemName.toLowerCase().includes(lowerCaseSearch))
  );
};