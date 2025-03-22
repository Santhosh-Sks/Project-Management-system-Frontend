import React from 'react';
import { CalendarIcon, ChevronRightIcon, UserIcon } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Task } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  className?: string;
}

export const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onClick,
  className,
}) => {
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No due date';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div 
      className={cn(
        "task-card group hover:border-primary/50",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">
          {task.title}
        </h4>
        {task.priority && (
          <Badge 
            className={cn(
              "px-2 text-xs font-normal",
              getPriorityColor(task.priority)
            )}
          >
            {task.priority}
          </Badge>
        )}
      </div>
      
      {task.description && (
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {task.description}
        </p>
      )}
      
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-4">
          {task.assignee ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      {task.assignee.avatar ? (
                        <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                      ) : (
                        <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
                      )}
                    </Avatar>
                    <span className="text-xs text-muted-foreground">
                      {task.assignee.name}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Assigned to {task.assignee.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <UserIcon className="h-3 w-3" />
              <span>Unassigned</span>
            </div>
          )}
          
          {task.dueDate && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarIcon className="h-3 w-3" />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          )}
        </div>

        {onClick && (
          <ChevronRightIcon 
            className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" 
          />
        )}
      </div>

      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t">
          {task.tags.map((tag, index) => (
            <Badge
              key={index}
              variant="outline"
              className="text-xs bg-secondary/50"
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
