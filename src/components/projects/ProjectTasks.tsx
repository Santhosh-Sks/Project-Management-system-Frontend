import React from 'react';
import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TaskBoard } from '@/components/tasks/TaskBoard';
import { Task, Comment } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from "@/lib/utils";

interface ProjectTasksProps {
  tasks?: Task[];  // Default to an empty array
  comments?: Record<string, Comment[]>; // Default to an empty object
  onTaskClick: (taskId: string) => void;
  onAddTask: () => void;
  selectedTask: Task | null;
  newComment: string;
  setNewComment: (comment: string) => void;
  handleAddComment: () => void;
}

export const ProjectTasks: React.FC<ProjectTasksProps> = ({
  tasks = [],
  comments = {},
  onTaskClick,
  onAddTask,
  selectedTask,
  newComment,
  setNewComment,
  handleAddComment
}) => {
  
  const formatTime = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Task Board</h2>
        <Button onClick={onAddTask}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <TaskBoard
            tasks={tasks}
            onTaskClick={onTaskClick}
            onAddTask={onAddTask}
          />
        </div>

        {selectedTask && (
          <div className="bg-accent/30 p-4 rounded-lg border">
            <h3 className="font-semibold mb-2">{selectedTask.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{selectedTask.description}</p>
            
            <div className="flex items-center mb-4">
              <Badge className={cn(
                selectedTask.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                selectedTask.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
              )}>
                {selectedTask.priority}
              </Badge>
              
              <Badge className="ml-2">
                {selectedTask.status}
              </Badge>
            </div>
            
            <h4 className="text-sm font-medium mb-2">Comments</h4>
            <div className="max-h-[300px] overflow-y-auto mb-4">
            {selectedTask?.id && comments[selectedTask.id]?.length ? (
  comments[selectedTask.id].map(comment => (
    <div key={comment.id} className="mb-3 pb-3 border-b">
      <div className="flex items-center gap-2 mb-1">
        {comment.author ? (
          <Avatar className="h-6 w-6">
            {comment.author.avatar ? (
              <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
            ) : (
              <AvatarFallback>{comment.author.name?.charAt(0) || "?"}</AvatarFallback>
            )}
          </Avatar>
        ) : (
          <Avatar className="h-6 w-6">
            <AvatarFallback>?</AvatarFallback>
          </Avatar>
        )}
        <span className="text-sm font-medium">{comment.author?.name || "Unknown"}</span>
        <span className="text-xs text-muted-foreground">
          {formatTime(comment.createdAt)}
        </span>
      </div>
      <p className="text-sm">{comment.text}</p>
    </div>
  ))
) : (
  <p className="text-sm text-muted-foreground">No comments yet</p>
)}

            </div>
            
            <div className="flex gap-2">
              <Textarea 
                placeholder="Add a comment..." 
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
            <Button 
              className="mt-2" 
              disabled={!newComment.trim()}
              onClick={handleAddComment}
            >
              Add Comment
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
