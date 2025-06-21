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
import { Mail, FileText, Brain, Zap, Code, Database, Palette, ArrowLeft, CheckCircle, Github, ExternalLink } from 'lucide-react';

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
  const [animatingPath, setAnimatingPath] = useState<string | null>(null);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  const [hasCompletedOnce, setHasCompletedOnce] = useState(false);  // Show welcome messages on first load
  React.useEffect(() => {
    if (!hasShownWelcome && terminalHistory.length === 0) {
      // No delay - show welcome immediately
      addTerminalEntry('🌟 === WELCOME TO THE DIGITAL REALM === 🌟');
      addTerminalEntry('');
      addTerminalEntry('🎭 You have entered Aadhav\'s Interactive Portfolio Hub');
      addTerminalEntry('📍 Current Location: Central Command Center');
      addTerminalEntry('🎯 Primary Mission: Discover projects, unlock skills, establish contact');
      addTerminalEntry('');
      addTerminalEntry('⚡ System Status: ONLINE | Exploration Mode: ACTIVE');
      addTerminalEntry('🗺️  Available Pathways: 5 project realms await discovery');
      addTerminalEntry('🔐 Advanced Systems: Locked (complete all projects to unlock)');
      addTerminalEntry('');
      addTerminalEntry('💡 Essential Commands:');
      addTerminalEntry('   📖 "help" - Access command matrix');
      addTerminalEntry('   🧭 "explore" - Receive navigation guidance');
      addTerminalEntry('   🌍 Directional commands (north, east, south, west, northeast)');
      addTerminalEntry('');
      addTerminalEntry('🚀 Begin your digital odyssey! Type "help" to start.');
      setHasShownWelcome(true);
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
  const commandMap: { [key: string]: () => void } = {    'help': () => {
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
      addTerminalEntry('   ❓ help          → Display this compendium');
      addTerminalEntry('   🗺️  explore      → Get navigation tips & tricks');
      addTerminalEntry('   🚀 start journey → Begin guided exploration');
      addTerminalEntry('');
      addTerminalEntry('════════════════════════════════════════');
    },    'start journey': () => {
      addTerminalEntry('🚀 === INITIATING GUIDED EXPLORATION === 🚀');
      addTerminalEntry('');
      addTerminalEntry('🎯 Welcome to your personalized adventure through my portfolio!');
      addTerminalEntry('');
      addTerminalEntry('📋 MISSION BRIEFING:');
      addTerminalEntry('   🎪 You are about to explore 5 unique projects');
      addTerminalEntry('   🔓 Use terminal commands to unlock project paths');
      addTerminalEntry('   🖱️  Click unlocked project icons to enter and explore');
      addTerminalEntry('   ✅ Complete projects by viewing their full details');
      addTerminalEntry('   🏆 Unlock advanced systems after exploring all projects');
      addTerminalEntry('');
      addTerminalEntry('🧭 RECOMMENDED PATH:');
      addTerminalEntry('   1️⃣  "go north" → Unlock Palate project, then click to explore');
      addTerminalEntry('   2️⃣  "go east" → Unlock ExpressInk, then click to explore');
      addTerminalEntry('   3️⃣  "go south" → Unlock Premier League Analytics');
      addTerminalEntry('   4️⃣  "go west" → Unlock Inventory360');
      addTerminalEntry('   5️⃣  "go northeast" → Unlock Brickd');
      addTerminalEntry('');
      addTerminalEntry('💡 TIPS FOR SUCCESS:');
      addTerminalEntry('   • Commands unlock paths, clicking enters projects');
      addTerminalEntry('   • Take your time to read project descriptions');
      addTerminalEntry('   • Use "help" anytime to see available commands');
      addTerminalEntry('   • Advanced sections unlock sequentially after projects');
      addTerminalEntry('');
      addTerminalEntry('🌟 Ready to begin? Type "go north" to unlock your first path!');
    },    'explore': () => {
      addTerminalEntry('🗺️  === EXPLORER\'S GUIDE === 🗺️');
      addTerminalEntry('');
      addTerminalEntry('🎮 NAVIGATION TIPS:');
      addTerminalEntry('   • Each direction command unlocks a unique project');
      addTerminalEntry('   • Click unlocked project icons to enter and explore');
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
      addTerminalEntry('   • Commands unlock, clicks enter projects');
      addTerminalEntry('   • Each project showcases different skills');
      addTerminalEntry('   • Advanced systems contain detailed information');
      addTerminalEntry('');
      addTerminalEntry('🚀 Ready to start? Try "go north" to unlock your first project!');
    },'go north': () => handleDirectionalCommand('go north'),
    'go east': () => handleDirectionalCommand('go east'),
    'go south': () => handleDirectionalCommand('go south'),
    'go west': () => handleDirectionalCommand('go west'),
    'go northeast': () => handleDirectionalCommand('go northeast'),
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

    // Animate path with immersive messaging    setAnimatingPath(direction);
    addTerminalEntry(`✨ Initiating transport to ${direction.replace('go ', '')} sector...`);
    addTerminalEntry(`🌀 Portal energy building... ${project.title} awaits!`);    // Show project after brief animation
    setTimeout(() => {
      setCurrentProject(project);
      setCurrentView('project');
      setAnimatingPath(null);
    }, 400); // Reduced from 800ms to 400ms
  };
  const handleDirectionalCommand = (direction: string) => {
    const project = projects.find(p => p.direction === direction);
    if (!project) {
      addTerminalEntry('🚫 No pathway exists in that direction. Check your compass!');
      return;
    }

    // If already unlocked, show navigation hint
    if (unlockedProjects.includes(project.id)) {
      const directionName = direction.replace('go ', '');
      addTerminalEntry(`✨ ${directionName.charAt(0).toUpperCase() + directionName.slice(1)} pathway is already accessible!`);
      addTerminalEntry(`🎯 Click the ${project.title} icon to enter the project realm.`);
      return;
    }

    // Otherwise unlock but don't auto-navigate
    unlockProject(project.id);
    const directionName = direction.replace('go ', '');
    const unlockMessages = {
      'go north': '🔓 Northern pathway unlocked! Project discovered.',
      'go east': '🔓 Eastern gateway opened! New project revealed.',
      'go south': '🔓 Southern route established! Project accessible.',
      'go west': '🔓 Western passage cleared! Project unlocked.',
      'go northeast': '🔓 Northeastern summit reached! Project discovered.'
    };    addTerminalEntry(unlockMessages[direction as keyof typeof unlockMessages] || `🔓 ${directionName} pathway unlocked!`);
    addTerminalEntry(`🎯 Click the ${project.title} icon above to explore this project!`);
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
    const project = projects.find(p => p.direction === direction);
    if (!project) return;    if (!unlockedProjects.includes(project.id)) {
      addTerminalEntry(`🔒 ${project.title} is locked! Use "${direction}" to unlock this pathway.`);
      return;
    }

    // Project is unlocked, proceed with navigation
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
        project={currentProject}        onBack={() => {          // Mark project as completed when returning from project view
          if (!completedProjects.includes(currentProject.id)) {
            completeProject(currentProject.id);
            addTerminalEntry(`✅ PROJECT MASTERED: ${currentProject.title}`);
            addTerminalEntry(`🎯 Knowledge acquired and archived!`);
              // Check if this completes Tier 1
            const newCompletedCount = completedProjects.length + 1;
            if (newCompletedCount === projects.length) {
              // Remove delay - show immediately
              addTerminalEntry('');
              addTerminalEntry('🎉 ═══ TIER 1 MASTERY ACHIEVED! ═══ 🎉');
              addTerminalEntry('🗺️  All directional realms explored!');
              addTerminalEntry('🔓 TIER 2 SYSTEMS NOW ONLINE!');
              addTerminalEntry('💫 Advanced command matrix unlocked!');
              addTerminalEntry('🎯 Type "help" to access your new abilities!');
              addTerminalEntry('');
            } else {
              // Give next step guidance for incomplete projects
              const remainingProjects = projects.filter(p => !completedProjects.includes(p.id) && p.id !== currentProject.id);
              if (remainingProjects.length > 0) {
                // Remove delay - show immediately
                addTerminalEntry('');
                addTerminalEntry('🧭 === NEXT EXPLORATION TARGET === 🧭');
                const nextProject = remainingProjects[0];
                const unlockedRemaining = remainingProjects.filter(p => unlockedProjects.includes(p.id));
                    if (unlockedRemaining.length > 0) {
                    const nextUnlocked = unlockedRemaining[0];
                    addTerminalEntry(`🎯 Ready to explore: ${nextUnlocked.title}`);
                    addTerminalEntry(`🖱️  Click the ${nextUnlocked.title} icon to continue your journey!`);
                  } else {
                    addTerminalEntry(`🔐 Next target: ${nextProject.title}`);
                    addTerminalEntry(`⚡ Use "${nextProject.direction}" to unlock this pathway`);
                    addTerminalEntry(`📊 Progress: ${completedProjects.length + 1}/${projects.length} projects completed`);
                  }
                  addTerminalEntry('');
              }
            }
          }
          setCurrentProject(null);
          setCurrentView('hub');
        }}
      />
    );
  }
  // Section view
  if (currentView === 'section' && currentSection) {    return (      <SectionView 
        section={currentSection}
        skillsUnlocked={skillsUnlocked}
        researchUnlocked={researchUnlocked}
        contactUnlocked={contactUnlocked}
        resumeUnlocked={resumeUnlocked}onBack={() => {
          // Show next step guidance when returning from sections
          const sectionOrder: SectionType[] = ['skills', 'research', 'contact', 'resume'];
          const currentIndex = sectionOrder.indexOf(currentSection!);
          const nextSection = sectionOrder[currentIndex + 1];
          
          if (nextSection) {
            const nextCommands = {
              'research': 'consult the scrolls',
              'contact': 'display beacon', 
              'resume': 'get apprenticeship'
            };
            const nextSectionTitles = {
              'research': 'Research Archives',
              'contact': 'Contact Channels',
              'resume': 'Resume Vault'
            };            
            // Remove delay - show immediately
            addTerminalEntry('');
            addTerminalEntry('🔄 === RETURNING TO COMMAND CENTER === 🔄');
            addTerminalEntry(`🎯 Next unlock available: ${nextSectionTitles[nextSection as keyof typeof nextSectionTitles]}`);
            addTerminalEntry(`⚡ Command: "${nextCommands[nextSection as keyof typeof nextCommands]}"`);
            addTerminalEntry('');
          } else {
            // All sections unlocked - Remove delay, show immediately
            addTerminalEntry('');
            addTerminalEntry('🎉 === ALL SYSTEMS FULLY EXPLORED === 🎉');
            addTerminalEntry('🏆 You have mastered every aspect of this portfolio!');
            addTerminalEntry('✨ Feel free to re-explore any section anytime');
            addTerminalEntry('');
          }
          
          setCurrentSection(null);
          setCurrentView('hub');        }}
      />);
  }

  // Check for completion - all projects completed and all sections unlocked
  const allCompleted = completedProjects.length === projects.length && 
                      skillsUnlocked && researchUnlocked && contactUnlocked && resumeUnlocked;
    
  // Show completion screen only if completed and hasn't been dismissed
  if (allCompleted && !hasCompletedOnce) {
    return <CompletionScreen onBack={() => {
      // Mark completion as seen and return to hub
      setHasCompletedOnce(true);
      setCurrentView('hub');
      setCurrentProject(null);
      setCurrentSection(null);      setAnimatingPath(null);
      
      // Show welcome back message immediately
      addTerminalEntry('');
      addTerminalEntry('🎉 === WELCOME BACK, MASTER EXPLORER! === 🎉');
      addTerminalEntry('');
      addTerminalEntry('✨ You have returned to the fully unlocked Hub');
      addTerminalEntry('🏆 Status: GRANDMASTER - All systems accessible');
      addTerminalEntry('🌟 Experience Level: Maximum');
      addTerminalEntry('');
      addTerminalEntry('🎯 All pathways remain open for re-exploration');
      addTerminalEntry('📚 Advanced systems ready for your command');
      addTerminalEntry('');
      addTerminalEntry('💡 Type "help" to see your full command matrix');
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
              </h3>              <div className="grid grid-cols-4 gap-4 justify-items-center">
                <SectionCard 
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
    <div className="flex flex-col items-center gap-2">
      <motion.div
        className={`
          relative h-12 w-12 rounded-lg cursor-pointer
          flex items-center justify-center transition-all duration-200
          ${isClickable 
            ? 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25' 
            : isAvailable 
            ? 'bg-gradient-to-br from-slate-500 to-slate-600 shadow-lg shadow-slate-500/25 hover:from-slate-400 hover:to-slate-500' 
            : 'bg-gradient-to-br from-slate-700 to-slate-800 cursor-not-allowed opacity-60'
          }
        `}
        whileHover={isAvailable ? { scale: 1.05 } : {}}
        whileTap={isClickable ? { scale: 0.95 } : {}}
        onClick={isClickable ? onClick : undefined}
      >
        <Icon 
          size={20} 
          className={
            isClickable 
              ? 'text-cyan-100' 
              : isAvailable 
              ? 'text-slate-200' 
              : 'text-slate-500'
          } 
        />
        {isClickable && (
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-400 rounded-full flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <span className="text-cyan-900 text-xs font-bold">✓</span>
          </motion.div>
        )}
        {!isAvailable && (
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 bg-slate-600 rounded-full flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <span className="text-slate-400 text-xs">🔒</span>
          </motion.div>
        )}
      </motion.div>
      
      {/* Section Name Label */}
      <motion.div
        className={`
          px-2 py-1 rounded text-xs font-medium max-w-20 text-center
          ${isClickable 
            ? 'bg-cyan-900/60 text-cyan-300' 
            : isAvailable 
            ? 'bg-slate-800/60 text-slate-400' 
            : 'bg-slate-900/60 text-slate-600'
          }
        `}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {title}
      </motion.div>
    </div>
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
function SectionView({ 
  section, 
  onBack,
  skillsUnlocked,
  researchUnlocked,
  contactUnlocked,
  resumeUnlocked
}: { 
  section: string; 
  onBack: () => void;
  skillsUnlocked: boolean;
  researchUnlocked: boolean;
  contactUnlocked: boolean;
  resumeUnlocked: boolean;
}) {
  const sectionData = {
    skills: {
      title: 'Skills Inventory',
      pathLabel: 'Advanced System Module',
      direction: 'Technology Stack Overview',
      icon: Code,
      content: {
        'Programming Languages': ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'C', 'R'],
        'Web Technologies': ['React', 'Next.js', 'Node.js', 'Express', 'Tailwind CSS', 'HTML/CSS']
      }
    },
    research: {
      title: 'Research',
      pathLabel: 'Advanced System Module',
      direction: 'Current Investigation',
      icon: Brain,
      content: {
        description: 'I am investigating KV cache compression for large language models—specifically through chunk-wise singular value decomposition (SVD) and dynamic token-rank strategies. The work combines mathematical exploration, GPU-accelerated computation, and high-performance system design to make inference more memory-efficient without degrading output quality. This research is deployed across Dockerized environments in HPC clusters.',
        repository: 'chunkedDecomp'
      }
    },
    contact: {
      title: 'Contact',
      pathLabel: 'Advanced System Module',
      direction: 'Communication Channels',
      icon: Mail,
      content: {
        'Email': 'bharadwajaadhav@gmail.com',
        'GitHub': 'github.com/Aadhavsb',
        'LinkedIn': 'linkedin.com/in/aadhav-bharadwaj'
      }
    },
    resume: {
      title: 'Resume',
      pathLabel: 'Advanced System Module',
      direction: 'Professional Documentation',
      icon: FileText,
      content: {
        description: 'Access resume containing detailed experience, education, certifications, and comprehensive skills inventory.',
        downloadText: 'Download PDF Resume',
        status: 'Available Soon'
      }
    }
  };
  const data = sectionData[section as keyof typeof sectionData];
  
  // Use the individual section unlocked states from the parent component
  const isAccessed = section === 'skills' ? skillsUnlocked :
                    section === 'research' ? researchUnlocked :
                    section === 'contact' ? contactUnlocked :
                    section === 'resume' ? resumeUnlocked : false;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="min-h-screen p-8 flex items-center justify-center"
    >
      <div className="max-w-4xl w-full">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Hub
        </motion.button>

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {data.title}
            </h1>
            {isAccessed && (
              <CheckCircle size={32} className="text-green-500" />
            )}
          </div>
          <p className="text-xl text-blue-300 mb-2">{data.pathLabel}</p>
          <p className="text-gray-400">{data.direction}</p>
        </motion.div>

        {/* Section Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 mb-8"
        >
          {/* Content based on section type */}
          {section === 'skills' ? (
            <>
              {/* Description */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">About This Section</h2>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Core technologies and programming languages in my current toolkit. This represents the primary tools I use for development and problem-solving.
                </p>
              </div>

              {/* Skills Grid */}
              {Object.entries(data.content).map(([category, skills]) => (
                <div key={category} className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4">{category}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(skills as string[]).map((skill) => (
                      <SkillIcon key={skill} skill={skill} />
                    ))}
                  </div>
                </div>
              ))}

              {/* Note */}
              <div className="mt-6 p-4 bg-blue-600/20 border border-blue-500/30 rounded-lg">
                <p className="text-blue-300 text-sm text-center">
                  💼 <span className="font-medium">Refer to the resume scroll for comprehensive skills inventory</span>
                </p>
              </div>
            </>
          ) : section === 'contact' ? (
            <>
              {/* Description */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">Get In Touch</h2>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Feel free to reach out for collaboration opportunities, technical discussions, or project inquiries.
                </p>
              </div>

              {/* Contact Methods */}
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
                />
              </div>
            </>
          ) : section === 'research' ? (
            <>              {/* Description */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">Current Research</h2>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {(data.content as { description: string }).description}
                </p>
              </div>

              {/* Repository Link */}
              <div className="flex flex-wrap gap-4">
                <motion.a
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  href="https://github.com/Aadhavsb/chunkedDecomp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
                >
                  <Github size={20} />
                  View Research Repository
                  <ExternalLink size={16} />
                </motion.a>
              </div>
            </>
          ) : section === 'resume' ? (
            <>
              {/* Description */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">Professional Documentation</h2>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {(data.content as { description: string }).description}
                </p>
              </div>

              {/* Download Section */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-6 py-3 bg-gray-700/50 rounded-lg text-gray-400">
                  <FileText size={20} />
                  {(data.content as { downloadText: string }).downloadText}
                  <span className="text-sm">({(data.content as { status: string }).status})</span>
                </div>
              </div>
            </>
          ) : null}
        </motion.div>

        {/* Section Complete Status */}
        {isAccessed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-600/20 border border-green-500/30 rounded-lg text-green-400 font-semibold">
              <CheckCircle size={20} />
              Module Accessed!
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
