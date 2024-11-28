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
          <div className="capabilities-section">
            <h2 className="text-2xl font-bold mb-4 text-black">Capabilities and Past Performance</h2>
            <p className="body-text-slim">
              Upload files showcasing your company’s capabilities and past work to help Skim find new opportunities.
              Don’t have them? Skim AI can guide you through the proposal process with ease.
            </p>
          </div>
          <FileManagement />
        </main>
      </div>
    </div>
  );
}; 