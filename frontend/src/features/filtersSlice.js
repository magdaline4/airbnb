import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  minPrice: 0,
  maxPrice: 50000,
  bedrooms: 1,
  beds: 1,
  bathrooms: 1,
  amenities: [],
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetFilters: () => initialState,
  },
});

export const { setFilters, resetFilters } = filtersSlice.actions;
export default filtersSlice.reducer;
