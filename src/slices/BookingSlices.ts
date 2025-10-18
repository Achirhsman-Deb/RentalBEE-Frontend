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

  cancelError: string | null;
  cancelSuccess: boolean;
  cancelLoading: boolean;
  cancelResponse: any | null;

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

  cancelError: null,
  cancelSuccess: false,
  cancelLoading: false,
  cancelResponse: null,

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
    resetCancelStatus: (state) => {
      state.cancelSuccess = false;
      state.cancelError = null;
      state.cancelResponse = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Confirm Reservation
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
        state.error =
          (action.payload as { message: string })?.message || "Something went wrong";
      })

      // ✅ Fetch Bookings
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

      // ✅ Cancel Booking (fixed)
      .addCase(cancelBooking.pending, (state) => {
        state.cancelLoading = true;
        state.cancelError = null;
        state.cancelSuccess = false;
        state.cancelResponse = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.cancelLoading = false;
        state.cancelSuccess = true;
        state.cancelResponse = action.payload; // <-- store backend response
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.cancelLoading = false;
        state.cancelError = (action.payload as string) || "Failed to cancel booking";
      })

      // ✅ Get Booking Details
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

      // ✅ Edit Booking
      .addCase(editBooking.pending, (state) => {
        state.EditBookingLoading = true;
        state.EditBookingError = null;
      })
      .addCase(editBooking.fulfilled, (state, action) => {
        state.EditBookingLoading = false;
        state.EditBooking = action.payload;
      })
      .addCase(editBooking.rejected, (state, action) => {
        state.EditBookingLoading = false;
        state.EditBookingError =
          (action.payload as string) || "Failed to edit booking";
      });
  },
});

export const { resetBookingStatus, resetCancelStatus } = bookingSlice.actions;
export default bookingSlice.reducer;
