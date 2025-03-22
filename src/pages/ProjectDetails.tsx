
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { PageContainer } from '@/components/layout/PageContainer';
import { Project, Task, TaskStatus, ChatMessage, Comment } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { InviteTeamDialog } from '@/components/projects/InviteTeamDialog';
import { CreateTaskDialog } from '@/components/tasks/CreateTaskDialog';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

// Import our components
import { ProjectHeader } from '@/components/projects/ProjectHeader';
import { ProjectTasks } from '@/components/projects/ProjectTasks';
import { ProjectMembers } from '@/components/projects/ProjectMembers';
import { ProjectChat } from '@/components/projects/ProjectChat';
import { ProjectFiles } from '@/components/projects/ProjectFiles';

// Import services
import { fetchProjectById } from '@/services/projectService';
import { fetchProjectTasks, createTask, assignTask } from '@/services/taskService';
import { fetchTaskComments, createComment } from '@/services/commentService';
import { fetchProjectChat, sendChatMessage } from '@/services/chatService';
import { inviteTeamMember } from '@/services/projectService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newComment, setNewComment] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get project data
  const {
    data: project,
    isLoading: isProjectLoading,
    error: projectError
  } = useQuery({
    queryKey: ['project', id],
    queryFn: () => fetchProjectById(id || ''),
    enabled: !!id,
  });

  // Get tasks for this project
  const {
    data: tasks = [],
    isLoading: isTasksLoading,
  } = useQuery({
    queryKey: ['projectTasks', id],
    queryFn: () => fetchProjectTasks(id || ''),
    enabled: !!id,
  });

  // Get chat messages for this project
  const {
    data: chatMessages = [],
    isLoading: isChatLoading,
  } = useQuery({
    queryKey: ['projectChat', id],
    queryFn: () => fetchProjectChat(id || ''),
    enabled: !!id,
  });

  // Get comments for the selected task
  const {
    data: comments = {},
    isLoading: isCommentsLoading,
  } = useQuery({
    queryKey: ['taskComments', id, selectedTask?.id],
    queryFn: () => fetchTaskComments(id || '', selectedTask?.id || ''),
    enabled: !!id && !!selectedTask?.id,
    select: (data) => {
      // Transform the array of comments into an object keyed by task ID
      return { [selectedTask?.id || '']: data };
    },
  });

  // Create a new task
  const createTaskMutation = useMutation({
    mutationFn: (taskData: Partial<Task>) => createTask(id || '', taskData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectTasks', id] });
      toast({
        title: "Task Created",
        description: "Your task has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create task.",
        variant: "destructive",
      });
    },
  });

  // Add a comment to a task
  const addCommentMutation = useMutation({
    mutationFn: () => createComment(id || '', selectedTask?.id || '', newComment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskComments', id, selectedTask?.id] });
      setNewComment('');
      toast({
        title: "Comment Added",
        description: "Your comment has been added successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add comment.",
        variant: "destructive",
      });
    },
  });

  // Send a chat message
  const sendChatMutation = useMutation({
    mutationFn: () => sendChatMessage(id || '', newMessage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectChat', id] });
      setNewMessage('');
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to send message.",
        variant: "destructive",
      });
    },
  });

  // Invite team members
  const inviteTeamMutation = useMutation({
    mutationFn: ({ emails, role }: { emails: string[], role: string }) => 
      inviteTeamMember(id || '', emails, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] });
      toast({
        title: "Invitations Sent",
        description: "Team invitations have been sent successfully.",
      });
      setShowInviteDialog(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to send invitations.",
        variant: "destructive",
      });
    },
  });

  const handleTaskClick = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId) || null;
    setSelectedTask(task);
  };

  const handleAddTask = () => {
    setShowCreateTask(true);
  };

  const handleCreateTask = (taskData: Partial<Task>) => {
    createTaskMutation.mutate(taskData);
    setShowCreateTask(false);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    sendChatMutation.mutate();
  };

  const handleAddComment = () => {
    if (!selectedTask || !newComment.trim()) return;
    addCommentMutation.mutate();
  };

  const handleInviteTeam = (emails: string[], role: string) => {
    inviteTeamMutation.mutate({ emails, role });
  };

  const mockUser = {
    name: 'John Doe',
    email: 'john@example.com',
  };

  const isLoading = isProjectLoading || isTasksLoading || isChatLoading;

  if (isLoading) {
    return (
      <>
        <Navbar user={mockUser} />
        <PageContainer className="flex justify-center items-center">
          <div className="flex flex-col items-center">
            <div className="loader mb-4" />
            <p>Loading project details...</p>
          </div>
        </PageContainer>
      </>
    );
  }

  if (projectError || !project) {
    return (
      <>
        <Navbar user={mockUser} />
        <PageContainer className="flex justify-center items-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The project you're looking for doesn't exist or you don't have access to it.
            </p>
            <Button asChild>
              <a href="/dashboard">Back to Dashboard</a>
            </Button>
          </div>
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <Navbar user={mockUser} />
      <PageContainer>
        <div className="mb-8">
          <div className="flex flex-col space-y-6">
            <ProjectHeader
              project={project}
              onInviteClick={() => setShowInviteDialog(true)}
            />

            {/* Tabs for tasks, members, etc. */}
            <Tabs defaultValue="tasks" className="mt-6">
              <TabsList>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
              </TabsList>

              <TabsContent value="tasks" className="mt-6 animate-fade-in">
                <ProjectTasks
                  tasks={tasks}
                  comments={comments}
                  onTaskClick={handleTaskClick}
                  onAddTask={handleAddTask}
                  selectedTask={selectedTask}
                  newComment={newComment}
                  setNewComment={setNewComment}
                  handleAddComment={handleAddComment}
                />
              </TabsContent>

              <TabsContent value="members" className="mt-6 animate-fade-in">
                <ProjectMembers
                  members={project.members}
                  onInviteClick={() => setShowInviteDialog(true)}
                />
              </TabsContent>

              <TabsContent value="chat" className="mt-6 animate-fade-in">
                <ProjectChat
                  chatMessages={chatMessages}
                  newMessage={newMessage}
                  setNewMessage={setNewMessage}
                  handleSendMessage={handleSendMessage}
                  currentUserId="101" // Mock current user ID
                />
              </TabsContent>

              <TabsContent value="files" className="mt-6 animate-fade-in">
                <ProjectFiles />
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <CreateTaskDialog 
          open={showCreateTask}
          onOpenChange={setShowCreateTask}
          onCreateTask={handleCreateTask}
          members={project.members}
        />
        
        <InviteTeamDialog
          open={showInviteDialog}
          onOpenChange={setShowInviteDialog}
          onInvite={handleInviteTeam}
        />
      </PageContainer>
    </>
  );
};

export default ProjectDetails;
