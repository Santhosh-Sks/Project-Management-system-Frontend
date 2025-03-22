
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusIcon, X } from 'lucide-react';
import { cn } from "@/lib/utils";

interface CreateProjectDialogProps {
  onCreateProject: (projectData: any) => void;
  isCreating?: boolean;
  trigger?: React.ReactNode;
}

export const CreateProjectDialog: React.FC<CreateProjectDialogProps> = ({ 
  onCreateProject, 
  isCreating = false,
  trigger
}) => {
  const [open, setOpen] = useState(false);
  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    techStack: [''],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProjectData({ ...projectData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleTechChange = (index: number, value: string) => {
    const newTechStack = [...projectData.techStack];
    newTechStack[index] = value;
    setProjectData({ ...projectData, techStack: newTechStack });
  };

  const addTechField = () => {
    setProjectData({
      ...projectData,
      techStack: [...projectData.techStack, ''],
    });
  };

  const removeTechField = (index: number) => {
    const newTechStack = [...projectData.techStack];
    newTechStack.splice(index, 1);
    setProjectData({ ...projectData, techStack: newTechStack });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!projectData.name.trim()) {
      newErrors.name = 'Project name is required';
    }
    
    if (!projectData.description.trim()) {
      newErrors.description = 'Project description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Filter out empty tech stack entries
      const filteredTechStack = projectData.techStack.filter(tech => tech.trim() !== '');
      
      onCreateProject({
        ...projectData,
        techStack: filteredTechStack,
      });
    }
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      // Reset form state when dialog is closed
      setProjectData({
        name: '',
        description: '',
        techStack: [''],
      });
      setErrors({});
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <PlusIcon className="h-4 w-4" />
            <span>New Project</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] animate-scale-in">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new project. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Project Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={projectData.name}
                onChange={handleChange}
                placeholder="Enter project name"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                value={projectData.description}
                onChange={handleChange}
                placeholder="Brief description of your project"
                className={cn(
                  "min-h-20",
                  errors.description ? "border-destructive" : ""
                )}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Tech Stack</Label>
              
              {projectData.techStack.map((tech, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-2 mt-2 mb-2 first:mt-0"
                >
                  <Input
                    value={tech}
                    onChange={(e) => handleTechChange(index, e.target.value)}
                    placeholder="e.g., React, Node.js, MongoDB"
                  />
                  {projectData.techStack.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTechField(index)}
                      className="flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTechField}
                className="mt-2"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Technology
              </Button>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="submit" 
              disabled={isCreating}
            >
              {isCreating ? (
                <>
                  <div className="loader mr-2" />
                  Creating...
                </>
              ) : (
                'Create Project'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
