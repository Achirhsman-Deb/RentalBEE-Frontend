import { configureStore } from "@reduxjs/toolkit";
import bookingReducer from "../slices/BookingSlices";
import locationReducer from "../slices/HomepageSlices";
import carReducer from "../slices/CarSlices";
import authReducer from "../slices/AuthSlices";
import feedbackReducer from "../slices/FeedbackSlice";
import reportReducer from '../slices/ReportSlice'
import documentReducer from '../slices/documentSlice'
import notificationsReducer from '../slices/NotificationSlice'
import SupportUserReducer from '../slices/SupportUserSlices'
import supportBookingsReducer from '../slices/SupportBookingSlices'


const carStore = configureStore(
  {
    reducer: {
      booking: bookingReducer,
      homepage: locationReducer,
      cars: carReducer,
      auth: authReducer,
      feedback: feedbackReducer,
      reports: reportReducer,
      documents: documentReducer,
      notifications: notificationsReducer,
      support_userDocs: SupportUserReducer,
      support_bookings: supportBookingsReducer,
    },
  }
);

export type RootState = ReturnType<typeof carStore.getState>;
export type AppDispatch = typeof carStore.dispatch;

export default carStore;
