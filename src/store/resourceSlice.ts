import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { FileNode, FolderNode } from '../types/resource';

interface ResourceState {
  folderTreeData: FolderNode[],
  filesToShow: FileNode[]
}

const initialState: ResourceState = {
  folderTreeData: [],
  filesToShow: []
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
  },
});

export const { setFolderTreeData, setFilesToShow } = resourceSlice.actions;

export default resourceSlice.reducer;