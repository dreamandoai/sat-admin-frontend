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
  direction?: "next" | "previous",
  pagination_history?: History[]
}

export interface GetFilesResponseState {
  currentFolder: string | null,
  nextPageToken: string | null,
  remainingFolders: string[],
  paginationHistory: History[]
}

export interface History {
  currentFolder: string | null,
  files: FileNode[],
  pageToken: string | null,
  prevPageToken: string | null,
  remainingFolders: string[]
}

export interface GetFilsResponse {
  files: FileNode[],
  state: GetFilesResponseState
}