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
    projects
  } = useGameStore();

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
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-stone-900 to-slate-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_white_1px,_transparent_0)]"
          style={{ backgroundSize: '50px 50px' }}
        />
      </div>

      <AnimatePresence mode="wait">
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
          >            <RPGHub />
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
            className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full"
          />
        </div>
      )}
    </main>
  );
}
