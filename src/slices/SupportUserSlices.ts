import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchUsersWithDocuments, FetchUsersResponse, UserWithDocuments, fetchUserDocumentsById, UserDocumentsResponse } from "./ThunkAPI/ThunkAPI";

interface SupportUser {
    users: UserWithDocuments[];
    totalUsers: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
    userDocuments: UserDocumentsResponse["data"] | null;
    userDocumentsLoading: boolean;
}

const initialState: SupportUser = {
  users: [],
  totalUsers: 0,
  totalPages: 0,
  currentPage: 1,
  loading: false,
  error: null,
  userDocuments: null,
  userDocumentsLoading: false,
};

const SupportUserSlice = createSlice({
    name: "SupportUser",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // --- fetchUsersWithDocuments ---
        builder
            .addCase(fetchUsersWithDocuments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                fetchUsersWithDocuments.fulfilled,
                (state, action: PayloadAction<FetchUsersResponse>) => {
                    state.loading = false;
                    state.users = action.payload.data;
                    state.totalUsers = action.payload.totalUsers;
                    state.totalPages = action.payload.totalPages;
                    state.currentPage = action.payload.currentPage;
                }
            )
            .addCase(fetchUsersWithDocuments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch users";
            });

        // --- fetchUserDocumentsById ---
        builder
            .addCase(fetchUserDocumentsById.pending, (state) => {
                state.userDocumentsLoading = true;
                state.error = null;
            })
            .addCase(
                fetchUserDocumentsById.fulfilled,
                (state, action: PayloadAction<UserDocumentsResponse>) => {
                    state.userDocumentsLoading = false;
                    state.userDocuments = action.payload.data;
                }
            )
            .addCase(fetchUserDocumentsById.rejected, (state, action) => {
                state.userDocumentsLoading = false;
                state.error = action.payload || "Failed to fetch user documents";
            });
    },
});

export default SupportUserSlice.reducer;
