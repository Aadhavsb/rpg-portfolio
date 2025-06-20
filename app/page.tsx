'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/store';
import { Project } from '@/lib/types';
import { RPGHub } from '@/components/RPGHub';
import { ProjectView } from '@/components/ProjectView';
import { TerminalComponent } from '@/components/Terminal';
import portfolioData from '@/data/portfolio.json';

export default function Home() {
  const [currentView, setCurrentView] = useState<'hub' | 'project' | 'terminal'>('hub');
  const [showTerminal, setShowTerminal] = useState(false);
  const [availableCommands, setAvailableCommands] = useState<string[]>([]);
  const [idleTimer, setIdleTimer] = useState(0);
  
  const {
    projects,
    currentProject,
    setCurrentProject,
    unlockProject,
    completeProject,
    addTerminalEntry,
    getNextAvailableProject,
    getAllProjectsCompleted,
    unlockedProjects,
    completedProjects
  } = useGameStore();

  // Initialize first project
  useEffect(() => {
    if (unlockedProjects.length === 0) {
      const firstProject = projects[0];
      if (firstProject) {
        unlockProject(firstProject.id);
        setAvailableCommands([firstProject.direction]);
      }
    }
  }, [projects, unlockedProjects, unlockProject]);

  // Auto-progression logic
  useEffect(() => {
    if (!showTerminal) return;

    const timer = setInterval(() => {
      setIdleTimer(prev => {
        if (prev >= 30) { // 30 seconds idle
          handleAutoProgress();
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showTerminal, availableCommands]);

  const handleAutoProgress = () => {
    if (availableCommands.length > 0) {
      const nextCommand = availableCommands[0];
      addTerminalEntry(`[Auto-progression] > ${nextCommand}`);
      handleCommand(nextCommand.toLowerCase());
    }
  };

  const handleCommand = (command: string) => {
    setIdleTimer(0); // Reset idle timer
    
    // Handle project navigation commands
    const projectCommand = projects.find(p => 
      p.direction.toLowerCase() === command && unlockedProjects.includes(p.id)
    );
    
    if (projectCommand) {
      setCurrentProject(projectCommand);
      setCurrentView('project');
      addTerminalEntry(`Exploring ${projectCommand.title}...`);
      setAvailableCommands([]);
      return;
    }

    // Handle special commands
    switch (command) {
      case 'check inventory':
        if (getAllProjectsCompleted()) {
          displayInventory();
        } else {
          addTerminalEntry('Command locked. Complete all projects first.');
        }
        break;
        
      case 'consult the scrolls':
        if (getAllProjectsCompleted()) {
          displayResearch();
        } else {
          addTerminalEntry('Command locked. Complete all projects first.');
        }
        break;
        
      case 'display beacon':
        if (getAllProjectsCompleted()) {
          displayContact();
        } else {
          addTerminalEntry('Command locked. Complete all projects first.');
        }
        break;
        
      case 'get apprenticeship':
        if (getAllProjectsCompleted()) {
          displayResume();
        } else {
          addTerminalEntry('Command locked. Complete all projects first.');
        }
        break;
        
      case 'help':
        displayHelp();
        break;
        
      case 'clear':
        // Clear functionality would be handled by the terminal component
        break;
        
      default:
        addTerminalEntry(`Unknown command: ${command}`);
        addTerminalEntry('Type "help" for available commands.');
    }
  };

  const displayInventory = () => {
    addTerminalEntry('=== INVENTORY: ACQUIRED SKILLS ===');
    portfolioData.skills.forEach(skill => {
      addTerminalEntry(`${skill.icon} ${skill.name} (${skill.category})`);
    });
  };

  const displayResearch = () => {
    addTerminalEntry('=== RESEARCH SCROLLS ===');
    addTerminalEntry(portfolioData.research.title);
    addTerminalEntry(portfolioData.research.description);
    addTerminalEntry(`Project: ${portfolioData.research.project}`);
    addTerminalEntry(`GitHub: ${portfolioData.research.githubUrl}`);
  };

  const displayContact = () => {
    addTerminalEntry('=== BEACON SIGNAL TRANSMITTED ===');
    addTerminalEntry(`📧 Email: ${portfolioData.contact.email}`);
    addTerminalEntry(`🐙 GitHub: ${portfolioData.contact.github}`);
    addTerminalEntry(`💼 LinkedIn: ${portfolioData.contact.linkedin}`);
  };

  const displayResume = () => {
    addTerminalEntry('=== APPRENTICESHIP SCROLL ===');
    addTerminalEntry('Resume: [Link to be added]');
    addTerminalEntry('Opening resume in new window...');
  };

  const displayHelp = () => {
    addTerminalEntry('=== AVAILABLE COMMANDS ===');
    addTerminalEntry('Navigation: go north, go east, go south, go west, go northeast');
    if (getAllProjectsCompleted()) {
      addTerminalEntry('Special: check inventory, consult the scrolls, display beacon, get apprenticeship');
    }
    addTerminalEntry('Utility: help, clear');
  };

  const handleProjectSelect = (project: Project) => {
    setCurrentProject(project);
    setCurrentView('project');
  };

  const handleProjectComplete = () => {
    if (currentProject) {
      completeProject(currentProject.id);
      addTerminalEntry(`${currentProject.title} completed!`);
      
      // Unlock next project
      const nextProject = getNextAvailableProject();
      if (nextProject) {
        unlockProject(nextProject.id);
        setAvailableCommands([nextProject.direction]);
        addTerminalEntry(`New path unlocked: ${nextProject.direction}`);
      } else if (getAllProjectsCompleted()) {
        // All projects completed, unlock special commands
        setAvailableCommands([
          'check inventory',
          'consult the scrolls', 
          'display beacon',
          'get apprenticeship'
        ]);
        addTerminalEntry('All projects completed! Special commands unlocked.');
      }
      
      setCurrentView('hub');
      setCurrentProject(null);
    }
  };

  const handleBackToHub = () => {
    setCurrentView('hub');
    setCurrentProject(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {currentView === 'hub' && (
            <RPGHub
              key="hub"
              onProjectSelect={handleProjectSelect}
            />
          )}
          
          {currentView === 'project' && currentProject && (
            <ProjectView
              key="project"
              project={currentProject}
              onBack={handleBackToHub}
              onComplete={handleProjectComplete}
            />
          )}
        </AnimatePresence>
        
        {/* Terminal Overlay */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20">
          {!showTerminal ? (
            <button
              onClick={() => setShowTerminal(true)}
              className="px-6 py-3 bg-black/50 backdrop-blur-sm border border-green-500/30 rounded-lg text-green-400 hover:bg-black/70 transition-colors"
            >
              Open Terminal
            </button>
          ) : (
            <div className="relative">
              <TerminalComponent
                onCommand={handleCommand}
                availableCommands={availableCommands}
              />
              <button
                onClick={() => setShowTerminal(false)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-sm"
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
