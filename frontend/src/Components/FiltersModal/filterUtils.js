export const getFilterCount = (filters) => {
  let count = 0;
  
  // Count all amenities/selections in the amenities array
  // This includes: Recommended items, Type of place, Amenities, 
  // Booking options, Property types, Accessibility, Languages, etc.
  if (filters.amenities && filters.amenities.length > 0) {
    count += filters.amenities.length;
  }
  
  // Count if price range is modified from default (30000-50000)
  if (filters.minPrice !== 30000 || filters.maxPrice !== 50000) {
    count += 1;
  }
  
  // Count if bedrooms is modified from default (1)
  if (filters.bedrooms && filters.bedrooms > 1) {
    count += 1;
  }
  
  // Count if beds is modified from default (1)
  if (filters.beds && filters.beds > 1) {
    count += 1;
  }
  
  // Count if bathrooms is modified from default (1)
  if (filters.bathrooms && filters.bathrooms > 1) {
    count += 1;
  }
  
  return count;
};
