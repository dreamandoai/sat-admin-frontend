import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { FileNode, FolderNode, History, PaginationState } from '../types/resource';

interface ResourceState {
  folderTreeData: FolderNode[],
  filesToShow: FileNode[],
  paginationState: PaginationState,
  paginationHistory: History[]
}

const initialState: ResourceState = {
  folderTreeData: [],
  filesToShow: [],
  paginationState: {
    currentFolderId: null,
    token: null,
    remainingFolders: [],
    hasNextPage: false,
    hasPreviousPage: false
  },
  paginationHistory: []
};

const resourceSlice = createSlice({
  name: 'resource',
  initialState,
  reducers: {
    setFolderTreeData: ( state, action: PayloadAction<FolderNode[]> ) => {
      state.folderTreeData = action.payload
    },
    setFilesToShow: ( state, action: PayloadAction<FileNode[]> ) => {
      state.filesToShow = action.payload
    },
    setPaginationState: ( state, action: PayloadAction<PaginationState> ) => {
      state.paginationState = action.payload
    },
    updatePaginationState: (state, action: PayloadAction<Partial<PaginationState>>) => {
      state.paginationState = { ...state.paginationState, ...action.payload };
    },
    setPaginationHistory: ( state, action: PayloadAction<History[]> ) => {
      state.paginationHistory = action.payload
    },
    addToPaginationHistory: (state, action: PayloadAction<History>) => {
      state.paginationHistory.push(action.payload);
    },
    removeLastFromPaginationHistory: (state) => {
      state.paginationHistory.pop();
    },
    resetPagination: (state) => {
      const updatePaginationState: PaginationState = {
        currentFolderId: null,
        token: null,
        remainingFolders: [],
        hasNextPage: false,
        hasPreviousPage: false
      };
      state.paginationState = updatePaginationState;
      state.paginationHistory = [];
    },
    resetPaginationForNewFolder: (state, action: PayloadAction<string>) => {
      state.paginationState.currentFolderId = action.payload;
      state.paginationState.token = null;
      state.paginationState.remainingFolders = [];
      state.paginationState.hasNextPage = false;
      state.paginationState.hasPreviousPage = false;
      state.paginationHistory = []
    }
  },
});

export const { 
  setFolderTreeData, 
  setFilesToShow, 
  setPaginationState,
  updatePaginationState,
  setPaginationHistory,
  addToPaginationHistory,
  removeLastFromPaginationHistory,
  resetPagination,
  resetPaginationForNewFolder
} = resourceSlice.actions;

export default resourceSlice.reducer;