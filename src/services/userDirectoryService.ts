import { apiService } from './api';
import type { ApiError } from '../types/api';
import type { RegisteredStudent, RegisteredTeacher, UserAiAccessRequest } from '../types/userDirectory';

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
  },
  setUserAiAccess: async (users: UserAiAccessRequest[]) => {
    try {
      const response = await apiService.post("/user/set-ai-access", users);
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  }
};