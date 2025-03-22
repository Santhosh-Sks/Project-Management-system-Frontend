import axios from "axios";
import { Project } from "@/lib/types";

const API_URL = "http://localhost:8080/api"; // Updated API URL

export const fetchUserProjects = async () => {
  try {
    const token = localStorage.getItem("token"); // Retrieve JWT from storage
    const response = await fetch(`${API_URL}/projects`, {
      headers: {
        "Authorization": `Bearer ${token}`, 
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Fetched Data:", data);

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
};


// Get a single project by ID
export const fetchProjectById = async (id: string) => {
  const response = await axios.get(`${API_URL}/projects/${id}`);
  return response.data;
};

// Create a new project
export const createProject = async (projectData: Partial<Project>) => {
  try {
    const response = await axios.post(`${API_URL}/projects`, projectData);
    return response.data;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
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
