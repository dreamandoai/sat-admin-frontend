import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { StudentsInfo } from '../types/studentInfo';


interface StudentsInfoState {
  numberOfStudents: number;
  averageScore: number;
  numberOfStudyPlans: number;
}

const initialState: StudentsInfoState = {
  numberOfStudents: 0,
  averageScore: 0,
  numberOfStudyPlans: 0
};

const studentsInfoSlice = createSlice({
  name: 'pair',
  initialState,
  reducers: {
    setStudentsInfo: (state, action: PayloadAction<StudentsInfo>) => {
      state.numberOfStudents = action.payload.totalStudents;
      state.averageScore = action.payload.averageScore;
      state.numberOfStudyPlans = action.payload.totalPlans;
    },
  },
});

export const { setStudentsInfo } = studentsInfoSlice.actions;

export default studentsInfoSlice.reducer;