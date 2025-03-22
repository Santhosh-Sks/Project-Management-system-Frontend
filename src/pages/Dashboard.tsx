
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { PageContainer } from '@/components/layout/PageContainer';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { CreateProjectDialog } from '@/components/projects/CreateProjectDialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  ChevronDownIcon, 
  SearchIcon 
} from 'lucide-react';
import { Project } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { fetchUserProjects, createProject } from '@/services/projectService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user's projects
  const { 
    data: projects = [], 
    isLoading,
    error 
  } = useQuery({
    queryKey: ['userProjects'],
    queryFn: fetchUserProjects
  });

  // Create a new project
  const createProjectMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProjects'] });
      setIsCreating(false);
      toast({
        title: "Project Created!",
        description: "Your new project has been created successfully.",
      });
    },
    onError: (error: any) => {
      setIsCreating(false);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create project.",
        variant: "destructive",
      });
    },
  });

  const handleCreateProject = (projectData: any) => {
    setIsCreating(true);
    createProjectMutation.mutate(projectData);
  };

  // Filter projects based on search query and status filter
  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const mockUser = {
    name: 'John Doe',
    email: 'john@example.com',
  };

  return (
    <>
      <Navbar user={mockUser} />
      <PageContainer>
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
              <p className="text-muted-foreground mt-1">
                Manage and collaborate on all your projects
              </p>
            </div>
            
            <CreateProjectDialog 
              onCreateProject={handleCreateProject}
              isCreating={isCreating}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative w-full sm:w-auto flex-1 max-w-sm">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex gap-2 h-10">
                  Status: {statusFilter === 'all' ? 'All' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                  <ChevronDownIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                  All
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('active')}>
                  Active
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('completed')}>
                  Completed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('on-hold')}>
                  On Hold
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('archived')}>
                  Archived
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="loader mr-2" />
              <span>Loading projects...</span>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <h3 className="text-lg font-medium text-destructive">Error loading projects</h3>
              <p className="text-muted-foreground mt-1 mb-6">
                Please try again later
              </p>
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-lg font-medium">No projects found</h3>
              <p className="text-muted-foreground mt-1 mb-6">
                {searchQuery || statusFilter !== 'all' 
                  ? "Try adjusting your search or filters" 
                  : "Create your first project to get started"}
              </p>
              
              {!searchQuery && statusFilter === 'all' && (
                <CreateProjectDialog 
                  onCreateProject={handleCreateProject}
                  isCreating={isCreating}
                  trigger={
                    <Button>Create your first project</Button>
                  }
                />
              )}
            </div>
          )}
        </div>
      </PageContainer>
    </>
  );
};

export default Dashboard;
