
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Task, TeamMember } from '@/lib/types';

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTask: (taskData: Partial<Task>) => void;
  members: TeamMember[];
}

export const CreateTaskDialog: React.FC<CreateTaskDialogProps> = ({
  open,
  onOpenChange,
  onCreateTask,
  members,
}) => {
  const [taskData, setTaskData] = useState<Partial<Task>>({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    tags: [],
  });
  const [tag, setTag] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTaskData({ ...taskData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleStatusChange = (value: string) => {
    setTaskData({ ...taskData, status: value as Task['status'] });
  };

  const handlePriorityChange = (value: string) => {
    setTaskData({ ...taskData, priority: value as Task['priority'] });
  };

  const handleAssigneeChange = (value: string) => {
    const assignee = members.find(m => m.id === value);
    setTaskData({ ...taskData, assignee });
  };

  const handleDateChange = (date: Date | undefined) => {
    setDate(date);
    setTaskData({ 
      ...taskData, 
      dueDate: date ? date.toISOString() : undefined 
    });
  };

  const addTag = () => {
    if (tag.trim()) {
      setTaskData({
        ...taskData,
        tags: [...(taskData.tags || []), tag.trim()],
      });
      setTag('');
    }
  };

  const removeTag = (index: number) => {
    const tags = [...(taskData.tags || [])];
    tags.splice(index, 1);
    setTaskData({ ...taskData, tags });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!taskData.title?.trim()) {
      newErrors.title = 'Task title is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onCreateTask(taskData);
      // Reset form
      setTaskData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        tags: [],
      });
      setDate(undefined);
      setTag('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                Task Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                value={taskData.title}
                onChange={handleChange}
                placeholder="Enter task title"
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={taskData.description}
                onChange={handleChange}
                placeholder="Describe the task details"
                className="min-h-20"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select 
                  defaultValue={taskData.status} 
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select 
                  defaultValue={taskData.priority} 
                  onValueChange={handlePriorityChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Assignee</Label>
              <Select onValueChange={handleAssigneeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Assign to team member" />
                </SelectTrigger>
                <SelectContent>
                  {members.map(member => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select due date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="Add tag"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag}>
                  Add
                </Button>
              </div>
              
              {taskData.tags && taskData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {taskData.tags.map((tag, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-1 bg-accent px-2 py-1 rounded-full"
                    >
                      <span className="text-xs">{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="h-4 w-4 rounded-full flex items-center justify-center hover:bg-muted-foreground/20"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
