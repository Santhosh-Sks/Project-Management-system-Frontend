
import React, { useState } from 'react';
import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TaskCard } from '@/components/tasks/TaskCard';
import { Task, TaskStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

interface TaskBoardProps {
  tasks: Task[];
  onTaskClick?: (taskId: string) => void;
  onAddTask?: (status: TaskStatus) => void;
  className?: string;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({ 
  tasks, 
  onTaskClick,
  onAddTask,
  className
}) => {
  // Group tasks by status
  const tasksByStatus: Record<TaskStatus, Task[]> = {
    'todo': tasks.filter(task => task.status === 'todo'),
    'in-progress': tasks.filter(task => task.status === 'in-progress'),
    'done': tasks.filter(task => task.status === 'done'),
  };

  const columns: { id: TaskStatus; title: string }[] = [
    { id: 'todo', title: 'To Do' },
    { id: 'in-progress', title: 'In Progress' },
    { id: 'done', title: 'Done' },
  ];

  const getColumnColor = (status: TaskStatus) => {
    switch (status) {
      case 'todo':
        return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20';
      case 'in-progress':
        return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20';
      case 'done':
        return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20';
      default:
        return 'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/20';
    }
  };

  return (
    <div 
      className={cn(
        "grid grid-cols-1 md:grid-cols-3 gap-6 w-full",
        className
      )}
    >
      {columns.map(column => (
        <div key={column.id} className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-sm">
              {column.title}{' '}
              <span className="text-muted-foreground ml-1.5">
                ({tasksByStatus[column.id].length})
              </span>
            </h3>
            
            {onAddTask && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 w-7 p-0" 
                onClick={() => onAddTask(column.id)}
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div 
            className={cn(
              "flex-1 rounded-lg border p-3 overflow-y-auto",
              getColumnColor(column.id)
            )}
          >
            <div className="space-y-3 min-h-[200px]">
              {tasksByStatus[column.id].length > 0 ? (
                tasksByStatus[column.id].map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onClick={onTaskClick ? () => onTaskClick(task.id) : undefined}
                  />
                ))
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm p-6">
                  No tasks in this column
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
