import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Async thunk to fetch listings
export const fetchListings = createAsyncThunk(
  "listings/fetchListings",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/api/listings`);
      return res.data.listings || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const listingsSlice = createSlice({
  name: "listings",
  initialState: {
    listings: [],
    loading: false,
    error: null,
    pageIndexes: {}, // { location: pageIndex }
  },
  reducers: {
    changePage: (state, action) => {
      const { location, direction, itemsPerPage } = action.payload;
      const allListings = state.listings.filter((l) => l.location === location);
      const totalPages = Math.ceil(allListings.length / itemsPerPage);
      const currentPage = state.pageIndexes[location] || 0;
      const nextPage = currentPage + direction;

      if (nextPage < 0 || nextPage >= totalPages) return;
      state.pageIndexes[location] = nextPage;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchListings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchListings.fulfilled, (state, action) => {
        state.loading = false;
        state.listings = action.payload;
      })
      .addCase(fetchListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { changePage } = listingsSlice.actions;
export default listingsSlice.reducer;
