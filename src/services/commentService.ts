
import axios from "axios";
import { Comment } from "@/lib/types";

const API_URL = "http://localhost:8080/api"; // Add full URL


// Get all comments for a task
export const fetchTaskComments = async (projectId: string, taskId: string) => {
  const response = await axios.get(`${API_URL}/projects/${projectId}/tasks/${taskId}/comments`);
  return response.data;
};

// Create a new comment
export const createComment = async (projectId: string, taskId: string, text: string) => {
  const response = await axios.post(`${API_URL}/projects/${projectId}/tasks/${taskId}/comments`, { text });
  return response.data;
};

// Delete a comment
export const deleteComment = async (projectId: string, taskId: string, commentId: string) => {
  const response = await axios.delete(`${API_URL}/projects/${projectId}/tasks/${taskId}/comments/${commentId}`);
  return response.data;
};
