export const getFilterCount = (filters) => {
  if (!filters) return 0;
  
  let count = 0;
  
  // Count all amenities/selections
  if (filters.amenities && filters.amenities.length > 0) {
    count += filters.amenities.length;
  }
  
  // Only count price if BOTH min and max are changed from defaults
  // Check if either value is different from defaults (30000-50000)
  const isPriceChanged = (filters.minPrice && filters.minPrice !== 10000) || 
                         (filters.maxPrice && filters.maxPrice !== 40000);
  if (isPriceChanged) {
    count += 1;
  }
  
  // Only count if bedrooms is greater than 1 (default is 1)
  if (filters.bedrooms && filters.bedrooms > 1) {
    count += 1;
  }
  
  // Only count if beds is greater than 1 (default is 1)
  if (filters.beds && filters.beds > 1) {
    count += 1;
  }
  
  // Only count if bathrooms is greater than 1 (default is 1)
  if (filters.bathrooms && filters.bathrooms > 1) {
    count += 1;
  }
  
  return count;
};