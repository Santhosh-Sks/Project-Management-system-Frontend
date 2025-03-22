
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, CalendarIcon, UsersIcon } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/button';
import { Project } from '@/lib/types';
import { cn } from "@/lib/utils";

interface ProjectHeaderProps {
  project: Project;
  onInviteClick: () => void;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({ 
  project,
  onInviteClick
}) => {
  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className="flex flex-col space-y-4">
      <Button
        variant="ghost"
        size="sm"
        className="w-fit -ml-2 mb-2"
        asChild
      >
        <Link to="/dashboard">
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Projects
        </Link>
      </Button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Badge className={cn("mb-2", getStatusColor(project.status))}>
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </Badge>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <p className="text-muted-foreground mt-2 max-w-3xl">
            {project.description}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mt-2 md:mt-0">
          <Button variant="outline" onClick={onInviteClick}>
            Invite Members
          </Button>
          <Button>Edit Project</Button>
        </div>
      </div>

      {/* Project stats */}
      <div className="flex flex-wrap gap-6 mt-2">
        <div className="flex items-center gap-2 text-sm">
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Created:</span>
          <span>{formatDate(project.createdAt)}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <UsersIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Team:</span>
          <span>{project.members.length} members</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-1">
        {project.techStack.map((tech) => (
          <Badge key={tech} variant="outline" className="bg-accent/50">
            {tech}
          </Badge>
        ))}
      </div>
    </div>
  );
};
