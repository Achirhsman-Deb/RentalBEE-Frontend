import { createSlice } from "@reduxjs/toolkit";
import { fetchClientReviews, postFeedback } from "./ThunkAPI/ThunkAPI";
interface ClientReviewType {
  author: string; 
  authorImageUrl: string; 
  date: string; 
  rentalExperience: string; 
  text: string; 
}

interface FeedbackState {
  loading: boolean;
  success: boolean;
  error: string | null;
  reviews: ClientReviewType[]; 
  totalPages: number; 
  totalElements: number; 
  currentPage: number; 
}



const initialState: FeedbackState = {
  loading: false,
  success: false,
  error: null,
  reviews:[],
  totalPages: 0,
  totalElements: 0,
  currentPage: 0,
};

const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {
    resetFeedbackStatus(state) {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postFeedback.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(postFeedback.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(postFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

       builder
      .addCase(fetchClientReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchClientReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.content || []; 
        state.totalPages = action.payload.totalPages || 0; 
        state.totalElements = action.payload.totalElements || 0; 
        state.currentPage = action.payload.currentPage || 0; 
      })
      .addCase(fetchClientReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Something Went Wrong!";
      });
  },
});

export const { resetFeedbackStatus } = feedbackSlice.actions;
export default feedbackSlice.reducer;
