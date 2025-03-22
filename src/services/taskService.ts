
import axios from "axios";
import { Task } from "@/lib/types";

const API_URL = "/api";

// Get all tasks for a project
export const fetchProjectTasks = async (projectId: string) => {
  const response = await axios.get(`${API_URL}/projects/${projectId}/tasks`);
  return response.data;
};

// Get a single task by ID
export const fetchTaskById = async (projectId: string, taskId: string) => {
  const response = await axios.get(`${API_URL}/projects/${projectId}/tasks/${taskId}`);
  return response.data;
};

// Create a new task
export const createTask = async (projectId: string, taskData: Partial<Task>) => {
  const response = await axios.post(`${API_URL}/projects/${projectId}/tasks`, taskData);
  return response.data;
};

// Update a task
export const updateTask = async (projectId: string, taskId: string, taskData: Partial<Task>) => {
  const response = await axios.put(`${API_URL}/projects/${projectId}/tasks/${taskId}`, taskData);
  return response.data;
};

// Delete a task
export const deleteTask = async (projectId: string, taskId: string) => {
  const response = await axios.delete(`${API_URL}/projects/${projectId}/tasks/${taskId}`);
  return response.data;
};

// Assign a task to a team member
export const assignTask = async (projectId: string, taskId: string, userId: string) => {
  const response = await axios.put(`${API_URL}/projects/${projectId}/tasks/${taskId}/assign`, { userId });
  return response.data;
};
