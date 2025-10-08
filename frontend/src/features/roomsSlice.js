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

const roomsSlice = createSlice({
  name: "rooms",
  initialState: {
    rooms: [],
    room: null,          // ✅ for single room details
    totalPages: 1,
    totalRooms: 0,
    currentPage: 1,
    loading: false,
    error: null,
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
      });
  },
});

export const { setPage, toggleLike, clearCurrentRoom } = roomsSlice.actions;
export default roomsSlice.reducer;
