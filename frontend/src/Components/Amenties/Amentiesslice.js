import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// ... (keep your existing room fetching thunks)

// ✅ Fetch amenities categories (for reference)
export const fetchPreviewAmenities = createAsyncThunk(
  "rooms/fetchPreviewAmenities",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/api/amenities`);
      
      // This API returns categories in res.data.amenities
      let categories = [];
      if (res.data && Array.isArray(res.data.amenities)) {
        categories = res.data.amenities;
      }
      
      return categories;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching amenities categories");
    }
  }
);

// ✅ Fetch all amenities with categories (for popup)
export const fetchAllAmenities = createAsyncThunk(
  "rooms/fetchAllAmenities",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/api/amenitiesitem/items`);
      
      // This API returns actual amenity items in res.data.data
      let amenities = [];
      if (res.data && Array.isArray(res.data.data)) {
        amenities = res.data.data;
      }
      
      return amenities;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching all amenities");
    }
  }
);

const roomsSlice = createSlice({
  name: "rooms",
  initialState: {
    rooms: [],
    room: null,
    previewAmenities: [], // This will store categories from /api/amenities
    allAmenities: [],     // This will store actual items from /api/amenitiesitem/items
    totalPages: 1,
    totalRooms: 0,
    currentPage: 1,
    loading: false,
    error: null,
    previewAmenitiesLoading: false,
    previewAmenitiesError: null,
    allAmenitiesLoading: false,
    allAmenitiesError: null,
    likedRooms: [],
  },
  reducers: {
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    toggleLike: (state, action) => {
      const roomId = action.payload;
      if (state.likedRooms.includes(roomId)) {
        state.likedRooms = state.likedRooms.filter((id) => id !== roomId);
      } else {
        state.likedRooms.push(roomId);
      }
    },
    clearCurrentRoom: (state) => {
      state.room = null;
      state.error = null;
    },
    clearAmenitiesLoading: (state) => {
      state.allAmenitiesLoading = false;
      state.allAmenitiesError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ... (your existing room cases)

      // ✅ Preview Amenities (Categories)
      .addCase(fetchPreviewAmenities.pending, (state) => {
        state.previewAmenitiesLoading = true;
        state.previewAmenitiesError = null;
      })
      .addCase(fetchPreviewAmenities.fulfilled, (state, action) => {
        state.previewAmenitiesLoading = false;
        state.previewAmenities = action.payload;
      })
      .addCase(fetchPreviewAmenities.rejected, (state, action) => {
        state.previewAmenitiesLoading = false;
        state.previewAmenitiesError = action.payload;
      })

      // ✅ All Amenities (Items for popup)
      .addCase(fetchAllAmenities.pending, (state) => {
        state.allAmenitiesLoading = true;
        state.allAmenitiesError = null;
      })
      .addCase(fetchAllAmenities.fulfilled, (state, action) => {
        state.allAmenitiesLoading = false;
        state.allAmenities = action.payload;
      })
      .addCase(fetchAllAmenities.rejected, (state, action) => {
        state.allAmenitiesLoading = false;
        state.allAmenitiesError = action.payload;
      });
  },
});

export const { setPage, toggleLike, clearCurrentRoom, clearAmenitiesLoading } = roomsSlice.actions;
export default roomsSlice.reducer;