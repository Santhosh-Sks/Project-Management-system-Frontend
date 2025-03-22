import React from 'react';
import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TaskCard } from '@/components/tasks/TaskCard';
import { Task, TaskStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

interface TaskBoardProps {
  tasks: Task[] | null;
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
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  const tasksByStatus: Record<TaskStatus, Task[]> = {
    'todo': safeTasks.filter(task => task.status === 'todo'),
    'in-progress': safeTasks.filter(task => task.status === 'in-progress'),
    'done': safeTasks.filter(task => task.status === 'done'),
  };

  const columns: { id: TaskStatus; title: string }[] = [
    { id: 'todo', title: 'To Do' },
    { id: 'in-progress', title: 'In Progress' },
    { id: 'done', title: 'Done' },
  ];

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-6 w-full", className)}>
      {columns.map(column => (
        <div key={column.id} className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-sm">
              {column.title} ({tasksByStatus[column.id]?.length || 0})
            </h3>
            {onAddTask && (
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => onAddTask(column.id)}>
                <PlusIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className={cn("flex-1 rounded-lg border p-3 overflow-y-auto")}> 
            {tasksByStatus[column.id]?.length > 0 ? (
              tasksByStatus[column.id].map(task => (
                <TaskCard key={task.id} task={task} onClick={onTaskClick ? () => onTaskClick(task.id) : undefined} />
              ))
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm p-6">
                No tasks in this column
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
