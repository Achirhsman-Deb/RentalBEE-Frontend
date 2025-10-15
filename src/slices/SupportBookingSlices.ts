import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchSupportBookingById, fetchSupportBookings } from "./ThunkAPI/ThunkAPI";

interface CarInfo {
  model: string;
  category: string;
}

interface ClientInfo {
  firstName: string;
  lastName: string;
}

interface BookingLite {
  _id: string;
  bookingDate: string;
  status: string;
  totalPrice: number;
  createdAt: string;
  carId: CarInfo;
  clientId: ClientInfo;
}

interface DetailedBooking {
  _id: string;
  bookingDate: string;
  status: string;
  totalPrice: number;
  createdAt: string;
  carId: {
    model: string;
    images: string[];
    category: string;
    engineCapacity: string;
    fuelType: string;
    gearBoxType: string;
    passengerCapacity: number;
  };
  clientId: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
  };
  pickupLocationId: {
    locationName: string;
    locationAddress: string;
  };
  dropoffLocationId: {
    locationName: string;
    locationAddress: string;
  };
}

interface CarOption {
  id: string;
  name: string;
}

interface SupportBookingState {
  bookings: BookingLite[];
  total: number;
  currentPage: number;
  totalPages: number;
  bookingDetails: DetailedBooking | null;
  loading: boolean;
  error: string | null;
  Cars: CarOption[];
}

const initialState: SupportBookingState = {
  bookings: [],
  total: 0,
  currentPage: 1,
  totalPages: 1,
  bookingDetails: null,
  loading: false,
  error: null,
  Cars: []
};

const supportBookingSlice = createSlice({
  name: "supportBookings",
  initialState,
  reducers: {
    clearBookingDetails: (state) => {
      state.bookingDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all bookings
      .addCase(fetchSupportBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSupportBookings.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.bookings = action.payload.bookings;
        state.total = action.payload.total;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.Cars = action.payload.Cars;
      })
      .addCase(fetchSupportBookings.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch single booking
      .addCase(fetchSupportBookingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSupportBookingById.fulfilled, (state, action: PayloadAction<DetailedBooking>) => {
        state.loading = false;
        state.bookingDetails = action.payload;
      })
      .addCase(fetchSupportBookingById.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBookingDetails } = supportBookingSlice.actions;
export default supportBookingSlice.reducer;