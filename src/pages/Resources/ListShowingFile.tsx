import React from 'react';
import type { FileNode } from '../../types/resource';
import { getFileIcon } from './DriveStyleRow';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/DropdownMenu';
import { Button } from '../../components/Button';
import { MoreVertical, Eye, Download } from 'lucide-react';
import { formatFileSize } from '../../utils/formatters';

interface ListShowingFileProps {
  file: FileNode,
  onSelectedFile: (file: FileNode | null) => void
  onShowPDFViewer: (show: boolean) => void
}

const GridShowingFile: React.FC<ListShowingFileProps> = ({ file, onSelectedFile, onShowPDFViewer }) => {
  
  const handleFileOpen = (file: FileNode) => {
    onSelectedFile(file);
    if (file.fileType === 'pdf') {
      onShowPDFViewer(true);
    }
  }

  const handleDownload = (file: FileNode) => {
    const link = document.createElement('a');
    link.href = file.downloadLink;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="group flex items-center px-4 py-3 rounded-lg hover:bg-[#b2dafb]/20 cursor-pointer transition-colors border border-transparent hover:border-[#3fa3f6]/30">
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <div className="flex-shrink-0">
          {getFileIcon(file.fileType)}
        </div>
        <div className="min-w-0 flex-1">
          <h4 
            className="font-medium text-[#00213e] truncate group-hover:text-[#3fa3f6] transition-colors"
            style={{ fontFamily: 'Poppins' }}
          >
            {file.name}
          </h4>
          <div 
            className="flex items-center space-x-3 text-sm text-gray-500"
            style={{ fontFamily: 'Poppins' }}
          >
            {file.uploadedDate && (
              <span>Modified {new Date(file.uploadedDate).toLocaleDateString()}</span>
            )}
            {file.size && (
              <span>{formatFileSize(file.size)}</span>
            )}
          </div>
        </div>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg hover:bg-[#b2dafb]/30"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="rounded-lg">
          <DropdownMenuItem onClick={() => handleFileOpen(file)}>
            <Eye className="h-4 w-4 mr-2" />
            Open
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDownload(file)}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default GridShowingFile;
