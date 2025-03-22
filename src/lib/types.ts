
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export type UserRole = 'admin' | 'manager' | 'member';

export interface TeamMember extends User {
  role: UserRole;
}

export type ProjectStatus = 'active' | 'completed' | 'on-hold' | 'archived';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  techStack: string[];
  createdAt: string;
  members: TeamMember[];
}

export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignee?: TeamMember;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
}

export interface Comment {
  id: string;
  text: string;
  author: User;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: User;
  timestamp: string;
}

export interface Invitation {
  id: string;
  projectId: string;
  projectName: string;
  invitedBy: User;
  invitedEmail: string;
  role: UserRole;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}
