'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/store';
import { Project } from '@/lib/types';
import { TerminalSimple } from './TerminalSimple';
import { ProjectView } from './ProjectView';
import { ProjectIcon } from './ProjectIcon';
import { SectionCard } from './SectionCard';
import { SectionView } from './SectionView';
import { CompletionScreen } from './CompletionScreen';
import { Mail, FileText, Brain, Zap, Code, Database, Palette } from 'lucide-react';

type ViewState = 'hub' | 'project' | 'section';
type SectionType = 'skills' | 'research' | 'contact' | 'resume';

export function RPGHub() {
  const {
    projects,
    terminalHistory,
    addTerminalEntry,
    unlockProject,
    completeProject,
    unlockedProjects,
    completedProjects
  } = useGameStore();

  const [currentView, setCurrentView] = useState<ViewState>('hub');
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [currentSection, setCurrentSection] = useState<SectionType | null>(null);
  const [skillsUnlocked, setSkillsUnlocked] = useState(false);
  const [researchUnlocked, setResearchUnlocked] = useState(false);
  const [contactUnlocked, setContactUnlocked] = useState(false);  const [resumeUnlocked, setResumeUnlocked] = useState(false);
  const [animatingPath, setAnimatingPath] = useState<string | null>(null);
  const [showCompletionScreen, setShowCompletionScreen] = useState(false);

  // Project icon mapping
  const projectIcons = {
    'palate': Palette,
    'expressink': Brain,
    'premier-league': Zap,
    'inventory360': Database,
    'brickd': Code
  };

  // Command mappings with automatic path discovery
  const commandMap: { [key: string]: () => void } = {
    'help': () => {
      const allDirectionalProjectsCompleted = projects.every(project => 
        completedProjects.includes(project.id)
      );
      
      if (!allDirectionalProjectsCompleted) {
        addTerminalEntry('TIER 1 - Explore all directions: go north, go east, go south, go west, go northeast');
      } else {
        addTerminalEntry('TIER 2 - Advanced commands: check inventory, consult the scrolls, display beacon, get apprenticeship');
      }
    },
    'go north': () => handleProjectNavigation('go north'),
    'go east': () => handleProjectNavigation('go east'),
    'go south': () => handleProjectNavigation('go south'),
    'go west': () => handleProjectNavigation('go west'),
    'go northeast': () => handleProjectNavigation('go northeast'),
    'check inventory': () => handleSectionUnlock('skills'),
    'consult the scrolls': () => handleSectionUnlock('research'),
    'display beacon': () => handleSectionUnlock('contact'),
    'get apprenticeship': () => handleSectionUnlock('resume')
  };

  const handleProjectNavigation = (direction: string) => {
    const project = projects.find(p => p.direction === direction);
    if (!project) {
      addTerminalEntry(`No project found in that direction.`);
      return;
    }

    // Auto-unlock project when navigating
    if (!unlockedProjects.includes(project.id)) {
      unlockProject(project.id);
    }

    // Animate path
    setAnimatingPath(direction);
    addTerminalEntry(`Activating path ${direction.replace('go ', '')}...`);
    
    // Show project after animation
    setTimeout(() => {
      setCurrentProject(project);
      setCurrentView('project');
      setAnimatingPath(null);
    }, 1000);
  };

  const handleSectionUnlock = (section: SectionType) => {
    // Check if Tier 1 (all directional projects) is completed
    const allDirectionalProjectsCompleted = projects.every(project => 
      completedProjects.includes(project.id)
    );

    if (!allDirectionalProjectsCompleted) {
      addTerminalEntry('Quest requirements not met. Complete all directional paths first (go north, east, south, west, northeast).');
      return;
    }

    const requiredProjects = getRequiredProjectsForSection();
    const hasRequiredProjects = requiredProjects.every(id => completedProjects.includes(id));

    if (!hasRequiredProjects) {
      const missing = requiredProjects.filter(id => !completedProjects.includes(id));
      const missingTitles = missing.map(id => projects.find(p => p.id === id)?.title).join(', ');
      addTerminalEntry(`Quest requirements not met. Complete: ${missingTitles}`);
      return;
    }

    // Sequential unlocking for Tier 2 commands
    const sectionOrder: SectionType[] = ['skills', 'research', 'contact', 'resume'];
    const currentIndex = sectionOrder.indexOf(section);
    
    // Check if previous sections are unlocked
    for (let i = 0; i < currentIndex; i++) {
      const prevSection = sectionOrder[i];
      const isUnlocked = {
        skills: skillsUnlocked,
        research: researchUnlocked,
        contact: contactUnlocked,
        resume: resumeUnlocked
      }[prevSection];
      
      if (!isUnlocked) {
        const prevCommand = {
          skills: 'check inventory',
          research: 'consult the scrolls',
          contact: 'display beacon',
          resume: 'get apprenticeship'
        }[prevSection];
        addTerminalEntry(`You must unlock the previous section first. Type: ${prevCommand}`);
        return;
      }
    }

    // Unlock and show the section
    switch (section) {
      case 'skills':
        setSkillsUnlocked(true);
        addTerminalEntry('Inventory accessed! Opening skills matrix...');
        break;
      case 'research':
        setResearchUnlocked(true);
        addTerminalEntry('Ancient scrolls revealed! Accessing research archives...');
        break;
      case 'contact':
        setContactUnlocked(true);
        addTerminalEntry('Beacon activated! Contact channels established...');
        break;      case 'resume':
        setResumeUnlocked(true);
        addTerminalEntry('Apprenticeship documents materialized!');
        // Check if this completes everything
        setTimeout(() => {
          addTerminalEntry('🎆 INCREDIBLE! You have unlocked everything!');
          addTerminalEntry('🏆 PORTFOLIO MASTERY ACHIEVED! Welcome to the completion ceremony!');
          // Show completion screen after a delay
          setTimeout(() => {
            setShowCompletionScreen(true);
          }, 2000);
        }, 1000);
        break;
    }
    
    setCurrentSection(section);
    setCurrentView('section');
  };

  const getRequiredProjectsForSection = (): string[] => {
    // For Tier 2, only require that all directional projects are completed
    // Individual sections don't need specific project completion, just sequential unlock
    return projects.map(p => p.id); // All directional projects
  };

  const getNextAvailableDirection = () => {
    const directionsInOrder = ['go north', 'go east', 'go south', 'go west', 'go northeast'];
    
    for (const direction of directionsInOrder) {
      const project = projects.find(p => p.direction === direction);
      if (project && !completedProjects.includes(project.id)) {
        return direction;
      }
    }
    return null;
  };

  const handleCommand = (cmd: string) => {
    addTerminalEntry(`> ${cmd}`);
    
    const normalizedCmd = cmd.toLowerCase().trim();
    const handler = commandMap[normalizedCmd];
    
    if (handler) {
      handler();
    } else {
      addTerminalEntry(`Unknown command: ${cmd}. Type 'help' for available commands.`);
    }
  };

  const handleProjectIconClick = (direction: string) => {
    const project = projects.find(p => p.direction === direction);
    if (!project) {
      addTerminalEntry(`No project found in that direction.`);
      return;
    }

    // Check if project is unlocked before allowing navigation
    if (!unlockedProjects.includes(project.id)) {
      addTerminalEntry(`Project "${project.title}" hasn't been unlocked.`);
      return;
    }

    handleProjectNavigation(direction);
  };

  const handleSectionCardClick = (section: SectionType) => {
    const isUnlocked = {
      skills: skillsUnlocked,
      research: researchUnlocked,
      contact: contactUnlocked,
      resume: resumeUnlocked
    }[section];

    if (isUnlocked) {
      setCurrentSection(section);
      setCurrentView('section');
    }
  };

  // Project view
  if (currentView === 'project' && currentProject) {
    return (
      <ProjectView 
        project={currentProject} 
        onBack={() => {
          // Mark project as completed when returning from project view
          if (!completedProjects.includes(currentProject.id)) {
            completeProject(currentProject.id);
            addTerminalEntry(`Project completed: ${currentProject.title}`);
            
            // Check if this completes Tier 1
            const newCompletedCount = completedProjects.length + 1;
            if (newCompletedCount === projects.length) {
              setTimeout(() => {
                addTerminalEntry('🎉 TIER 1 COMPLETED! All directional paths explored!');
                addTerminalEntry('🔓 TIER 2 UNLOCKED! Advanced commands are now available.');
                addTerminalEntry('Type "help" to see your new options.');
              }, 500);
            }
          }
          setCurrentProject(null);
          setCurrentView('hub');
        }}
      />
    );
  }

  // Section view
  if (currentView === 'section' && currentSection) {
    return (
      <SectionView 
        section={currentSection}
        onBack={() => {
          setCurrentSection(null);
          setCurrentView('hub');
        }}
      />
    );
  }
  // Completion screen - only when explicitly triggered
  if (showCompletionScreen) {
    return <CompletionScreen onBack={() => setShowCompletionScreen(false)} />;
  }

  // Main hub view
  return (
    <div className="h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-black text-gray-100 relative overflow-hidden">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_1px_1px,_white_1px,_transparent_0)]" style={{backgroundSize: '40px 40px'}}></div>
      
      <div className="container mx-auto p-6 h-full flex flex-col relative z-10">
        {/* Header - Clean and Professional */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2 tracking-tight">
            Aadhav Bharadwaj
          </h1>
          <p className="text-sm text-gray-400">Interactive Developer Portfolio</p>
        </motion.div>        {/* Main Content Area - Restructured layout */}
        <div className="flex-1 flex gap-6 min-h-0 pb-4">
          {/* Left - Terminal Column (no advanced cards here) */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-80 flex-shrink-0"
          >
            {/* Terminal - Full height */}
            <div className="h-full bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 flex flex-col shadow-2xl">
              <h3 className="text-lg font-semibold mb-3 text-blue-400 flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                Terminal
              </h3>
              
              {/* Quick Command Buttons */}
              <div className="mb-4 space-y-2">
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Quick Commands</div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleCommand('help')}
                    className="px-3 py-1 text-xs bg-slate-800/60 border border-slate-600/50 rounded-md hover:bg-slate-700/60 transition-colors text-slate-300"
                  >
                    help
                  </button>
                  
                  {/* Show next available direction */}
                  {(() => {
                    const nextDirection = getNextAvailableDirection();
                    if (!nextDirection) return null;
                    
                    const buttonText = nextDirection.replace('go ', '');
                    return (
                      <button
                        onClick={() => handleCommand(nextDirection)}
                        className="px-3 py-1 text-xs bg-cyan-800/60 border border-cyan-600/50 rounded-md hover:bg-cyan-700/60 transition-colors text-cyan-300"
                      >
                        {buttonText}
                      </button>
                    );
                  })()}
                  
                  {/* Advanced commands after all projects completed */}
                  {completedProjects.length === projects.length && (
                    <>
                      {!skillsUnlocked && (
                        <button
                          onClick={() => handleCommand('check inventory')}
                          className="px-3 py-1 text-xs bg-blue-800/60 border border-blue-600/50 rounded-md hover:bg-blue-700/60 transition-colors text-blue-300"
                        >
                          inventory
                        </button>
                      )}
                      {skillsUnlocked && !researchUnlocked && (
                        <button
                          onClick={() => handleCommand('consult the scrolls')}
                          className="px-3 py-1 text-xs bg-purple-800/60 border border-purple-600/50 rounded-md hover:bg-purple-700/60 transition-colors text-purple-300"
                        >
                          scrolls
                        </button>
                      )}
                      {researchUnlocked && !contactUnlocked && (
                        <button
                          onClick={() => handleCommand('display beacon')}
                          className="px-3 py-1 text-xs bg-green-800/60 border border-green-600/50 rounded-md hover:bg-green-700/60 transition-colors text-green-300"
                        >
                          beacon
                        </button>
                      )}
                      {contactUnlocked && !resumeUnlocked && (
                        <button
                          onClick={() => handleCommand('get apprenticeship')}
                          className="px-3 py-1 text-xs bg-amber-800/60 border border-amber-600/50 rounded-md hover:bg-amber-700/60 transition-colors text-amber-300"
                        >
                          apprenticeship
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>              
              <div className="flex-1 min-h-0 overflow-hidden">
                <TerminalSimple 
                  history={terminalHistory}
                  onCommand={handleCommand}
                />
              </div>
            </div>
          </motion.div>

          {/* Right - Project Hub Column */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col min-h-0"
          >
            <div className="flex-1 bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 flex flex-col shadow-2xl">
              <h3 className="text-lg font-semibold mb-4 text-center text-slate-200 flex items-center justify-center">
                <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></span>
                Project Hub
                <span className="w-2 h-2 bg-cyan-400 rounded-full ml-3"></span>
              </h3>
              
              {/* Project Grid with Path Animations - More Compact */}
              <div className="relative grid grid-cols-3 grid-rows-3 gap-4 max-w-xs mx-auto place-items-center" style={{ height: '240px' }}>
                {/* Animated Paths */}
                <AnimatePresence>
                  {animatingPath && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 pointer-events-none"
                    >
                      <PathAnimation direction={animatingPath} />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Project Icons in Perfect Symmetric Grid */}
                {/* Row 1 - North and Northeast */}
                <div></div>
                <ProjectIcon 
                  project={projects.find(p => p.direction === 'go north')} 
                  direction="go north" 
                  onClick={handleProjectIconClick}
                  unlockedProjects={unlockedProjects}
                  completedProjects={completedProjects}
                  projectIcons={projectIcons}
                />
                <ProjectIcon 
                  project={projects.find(p => p.direction === 'go northeast')} 
                  direction="go northeast" 
                  onClick={handleProjectIconClick}
                  unlockedProjects={unlockedProjects}
                  completedProjects={completedProjects}
                  projectIcons={projectIcons}
                />

                {/* Row 2 - West, HUB, East */}                <ProjectIcon 
                  project={projects.find(p => p.direction === 'go west')} 
                  direction="go west" 
                  onClick={handleProjectIconClick}
                  unlockedProjects={unlockedProjects}
                  completedProjects={completedProjects}
                  projectIcons={projectIcons}
                />
                
                <motion.div 
                  className="flex items-center justify-center bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800 rounded-lg h-10 w-10 border border-white/10 shadow-xl backdrop-blur-xl overflow-hidden relative"
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                >
                  {/* Premium Background Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 rounded-lg" />
                  
                  <span className="text-xs font-semibold text-slate-200 relative z-10 tracking-wide">HUB</span>
                  
                  {/* Subtle Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
                
                <ProjectIcon 
                  project={projects.find(p => p.direction === 'go east')} 
                  direction="go east" 
                  onClick={handleProjectIconClick}
                  unlockedProjects={unlockedProjects}
                  completedProjects={completedProjects}
                  projectIcons={projectIcons}
                />

                {/* Row 3 - South (centered) */}
                <div></div>
                <ProjectIcon 
                  project={projects.find(p => p.direction === 'go south')} 
                  direction="go south" 
                  onClick={handleProjectIconClick}
                  unlockedProjects={unlockedProjects}
                  completedProjects={completedProjects}
                  projectIcons={projectIcons}
                />
                <div></div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Advanced Section Cards - Below Project Hub, Above Progress Bar */}
        {(skillsUnlocked || researchUnlocked || contactUnlocked || resumeUnlocked) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-4 bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 shadow-2xl"
          >
            <div className="text-sm font-medium text-slate-300 mb-4 text-center flex items-center justify-center">
              <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
              Advanced Access
              <span className="w-2 h-2 bg-purple-400 rounded-full ml-3"></span>
            </div>
            <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
              {skillsUnlocked && (
                <SectionCard 
                  title="Skills"
                  icon={Code}
                  unlocked={skillsUnlocked}
                  onClick={() => handleSectionCardClick('skills')}
                />
              )}
              {researchUnlocked && (
                <SectionCard 
                  title="Research"
                  icon={Brain}
                  unlocked={researchUnlocked}
                  onClick={() => handleSectionCardClick('research')}
                />
              )}
              {contactUnlocked && (
                <SectionCard 
                  title="Contact"
                  icon={Mail}
                  unlocked={contactUnlocked}
                  onClick={() => handleSectionCardClick('contact')}
                />
              )}
              {resumeUnlocked && (
                <SectionCard 
                  title="Resume"
                  icon={FileText}
                  unlocked={resumeUnlocked}
                  onClick={() => handleSectionCardClick('resume')}
                />
              )}
            </div>
          </motion.div>
        )}
        
        {/* Progress Bar - Fixed at bottom, never overlapping */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-slate-900/60 via-slate-800/80 to-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl flex-shrink-0"
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></div>
              <span className="text-slate-200 text-sm font-semibold tracking-wide">Portfolio Progress</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-400 text-sm font-bold">
                {completedProjects.length + [skillsUnlocked, researchUnlocked, contactUnlocked, resumeUnlocked].filter(Boolean).length}
              </span>
              <span className="text-slate-400 text-sm">/</span>
              <span className="text-slate-400 text-sm">{projects.length + 4}</span>
              <span className="text-slate-500 text-xs">completed</span>
            </div>
          </div>
          
          <div className="relative w-full bg-slate-800/80 rounded-full h-3 overflow-hidden border border-slate-700/50">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-700/50 to-slate-600/50"></div>
            
            <motion.div 
              className="relative h-3 rounded-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 shadow-lg shadow-blue-500/30"
              style={{
                background: 'linear-gradient(90deg, #3B82F6 0%, #06B6D4 50%, #3B82F6 100%)'
              }}
              initial={{ width: 0 }}
              animate={{ 
                width: `${((completedProjects.length + [skillsUnlocked, researchUnlocked, contactUnlocked, resumeUnlocked].filter(Boolean).length) / (projects.length + 4)) * 100}%` 
              }}
              transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
            />
            
            {/* Progress Bar Shimmer Effect */}
            <motion.div
              className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }}
              style={{ width: '50%' }}
            />
          </div>
          
          {/* Progress Details */}
          <div className="flex justify-between items-center mt-3 text-xs">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-slate-400">Projects: {completedProjects.length}/{projects.length}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-slate-400">Advanced: {[skillsUnlocked, researchUnlocked, contactUnlocked, resumeUnlocked].filter(Boolean).length}/4</span>
              </div>
            </div>
            <div className="text-slate-500">
              {Math.round(((completedProjects.length + [skillsUnlocked, researchUnlocked, contactUnlocked, resumeUnlocked].filter(Boolean).length) / (projects.length + 4)) * 100)}% Complete
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Path Animation Component
function PathAnimation({ direction }: { direction: string }) {
  const pathVariants = {
    'go north': { x: 0, y: -80 },
    'go east': { x: 80, y: 0 },
    'go south': { x: 0, y: 80 },
    'go west': { x: -80, y: 0 },
    'go northeast': { x: 80, y: -80 }
  };

  const movement = pathVariants[direction as keyof typeof pathVariants] || { x: 0, y: 0 };

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 w-2 h-2 bg-cyan-400 rounded-full shadow-sm"
      initial={{ x: -4, y: -4, opacity: 0 }}
      animate={{ 
        x: movement.x - 4, 
        y: movement.y - 4, 
        opacity: [0, 1, 1, 0] 
      }}
      transition={{ duration: 1, ease: "easeInOut" }}
    />
  );
}
