import React, { useEffect, useState } from 'react'
import LeftPanel from './LeftPanel';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { setFolderTreeData } from '../../store/resourceSlice';
import type { FolderNode } from '../../types/resource';
import RightPanel from './RightPanel';
import Navbar from '../../layouts/Navbar';

const Resources: React.FC = () => {
  const dispatch = useDispatch();
  const { folderTreeData } = useSelector((state: RootState) => state.resource);
  const [selectedFolder, setSelectedFolder] = useState<FolderNode | null>(null);
  const [loading, setLoading] = useState<boolean>(false);


  const handleSelectFolder = (node: FolderNode | null) => {
    setSelectedFolder(node);
  }

  const setInitialFolderData = async () => {
    setLoading(true);
    const initialFolderData: FolderNode[] = [
      {
        "id": "1JTaIkw1JHBHh0Hc20qchKOFNYsORPce7",
        "name": "Teacher Resources",
        "type": "folder",
        "hasChildren": true
      },
      {
        "id": "1jM-TLjnsM8iWwmJy0heneQmi8lr2aap7",
        "name": "Student Resources",
        "type": "folder",
        "hasChildren": true
      }
    ]
    dispatch(setFolderTreeData(initialFolderData));
    setLoading(false);
  }

  useEffect(() => {
    setInitialFolderData();
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#ffffff]">
      <Navbar title="SAT Resources Drive" />
      <div className="flex h-[calc(100vh-4rem)]">
        <div className="border-r border-gray-200">
          <LeftPanel 
            nodes={folderTreeData}
            selectedFolder={selectedFolder} 
            onSelectFolder={handleSelectFolder}
            loading={loading}
          />
        </div>
        <RightPanel
          selectedFolder={selectedFolder}
          onSelectedFolder={handleSelectFolder}
        />
      </div>
    </div>
  )
}

export default Resources;
