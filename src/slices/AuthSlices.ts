import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { 
    loginUser, 
    registerUser, 
    logoutUser, 
    changePassword, 
    personalInfoGet, 
    personalInfoPut 
} from './ThunkAPI/ThunkAPI';
import { User } from '../types/types';

export interface AuthState {
    user: User | null;
    signUpConf: string | null;
    loading: boolean;
    error: string | null;
}

function getUserDataFromStorage(): User | null {
    try {
        const raw = localStorage.getItem('user_data');
        if (!raw) return null;
        return JSON.parse(raw) as User;
    } catch {
        return null;
    }
}

const initialState: AuthState = {
    user: getUserDataFromStorage(), 
    signUpConf: null,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        resetSignUpConf(state) {
            state.signUpConf = null;
        },
        
        setUser(state, action: PayloadAction<User | null>) {
            state.user = action.payload;
            if (action.payload === null) {
                localStorage.removeItem('user_data');
            } else {
                localStorage.setItem('user_data', JSON.stringify(action.payload));
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // --- REGISTER USER ---
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.signUpConf = typeof action.payload === 'string'
                    ? action.payload
                    : action.payload?.message || "Registration successful";
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // --- LOGIN USER ---
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                localStorage.setItem('user_data', JSON.stringify(action.payload));
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            
            // --- LOGOUT USER ---
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.error = null;
                localStorage.removeItem('user_data'); 
            })

            // --- CHANGE PASSWORD ---
            .addCase(changePassword.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(changePassword.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; })
            .addCase(changePassword.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

            // --- PERSONAL INFO PUT ---
            .addCase(personalInfoPut.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(personalInfoPut.fulfilled, (state, action) => {
                state.loading = false;
                if (state.user) {
                    Object.assign(state.user, action.payload); 
                    localStorage.setItem('user_data', JSON.stringify(state.user));
                }
            })
            .addCase(personalInfoPut.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

            // --- PERSONAL INFO GET ---
            .addCase(personalInfoGet.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(personalInfoGet.fulfilled, (state, action) => {
                state.loading = false;
                if (state.user) {
                    Object.assign(state.user, action.payload);
                    localStorage.setItem('user_data', JSON.stringify(state.user));
                }
            })
            .addCase(personalInfoGet.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });
    },
});

export const { resetSignUpConf, setUser } = authSlice.actions;
export default authSlice.reducer;