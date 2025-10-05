export interface FolderNode {
  id: string
  name: string
  type: 'folder' | 'file'
  hasChildren: boolean
  children?: FolderNode[]  
}

export interface FileNode{
  id: string
  name: string
  size: number,
  fileType: 'pdf' | 'doc' | 'ppt' | 'txt',
  viewLink: string,
  downloadLink: string
  uploadedDate: string
}

export interface GetFilesRequest {
  folder_id: string,
  token?: string
  remaining_folders?: string[],
}

export interface GetFilesResponseState {
  currentFolder: string | null,
  nextPageToken: string | null,
  remainingFolders: string[]
}

export interface History {
  currentFolder: string | null,
  files: FileNode[],
  pageToken: string | null,
  remainingFolders: string[]
}

export interface GetFilsResponse {
  files: FileNode[],
  state: GetFilesResponseState
}

export interface PaginationState {
  currentFolderId: string | null;
  token: string | null;
  remainingFolders: string[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}