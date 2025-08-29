import { apiService } from './api';
import type { ApiError } from '../types/api';
import type { PlanRequest, StudentProfile, StudyPlan } from '../types/plan';

export const planService = {
  getStudents: async () => {
    try {
      const response = await apiService.get<StudentProfile[]>("/user/tested-students");
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  },

  generatePlan: async (request: PlanRequest) => {
    try {
      const response = await apiService.post<StudyPlan>("/plan/generate", request);
      return response;
    } catch (error) {
      throw error as ApiError
    }
  }
};