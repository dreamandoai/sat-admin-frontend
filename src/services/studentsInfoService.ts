import { apiService } from './api';
import type { ApiError } from '../types/api';
import type { StudentsInfo } from '../types/studentInfo';

export const studentsInfoService = {
  getStudentsInfo: async () => {
    try {
      const response = await apiService.get<StudentsInfo>("/user/students-info");
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  },
  getNumberOfTeachers: async () => {
    try {
      const response = await apiService.get<number>("/user/teachers-info");
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  }
};