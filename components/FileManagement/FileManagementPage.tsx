'use client';

import React from 'react';
import { FileManagement } from '../shared/FileManagement';
import { Header } from '../shared/Header';
import { Sidebar } from '../shared/Sidebar';

interface FileManagementPageProps {
  userCreatedAt: Date;
}

export const FileManagementPage: React.FC<FileManagementPageProps> = ({ userCreatedAt }) => {
  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar />
      <div className="flex-1 ml-[312px]">
        <Header userCreatedAt={userCreatedAt} showNav={true} />
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6 text-neutral-950">File Management</h1>
          <FileManagement />
        </main>
      </div>
    </div>
  );
}; 