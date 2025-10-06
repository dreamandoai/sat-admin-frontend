import { apiService } from './api';
import type { ApiError } from '../types/api';
import type { RegisteredStudent, RegisteredTeacher } from '../types/userDirectory';

export const userDirectoryService = {
  getRegisteredTeachers: async () => {
    try {
      const response = await apiService.get<RegisteredTeacher[]>("/user/teachers");
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  },
  getRegisteredStudents: async () => {
    try {
      const response = await apiService.get<RegisteredStudent[]>("/user/students");
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  }
};