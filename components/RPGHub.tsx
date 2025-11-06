'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/store';
import { Project, WorkExperience } from '@/lib/types';
import { TerminalSimple } from './TerminalSimple';
import { ProjectView } from './ProjectView';
import { WorkExperienceView } from './WorkExperienceView';
import { SkillIcon } from './SkillIcon';
import { ContactIcon } from './ContactIcon';
import { CompletionScreen } from './CompletionScreen';
import { Mail, FileText, Brain, Zap, Code, Database, Palette, ArrowLeft, CheckCircle, Github, ExternalLink, Briefcase } from 'lucide-react';
import portfolioData from '@/data/portfolio.json';

type ViewState = 'hub' | 'project' | 'section' | 'workExperience';
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
  const [currentWorkExperience, setCurrentWorkExperience] = useState<WorkExperience | null>(null);
  const [workExperiences] = useState<WorkExperience[]>(portfolioData.workExperience as WorkExperience[]);
  const [chroniclesUnlocked, setChroniclesUnlocked] = useState(false);
  const [viewedExperiences, setViewedExperiences] = useState<string[]>([]);
  const [skillsUnlocked, setSkillsUnlocked] = useState(false);
  const [researchUnlocked, setResearchUnlocked] = useState(false);
  const [contactUnlocked, setContactUnlocked] = useState(false);
  const [resumeUnlocked, setResumeUnlocked] = useState(false);
  const [animatingPath, setAnimatingPath] = useState<string | null>(null);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  const [hasCompletedOnce, setHasCompletedOnce] = useState(false);  // Show welcome messages on first load
  React.useEffect(() => {
    if (!hasShownWelcome && terminalHistory.length === 0) {      // No delay - show welcome immediately
      addTerminalEntry('🌟 === DIGITAL REALM ACTIVE === 🌟');
      addTerminalEntry('🎭 Welcome to Aadhav\'s Portfolio Hub');
      addTerminalEntry('🎯 Mission: Unlock projects & advanced systems');
      addTerminalEntry('⚡ Status: ONLINE | 5 realms await');
      addTerminalEntry('🔐 Advanced systems locked (unlock projects first)');
      addTerminalEntry('💡 Commands: "help" | "explore" | directionals');
      addTerminalEntry('🚀 Type "help" to begin your quest!');
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
      const allDirectionalProjectsUnlocked = projects.every(project =>
        unlockedProjects.includes(project.id)
      );

      addTerminalEntry('🔮 === COMMAND MATRIX === 🔮');
      if (!allDirectionalProjectsUnlocked) {
        addTerminalEntry('⚔️  TIER 1 - PROJECT EXPLORATION:');
        addTerminalEntry('   🧭 go north/east/south/west/northeast');
        addTerminalEntry('🎯 Unlock all projects to access TIER 2!');
      } else if (!chroniclesUnlocked) {
        addTerminalEntry('🔓 TIER 2 - INTERNSHIP EXPERIENCES:');
        addTerminalEntry('   🏢 review chronicles → unlock internships & TIER 3');
        addTerminalEntry('🎯 Type "review chronicles" to continue!');
      } else {
        addTerminalEntry('🔓 TIER 2 - INTERNSHIP EXPERIENCES:');
        addTerminalEntry('   📋 Click work experience cards to review (optional)');
        addTerminalEntry(`   Progress: ${viewedExperiences.length}/${workExperiences.length} experiences reviewed`);
        addTerminalEntry('');
        addTerminalEntry('🔓 TIER 3 - ADVANCED SYSTEMS (Unlock gradually):');
        addTerminalEntry('   📦 check inventory → skills');
        addTerminalEntry('   📜 consult the scrolls → research');
        addTerminalEntry('   📡 display beacon → contact');
        addTerminalEntry('   📋 get apprenticeship → resume');
      }
      addTerminalEntry('🛠️  UTILITY: help | explore | start journey');
    },    'start journey': () => {
      addTerminalEntry('🚀 === GUIDED EXPLORATION === 🚀');
      addTerminalEntry('🎯 Welcome to my interactive portfolio!');
      addTerminalEntry('📋 MISSION: Unlock 5 projects → internships → 4 advanced systems');
      addTerminalEntry('🧭 PATH: Use directional commands to unlock projects');
      addTerminalEntry('🖱️  Click unlocked icons to explore details (optional)');
      addTerminalEntry('💡 TIP: Type "go north" to unlock first project');
      addTerminalEntry('🌟 Ready? Start with "go north"!');
    },'explore': () => {
      addTerminalEntry('🗺️  === EXPLORER\'S GUIDE === 🗺️');
      addTerminalEntry('🎮 NAVIGATION: Use direction commands to unlock projects');
      addTerminalEntry('🖱️  Click unlocked icons to explore details (optional)');
      addTerminalEntry('🏆 PROGRESSION: 5 projects → internships → 4 systems');
      addTerminalEntry('💡 TIP: Type commands to unlock. Use "help" anytime!');
      addTerminalEntry('🚀 Ready? Try "go north" to unlock your first project!');
    },'go north': () => handleDirectionalCommand('go north'),
    'go east': () => handleDirectionalCommand('go east'),
    'go south': () => handleDirectionalCommand('go south'),
    'go west': () => handleDirectionalCommand('go west'),
    'go northeast': () => handleDirectionalCommand('go northeast'),
    'review chronicles': () => handleChroniclesUnlock(),
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

    // Check if all projects are now unlocked
    const allProjectsUnlocked = projects.every(p => unlockedProjects.includes(p.id) || p.id === project.id);
    if (allProjectsUnlocked) {
      addTerminalEntry('🎉 === ALL PATHS UNLOCKED === 🎉');
      addTerminalEntry('🏢 Internship Experiences available! Type "review chronicles"');
    }
  };

  const handleChroniclesUnlock = () => {
    // Check if all projects are unlocked (not necessarily clicked)
    const allDirectionalProjectsUnlocked = projects.every(project =>
      unlockedProjects.includes(project.id)
    );

    if (!allDirectionalProjectsUnlocked) {
      addTerminalEntry('⚠️  INTERNSHIP EXPERIENCES LOCKED: Unlock all directional paths first!');
      addTerminalEntry('🗺️  Missing paths: ' + projects.filter(p => !unlockedProjects.includes(p.id)).map(p => p.direction.replace('go ', '')).join(', '));
      return;
    }

    if (chroniclesUnlocked) {
      addTerminalEntry('📋 Internship Experiences already accessible!');
      addTerminalEntry('🎯 Click the work experience cards above to review them.');
      return;
    }

    // Unlock the chronicles section (but NOT Tier 3 systems yet)
    setChroniclesUnlocked(true);
    addTerminalEntry('🏢 === INTERNSHIP EXPERIENCES UNLOCKED === 🏢');
    addTerminalEntry('📋 Work experience archive now accessible!');
    addTerminalEntry('🎯 Click the experience cards above to explore each role.');
    addTerminalEntry('✨ TIER 3 commands now available in Quick Commands!');
  };

  const handleWorkExperienceClick = (experienceId: string) => {
    if (!chroniclesUnlocked) {
      addTerminalEntry('🔒 Internship Experiences locked! Unlock all directional paths first.');
      addTerminalEntry('💡 Type "review chronicles" after unlocking all 5 directions.');
      return;
    }

    const experience = workExperiences.find(exp => exp.id === experienceId);
    if (!experience) return;

    setCurrentWorkExperience(experience);
    setCurrentView('workExperience');
  };

  const handleSectionUnlock = (section: SectionType) => {
    if (!chroniclesUnlocked) {
      addTerminalEntry('⚠️  TIER 3 SYSTEMS LOCKED: Unlock Internship Experiences first!');
      addTerminalEntry('💡 Complete all projects, then type "review chronicles" to unlock TIER 2.');
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
            addTerminalEntry(`🎯 Knowledge acquired and archived!`);            // Check if this completes Tier 1
            const newCompletedCount = completedProjects.length + 1;
            if (newCompletedCount === projects.length) {
              // Remove delay - show immediately
              addTerminalEntry('🎉 === TIER 1 COMPLETE === 🎉');
              addTerminalEntry(' TIER 2 systems now online! Type "help"');
            } else {
              // Give next step guidance for incomplete projects
              const remainingProjects = projects.filter(p => !completedProjects.includes(p.id) && p.id !== currentProject.id);
              if (remainingProjects.length > 0) {
                // Remove delay - show immediately
                const nextProject = remainingProjects[0];
                const unlockedRemaining = remainingProjects.filter(p => unlockedProjects.includes(p.id));
                    if (unlockedRemaining.length > 0) {
                    const nextUnlocked = unlockedRemaining[0];
                    addTerminalEntry(`🎯 Next: Click ${nextUnlocked.title} to continue`);
                  } else {                    addTerminalEntry(`🔐 Next: "${nextProject.direction}" to unlock ${nextProject.title}`);
                  }
              }
            }
          }
          setCurrentProject(null);
          setCurrentView('hub');
        }}
      />
    );
  }

  // Work Experience view
  if (currentView === 'workExperience' && currentWorkExperience) {
    return (
      <WorkExperienceView
        experience={currentWorkExperience}
        onBack={() => {
          // Mark experience as viewed when returning
          if (!viewedExperiences.includes(currentWorkExperience.id)) {
            setViewedExperiences([...viewedExperiences, currentWorkExperience.id]);
            addTerminalEntry(`✅ EXPERIENCE REVIEWED: ${currentWorkExperience.company}`);
            addTerminalEntry(`📋 Professional background documented!`);

            // Check if all experiences are now viewed
            const newViewedCount = viewedExperiences.length + 1;
            if (newViewedCount === workExperiences.length) {
              addTerminalEntry('🎉 === ALL INTERNSHIPS EXPLORED === 🎉');
              addTerminalEntry('✨ Work experience fully documented!');
            } else {
              // Show remaining experiences
              const remainingExperiences = workExperiences.filter(
                exp => !viewedExperiences.includes(exp.id) && exp.id !== currentWorkExperience.id
              );
              if (remainingExperiences.length > 0) {
                const nextExp = remainingExperiences[0];
                addTerminalEntry(`🎯 Next: Review ${nextExp.company} experience`);
              }
            }
          }
          setCurrentWorkExperience(null);
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

  // Check for completion - all projects completed, all experiences viewed, and all sections unlocked
  const allCompleted = completedProjects.length === projects.length &&
                      viewedExperiences.length === workExperiences.length &&
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
      
      <div className="container mx-auto px-4 pt-4 h-full flex flex-col relative z-10">
        {/* Header - Compact */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2 tracking-tight">
            Aadhav&apos;s Portfolio
          </h1>
          <p className="text-sm text-slate-400">Interactive Developer Experience</p>        </motion.div>        {/* Main Grid - Fixed height layout to prevent terminal shrinking */}
        <div className="flex-1 flex gap-3 min-h-0 h-full">          {/* Left - Terminal - Slightly bigger width, full height */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-[30rem] flex-shrink-0 h-full"
          >
            <div className="h-full bg-slate-900/40 backdrop-blur-md border border-slate-700/50 rounded-lg p-4 flex flex-col">
              <h3 className="text-lg font-semibold mb-3 text-cyan-400 flex items-center">
                <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></span>
                Terminal
              </h3>              <div className="flex-1 min-h-0">
                <TerminalSimple
                  history={terminalHistory}
                  onCommand={handleCommand}
                  quickCommands={(() => {
                    const allProjectsUnlocked = projects.every(project =>
                      unlockedProjects.includes(project.id)
                    );

                    const commands = [
                      { label: 'Help', command: 'help', icon: '❓' },
                      { label: 'Explore', command: 'explore', icon: '🗺️' }
                    ];

                    if (chroniclesUnlocked) {
                      // Tier 3 commands - Advanced Systems (show immediately when chronicles unlocked)
                      commands.push(
                        { label: 'check inventory', command: 'check inventory', icon: '📦' },
                        { label: 'consult the scrolls', command: 'consult the scrolls', icon: '📜' },
                        { label: 'display beacon', command: 'display beacon', icon: '📡' },
                        { label: 'get apprenticeship', command: 'get apprenticeship', icon: '📋' }
                      );
                    } else if (allProjectsUnlocked) {
                      // Tier 2 - Show review chronicles command (once all projects unlocked)
                      commands.push(
                        { label: 'review chronicles', command: 'review chronicles', icon: '🏢' }
                      );
                    } else {
                      // Tier 1 commands - only show locked directions
                      const availableDirections = [
                        { direction: 'go north', label: 'North', icon: '⬆️' },
                        { direction: 'go east', label: 'East', icon: '➡️' },
                        { direction: 'go south', label: 'South', icon: '⬇️' },
                        { direction: 'go west', label: 'West', icon: '⬅️' },
                        { direction: 'go northeast', label: 'NE', icon: '↗️' }
                      ];

                      availableDirections.forEach(dir => {
                        const project = projects.find(p => p.direction === dir.direction);
                        if (project && !unlockedProjects.includes(project.id)) {
                          commands.push({
                            label: dir.label,
                            command: dir.direction,
                            icon: dir.icon
                          });
                        }
                      });
                    }

                    return commands;
                  })()}
                />
              </div>
            </div>
          </motion.div>          {/* Right Side - Project Hub and Advanced Cards - Fill remaining space */}
          <div className="flex-1 flex flex-col gap-2 min-h-0">{/* Project Hub - Compact height */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900/30 backdrop-blur-md border border-slate-700/50 rounded-lg p-4 flex flex-col"
            >
              <h3 className="text-lg font-semibold mb-4 text-center text-slate-200 flex items-center justify-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                Project Hub
                <span className="w-2 h-2 bg-blue-400 rounded-full ml-2"></span>
              </h3>                {/* Project Grid - Better spacing */}
              <div className="relative grid grid-cols-3 grid-rows-3 gap-6 max-w-sm mx-auto place-items-center mb-4">
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
                />                <motion.div 
                  className="flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800 rounded-full h-10 w-10 border border-slate-600 shadow-lg"
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
            </motion.div>

            {/* Internship Experiences Section - Middle Tier */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-slate-900/30 backdrop-blur-md border border-slate-700/50 rounded-lg p-3"
            >
              <h3 className="text-lg font-semibold mb-3 text-center text-orange-400 flex items-center justify-center">
                <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                Internship Experiences
                <span className="w-2 h-2 bg-orange-400 rounded-full ml-2"></span>
              </h3>
              <div className="flex items-center justify-center gap-6">
                {workExperiences.map((experience) => (
                  <WorkExperienceCard
                    key={experience.id}
                    experience={experience}
                    chroniclesUnlocked={chroniclesUnlocked}
                    viewed={viewedExperiences.includes(experience.id)}
                    allProjectsUnlocked={projects.every(project => unlockedProjects.includes(project.id))}
                    onClick={() => handleWorkExperienceClick(experience.id)}
                  />
                ))}
              </div>
            </motion.div>

            {/* Advanced Section Cards - Expand to fill space */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex-1 bg-slate-900/30 backdrop-blur-md border border-slate-700/50 rounded-lg p-3 flex flex-col"
            >
              <h3 className="text-lg font-semibold mb-3 text-center text-slate-200 flex items-center justify-center">
                <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                Advanced Systems
                <span className="w-2 h-2 bg-purple-400 rounded-full ml-2"></span>
              </h3>
                <div className="flex-1 flex items-center justify-center">
                <div className="grid grid-cols-4 gap-6 justify-items-center">
                <SectionCard
                  title="Skills"
                  icon={Code}
                  unlocked={skillsUnlocked}
                  chroniclesUnlocked={chroniclesUnlocked}
                  onClick={() => handleSectionCardClick('skills')}
                />
                <SectionCard
                  title="Research"
                  icon={Brain}
                  unlocked={researchUnlocked}
                  chroniclesUnlocked={chroniclesUnlocked}
                  onClick={() => handleSectionCardClick('research')}
                />
                <SectionCard
                  title="Contact"
                  icon={Mail}
                  unlocked={contactUnlocked}
                  chroniclesUnlocked={chroniclesUnlocked}
                  onClick={() => handleSectionCardClick('contact')}
                />
                <SectionCard
                  title="Resume"
                  icon={FileText}
                  unlocked={resumeUnlocked}
                  chroniclesUnlocked={chroniclesUnlocked}
                  onClick={() => handleSectionCardClick('resume')}                />
              </div>
              </div>
            </motion.div>{/* Progress Bar - Compact */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-2"
            >              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-300 text-sm">Progress</span>
                <span className="text-cyan-400 text-sm font-medium">
                  {completedProjects.length + viewedExperiences.length + [skillsUnlocked, researchUnlocked, contactUnlocked, resumeUnlocked].filter(Boolean).length}/11
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${((completedProjects.length + viewedExperiences.length + [skillsUnlocked, researchUnlocked, contactUnlocked, resumeUnlocked].filter(Boolean).length) / 11) * 100}%`
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
      <div className={`flex ${getLayoutClasses()} gap-2`}>        <motion.div
          className={`
            relative h-10 w-10 rounded-lg cursor-pointer
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
            size={18} 
            className={isCompleted ? 'text-green-100' : isUnlocked ? 'text-blue-100' : 'text-slate-300'} 
          />
          {isCompleted && (
            <motion.div
              className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full flex items-center justify-center"
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
            px-2 py-0.5 rounded text-xs font-medium max-w-24 text-center break-words
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
function SectionCard({ title, icon: Icon, unlocked, chroniclesUnlocked, onClick }: {
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  unlocked: boolean;
  chroniclesUnlocked: boolean;
  onClick: () => void;
}) {
  const isClickable = unlocked;
  const isAvailable = chroniclesUnlocked;

  return (
    <div className="flex flex-col items-center gap-2">      <motion.div
        className={`
          relative h-10 w-10 rounded-lg cursor-pointer
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
          size={18} 
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
            className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-cyan-400 rounded-full flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <span className="text-cyan-900 text-xs font-bold">✓</span>
          </motion.div>
        )}
        {!isAvailable && (
          <motion.div
            className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-slate-600 rounded-full flex items-center justify-center"
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
          px-2 py-0.5 rounded text-xs font-medium max-w-18 text-center
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

// Work Experience Card Component
function WorkExperienceCard({
  experience,
  chroniclesUnlocked,
  viewed,
  allProjectsUnlocked,
  onClick
}: {
  experience: WorkExperience;
  chroniclesUnlocked: boolean;
  viewed: boolean;
  allProjectsUnlocked: boolean;
  onClick: () => void;
}) {
  const isClickable = chroniclesUnlocked;
  const isAvailable = allProjectsUnlocked;

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div
        className={`
          relative h-10 w-10 rounded-lg cursor-pointer
          flex items-center justify-center transition-all duration-200
          ${viewed
            ? 'bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/25'
            : isClickable
            ? 'bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/25 hover:from-orange-400 hover:to-orange-500'
            : isAvailable
            ? 'bg-gradient-to-br from-slate-500 to-slate-600 shadow-lg shadow-slate-500/25'
            : 'bg-gradient-to-br from-slate-700 to-slate-800 cursor-not-allowed opacity-60'
          }
        `}
        whileHover={isClickable || isAvailable ? { scale: 1.05 } : {}}
        whileTap={isClickable ? { scale: 0.95 } : {}}
        onClick={isClickable ? onClick : undefined}
      >
        <Briefcase
          size={18}
          className={
            viewed
              ? 'text-green-100'
              : isClickable
              ? 'text-orange-100'
              : isAvailable
              ? 'text-slate-200'
              : 'text-slate-500'
          }
        />
        {viewed && (
          <motion.div
            className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <span className="text-green-900 text-xs font-bold">✓</span>
          </motion.div>
        )}
        {!isAvailable && (
          <motion.div
            className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-slate-600 rounded-full flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <span className="text-slate-400 text-xs">🔒</span>
          </motion.div>
        )}
      </motion.div>

      {/* Experience Name Label */}
      <motion.div
        className={`
          px-2 py-0.5 rounded text-xs font-medium max-w-24 text-center
          ${viewed
            ? 'bg-green-900/60 text-green-300'
            : isClickable
            ? 'bg-orange-900/60 text-orange-300'
            : isAvailable
            ? 'bg-slate-800/60 text-slate-400'
            : 'bg-slate-800/60 text-slate-500'
          }
        `}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {experience.company}
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
        downloadText: 'Download PDF Resume'
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
                <motion.a
                  href="https://drive.google.com/file/d/1J5YsWXeU-5DrI5iDPlsuf5CkfaAfnsMB/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FileText size={20} />
                  {(data.content as { downloadText: string }).downloadText}
                  <ExternalLink size={16} />
                </motion.a>
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
