import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./authSlice";
import planReducer from "./planSlice";
import pairReducer from "./pairSlice";
import studentsInfoReducer from "./studentsInfoSlice";
import resourceReducer from "./resourceSlice";
import userDirectoryReducer from "./userDirectorySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    plan: planReducer,
    pair: pairReducer,
    studentsInfo: studentsInfoReducer,
    resource: resourceReducer,
    userDirectory: userDirectoryReducer
  }
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch