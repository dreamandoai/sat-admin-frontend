import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RegisteredStudent, RegisteredTeacher } from '../types/userDirectory';


interface StudentsInfoState {
  registeredTeachers: RegisteredTeacher[];
  registeredStudents: RegisteredStudent[];
}

const initialState: StudentsInfoState = {
  registeredTeachers: [],
  registeredStudents: []
};

const userDirectorySlice = createSlice({
  name: 'userDirectory',
  initialState,
  reducers: {
    setRegisteredTeachers: (state, action: PayloadAction<RegisteredTeacher[]>) => {
      state.registeredTeachers = action.payload;
    },
    setRegisteredStudents: (state, action: PayloadAction<RegisteredStudent[]>) => {
      state.registeredStudents = action.payload;
    }
  },
});

export const { setRegisteredTeachers, setRegisteredStudents } = userDirectorySlice.actions;

export default userDirectorySlice.reducer;