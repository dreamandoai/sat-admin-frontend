import { ChevronRight, ChevronDown, Folder, FileText } from 'lucide-react';
import type { FolderNode } from '../../types/resource';

interface DriveStyleRowProps {
  node: FolderNode
  depth: number
  isSelected: boolean
  isExpanded: boolean
  isLoading?: boolean
  onSelect: (node: FolderNode) => void
  onToggleExpand: (nodeId: string) => void
  selectedNodeId: string | null
  expandedFolders: Set<string>
  loadingFolders: Set<string>
}

export const getFileIcon = (fileType?: string) => {
  if (!fileType) return <FileText className="h-8 w-8 text-gray-500" />
  
  switch (fileType) {
    case 'pdf':
      return <FileText className="h-8 w-8 text-red-600" />
    case 'doc':
      return <FileText className="h-8 w-8 text-blue-600" />
    case 'ppt':
      return <FileText className="h-8 w-8 text-orange-600" />
    case 'txt':
      return <FileText className="h-8 w-8 text-gray-600" />
    case 'jpg':
    case 'png':
      return <FileText className="h-8 w-8 text-green-600" />
    default:
      return <FileText className="h-8 w-8 text-gray-500" />
  }
}

const DriveStyleRow: React.FC<DriveStyleRowProps> = ({ 
  node, 
  depth, 
  isSelected, 
  isExpanded,
  isLoading = false,
  onSelect, 
  onToggleExpand,
  selectedNodeId,
  expandedFolders,
  loadingFolders
}: DriveStyleRowProps) => {
  const hasChildren = node.hasChildren
  const indentWidth = depth * 16 // 16px per level as per Google Drive spec

  const handleRowClick = () => {
    onSelect(node)
  }

  const handleDisclosureClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (hasChildren) {
      onToggleExpand(node.id)
    }
  }

  return (
    <>
      {/* Main Row */}
      <div
        className={`
          group flex items-center h-10 px-2 gap-2 cursor-pointer rounded-lg transition-all duration-150
          ${isSelected 
            ? 'bg-[#feefad] font-semibold relative' 
            : 'hover:bg-[#b2dafb] font-normal'
          }
        `}
        style={{ 
          paddingLeft: `${8 + indentWidth}px`,
          fontFamily: 'Poppins',
          fontSize: '16px'
        }}
        onClick={handleRowClick}
      >
        {/* Selection indicator bar for selected state */}
        {isSelected && (
          <div 
            className="absolute left-0 top-0 bottom-0 w-1 bg-[#fcda49] rounded-r-sm"
            style={{ width: '4px' }}
          />
        )}

        {/* Disclosure Icon - Hidden if no children as per spec */}
        <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
          {hasChildren ? (
            <button
              onClick={handleDisclosureClick}
              className="p-0 border-0 bg-transparent cursor-pointer flex items-center justify-center w-4 h-4 hover:bg-gray-200 rounded transition-colors"
              aria-label={isExpanded ? 'Collapse folder' : 'Expand folder'}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="h-3 w-3 animate-spin rounded-full border-1 border-[#00213e] border-t-transparent" />
              ) : isExpanded ? (
                <ChevronDown className="h-4 w-4 text-[#00213e]" />
              ) : (
                <ChevronRight className="h-4 w-4 text-[#00213e]" />
              )}
            </button>
          ) : null}
        </div>

        {/* Folder/File Icon */}
        <div className="flex-shrink-0">
          {node.type === 'folder' ? (
            <Folder className="h-4 w-4 text-[#3fa3f6]" />
          ) : (
            getFileIcon(node.type)
          )}
        </div>

        {/* Label with proper truncation and tooltip */}
        <span 
          className={`flex-1 truncate text-[#00213e] ${isSelected ? 'font-semibold' : 'font-normal'}`}
          style={{ 
            fontFamily: 'Poppins',
            fontSize: '16px',
            fontWeight: isSelected ? 600 : 400
          }}
          title={node.name}
        >
          {node.name}
        </span>
      </div>

      {/* Children - Recursive rendering for unlimited depth */}
      {hasChildren && isExpanded && (
        <div className="folder-tree-node-expand">
          {node.children!.map((child) => (
            <DriveStyleRow
              key={child.id}
              node={child}
              depth={depth + 1} // Increment depth for proper indentation
              isSelected={selectedNodeId === child.id}
              isExpanded={expandedFolders.has(child.id)}
              isLoading={loadingFolders.has(child.id)}
              loadingFolders={loadingFolders}
              onSelect={onSelect}
              onToggleExpand={onToggleExpand}
              selectedNodeId={selectedNodeId}
              expandedFolders={expandedFolders}
            />
          ))}
        </div>
      )}
    </>
  )
}

export default DriveStyleRow;