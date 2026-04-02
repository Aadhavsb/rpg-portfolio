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
import { Mail, FileText, Brain, Zap, Code, Database, Palette, ArrowLeft, CheckCircle, Github, ExternalLink, Briefcase, MessageSquare } from 'lucide-react';
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
      addTerminalEntry('Welcome to Aadhav\'s Portfolio Hub');
      addTerminalEntry('Type "help" for commands. 6 realms await.');
      setHasShownWelcome(true);
    }
  }, [hasShownWelcome, terminalHistory.length, addTerminalEntry]);


  // Completion check
  React.useEffect(() => {
    const allDone = completedProjects.length === projects.length &&
                    viewedExperiences.length === workExperiences.length &&
                    skillsUnlocked && researchUnlocked && contactUnlocked && resumeUnlocked;
    if (allDone && !hasCompletedOnce) {
      setHasCompletedOnce(true);
      addTerminalEntry('All sections explored! Portfolio complete.');
    }
  }, [completedProjects, viewedExperiences, skillsUnlocked, researchUnlocked, contactUnlocked, resumeUnlocked, projects.length, workExperiences.length, hasCompletedOnce, addTerminalEntry]);
  // Project icon mapping
  const projectIcons = {
    'palate': Palette,
    'expressink': Brain,
    'premier-league': Zap,
    'inventory360': Database,
    'brickd': Code,
    'arguably': MessageSquare
  };  // Command mappings with automatic path discovery
  const commandMap: { [key: string]: () => void } = {    'help': () => {
      const allDirectionalProjectsUnlocked = projects.every(project =>
        unlockedProjects.includes(project.id)
      );

      if (!allDirectionalProjectsUnlocked) {
        addTerminalEntry('Directions: go north/south/northeast/northwest/southeast/southwest');
      } else if (!chroniclesUnlocked) {
        addTerminalEntry('Type "review chronicles" to unlock internships');
      } else {
        addTerminalEntry('check inventory | consult the scrolls | display beacon | get apprenticeship');
      }
    },    'start journey': () => {
      addTerminalEntry('Unlock projects with directional commands. Try "go north"!');
    },'explore': () => {
      addTerminalEntry('6 projects → internships → 4 systems. Type "go north" to start.');
    },'go north': () => handleDirectionalCommand('go north'),
    'go northeast': () => handleDirectionalCommand('go northeast'),
    'go northwest': () => handleDirectionalCommand('go northwest'),
    'go south': () => handleDirectionalCommand('go south'),
    'go southeast': () => handleDirectionalCommand('go southeast'),
    'go southwest': () => handleDirectionalCommand('go southwest'),
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

    setAnimatingPath(direction);
    addTerminalEntry(`Opening ${project.title}...`);    // Show project after brief animation
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

    if (unlockedProjects.includes(project.id)) {
      addTerminalEntry(`Already unlocked. Click ${project.title} to explore.`);
      return;
    }

    unlockProject(project.id);
    addTerminalEntry(`${project.title} unlocked! Click to explore.`);

    const allProjectsUnlocked = projects.every(p => unlockedProjects.includes(p.id) || p.id === project.id);
    if (allProjectsUnlocked) {
      addTerminalEntry('All paths unlocked! Type "review chronicles"');
    }
  };

  const handleChroniclesUnlock = () => {
    // Check if all projects are unlocked (not necessarily clicked)
    const allDirectionalProjectsUnlocked = projects.every(project =>
      unlockedProjects.includes(project.id)
    );

    if (!allDirectionalProjectsUnlocked) {
      addTerminalEntry('Unlock all directions first. Missing: ' + projects.filter(p => !unlockedProjects.includes(p.id)).map(p => p.direction.replace('go ', '')).join(', '));
      return;
    }

    if (chroniclesUnlocked) {
      addTerminalEntry('Already unlocked. Click experience cards to review.');
      return;
    }

    setChroniclesUnlocked(true);
    addTerminalEntry('Internship experiences unlocked! Click cards to review.');
  };

  const handleWorkExperienceClick = (experienceId: string) => {
    if (!chroniclesUnlocked) {
      addTerminalEntry('Unlock all directions first, then type "review chronicles".');
      return;
    }

    const experience = workExperiences.find(exp => exp.id === experienceId);
    if (!experience) return;

    setCurrentWorkExperience(experience);
    setCurrentView('workExperience');
  };

  const handleSectionUnlock = (section: SectionType) => {
    if (!chroniclesUnlocked) {
      addTerminalEntry('Unlock internships first. Type "review chronicles".');
      return;
    }

    // Unlock all sections at once
    if (!skillsUnlocked) {
      setSkillsUnlocked(true);
      setResearchUnlocked(true);
      setContactUnlocked(true);
      setResumeUnlocked(true);
      addTerminalEntry('All sections unlocked: Skills, Research, Contact, Resume.');
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
    if (skillsUnlocked) {
      // All sections are unlocked together, so just navigate
      setCurrentSection(section);
      setCurrentView('section');
    } else if (chroniclesUnlocked) {
      // Unlock all sections at once and navigate
      setSkillsUnlocked(true);
      setResearchUnlocked(true);
      setContactUnlocked(true);
      setResumeUnlocked(true);
      addTerminalEntry('All sections unlocked: Skills, Research, Contact, Resume.');
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
            addTerminalEntry(`${currentProject.title} completed.`);
            const newCompletedCount = completedProjects.length + 1;
            if (newCompletedCount === projects.length) {
              addTerminalEntry('All projects done! Type "help" for next steps.');
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
            addTerminalEntry(`${currentWorkExperience.company} reviewed.`);
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
          setCurrentSection(null);
          setCurrentView('hub');
        }}
      />);
  }

  // Main hub view
  return (
    <div className="h-screen bg-gradient-to-br from-slate-950 via-stone-900 to-slate-900 text-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_1px_1px,_white_1px,_transparent_0)]" style={{backgroundSize: '50px 50px'}}></div>
      
      <div className="container mx-auto px-4 pt-4 h-full flex flex-col relative z-10">
        {/* Header - Compact */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-2"
        >
          <h1 className="text-4xl font-bold text-amber-300 font-mono mb-2 tracking-tight">
            Aadhav&apos;s Portfolio
          </h1>
          <p className="text-sm text-amber-200/50 font-mono">Interactive Developer Experience</p>        </motion.div>        {/* Main Grid - Fixed height layout to prevent terminal shrinking */}
        <div className="flex-1 flex gap-3 min-h-0 h-full">          {/* Left - Terminal - Slightly bigger width, full height */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-[30rem] flex-shrink-0 h-full"
          >
            <div className="h-full bg-black/60 border-2 border-amber-500/20 rounded-lg p-4 flex flex-col">
              <h3 className="text-lg font-semibold mb-3 text-amber-400 font-mono flex items-center">
                <span className="w-2 h-2 bg-amber-400 rounded-full mr-2"></span>
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
                        { direction: 'go northwest', label: 'NW', icon: '↖️' },
                        { direction: 'go north', label: 'North', icon: '⬆️' },
                        { direction: 'go northeast', label: 'NE', icon: '↗️' },
                        { direction: 'go southwest', label: 'SW', icon: '↙️' },
                        { direction: 'go south', label: 'South', icon: '⬇️' },
                        { direction: 'go southeast', label: 'SE', icon: '↘️' }
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
          <div className="flex-1 flex flex-col gap-1.5 min-h-0">{/* Project Hub - Compact height */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-black/40 border-2 border-amber-500/20 rounded-lg p-3 flex flex-col"
            >
              <h3 className="text-lg font-semibold mb-2 text-center text-amber-300 font-mono flex items-center justify-center">
                <span className="w-2 h-2 bg-amber-400 rounded-full mr-2"></span>
                Project Hub
                <span className="w-2 h-2 bg-amber-400 rounded-full ml-2"></span>
              </h3>                {/* Project Grid - Better spacing */}
              <div className="relative grid grid-cols-3 grid-rows-3 gap-4 max-w-sm mx-auto place-items-center mb-2">
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

                {/* Row 1 - NW, North, NE */}
                <ProjectIcon
                  project={projects.find(p => p.direction === 'go northwest')}
                  direction="go northwest"
                  onClick={handleProjectIconClick}
                  unlockedProjects={unlockedProjects}
                  completedProjects={completedProjects}
                  projectIcons={projectIcons}
                />
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

                {/* Row 2 - empty, HUB, empty */}
                <div></div>
                <motion.div
                  className="flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800 rounded-full h-10 w-10 border border-slate-600 shadow-lg"
                  whileHover={{ scale: 1.1 }}
                >
                  <span className="text-xs font-semibold text-slate-300">HUB</span>
                </motion.div>
                <div></div>

                {/* Row 3 - SW, South, SE */}
                <ProjectIcon
                  project={projects.find(p => p.direction === 'go southwest')}
                  direction="go southwest"
                  onClick={handleProjectIconClick}
                  unlockedProjects={unlockedProjects}
                  completedProjects={completedProjects}
                  projectIcons={projectIcons}
                />
                <ProjectIcon
                  project={projects.find(p => p.direction === 'go south')}
                  direction="go south"
                  onClick={handleProjectIconClick}
                  unlockedProjects={unlockedProjects}
                  completedProjects={completedProjects}
                  projectIcons={projectIcons}
                />
                <ProjectIcon
                  project={projects.find(p => p.direction === 'go southeast')}
                  direction="go southeast"
                  onClick={handleProjectIconClick}
                  unlockedProjects={unlockedProjects}
                  completedProjects={completedProjects}
                  projectIcons={projectIcons}
                />
              </div>
            </motion.div>

            {/* Internship Experiences Section - Middle Tier */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-black/40 border-2 border-amber-500/20 rounded-lg p-3"
            >
              <h3 className="text-lg font-semibold mb-3 text-center text-amber-400 font-mono flex items-center justify-center">
                <span className="w-2 h-2 bg-amber-400 rounded-full mr-2"></span>
                Internship Experiences
                <span className="w-2 h-2 bg-amber-400 rounded-full ml-2"></span>
              </h3>
              <div className="flex flex-wrap items-center justify-center gap-4">
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
              className="flex-1 bg-black/40 border-2 border-amber-500/20 rounded-lg p-3 flex flex-col"
            >
              <h3 className="text-lg font-semibold mb-3 text-center text-amber-300 font-mono flex items-center justify-center">
                <span className="w-2 h-2 bg-amber-400 rounded-full mr-2"></span>
                Advanced Systems
                <span className="w-2 h-2 bg-amber-400 rounded-full ml-2"></span>
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
              className="bg-black/40 border border-amber-500/20 rounded-lg p-1.5"
            >              <div className="flex justify-between items-center mb-1">
                <span className="text-amber-200/70 text-sm font-mono">Progress</span>
                <span className="text-amber-400 text-sm font-medium font-mono">
                  {completedProjects.length + viewedExperiences.length + [skillsUnlocked, researchUnlocked, contactUnlocked, resumeUnlocked].filter(Boolean).length}/15
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-amber-500 to-yellow-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${((completedProjects.length + viewedExperiences.length + [skillsUnlocked, researchUnlocked, contactUnlocked, resumeUnlocked].filter(Boolean).length) / 15) * 100}%`
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
        case 'go northeast':
          return 'flex-col items-center';
        case 'go northwest':
          return 'flex-col items-center';
        case 'go southeast':
          return 'flex-col-reverse items-center';
        case 'go southwest':
          return 'flex-col-reverse items-center';
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
    'go northeast': { x: 100, y: -100 },
    'go northwest': { x: -100, y: -100 },
    'go south': { x: 0, y: 100 },
    'go southeast': { x: 100, y: 100 },
    'go southwest': { x: -100, y: 100 }
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
        'Programming Languages': ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C', 'C#', 'R', 'SQL', 'SystemVerilog', 'Assembly'],
        'Web Technologies': ['React', 'Next.js', 'Node.js', 'Express', 'Tailwind CSS', 'HTML/CSS'],
        'AI/ML & Data': ['PyTorch', 'TensorFlow', 'Machine Learning', 'MongoDB'],
        'Tools & DevOps': ['Git', 'Docker', 'Unity', 'Linux']
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
      className="min-h-screen p-8 flex items-center justify-center bg-gradient-to-br from-slate-900 via-stone-900 to-amber-900 font-mono"
    >
      <div className="max-w-4xl w-full">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-amber-400/70 hover:text-amber-300 transition-colors"
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
            <h1 className="text-5xl font-bold text-amber-300">
              {data.title}
            </h1>
            {isAccessed && (
              <CheckCircle size={32} className="text-amber-500" />
            )}
          </div>
          <p className="text-xl text-amber-400 mb-2">{data.pathLabel}</p>
          <p className="text-amber-200/50">{data.direction}</p>
        </motion.div>

        {/* Section Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-black/80 border-2 border-amber-500/30 rounded-lg p-8 mb-8"
        >
          {/* Content based on section type */}
          {section === 'skills' ? (
            <>
              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl text-amber-300 mb-4">Skill Inventory</h2>
                <p className="text-amber-200/80 text-lg leading-relaxed">
                  Core technologies and programming languages in my current toolkit. This represents the primary tools I use for development and problem-solving.
                </p>
              </div>

              {/* Skills Grid */}
              {Object.entries(data.content).map(([category, skills]) => (
                <div key={category} className="mb-8">
                  <h3 className="text-lg text-amber-300 mb-4">{category}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(skills as string[]).map((skill) => (
                      <SkillIcon key={skill} skill={skill} />
                    ))}
                  </div>
                </div>
              ))}

              {/* Note */}
              <div className="mt-6 p-4 bg-amber-600/20 border border-amber-500/30 rounded-lg">
                <p className="text-amber-300 text-sm text-center">
                  <span className="font-medium">&gt; Refer to the resume scroll for comprehensive skills inventory</span>
                </p>
              </div>
            </>
          ) : section === 'contact' ? (
            <>
              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl text-amber-300 mb-4">Communication Channels</h2>
                <p className="text-amber-200/80 text-lg leading-relaxed">
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
            <>
              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl text-amber-300 mb-4">Current Research</h2>
                <p className="text-amber-200/80 text-lg leading-relaxed">
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
                  className="flex items-center gap-2 px-6 py-3 bg-amber-600/20 hover:bg-amber-600/40 border border-amber-500/30 rounded text-amber-200 transition-colors"
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
                <h2 className="text-xl text-amber-300 mb-4">Professional Documentation</h2>
                <p className="text-amber-200/80 text-lg leading-relaxed">
                  {(data.content as { description: string }).description}
                </p>
              </div>

              {/* Download Section */}
              <div className="flex flex-wrap gap-4">
                <motion.a
                  href="https://drive.google.com/file/d/1hkRizSsR4ptumm_6wLm8bfNBjFJp4MXI/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-amber-600/20 hover:bg-amber-600/40 border border-amber-500/30 rounded text-amber-200 transition-colors cursor-pointer"
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
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600/20 border border-amber-500/30 rounded-lg text-amber-400 font-semibold">
              <CheckCircle size={20} />
              Module Accessed!
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
