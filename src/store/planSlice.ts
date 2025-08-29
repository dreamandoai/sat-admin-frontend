import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { StudentProfile, StudyPlan } from '../types/plan';


interface PlanState {
  isLoading: boolean;
  testedStudents: StudentProfile[];
  selectedStudent: StudentProfile | null;
  plan: StudyPlan | null
}

const initialState: PlanState = {
  isLoading: false,
  testedStudents: [],
  selectedStudent: null,
  plan: null
};

const planSlice = createSlice({
  name: 'plan',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setSelectedStudent: (state, action: PayloadAction<StudentProfile>) => {
      state.selectedStudent = action.payload;
    },
    setTestedStudents: (state, action: PayloadAction<StudentProfile[]>) => {
      state.testedStudents = action.payload;
      state.isLoading = false;
    },
    setPlan: (state, action: PayloadAction<StudyPlan>) => {
      state.plan = action.payload;
    }
  },
});

export const { setLoading, setTestedStudents, setPlan, setSelectedStudent } = planSlice.actions;

export default planSlice.reducer;