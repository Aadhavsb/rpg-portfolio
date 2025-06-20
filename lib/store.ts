import { create } from 'zustand';
import { Project, GameState } from '@/lib/types';
import portfolioData from '@/data/portfolio.json';

interface GameStore extends GameState {
  projects: Project[];
  currentProject: Project | null;
  terminalHistory: string[];
  
  // Actions
  unlockProject: (projectId: string) => void;
  completeProject: (projectId: string) => void;
  setCurrentProject: (project: Project | null) => void;
  addTerminalEntry: (entry: string) => void;
  clearTerminal: () => void;
  resetGame: () => void;
  getNextAvailableProject: () => Project | null;
  getAllProjectsCompleted: () => boolean;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  currentStage: 'hub',
  unlockedProjects: [],
  completedProjects: [],
  availableCommands: [],
  autoProgressEnabled: true,
  idleTimer: 0,
  projects: portfolioData.projects as Project[],
  currentProject: null,
  terminalHistory: ['Welcome to Aadhav\'s RPG Portfolio!', 'Type commands or click options to explore...'],

  // Actions
  unlockProject: (projectId: string) => {
    set((state) => ({
      unlockedProjects: [...state.unlockedProjects, projectId],
      projects: state.projects.map(p => 
        p.id === projectId ? { ...p, unlocked: true } : p
      )
    }));
  },

  completeProject: (projectId: string) => {
    set((state) => ({
      completedProjects: [...state.completedProjects, projectId],
      projects: state.projects.map(p => 
        p.id === projectId ? { ...p, completed: true } : p
      )
    }));
  },

  setCurrentProject: (project: Project | null) => {
    set({ currentProject: project });
  },

  addTerminalEntry: (entry: string) => {
    set((state) => ({
      terminalHistory: [...state.terminalHistory, entry]
    }));
  },

  clearTerminal: () => {
    set({ terminalHistory: [] });
  },

  resetGame: () => {
    set({
      currentStage: 'hub',
      unlockedProjects: [],
      completedProjects: [],
      availableCommands: [],
      currentProject: null,
      projects: portfolioData.projects.map(p => ({ ...p, unlocked: false, completed: false })),
      terminalHistory: ['Welcome to Aadhav\'s RPG Portfolio!', 'Type commands or click options to explore...']
    });
  },

  getNextAvailableProject: () => {
    const state = get();
    return state.projects.find(p => !state.unlockedProjects.includes(p.id)) || null;
  },

  getAllProjectsCompleted: () => {
    const state = get();
    return state.projects.every(p => state.completedProjects.includes(p.id));
  }
}));
