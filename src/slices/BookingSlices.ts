import { createSlice } from "@reduxjs/toolkit";
import {
  cancelBooking,
  confirmReservation,
  editBooking,
  fetchBookings,
  getBookingDetails,
} from "./ThunkAPI/ThunkAPI";
import { Booking } from "../types/BookingTypes";

export interface BookingState {
  loading: boolean;
  error: any;
  success: boolean;
  bookings: Booking[];
  orderId: string | null;

  cancelError: any;
  cancelSuccess: boolean;
  cancelLoading: boolean;

  selectedBooking: any | null;
  selectedLoading: boolean;
  selectedError: string | null;

  EditBooking: any | null;
  EditBookingLoading: boolean;
  EditBookingError: string | null;
}

const initialState: BookingState = {
  loading: false,
  error: null,
  success: false,
  bookings: [],
  orderId: null,
  cancelError: "",
  cancelSuccess: false,
  cancelLoading: false,

  selectedBooking: null,
  selectedLoading: false,
  selectedError: null,

  EditBooking: null,
  EditBookingLoading: false,
  EditBookingError: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    resetBookingStatus: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Confirm Reservation
      .addCase(confirmReservation.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(confirmReservation.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.orderId = action.payload.orderId;
      })
      .addCase(confirmReservation.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = (action.payload as { message: string })?.message || "Something went wrong";
      })

      // Fetch Bookings
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Cancel Booking
      .addCase(cancelBooking.pending, (state) => {
        state.cancelLoading = true;
        state.cancelError = '';
        state.cancelSuccess = false;
      })
      .addCase(cancelBooking.fulfilled, (state) => {
        state.cancelLoading = false;
        state.cancelSuccess = true;
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.cancelError = action.payload || 'Failed to cancel booking';
        state.cancelLoading = false;
      })

      // Get Booking Details
      .addCase(getBookingDetails.pending, (state) => {
        state.selectedLoading = true;
        state.selectedError = null;
        state.selectedBooking = null;
      })
      .addCase(getBookingDetails.fulfilled, (state, action) => {
        state.selectedLoading = false;
        state.selectedBooking = action.payload;
      })
      .addCase(getBookingDetails.rejected, (state, action) => {
        state.selectedLoading = false;
        state.selectedError = action.payload as string;
      })

      //Edit Booking Details
      .addCase(editBooking.pending, (state) => {
        state.EditBookingLoading = true;
      })
      .addCase(editBooking.fulfilled, (state, action) => {
        state.EditBookingLoading = false;
        state.EditBooking = action.payload;
      })
      .addCase(editBooking.rejected, (state, action) => {
        state.EditBookingLoading = false;
        state.EditBookingError = action.payload+"" || 'Failed to Edit Booking';
      });
},
});

export const { resetBookingStatus } = bookingSlice.actions;
export default bookingSlice.reducer;
