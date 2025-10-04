import { createSlice } from '@reduxjs/toolkit';
import { fetchBookedDates, getCarDetailsById } from './ThunkAPI/ThunkAPI';
import { Car } from '../Components/Cars/CarCard';

export interface CarState {
  bookedDates: string[];
  carDetails: Car | null;
  loading: boolean;
  error: string | null;
}

const initialState: CarState = {
  bookedDates: [],
  carDetails: null,
  loading: false,
  error: null,
};

const carSlice = createSlice({
  name: 'car',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCarDetailsById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCarDetailsById.fulfilled, (state, action) => {
        state.loading = false;
        state.carDetails = action.payload;
      })
      .addCase(getCarDetailsById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.toString() || "Failed to fetch car details";
      })
      .addCase(fetchBookedDates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookedDates.fulfilled, (state, action) => {
        state.loading = false;
        state.bookedDates = action.payload;
      })
      .addCase(fetchBookedDates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.toString() || "Failed to fetch booked dates";
      });
  },
});

export default carSlice.reducer;
