// Context/FiltersContext.jsx
import { createContext, useState, useEffect } from "react";

export const FiltersContext = createContext();

export const FiltersProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    minPrice: 10000,    // Realistic minimum for your rooms
    maxPrice: 40000,    // Realistic maximum for your rooms  
    bedrooms: 0,        // 0 means no filter
    beds: 0,            // 0 means no filter
    bathrooms: 0,       // 0 means no filter
    amenities: [],
  });

  const [filteredCount, setFilteredCount] = useState(0);
  const [filtersApplied, setFiltersApplied] = useState(false);

  // Function to apply filters and trigger re-fetch
  const applyFilters = (newFilters) => {
    setFilters(newFilters);
    setFiltersApplied(prev => !prev); // Toggle to trigger useEffect
  };

  return (
    <FiltersContext.Provider value={{ 
      filters, 
      setFilters: applyFilters, // Replace setFilters with applyFilters
      filteredCount, 
      setFilteredCount,
      filtersApplied
    }}>
      {children}
    </FiltersContext.Provider>
  );
};