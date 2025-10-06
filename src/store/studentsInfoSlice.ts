import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { StudentsInfo } from '../types/studentInfo';


interface StudentsInfoState {
  numberOfStudents: number;
  numberOfTestedStudents: number;
  averageScore: number;
  numberOfStudyPlans: number;
  numberOfTeachers: number;
}

const initialState: StudentsInfoState = {
  numberOfStudents: 0,
  numberOfTestedStudents: 0,
  numberOfTeachers: 0,
  averageScore: 0,
  numberOfStudyPlans: 0
};

const studentsInfoSlice = createSlice({
  name: 'studentsInfo',
  initialState,
  reducers: {
    setStudentsInfo: (state, action: PayloadAction<StudentsInfo>) => {
      state.numberOfStudents = action.payload.totalStudents;
      state.averageScore = action.payload.averageScore;
      state.numberOfStudyPlans = action.payload.totalPlans;
      state.numberOfTestedStudents = action.payload.totalTestedStudents;
    },
    setNumberOfTeachers: (state, action: PayloadAction<number>) => {
      state.numberOfTeachers = action.payload;
    }
  },
});

export const { setStudentsInfo, setNumberOfTeachers } = studentsInfoSlice.actions;

export default studentsInfoSlice.reducer;