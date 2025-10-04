import { createSlice} from "@reduxjs/toolkit";
import { exportReport, fetchReportData } from "./ThunkAPI/ThunkAPI";
import { ReportData } from "../types/ReportTypes";

export interface ReportState {
  data: ReportData[];
  loading: boolean;
  error: string | null;
  downloadLoading: boolean;
}

const initialState: ReportState = {
  data: [],
  loading: false,
  error: null,
  downloadLoading: false,
};

const reportSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReportData.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.data = [];
      })
      .addCase(fetchReportData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchReportData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error fetching reports";
      });

    builder
      .addCase(exportReport.pending, (state) => {
        state.downloadLoading = true;
        state.error = null;
      })
      .addCase(exportReport.fulfilled, (state) => {
        state.downloadLoading = false;
      })
      .addCase(exportReport.rejected, (state, action) => {
        state.downloadLoading = false;
        state.error = action.payload || "Error exporting report";
      });
  },
});

export default reportSlice.reducer;