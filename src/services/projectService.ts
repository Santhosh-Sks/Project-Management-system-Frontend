
import axios from "axios";
import { Project } from "@/lib/types";

const API_URL = "/api";

// Get all projects for the current user
export const fetchUserProjects = async () => {
  const response = await axios.get(`${API_URL}/projects`);
  return response.data;
};

// Get a single project by ID
export const fetchProjectById = async (id: string) => {
  const response = await axios.get(`${API_URL}/projects/${id}`);
  return response.data;
};

// Create a new project
export const createProject = async (projectData: Partial<Project>) => {
  const response = await axios.post(`${API_URL}/projects`, projectData);
  return response.data;
};

// Update a project
export const updateProject = async (id: string, projectData: Partial<Project>) => {
  const response = await axios.put(`${API_URL}/projects/${id}`, projectData);
  return response.data;
};

// Delete a project
export const deleteProject = async (id: string) => {
  const response = await axios.delete(`${API_URL}/projects/${id}`);
  return response.data;
};

// Invite a member to a project
export const inviteTeamMember = async (projectId: string, emails: string[], role: string) => {
  const response = await axios.post(`${API_URL}/projects/${projectId}/invites`, { emails, role });
  return response.data;
};
