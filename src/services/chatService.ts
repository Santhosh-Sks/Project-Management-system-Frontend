
import axios from "axios";
import { ChatMessage } from "@/lib/types";

const API_URL = "/api";

// Get all chat messages for a project
export const fetchProjectChat = async (projectId: string) => {
  const response = await axios.get(`${API_URL}/projects/${projectId}/chat`);
  return response.data;
};

// Send a new chat message
export const sendChatMessage = async (projectId: string, text: string) => {
  const response = await axios.post(`${API_URL}/projects/${projectId}/chat`, { text });
  return response.data;
};
