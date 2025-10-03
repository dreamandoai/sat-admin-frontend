import React from 'react';
import type { FileNode } from '../../types/resource';
import { getFileIcon } from './DriveStyleRow';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/DropdownMenu';
import { Button } from '../../components/Button';
import { MoreVertical, Eye, Download } from 'lucide-react';
import { formatFileSize } from '../../utils/formatters';

interface GridShowingFileProps {
  file: FileNode,
  onSelectedFile: (file: FileNode | null) => void
  onShowPDFViewer: (show: boolean) => void
}

const GridShowingFile: React.FC<GridShowingFileProps> = ({ file, onSelectedFile, onShowPDFViewer }) => {
  
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
    <div className="group cursor-pointer p-4 rounded-lg border border-gray-200 hover:border-[#3fa3f6] hover:shadow-md transition-all duration-200 bg-[#ffffff]">
      <div className="flex flex-col">
        <div className='flex items-center justify-between mb-3'>
          <div className="bg-gray-50 rounded-lg group-hover:bg-[#b2dafb]/20 transition-colors">
            {getFileIcon(file.fileType)}
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
        <h4 className="font-medium text-[#00213e] text-sm mb-1 line-clamp-2 group-hover:text-[#3fa3f6] transition-colors">
          {file.name}
        </h4>
        <div className="text-xs text-gray-500 space-y-1">
          {file.size && <p>{formatFileSize(file.size)}</p>}
          {file.uploadedDate && (
            <p>{new Date(file.uploadedDate).toLocaleDateString()}</p>
          )}
        </div>
        
      </div>
    </div>
  )
}

export default GridShowingFile;
