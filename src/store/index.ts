import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./authSlice";
import planReducer from "./planSlice";
import pairReducer from "./pairSlice";
import studentsInfoReducer from "./studentsInfoSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    plan: planReducer,
    pair: pairReducer,
    studentsInfo: studentsInfoReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch