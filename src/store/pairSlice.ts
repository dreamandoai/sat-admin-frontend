import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Pair, TeacherShort } from '../types/pair';


interface PairState {
  pairs: Pair[],
  teachers: TeacherShort[]
}

const initialState: PairState = {
  pairs: [],
  teachers: []
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
    }
  },
});

export const { setPairs, setTeachers } = pairSlice.actions;

export default pairSlice.reducer;