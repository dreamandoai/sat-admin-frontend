import { apiService } from './api';
import type { ApiError } from '../types/api';
import type { FolderNode, GetFilesRequest, GetFilsResponse } from '../types/resource';

export const resourceService = {
  getSubFolders: async (folder_id: string) => {
    try {
      const response = await apiService.get<FolderNode[]>(`/resources/folders/${folder_id}`);
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  },

  getFiles: async (request: GetFilesRequest) => {
    try {
      const response = await apiService.post<GetFilsResponse>("/resources/files", request);
      return response;
    } catch (error) {
      throw error as ApiError
    }
  }
};