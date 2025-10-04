import { createSlice } from "@reduxjs/toolkit";
import { fetchNotifications, ReadNotifications } from "./ThunkAPI/ThunkAPI";

export interface AppNotification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  __v: number;
}

interface NotificationState {
  items: AppNotification[];
  loading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  items: [],
  loading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong";
      })
      .addCase(ReadNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(ReadNotifications.fulfilled, (state, action) => {
        state.loading = false;
        const updatedNotification = action.payload;
        state.items = state.items.map((n) =>
          n._id === updatedNotification._id ? updatedNotification : n
        );
      })
      .addCase(ReadNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong";
      });
  }
});

export default notificationSlice.reducer;