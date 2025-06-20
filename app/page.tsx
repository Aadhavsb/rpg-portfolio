'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/store';
import { RPGHub } from '@/components/RPGHub';
import { ProjectView } from '@/components/ProjectView';
import { Terminal } from '@/components/Terminal';
import { Project } from '@/lib/types';

type ViewState = 'terminal' | 'hub' | 'project';

export default function HomePage() {
  // Start with terminal view (only terminal visible at first)
  const [currentView, setCurrentView] = useState<ViewState>('terminal');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hasStartedJourney, setHasStartedJourney] = useState(false);  const { 
    projects, 
    completeProject, 
    unlockProject,
    getNextAvailableProject
  } = useGameStore();

  // Don't auto-unlock any projects - let the player discover them through commands
  // useEffect(() => {
  //   if (unlockedProjects.length === 0) {
  //     unlockProject('palate');
  //   }
  // }, [unlockProject, unlockedProjects.length]);

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setCurrentView('project');
  };

  const handleProjectComplete = () => {
    if (selectedProject) {
      completeProject(selectedProject.id);
      
      // Auto-unlock next project
      const nextProject = getNextAvailableProject();
      if (nextProject) {
        unlockProject(nextProject.id);
      }
      
      // Return to hub
      setCurrentView('hub');
      setSelectedProject(null);
    }
  };

  const handleBackToHub = () => {
    setCurrentView('hub');
    setSelectedProject(null);
  };

  const handleStartJourney = () => {
    setHasStartedJourney(true);
    setCurrentView('hub');
  };

  const handleBackToTerminal = () => {
    setCurrentView('terminal');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-10">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), 
                             radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
                             radial-gradient(circle at 40% 80%, rgba(120, 200, 255, 0.3) 0%, transparent 50%)`
          }} 
        />
      </div>      <AnimatePresence mode="wait">
        {currentView === 'terminal' && (
          <motion.div
            key="terminal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            <Terminal 
              onBack={handleBackToTerminal}
              onStartJourney={handleStartJourney}
              showStartJourney={!hasStartedJourney}
            />
          </motion.div>
        )}

        {currentView === 'hub' && (
          <motion.div
            key="hub"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            <RPGHub 
              onProjectSelect={handleProjectSelect}
              onCommandsView={handleBackToTerminal}
            />
          </motion.div>
        )}

        {currentView === 'project' && selectedProject && (
          <motion.div
            key="project"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            <ProjectView
              project={selectedProject}
              onBack={handleBackToHub}
              onComplete={handleProjectComplete}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Indicator */}
      {projects.length === 0 && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full"
          />
        </div>
      )}
    </main>
  );
}
