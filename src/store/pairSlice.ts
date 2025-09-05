import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { DiagnosticResult, Pair, TeacherShort } from '../types/pair';


interface PairState {
  pairs: Pair[],
  teachers: TeacherShort[],
  diagnosticResults: DiagnosticResult[]
}

const initialState: PairState = {
  pairs: [],
  teachers: [],
  diagnosticResults: []
};

const pairSlice = createSlice({
  name: 'pair',
  initialState,
  reducers: {
    setPairs: (state, action: PayloadAction<Pair[]>) => {
      state.pairs = action.payload;
    },
    setTeachers: (state, action: PayloadAction<TeacherShort[]>) => {
      state.teachers = action.payload;
    },
    setDiagnosticResults: (state, action: PayloadAction<DiagnosticResult[]>) => {
      state.diagnosticResults = action.payload;
    }
  },
});

export const { setPairs, setTeachers, setDiagnosticResults } = pairSlice.actions;

export default pairSlice.reducer;