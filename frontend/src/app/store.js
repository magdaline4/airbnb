import { configureStore } from "@reduxjs/toolkit";
import filtersReducer from "../features/filtersSlice";
import roomsReducer from "../features/roomsSlice";
import listingsReducer from "../features/listingsSlice"

export const store = configureStore({
  reducer: {
    filters: filtersReducer,
    rooms: roomsReducer,
    listings: listingsReducer,
  },
});
export default store;