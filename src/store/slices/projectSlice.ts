
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Project } from '@/lib/types';

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,
};

export const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProjects: (state, action) => {
      state.projects = action.payload;
    },
    setCurrentProject: (state, action) => {
      state.currentProject = action.payload;
    },
    addProject: (state, action) => {
      state.projects.push(action.payload);
    },
    updateProject: (state, action) => {
      const index = state.projects.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.projects[index] = action.payload;
      }
    },
    removeProject: (state, action) => {
      state.projects = state.projects.filter(p => p.id !== action.payload);
    },
  },
});

export const { 
  setProjects, 
  setCurrentProject, 
  addProject, 
  updateProject, 
  removeProject 
} = projectSlice.actions;
export default projectSlice.reducer;
