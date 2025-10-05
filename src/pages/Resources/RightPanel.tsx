import React, { useEffect, useState } from 'react';
import { Grid3X3, List, Folder, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../components/Button';
import type { FileNode, FolderNode, GetFilesRequest } from '../../types/resource';
import { resourceService } from '../../services/resourceService';
import { useDispatch, useSelector } from 'react-redux';
import { 
  setFilesToShow, 
  updatePaginationState,
  addToPaginationHistory,
  removeLastFromPaginationHistory,
  resetPagination,
  resetPaginationForNewFolder
} from '../../store/resourceSlice';
import type { ApiError } from '../../types/api';
import type { RootState } from '../../store';
import GridShowingFile from './GridShowingFile';
import ListShowingFile from './ListShowingFile';
import PDFViewer from './PDFViewer';

interface RightPanelProps {
  selectedFolder: FolderNode | null,
  onSelectedFolder: (folder: FolderNode | null) => void
}

const RightPanel: React.FC<RightPanelProps> = ({ selectedFolder, onSelectedFolder }) => {
  const dispatch = useDispatch();
  const { 
    filesToShow, 
    paginationState, 
    paginationHistory 
  } = useSelector((state: RootState) => state.resource);
  
  // UI state
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [showPDFViewer, setShowPDFViewer] = useState<boolean>(false);

  // Reset pagination state when folder changes
  useEffect(() => {
    if (selectedFolder) {
      dispatch(resetPaginationForNewFolder(selectedFolder.id));
      dispatch(setFilesToShow([]));
      handleGetFilesToShow();
    } else {
      dispatch(resetPagination());
      dispatch(setFilesToShow([]));
    }
  }, [selectedFolder, dispatch]);

  const handleGetFilesToShow = async (direction?: "next" | "previous") => {
    if (!selectedFolder) {
      dispatch(setFilesToShow([]));
      return;
    }

    if (direction === "previous") {
      if (paginationHistory.length > 0) {
        dispatch(removeLastFromPaginationHistory());
        const previousState = paginationHistory[paginationHistory.length - 1];
        dispatch(setFilesToShow(previousState.files));
        dispatch(updatePaginationState({
          currentFolderId: previousState.currentFolder,
          token: previousState.pageToken,
          remainingFolders: previousState.remainingFolders,
          hasNextPage: true,
          hasPreviousPage: paginationHistory.length > 2
        }));
        return;
      }
    }

    setLoading(true);

    try {
      const requestParams: GetFilesRequest = {
        folder_id: paginationState.currentFolderId || selectedFolder.id
      };
      
      if (paginationState.token) {
        requestParams.token = paginationState.token;
      }
      if (paginationState.remainingFolders.length > 0) {
        requestParams.remaining_folders = paginationState.remainingFolders;
      }
      
      dispatch(addToPaginationHistory({
        currentFolder: requestParams.folder_id,
        pageToken: paginationState.token,
        remainingFolders: paginationState.remainingFolders,
        files: filesToShow
      }));

      const response = await resourceService.getFiles(requestParams);
      dispatch(setFilesToShow(response.files));

      dispatch(updatePaginationState({
        currentFolderId: response.state.currentFolder,
        token: response.state.nextPageToken,
        remainingFolders: response.state.remainingFolders || [],
        hasNextPage: (response.state.remainingFolders?.length || 0) > 0 && !!response.state.nextPageToken,
        hasPreviousPage: paginationHistory.length > 0
      }));
      
    } catch (error) {
      console.error('Error fetching files:', error);
      if (typeof error === 'object' && error !== null && 'message' in error) {
        const apiError = error as ApiError;
        console.error("API Error:", apiError.data?.detail || apiError.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    handleGetFilesToShow("next");
  }

  const handlePreviousPage = () => {
    handleGetFilesToShow("previous");
  };

  const handleClosePDFViewer = () => {
    setShowPDFViewer(false);
    setSelectedFile(null);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#ffffff]">
      {/* Content Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-[#ffffff] flex items-center justify-between">
        <div className="space-x-3">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="space-x-3">
          <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-2">
            <Button
              size="sm"
              className="p-2 rounded-lg"
              disabled={!paginationState.hasPreviousPage}
              onClick={handlePreviousPage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              className="p-2 rounded-lg"
              disabled={!paginationState.hasNextPage}
              onClick={handleNextPage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Breadcrumb Bar */}
      {selectedFolder && (
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-2 text-sm">
            <button
              onClick={() => onSelectedFolder(null)}
              className="text-[#3fa3f6] hover:text-[#00213e] transition-colors font-medium"
              style={{ fontFamily: 'Poppins' }}
            >
              My Drive
            </button>
            <span className="text-gray-400">/</span>
            <span 
              className="text-[#00213e] font-medium"
              style={{ fontFamily: 'Poppins' }}
            >
              {selectedFolder.name}
            </span>
          </div>
        </div>
      )}

      {/* File Display Area */}
      <div className="flex-1 p-6 overflow-auto bg-[#ffffff]">
        {loading ? (
          <div className='w-full h-full flex justify-center items-center'>
            <div className="h-10 w-10 animate-spin rounded-full border-1 border-[#00213e] border-t-transparent">
            </div>
          </div>
        ) : filesToShow.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Folder className="h-16 w-16 text-gray-300 mb-4" />
            <h3 
              className="text-lg font-medium text-[#00213e] mb-2"
              style={{ fontFamily: 'Montserrat' }}
            >
              {selectedFolder ? 'Folder is empty' : 'No files to show'}
            </h3>
            <p 
              className="text-gray-500 max-w-md"
              style={{ fontFamily: 'Poppins' }}
            >
              {selectedFolder 
                ? 'Drag files here or use the upload button to add files.'
                : 'Select a folder to view its contents.'
              }
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {filesToShow.map((file) => (
              <GridShowingFile 
                key={file.id} 
                file={file} 
                onSelectedFile={setSelectedFile}
                onShowPDFViewer={setShowPDFViewer} 
              />
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {filesToShow.map((file) => (
              <ListShowingFile 
                key={file.id} 
                file={file} 
                onSelectedFile={setSelectedFile} 
                onShowPDFViewer={setShowPDFViewer} 
              />
            ))}
          </div>
        )}
      </div>

      {selectedFile && showPDFViewer && (
        <PDFViewer file={selectedFile} onClose={handleClosePDFViewer} />
      )}
    </div>
  )
}

export default RightPanel;