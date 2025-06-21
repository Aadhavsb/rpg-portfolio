'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/store';
import { Project } from '@/lib/types';
import { TerminalSimple } from './TerminalSimple';
import { ProjectView } from './ProjectView';
import { SkillIcon } from './SkillIcon';
import { ContactIcon } from './ContactIcon';
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
  const [contactUnlocked, setContactUnlocked] = useState(false);
  const [resumeUnlocked, setResumeUnlocked] = useState(false);
  const [animatingPath, setAnimatingPath] = useState<string | null>(null);  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  // Show welcome messages on first load
  React.useEffect(() => {
    if (!hasShownWelcome && terminalHistory.length === 0) {
      setTimeout(() => {
        addTerminalEntry('� === WELCOME TO THE DIGITAL REALM === 🌟');
        addTerminalEntry('');
        addTerminalEntry('🎭 You have entered Aadhav\'s Interactive Portfolio Hub');
        addTerminalEntry('📍 Location: Central Command Center');
        addTerminalEntry('🎯 Mission: Discover projects, skills, and connect');
        addTerminalEntry('');
        addTerminalEntry('💡 Quick Start Commands:');
        addTerminalEntry('   • Type "help" - View all available commands');
        addTerminalEntry('   • Type "explore" - Get exploration tips');
        addTerminalEntry('   • Use directional commands to navigate projects');
        addTerminalEntry('');
        addTerminalEntry('🚀 Ready to begin your journey? Start with "help"');
        setHasShownWelcome(true);
      }, 1000);
    }
  }, [hasShownWelcome, terminalHistory.length, addTerminalEntry]);

  // Project icon mapping
  const projectIcons = {
    'palate': Palette,
    'expressink': Brain,
    'premier-league': Zap,
    'inventory360': Database,
    'brickd': Code
  };  // Command mappings with automatic path discovery
  const commandMap: { [key: string]: () => void } = {
    'help': () => {
      const allDirectionalProjectsCompleted = projects.every(project => 
        completedProjects.includes(project.id)
      );
      
      addTerminalEntry('🔮 === DIGITAL NAVIGATION COMPENDIUM === 🔮');
      addTerminalEntry('');
      if (!allDirectionalProjectsCompleted) {
        addTerminalEntry('⚔️  TIER 1 - PROJECT EXPLORATION:');
        addTerminalEntry('   🧭 go north      → Venture to the northern realm');
        addTerminalEntry('   🧭 go east       → Journey eastward to discovery'); 
        addTerminalEntry('   🧭 go south      → Explore the southern territories');
        addTerminalEntry('   🧭 go west       → Travel west to new horizons');
        addTerminalEntry('   🧭 go northeast  → Ascend to the northeastern peaks');
        addTerminalEntry('');
        addTerminalEntry('🎯 Complete all directional quests to unlock TIER 2!');
      } else {
        addTerminalEntry('🔓 TIER 2 - ADVANCED SYSTEMS UNLOCKED:');
        addTerminalEntry('   📦 check inventory      → Access skills matrix');
        addTerminalEntry('   📜 consult the scrolls  → View research archives');
        addTerminalEntry('   📡 display beacon       → Open contact channels');
        addTerminalEntry('   📋 get apprenticeship   → Access resume vault');
      }
      addTerminalEntry('');
      addTerminalEntry('🛠️  UTILITY COMMANDS:');
      addTerminalEntry('   ❓ help     → Display this compendium');
      addTerminalEntry('   🗺️  explore → Get navigation tips & tricks');
      addTerminalEntry('');
      addTerminalEntry('════════════════════════════════════════');
    },
    'explore': () => {
      addTerminalEntry('🗺️  === EXPLORER\'S GUIDE === 🗺️');
      addTerminalEntry('');
      addTerminalEntry('🎮 NAVIGATION TIPS:');
      addTerminalEntry('   • Each direction leads to a unique project');
      addTerminalEntry('   • Projects unlock automatically when you visit them');
      addTerminalEntry('   • Complete projects by viewing their details');
      addTerminalEntry('   • Advanced systems unlock after all projects');
      addTerminalEntry('');
      addTerminalEntry('🏆 PROGRESSION SYSTEM:');
      addTerminalEntry('   • TIER 1: Explore all 5 directional projects');
      addTerminalEntry('   • TIER 2: Access 4 advanced information systems');
      addTerminalEntry('   • COMPLETION: Unlock the final achievement screen');
      addTerminalEntry('');
      addTerminalEntry('💡 PRO TIPS:');
      addTerminalEntry('   • Use "help" to see available commands');
      addTerminalEntry('   • Each project showcases different skills');
      addTerminalEntry('   • Advanced systems contain detailed information');
      addTerminalEntry('');
      addTerminalEntry('🚀 Ready to start? Try "go north" to begin!');
    },    'go north': () => {
      const project = projects.find(p => p.direction === 'go north');
      if (project && !unlockedProjects.includes(project.id)) {
        unlockProject(project.id);
        addTerminalEntry('🔓 Northern pathway unlocked! Project discovered.');
      }
      handleProjectNavigation('go north');
    },
    'go east': () => {
      const project = projects.find(p => p.direction === 'go east');
      if (project && !unlockedProjects.includes(project.id)) {
        unlockProject(project.id);
        addTerminalEntry('🔓 Eastern gateway opened! New project revealed.');
      }
      handleProjectNavigation('go east');
    },
    'go south': () => {
      const project = projects.find(p => p.direction === 'go south');
      if (project && !unlockedProjects.includes(project.id)) {
        unlockProject(project.id);
        addTerminalEntry('🔓 Southern route established! Project accessible.');
      }
      handleProjectNavigation('go south');
    },
    'go west': () => {
      const project = projects.find(p => p.direction === 'go west');
      if (project && !unlockedProjects.includes(project.id)) {
        unlockProject(project.id);
        addTerminalEntry('🔓 Western passage cleared! Project unlocked.');
      }
      handleProjectNavigation('go west');
    },
    'go northeast': () => {
      const project = projects.find(p => p.direction === 'go northeast');
      if (project && !unlockedProjects.includes(project.id)) {
        unlockProject(project.id);
        addTerminalEntry('🔓 Northeastern summit reached! Project discovered.');
      }
      handleProjectNavigation('go northeast');
    },
    'check inventory': () => handleSectionUnlock('skills'),
    'consult the scrolls': () => handleSectionUnlock('research'),
    'display beacon': () => handleSectionUnlock('contact'),
    'get apprenticeship': () => handleSectionUnlock('resume')
  };  const handleProjectNavigation = (direction: string) => {
    const project = projects.find(p => p.direction === direction);
    if (!project) {
      addTerminalEntry('🚫 No pathway exists in that direction. Check your compass!');
      return;
    }

    // Check if project is unlocked before allowing navigation
    if (!unlockedProjects.includes(project.id)) {
      addTerminalEntry(`🔒 The path ${direction.replace('go ', '')} remains sealed. Use the command "${direction}" to unlock it first.`);
      return;
    }

    // Animate path with immersive messaging
    setAnimatingPath(direction);
    const directionName = direction.replace('go ', '');
    addTerminalEntry(`✨ Initiating transport to ${directionName} sector...`);
    addTerminalEntry(`🌀 Portal energy building... ${project.title} awaits!`);
    
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
    );    if (!allDirectionalProjectsCompleted) {
      addTerminalEntry('⚠️  TIER 2 SYSTEMS LOCKED: Complete all directional exploration first!');
      addTerminalEntry('🗺️  Missing paths: ' + projects.filter(p => !completedProjects.includes(p.id)).map(p => p.direction.replace('go ', '')).join(', '));
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
        }[prevSection];        addTerminalEntry(`You must unlock the previous section first. Type: ${prevCommand}`);
        return;
      }
    }    // Unlock and show the section
    switch (section) {
      case 'skills':
        setSkillsUnlocked(true);
        addTerminalEntry('📦 INVENTORY SYSTEM ACTIVATED!');
        addTerminalEntry('✨ Skills matrix now accessible...');
        break;
      case 'research':
        setResearchUnlocked(true);
        addTerminalEntry('📜 ANCIENT SCROLLS MATERIALIZED!');
        addTerminalEntry('🔬 Research archives unlocked...');
        break;
      case 'contact':
        setContactUnlocked(true);
        addTerminalEntry('📡 BEACON SIGNAL ESTABLISHED!');
        addTerminalEntry('🌐 Communication channels active...');
        break;
      case 'resume':
        setResumeUnlocked(true);
        addTerminalEntry('📋 APPRENTICESHIP VAULT OPENED!');
        addTerminalEntry('📄 Professional documentation accessible...');
        break;
    }

    setCurrentSection(section);
    setCurrentView('section');
  };  const getRequiredProjectsForSection = (): string[] => {
    // For Tier 2, only require that all directional projects are completed
    // Individual sections don't need specific project completion, just sequential unlock
    return projects.map(p => p.id); // All directional projects
  };
  const handleCommand = (cmd: string) => {
    addTerminalEntry(`> ${cmd}`);
    
    const normalizedCmd = cmd.toLowerCase().trim();
    const handler = commandMap[normalizedCmd];
    
    if (handler) {
      handler();
    } else {
      addTerminalEntry(`❓ Unknown command: "${cmd}"`);
      addTerminalEntry(`💡 Try "help" for available commands or "explore" for tips!`);
    }
  };

  const handleProjectIconClick = (direction: string) => {
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
        onBack={() => {          // Mark project as completed when returning from project view
          if (!completedProjects.includes(currentProject.id)) {
            completeProject(currentProject.id);
            addTerminalEntry(`✅ PROJECT MASTERED: ${currentProject.title}`);
            addTerminalEntry(`🎯 Knowledge acquired and archived!`);
            
            // Check if this completes Tier 1
            const newCompletedCount = completedProjects.length + 1;
            if (newCompletedCount === projects.length) {
              setTimeout(() => {
                addTerminalEntry('');
                addTerminalEntry('🎉 ═══ TIER 1 MASTERY ACHIEVED! ═══ 🎉');
                addTerminalEntry('🗺️  All directional realms explored!');
                addTerminalEntry('🔓 TIER 2 SYSTEMS NOW ONLINE!');
                addTerminalEntry('💫 Advanced command matrix unlocked!');
                addTerminalEntry('🎯 Type "help" to access your new abilities!');
                addTerminalEntry('');
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
  if (currentView === 'section' && currentSection) {    return (
      <SectionView 
        section={currentSection}
        onBack={() => {
          setCurrentSection(null);
          setCurrentView('hub');
        }}        onNavigateToSection={(section: string) => {
          setCurrentSection(section as SectionType);
          setCurrentView('section');
        }}
      />
    );
  }  // Check for completion - all projects completed and all sections unlocked
  const allCompleted = completedProjects.length === projects.length && 
                      skillsUnlocked && researchUnlocked && contactUnlocked && resumeUnlocked;
    if (allCompleted) {
    return <CompletionScreen onBack={() => {
      // Reset only view state, preserve advanced section unlock state
      setCurrentView('hub');
      setCurrentProject(null);
      setCurrentSection(null);
      setAnimatingPath(null);
      // Keep advanced sections unlocked: skillsUnlocked, researchUnlocked, contactUnlocked, resumeUnlocked
      // Don't reset hasShownWelcome to avoid re-showing welcome message
    }} />;
  }// Main hub view
  return (
    <div className="h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_1px_1px,_white_1px,_transparent_0)]" style={{backgroundSize: '50px 50px'}}></div>
      
      <div className="container mx-auto p-4 h-full flex flex-col relative z-10">
        {/* Header - Compact */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2 tracking-tight">
            Aadhav&apos;s Portfolio
          </h1>
          <p className="text-sm text-slate-400">Interactive Developer Experience</p>        </motion.div>

        {/* Main Grid - Fixed height layout to prevent terminal shrinking */}
        <div className="flex-1 flex gap-4 min-h-0 h-full">
          {/* Left - Terminal - Fixed width, full height */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-80 flex-shrink-0 h-full"
          >
            <div className="h-full bg-slate-900/40 backdrop-blur-md border border-slate-700/50 rounded-lg p-4 flex flex-col">
              <h3 className="text-lg font-semibold mb-3 text-cyan-400 flex items-center">
                <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></span>
                Terminal
              </h3>

              <div className="flex-1 min-h-0">
                <TerminalSimple 
                  history={terminalHistory}
                  onCommand={handleCommand}
                />
              </div>
            </div>
          </motion.div>

          {/* Right Side - Project Hub and Advanced Cards - Scrollable if needed */}
          <div className="flex-1 flex flex-col gap-4 min-h-0 overflow-y-auto">            {/* Project Hub - Fixed height to prevent layout issues */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900/30 backdrop-blur-md border border-slate-700/50 rounded-lg p-6 flex flex-col min-h-[400px]"
            >
              <h3 className="text-lg font-semibold mb-6 text-center text-slate-200 flex items-center justify-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                Project Hub
                <span className="w-2 h-2 bg-blue-400 rounded-full ml-2"></span>
              </h3>
                {/* Spacious Project Grid - 3x3 with larger icons and more padding */}
              <div className="relative grid grid-cols-3 grid-rows-3 gap-6 max-w-md mx-auto place-items-center h-full content-center">
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

                {/* Row 2 - West, HUB, East */}
                <ProjectIcon 
                  project={projects.find(p => p.direction === 'go west')} 
                  direction="go west" 
                  onClick={handleProjectIconClick}
                  unlockedProjects={unlockedProjects}
                  completedProjects={completedProjects}
                  projectIcons={projectIcons}
                />
                <motion.div 
                  className="flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800 rounded-full h-14 w-14 border border-slate-600 shadow-lg"
                  whileHover={{ scale: 1.1 }}
                >
                  <span className="text-xs font-semibold text-slate-300">HUB</span>
                </motion.div>
                <ProjectIcon 
                  project={projects.find(p => p.direction === 'go east')} 
                  direction="go east" 
                  onClick={handleProjectIconClick}
                  unlockedProjects={unlockedProjects}
                  completedProjects={completedProjects}
                  projectIcons={projectIcons}
                />

                {/* Row 3 - South */}
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
            </motion.div>            {/* Advanced Section Cards - Fixed height, always visible but disabled until all projects complete */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-900/30 backdrop-blur-md border border-slate-700/50 rounded-lg p-4"
            >
              <h3 className="text-lg font-semibold mb-4 text-center text-slate-200 flex items-center justify-center">
                <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                Advanced Systems
                <span className="w-2 h-2 bg-purple-400 rounded-full ml-2"></span>
              </h3>
                <div className="grid grid-cols-2 gap-3">                <SectionCard 
                  title="Skills"
                  icon={Code}
                  unlocked={skillsUnlocked}
                  allProjectsCompleted={projects.every(project => completedProjects.includes(project.id))}
                  onClick={() => handleSectionCardClick('skills')}
                />
                <SectionCard 
                  title="Research"
                  icon={Brain}
                  unlocked={researchUnlocked}
                  allProjectsCompleted={projects.every(project => completedProjects.includes(project.id))}
                  onClick={() => handleSectionCardClick('research')}
                />
                <SectionCard 
                  title="Contact"
                  icon={Mail}
                  unlocked={contactUnlocked}
                  allProjectsCompleted={projects.every(project => completedProjects.includes(project.id))}
                  onClick={() => handleSectionCardClick('contact')}
                />
                <SectionCard 
                  title="Resume"
                  icon={FileText}
                  unlocked={resumeUnlocked}
                  allProjectsCompleted={projects.every(project => completedProjects.includes(project.id))}
                  onClick={() => handleSectionCardClick('resume')}
                />
              </div>
            </motion.div>

            {/* Progress Bar - Compact at bottom */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-3"
            >              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-300 text-sm">Progress</span>
                <span className="text-cyan-400 text-sm font-medium">
                  {completedProjects.length + [skillsUnlocked, researchUnlocked, contactUnlocked, resumeUnlocked].filter(Boolean).length}/9
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <motion.div 
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${((completedProjects.length + [skillsUnlocked, researchUnlocked, contactUnlocked, resumeUnlocked].filter(Boolean).length) / 9) * 100}%` 
                  }}
                  transition={{ duration: 1, delay: 0.5 }}
                /></div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Project Icon Component
function ProjectIcon({ 
  project, 
  direction, 
  onClick, 
  unlockedProjects, 
  completedProjects, 
  projectIcons 
}: { 
  project: Project | undefined; 
  direction: string; 
  onClick: (direction: string) => void;
  unlockedProjects: string[];
  completedProjects: string[];
  projectIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>>;
}) {
    if (!project) return <div className="h-12 w-12"></div>;

    const isUnlocked = unlockedProjects.includes(project.id);
    const isCompleted = completedProjects.includes(project.id);
    const IconComponent = projectIcons[project.id as keyof typeof projectIcons] || Code;

    // Determine position for label based on direction
    const getLayoutClasses = () => {
      switch (direction) {
        case 'go north':
          return 'flex-col items-center';
        case 'go south':
          return 'flex-col-reverse items-center';
        case 'go east':
          return 'flex-row items-center';
        case 'go west':
          return 'flex-row-reverse items-center';
        case 'go northeast':
          return 'flex-col items-center';
        default:
          return 'flex-col items-center';
      }
    };

    return (
      <div className={`flex ${getLayoutClasses()} gap-2`}>
        <motion.div
          className={`
            relative h-12 w-12 rounded-lg cursor-pointer
            flex items-center justify-center transition-all duration-200
            ${isCompleted 
              ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/25' 
              : isUnlocked 
              ? 'bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg shadow-blue-500/25' 
              : 'bg-gradient-to-br from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600'
            }
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onClick(direction)}
        >
          <IconComponent 
            size={20} 
            className={isCompleted ? 'text-green-100' : isUnlocked ? 'text-blue-100' : 'text-slate-300'} 
          />
          {isCompleted && (
            <motion.div
              className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <span className="text-green-900 text-xs font-bold">✓</span>
            </motion.div>
          )}
        </motion.div>
        
        {/* Project Name Label */}
        <motion.div
          className={`
            px-2 py-1 rounded text-xs font-medium max-w-20 text-center
            ${isCompleted 
              ? 'bg-green-900/60 text-green-300' 
              : isUnlocked 
              ? 'bg-blue-900/60 text-blue-300' 
              : 'bg-slate-800/60 text-slate-400'
            }
          `}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {project.title}
        </motion.div>
      </div>
    );
  }

// Section Card Component
function SectionCard({ title, icon: Icon, unlocked, allProjectsCompleted, onClick }: {
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  unlocked: boolean;
  allProjectsCompleted: boolean;
  onClick: () => void;
}) {
    const isClickable = unlocked;
    const isAvailable = allProjectsCompleted;

    return (
      <motion.div
        className={`
          relative px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm
          ${isClickable 
            ? 'bg-slate-800/60 border border-cyan-500/50 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 cursor-pointer' 
            : isAvailable 
            ? 'bg-slate-800/40 border border-slate-600/50 hover:border-slate-500 cursor-pointer'
            : 'bg-slate-900/60 border border-slate-700/50 cursor-not-allowed opacity-60'
          }
        `}
        whileHover={isAvailable ? { scale: 1.02 } : {}}
        whileTap={isClickable ? { scale: 0.98 } : {}}
        onClick={isClickable ? onClick : undefined}
      >
        <Icon 
          size={14} 
          className={
            isClickable 
              ? 'text-cyan-400' 
              : isAvailable 
              ? 'text-slate-400' 
              : 'text-slate-600'
          } 
        />
        <span                className={
                  isClickable 
                    ? 'text-slate-200 font-medium' 
                    : isAvailable 
                    ? 'text-slate-400' 
                    : 'text-slate-600'
                }>
          {title}
        </span>
        {isClickable && (
          <motion.div
            className="w-2 h-2 bg-cyan-400 rounded-full ml-auto"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          />
        )}
        {!isAvailable && (
          <span className="text-xs text-slate-600 ml-auto">🔒</span>
        )}
      </motion.div>
    );
  }

// Path Animation Component
function PathAnimation({ direction }: { direction: string }) {
  const pathVariants = {
    'go north': { x: 0, y: -100 },
    'go east': { x: 100, y: 0 },
    'go south': { x: 0, y: 100 },
    'go west': { x: -100, y: 0 },
    'go northeast': { x: 100, y: -100 }
  };

  const movement = pathVariants[direction as keyof typeof pathVariants] || { x: 0, y: 0 };

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 w-2 h-2 bg-cyan-400 rounded-full"
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

// Section View Component
function SectionView({ section, onBack, onNavigateToSection }: { 
  section: string; 
  onBack: () => void;
  onNavigateToSection?: (section: string) => void;
}) {const sectionData = {
    skills: {
      title: 'Skills Inventory',
      icon: Code,      content: {
        'Programming Languages': ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'C', 'R'],
        'Web Technologies': ['React', 'Next.js', 'Node.js', 'Express', 'Tailwind CSS', 'HTML/CSS']
      }
    },    research: {
      title: 'Research',
      icon: Brain,      content: {
        description: 'I am investigating KV cache compression for large language models—specifically through chunk-wise singular value decomposition (SVD) and dynamic token-rank strategies. The work combines mathematical exploration, GPU-accelerated computation, and high-performance system design to make inference more memory-efficient without degrading output quality. This research is deployed across Dockerized environments in HPC clusters.',
        repository: 'chunkedDecomp'
      }
    },    contact: {
      title: 'Contact',
      icon: Mail,
      content: {
        'Email': 'bharadwajaadhav@gmail.com',
        'GitHub': 'github.com/Aadhavsb',
        'LinkedIn': 'linkedin.com/in/aadhav-bharadwaj'
      }
    },resume: {
      title: 'Resume',
      icon: FileText,      content: {
        description: 'Access resume containing detailed experience, education, certifications, and comprehensive skills inventory.',
        downloadText: 'Download PDF Resume',
        status: 'Available Soon'
      }
    }
  };

  const data = sectionData[section as keyof typeof sectionData];
  const Icon = data.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 text-white p-8"
    >
      <div className="max-w-4xl mx-auto">
        <motion.button
          className="mb-8 px-6 py-3 bg-slate-800 border border-slate-600 rounded-lg hover:border-slate-500 transition-colors"
          onClick={onBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ← Back to Hub
        </motion.button>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8"
        >
          <div className="flex items-center mb-8">
            <Icon size={32} className="text-cyan-400" />
            <h1 className="text-3xl font-bold ml-4">{data.title}</h1>
          </div>          <div className="space-y-6">            {section === 'skills' ? (
              <>
                {Object.entries(data.content).map(([category, skills]) => (
                  <div key={category}>
                    <h3 className="text-xl font-semibold text-cyan-400 mb-4">{category}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(skills as string[]).map((skill) => (
                        <SkillIcon key={skill} skill={skill} />
                      ))}
                    </div>
                  </div>
                ))}                <div className="mt-6 p-4 bg-slate-800/30 border border-slate-600/50 rounded-lg">
                  <p className="text-slate-400 text-sm text-center">
                    💼 <span className="text-cyan-400 font-medium">Refer to the resume scroll for full list of skills</span>
                  </p>
                </div>
              </>
            ) : section === 'contact' ? (
              <div className="space-y-4">
                <ContactIcon 
                  type="email" 
                  value="bharadwajaadhav@gmail.com" 
                  href="mailto:bharadwajaadhav@gmail.com" 
                />
                <ContactIcon 
                  type="github" 
                  value="github.com/Aadhavsb" 
                  href="https://github.com/Aadhavsb" 
                />
                <ContactIcon 
                  type="linkedin" 
                  value="linkedin.com/in/aadhav-bharadwaj" 
                  href="https://linkedin.com/in/aadhav-bharadwaj" 
                />              </div>            ) : section === 'research' ? (
              <div className="space-y-6">
                <p className="text-slate-300 leading-relaxed text-lg">
                  {(data.content as any).description}
                </p>
                <div className="p-4 bg-slate-800/30 border border-slate-600/50 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <Brain size={20} className="text-purple-400" />
                    <span className="text-slate-300 font-medium">GitHub Repository:</span>
                  </div>
                  <motion.a
                    href="https://github.com/Aadhavsb/chunkedDecomp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-slate-500 rounded-lg text-slate-300 hover:text-white transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-cyan-400 font-medium">{(data.content as any).repository}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </motion.a>
                </div>
              </div>
            ) : section === 'resume' ? (
              <div className="space-y-6">
                <p className="text-slate-300 leading-relaxed text-lg">
                  {(data.content as any).description}
                </p>
                <div className="flex items-center justify-center p-6 bg-slate-800/30 border border-slate-600/50 rounded-lg">
                  <FileText size={24} className="text-green-400 mr-3" />
                  <div className="text-center">
                    <p className="text-slate-300 mb-2">{(data.content as any).downloadText}</p>
                    <p className="text-slate-500 text-sm">[{(data.content as any).status}]</p>
                  </div>
                </div>
              </div>
            ) : (
              Object.entries(data.content).map(([key, value]) => (
                <div key={key} className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="text-cyan-400 font-semibold min-w-32">{key}:</span>
                  <span className="text-slate-300">{value}</span>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
