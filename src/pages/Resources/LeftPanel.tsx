import React, { useState } from 'react';
import { ScrollArea } from '../../components/ScrollArea';
import DriveStyleRow from './DriveStyleRow';
import type { FolderNode } from '../../types/resource';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { resourceService } from '../../services/resourceService';
import { setFolderTreeData } from '../../store/resourceSlice';
import type { ApiError } from '../../types/api';

interface LeftPanelProps {
  nodes: FolderNode[],
  selectedFolder: FolderNode | null,
  onSelectFolder: (node: FolderNode) => void
  loading: boolean
}

const LeftPanel: React.FC<LeftPanelProps> = ({ nodes, selectedFolder, onSelectFolder, loading }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { folderTreeData } = useSelector((state: RootState) => state.resource);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set([]));
  const [loadingFolders, setLoadingFolders] = useState<Set<string>>(new Set());

  const handleNodeSelect = (node: FolderNode) => {
    onSelectFolder(node);
  }

  const updateFolderTreeRecursively = (folders: FolderNode[], nodeId: string, newChildren: FolderNode[]): FolderNode[] => {
    return folders.map(folder => {
      if (folder.id === nodeId) {
        return { ...folder, children: newChildren };
      } else if (folder.children && folder.children.length > 0) {
        return {
          ...folder,
          children: updateFolderTreeRecursively(folder.children, nodeId, newChildren)
        };
      }
      return folder;
    });
  };

  const handleToggleExpand = async (nodeId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
      setExpandedFolders(newExpanded);
      return;
    }

    if (user) {
      setLoadingFolders(prev => new Set(prev).add(nodeId));
      
      try {
        const response = await resourceService.getSubFolders(nodeId);
        const updatedFolderTree = updateFolderTreeRecursively(folderTreeData, nodeId, response);
        dispatch(setFolderTreeData(updatedFolderTree));
        newExpanded.add(nodeId);
        setExpandedFolders(newExpanded);
      } catch (error) {
        if (typeof error === 'object' && error !== null && 'message' in error) {
          const apiError = error as ApiError;
          console.log("Error: ", apiError.data.detail);
        } else {
          console.error('Error getting subfolders:', error);
        }
      } finally {
        setLoadingFolders(prev => {
          const next = new Set(prev);
          next.delete(nodeId);
          return next;
        });
      }
    }
  }

  return (
    <div className="w-[300px] h-full bg-white flex flex-col" style={{ padding: '16px 12px' }}>
      <div className="mb-3">
        <h3 className="text-[22px] font-bold text-[#00213e] mb-3" style={{ fontFamily: 'Montserrat' }}>
          Resource View
        </h3>
      </div>

      {/* Tree Structure */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-1">
            {loading ?
              <div className='flex w-full justify-center items-center'>
                <div className="h-5 w-5 animate-spin rounded-full border-1 border-[#00213e] border-t-transparent">
                </div>
              </div>: 
              nodes.map((node) => (
                <DriveStyleRow
                  key={node.id}
                  node={node}
                  depth={0}
                  isSelected={selectedFolder?.id === node.id}
                  isExpanded={expandedFolders.has(node.id)}
                  isLoading={loadingFolders.has(node.id)}
                  loadingFolders = {loadingFolders}
                  onSelect={handleNodeSelect}
                  onToggleExpand={handleToggleExpand}
                  selectedNodeId={selectedFolder?.id || null}
                  expandedFolders={expandedFolders}
                />
              ))
            }
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

export default LeftPanel;