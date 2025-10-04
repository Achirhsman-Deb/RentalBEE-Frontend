import { createSlice } from '@reduxjs/toolkit';
import { loginUser, registerUser, logoutUser, changePassword, personalInfoGet, personalInfoPut } from './ThunkAPI/ThunkAPI';
import { User } from '../types/types';

export interface Auth {
  user: User | null;
  signUpConf: string | null;
  loading: boolean;
  error: string;
}

function getUserFromStorage() {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

const initialState: Auth = {
  user: getUserFromStorage(),
  signUpConf: null,
  loading: false,
  error: "",
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetSignUpConf(state) {
      state.signUpConf = null;
      // state.error = null; // optional
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(registerUser.fulfilled, (state, action: { payload: { message?: string } | string }) => {
        state.loading = false;
        state.signUpConf = typeof action.payload === 'string'
          ? action.payload
          : action.payload?.message || "Registration successful";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(personalInfoPut.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(personalInfoPut.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user) {
          state.user.city = action.payload.city;
          state.user.email = action.payload.email;
          state.user.country = action.payload.country;
          state.user.street = action.payload.street;
          state.user.postalCode = action.payload.postalCode;
          state.user.phoneNumber = action.payload.phoneNumber;
          state.user.firstName = action.payload.firstName;
          state.user.lastName = action.payload.lastName;
          state.user.imageUrl = action.payload.imageUrl;
        }
      })
      .addCase(personalInfoPut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(personalInfoGet.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(personalInfoGet.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user) {
          state.user.city = action.payload.city;
          state.user.email = action.payload.email;
          state.user.country = action.payload.country;
          state.user.street = action.payload.street;
          state.user.postalCode = action.payload.postalCode;
          state.user.phoneNumber = action.payload.phoneNumber;
          state.user.firstName = action.payload.firstName;
          state.user.lastName = action.payload.lastName;
          state.user.imageUrl = action.payload.imageUrl;
          state.user.status = action.payload.status;
        }
      })
      .addCase(personalInfoGet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.error = "";
        // Clear more auth state if necessary
      });;
  },
});

export const { resetSignUpConf } = authSlice.actions;
export default authSlice.reducer;