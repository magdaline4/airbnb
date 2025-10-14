import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Fetch rooms (list)
export const fetchRooms = createAsyncThunk(
  "rooms/fetchRooms",
  async ({ filters, currentPage, roomsPerPage }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: roomsPerPage,
        minPrice: filters.minPrice || 0,
        maxPrice: filters.maxPrice || 50000,
        bedrooms: filters.bedrooms || 1,
        beds: filters.beds || 1,
        bathrooms: filters.bathrooms || 1,
      });

      if (filters.amenities?.length > 0) {
        params.append("amenities", filters.amenities.join(","));
      }

      const res = await axios.get(`${API_URL}/api/rooms?${params.toString()}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching rooms");
    }
  }
);

// ✅ Fetch a single room by ID
export const fetchRoomById = createAsyncThunk(
  "rooms/fetchRoomById",
  async (roomId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/api/rooms/${roomId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching room details");
    }
  }
);

// ✅ UPDATED: Fetch ALL amenities with pagination handling
export const fetchAmenities = createAsyncThunk(
  "rooms/fetchAmenities",
  async (_, { rejectWithValue }) => {
    try {
      // First, get the first page to understand pagination structure
      const firstPageRes = await axios.get(`${API_URL}/api/amenitiesitem/items`);
      const firstPageData = firstPageRes.data;
      
      // Check if the response has pagination structure
      if (firstPageData.pagination && firstPageData.pagination.pages > 1) {
        // If there are multiple pages, fetch all pages
        let allAmenities = [...(firstPageData.data || [])];
        const totalPages = firstPageData.pagination.pages;
        
        // Fetch remaining pages concurrently
        const pagePromises = [];
        for (let page = 2; page <= totalPages; page++) {
          pagePromises.push(
            axios.get(`${API_URL}/api/amenitiesitem/items?page=${page}`)
          );
        }
        
        const responses = await Promise.all(pagePromises);
        responses.forEach(response => {
          if (response.data.data && Array.isArray(response.data.data)) {
            allAmenities = [...allAmenities, ...response.data.data];
          }
        });
        
        return allAmenities;
      } else {
        // If no pagination or only one page, return the data directly
        return firstPageData.data || firstPageData || [];
      }
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching amenities");
    }
  }
);

// ✅ ALTERNATIVE: Simple version - try to get all amenities at once
export const fetchAllAmenities = createAsyncThunk(
  "rooms/fetchAllAmenities",
  async (_, { rejectWithValue }) => {
    try {
      // Try to get all amenities in one request with a large limit
      const res = await axios.get(`${API_URL}/api/amenitiesitem/items?limit=100`);
      const responseData = res.data;
      
      // Handle different response structures
      if (Array.isArray(responseData)) {
        return responseData;
      } else if (responseData.data && Array.isArray(responseData.data)) {
        return responseData.data;
      } else if (responseData.success && Array.isArray(responseData.data)) {
        return responseData.data;
      } else {
        return [];
      }
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching amenities");
    }
  }
);

const roomsSlice = createSlice({
  name: "rooms",
  initialState: {
    rooms: [],
    room: null,          // ✅ for single room details
    amenities: [],       // ✅ for amenities
    totalPages: 1,
    totalRooms: 0,
    currentPage: 1,
    loading: false,
    error: null,
    amenitiesLoading: false, // ✅ separate loading for amenities
    amenitiesError: null,    // ✅ separate error for amenities
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
    // ✅ Clear the currently loaded room
    clearCurrentRoom: (state) => {
      state.room = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Rooms list
      .addCase(fetchRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload.rooms || [];
        state.totalPages = action.payload.totalPages || 1;
        state.totalRooms = action.payload.totalRooms || action.payload.total || 0;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Single room
      .addCase(fetchRoomById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoomById.fulfilled, (state, action) => {
        state.loading = false;
        state.room = action.payload.room || action.payload;
      })
      .addCase(fetchRoomById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ UPDATED: Amenities (with pagination handling)
      .addCase(fetchAmenities.pending, (state) => {
        state.amenitiesLoading = true;
        state.amenitiesError = null;
      })
      .addCase(fetchAmenities.fulfilled, (state, action) => {
        state.amenitiesLoading = false;
        state.amenities = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchAmenities.rejected, (state, action) => {
        state.amenitiesLoading = false;
        state.amenitiesError = action.payload;
      })

      // ✅ Alternative: All amenities at once
      .addCase(fetchAllAmenities.pending, (state) => {
        state.amenitiesLoading = true;
        state.amenitiesError = null;
      })
      .addCase(fetchAllAmenities.fulfilled, (state, action) => {
        state.amenitiesLoading = false;
        state.amenities = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchAllAmenities.rejected, (state, action) => {
        state.amenitiesLoading = false;
        state.amenitiesError = action.payload;
      });
  },
});

export const { setPage, toggleLike, clearCurrentRoom } = roomsSlice.actions;
export default roomsSlice.reducer;