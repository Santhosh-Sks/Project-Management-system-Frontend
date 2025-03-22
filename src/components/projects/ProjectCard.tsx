
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CalendarIcon,
  ChevronRightIcon,
  Users2Icon 
} from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { Project } from '@/lib/types';

interface ProjectCardProps {
  project: Project;
  className?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, className }) => {
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
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <Link to={`/projects/${project.id}`}>
      <Card 
        className={cn(
          "h-full overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer group",
          className
        )}
      >
        <CardHeader className="p-4 pb-0">
          <div className="flex justify-between items-start">
            <div>
              <Badge className={cn("mb-2 font-normal", getStatusColor(project.status))}>
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </Badge>
              <h3 className="text-lg font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                {project.name}
              </h3>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 pt-2">
          <p className="text-muted-foreground text-sm line-clamp-2 mb-3 h-10">
            {project.description}
          </p>
          
          <div className="flex flex-wrap gap-1 mt-1">
            {project.techStack.slice(0, 3).map((tech) => (
              <Badge 
                key={tech} 
                variant="outline" 
                className="bg-accent/50 text-xs py-0 px-2"
              >
                {tech}
              </Badge>
            ))}
            {project.techStack.length > 3 && (
              <Badge 
                variant="outline" 
                className="bg-accent/50 text-xs py-0 px-2"
              >
                +{project.techStack.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 border-t flex justify-between items-center gap-2">
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <CalendarIcon className="h-3.5 w-3.5" />
            <span>{formatDate(project.createdAt)}</span>
          </div>
          
          <div className="flex items-center justify-end gap-2">
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <Users2Icon className="h-3.5 w-3.5" />
              <span>{project.members.length}</span>
            </div>
            
            <ChevronRightIcon 
              className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" 
            />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};
