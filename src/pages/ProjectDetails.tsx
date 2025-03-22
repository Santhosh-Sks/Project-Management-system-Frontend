import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { PageContainer } from "@/components/layout/PageContainer";
import { Project, Task } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { InviteTeamDialog } from "@/components/projects/InviteTeamDialog";
import { CreateTaskDialog } from "@/components/tasks/CreateTaskDialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import components
import { ProjectHeader } from "@/components/projects/ProjectHeader";
import { ProjectTasks } from "@/components/projects/ProjectTasks";
import { ProjectMembers } from "@/components/projects/ProjectMembers";
import { ProjectChat } from "@/components/projects/ProjectChat";
import { ProjectFiles } from "@/components/projects/ProjectFiles";

// Import services
import { fetchProjectById } from "@/services/projectService";
import { fetchProjectTasks, createTask } from "@/services/taskService";
import { fetchTaskComments, createComment } from "@/services/commentService";
import { fetchProjectChat, sendChatMessage } from "@/services/chatService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newComment, setNewComment] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const { toast } = useToast();
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const queryClient = useQueryClient();

  // ✅ Fetch user details safely from localStorage
  const user = useMemo(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        return {
          name: parsedUser.name || "Guest",
          email: parsedUser.email || "",
        };
      }
    } catch (error) {
      console.error("Error parsing user from localStorage", error);
    }
    return { name: "Guest", email: "" };
  }, []);

  // Fetch project details
  const {
    data: project,
    isLoading: isProjectLoading,
    error: projectError,
  } = useQuery({
    queryKey: ["project", id],
    queryFn: () => fetchProjectById(id || ""),
    enabled: !!id,
  });

  // Fetch project tasks
  const {
    data: tasks = [],
    isLoading: isTasksLoading,
  } = useQuery({
    queryKey: ["projectTasks", id],
    queryFn: () => fetchProjectTasks(id || ""),
    enabled: !!id,
  });

  // Fetch chat messages
  const {
    data: chatMessages = [],
    isLoading: isChatLoading,
  } = useQuery({
    queryKey: ["projectChat", id],
    queryFn: () => fetchProjectChat(id || ""),
    enabled: !!id,
  });

  // Fetch comments for the selected task
  const {
    data: comments = {},
    isLoading: isCommentsLoading,
  } = useQuery({
    queryKey: ["taskComments", id, selectedTask?.id],
    queryFn: () => fetchTaskComments(id || "", selectedTask?.id || ""),
    enabled: !!id && !!selectedTask?.id,
    select: (data) => ({ [selectedTask?.id || ""]: data }),
  });

  // Create a new task
  const createTaskMutation = useMutation({
    mutationFn: (taskData: Partial<Task>) => createTask(id || "", taskData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectTasks", id] });
      toast({ title: "Task Created", description: "Task added successfully." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.response?.data?.message || "Failed to create task.", variant: "destructive" });
    },
  });

  // Add a comment to a task
  const addCommentMutation = useMutation({
    mutationFn: () => createComment(id || "", selectedTask?.id || "", newComment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taskComments", id, selectedTask?.id] });
      setNewComment("");
      toast({ title: "Comment Added", description: "Comment posted successfully." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.response?.data?.message || "Failed to add comment.", variant: "destructive" });
    },
  });

  // Send a chat message
  const sendChatMutation = useMutation({
    mutationFn: () => sendChatMessage(id || "", newMessage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectChat", id] });
      setNewMessage("");
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.response?.data?.message || "Failed to send message.", variant: "destructive" });
    },
  });

  // Handle task selection
  const handleTaskClick = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId) || null;
    setSelectedTask(task);
  };

  // Loading state
  const isLoading = isProjectLoading || isTasksLoading || isChatLoading;

  if (isLoading) {
    return (
      <>
        <Navbar user={user} />
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
        <Navbar user={user} />
        <PageContainer className="flex justify-center items-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
            <p className="text-muted-foreground mb-6">This project doesn't exist or you don't have access.</p>
            <Button asChild><a href="/dashboard">Back to Dashboard</a></Button>
          </div>
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <Navbar user={user} />
      <PageContainer>
        <div className="mb-8">
          <div className="flex flex-col space-y-6">
            <ProjectHeader project={project} onInviteClick={() => setShowInviteDialog(true)} />

            {/* Tabs for different sections */}
            <Tabs defaultValue="tasks" className="mt-6">
              <TabsList>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
              </TabsList>

              <TabsContent value="tasks">
                <ProjectTasks 
                  tasks={tasks} 
                  comments={comments} 
                  onTaskClick={handleTaskClick} 
                  onAddTask={() => createTaskMutation.mutate({ title: "New Task" })} 
                  selectedTask={selectedTask} 
                  newComment={newComment} 
                  setNewComment={setNewComment} 
                  handleAddComment={() => addCommentMutation.mutate()} 
                />
              </TabsContent>
              <TabsContent value="members">
                <ProjectMembers members={project.members} onInviteClick={() => setShowInviteDialog(true)} />
              </TabsContent>
              <TabsContent value="chat">
                <ProjectChat chatMessages={chatMessages} newMessage={newMessage} setNewMessage={setNewMessage} handleSendMessage={() => sendChatMutation.mutate()} currentUserId={user.email} />
              </TabsContent>
              <TabsContent value="files">
                <ProjectFiles />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </PageContainer>
    </>
  );
};

export default ProjectDetails;
