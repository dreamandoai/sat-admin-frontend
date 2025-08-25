import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { authService } from '../services/authService';
import type { UserData } from '../types/auth';

interface AuthState {
  isAuthenticated: boolean;
  user: UserData | null;
  token: string | null;
}

const initialState: AuthState = {
  isAuthenticated: !!authService.getCurrentToken(),
  user: authService.getCurrentUser(),
  token: authService.getCurrentToken(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: UserData; token: string }>
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;