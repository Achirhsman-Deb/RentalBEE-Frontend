import { createSlice } from "@reduxjs/toolkit";
import { getDocumentsThunk, uploadDocumentThunk } from "./ThunkAPI/ThunkAPI";

type DocumentInfo = {
  documentUrl: string | null;
  status: string;
  fileName: string | null;
  fileSize: number | null;
};

type DocumentState = {
  documents: {
    aadhaarCard?: DocumentInfo;
    drivingLicense?: DocumentInfo;
  } | null;
  loading: boolean;
  error: string | null;
};

const initialState: DocumentState = {
  documents: null,
  loading: false,
  error: null,
};

const documentSlice = createSlice({
  name: "documents",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Upload
      .addCase(uploadDocumentThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadDocumentThunk.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.url) {
          const docType = action.meta.arg.docType;
          state.documents = {
            ...state.documents,
            [docType]: {
              documentUrl: action.payload.url,
              status: "UNVERIFIED",
            },
          };
        }
      })
      .addCase(uploadDocumentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Upload failed";
      })

      // Get Documents
      .addCase(getDocumentsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDocumentsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = action.payload;
      })
      .addCase(getDocumentsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch documents";
      });
  },
});

export default documentSlice.reducer;
