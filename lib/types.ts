export interface Project {
  id: string;
  title: string;
  direction: string;
  pathLabel: string;
  description: string;
  githubUrl?: string;
  demoUrl?: string;
  unlocked: boolean;
  completed: boolean;
}

export interface GameState {
  currentStage: 'hub' | 'project' | 'commands';
  unlockedProjects: string[];
  completedProjects: string[];
  availableCommands: string[];
  autoProgressEnabled: boolean;
  idleTimer: number;
}

export interface Command {
  id: string;
  command: string;
  description: string;
  unlocked: boolean;
  action: () => void;
}
