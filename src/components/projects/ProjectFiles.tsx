
import React from 'react';
import { Button } from '@/components/ui/button';

interface ProjectFilesProps {
  // No props needed for now, but we can add them later if needed
}

export const ProjectFiles: React.FC<ProjectFilesProps> = () => {
  return (
    <div className="bg-accent/50 rounded-lg p-6 text-center">
      <h3 className="text-lg font-medium mb-2">Project Files</h3>
      <p className="text-muted-foreground mb-4">
        Upload and manage files related to this project.
      </p>
      <Button>Upload Files</Button>
    </div>
  );
};
