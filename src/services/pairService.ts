import { apiService } from './api';
import type { ApiError } from '../types/api';
import type { Pair, TeacherShort, GeneratePairRequest, DiagnosticResult } from '../types/pair';

export const pairService = {
  generatePair: async (request: GeneratePairRequest) => {
    try {
      const response = await apiService.post("/pair/generate", request);
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  },
  getPairs: async () => {
    try {
      const response = await apiService.get<Pair[]>("/pair");
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  },

  getTeachers: async () => {
    try {
      const response = await apiService.get<TeacherShort[]>("/user/teachers");
      return response;
    } catch (error) {
      throw error as ApiError
    }
  },

  getDiagnosticResults: async (studentId: string) => {
    try {
      const response = await apiService.get<DiagnosticResult[]>(`/diagnostic/get-history/${studentId}`);
      return response;
    } catch (error) {
      throw error as ApiError
    }
  }
};