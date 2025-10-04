import { createSlice } from "@reduxjs/toolkit";
import { getLocations } from "./ThunkAPI/ThunkAPI";
import type { LocationOption } from "../Components/CarBooking/Location";


interface HomepageState {
  locations: LocationOption[];
  loading: boolean;
  error: string | null;
}

const initialState: HomepageState = {
  locations: [],
  loading: false,
  error: null,
};

const homepageSlice = createSlice({
  name: "homepage",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLocations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLocations.fulfilled, (state, action) => {
        state.loading = false;
        state.locations = action.payload.content;
      })
      .addCase(getLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default homepageSlice.reducer;
