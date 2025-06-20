'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/store';
import { Project } from '@/lib/types';
import { TerminalSimple } from './TerminalSimple';
import { ProjectView } from './ProjectView';
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
  const [animatingPath, setAnimatingPath] = useState<string | null>(null);

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
        break;
      case 'resume':
        setResumeUnlocked(true);
        addTerminalEntry('Apprenticeship documents materialized!');
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
      addTerminalEntry(`Unknown command: ${cmd}. Type 'help' for available commands.`);
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
  }  // Main hub view
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
          <p className="text-sm text-slate-400">Interactive Developer Experience</p>
        </motion.div>        {/* Main Grid - Flex layout for better screen utilization */}
        <div className="flex-1 flex gap-4 min-h-0">
          {/* Left - Terminal */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-80 flex-shrink-0"
          >
            <div className="h-full bg-slate-900/40 backdrop-blur-md border border-slate-700/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 text-cyan-400 flex items-center">
                <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></span>
                Terminal
              </h3>
              <TerminalSimple 
                history={terminalHistory}
                onCommand={handleCommand}
              />
            </div>
          </motion.div>

          {/* Center - Project Hub */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col min-h-0"
          >
            <div className="flex-1 bg-slate-900/30 backdrop-blur-md border border-slate-700/50 rounded-lg p-6 flex flex-col">
              <h3 className="text-xl font-semibold mb-4 text-center text-slate-200 flex items-center justify-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                Project Hub
                <span className="w-2 h-2 bg-blue-400 rounded-full ml-2"></span>
              </h3>
              
              {/* Project Grid with Path Animations */}
              <div className="relative grid grid-cols-5 grid-rows-5 gap-2 max-w-2xl mx-auto flex-1 place-items-center">
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
                </AnimatePresence>                {/* Project Icons in Grid */}
                {/* Row 1 */}
                <div></div>
                <div></div>
                <ProjectIcon 
                  project={projects.find(p => p.direction === 'go north')} 
                  direction="go north" 
                  onClick={handleProjectIconClick}
                  unlockedProjects={unlockedProjects}
                  completedProjects={completedProjects}
                  projectIcons={projectIcons}
                />
                <div></div>
                <ProjectIcon 
                  project={projects.find(p => p.direction === 'go northeast')} 
                  direction="go northeast" 
                  onClick={handleProjectIconClick}
                  unlockedProjects={unlockedProjects}
                  completedProjects={completedProjects}
                  projectIcons={projectIcons}
                />

                {/* Row 2 */}
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>

                {/* Row 3 - Center row with HUB */}
                <div></div>
                <ProjectIcon 
                  project={projects.find(p => p.direction === 'go west')} 
                  direction="go west" 
                  onClick={handleProjectIconClick}
                  unlockedProjects={unlockedProjects}
                  completedProjects={completedProjects}
                  projectIcons={projectIcons}
                />
                <motion.div 
                  className="flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800 rounded-full h-12 w-12 border border-slate-600 shadow-lg"
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
                <div></div>

                {/* Row 4 */}
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>

                {/* Row 5 */}
                <div></div>
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
                <div></div>
              </div>
            </div>
          </motion.div>
        </div>        {/* Bottom - Section Cards - Compact Row */}
        {(skillsUnlocked || researchUnlocked || contactUnlocked || resumeUnlocked) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 flex gap-3 justify-center"
          >
            {skillsUnlocked && (
              <SectionCard 
                title="Skills"
                icon={Code}
                unlocked={skillsUnlocked}
                command="check inventory"
                onClick={() => handleSectionCardClick('skills')}
              />
            )}
            {researchUnlocked && (
              <SectionCard 
                title="Research"
                icon={Brain}
                unlocked={researchUnlocked}
                command="consult the scrolls"
                onClick={() => handleSectionCardClick('research')}
              />
            )}
            {contactUnlocked && (
              <SectionCard 
                title="Contact"
                icon={Mail}
                unlocked={contactUnlocked}
                command="display beacon"
                onClick={() => handleSectionCardClick('contact')}
              />
            )}
            {resumeUnlocked && (
              <SectionCard 
                title="Resume"
                icon={FileText}
                unlocked={resumeUnlocked}
                command="get apprenticeship"
                onClick={() => handleSectionCardClick('resume')}
              />
            )}
          </motion.div>
        )}

        {/* Progress Bar - Minimal */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-3"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-300 text-sm">Progress</span>
            <span className="text-cyan-400 text-sm font-medium">{completedProjects.length}/{projects.length}</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(completedProjects.length / projects.length) * 100}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </motion.div>
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
    if (!project) return <div className="h-10 w-10"></div>;

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
function SectionCard({ title, icon: Icon, unlocked, command, onClick }: {
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  unlocked: boolean;
  command: string;
  onClick: () => void;
}) {
    return (
      <motion.div
        className={`
          relative px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 flex items-center gap-3
          ${unlocked 
            ? 'bg-slate-800/60 border border-cyan-500/50 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30' 
            : 'bg-slate-900/60 border border-slate-600/50 hover:border-slate-500'
          }
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
      >
        <Icon 
          size={16} 
          className={unlocked ? 'text-cyan-400' : 'text-slate-500'} 
        />
        <span className={`text-sm font-medium ${unlocked ? 'text-slate-200' : 'text-slate-400'}`}>
          {title}
        </span>
        {unlocked && (
          <motion.div
            className="w-2 h-2 bg-cyan-400 rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          />
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
function SectionView({ section, onBack }: { section: string; onBack: () => void }) {
  const sectionData = {
    skills: {
      title: 'Skills Inventory',
      icon: Code,
      content: {
        'Programming Languages': ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#'],
        'Web Technologies': ['React', 'Next.js', 'Node.js', 'Express', 'Tailwind CSS', 'HTML/CSS'],
        'Backend & Cloud': ['MongoDB', 'PostgreSQL', 'Docker', 'Git', 'AWS'],
        'AI/ML': ['TensorFlow', 'Scikit-learn', 'Pandas', 'OpenAI API', 'Computer Vision']
      }
    },
    research: {
      title: 'Research Archives',
      icon: Brain,
      content: {
        'Project': 'chunkedDecomp',
        'Focus': 'Token-wise transformer KV Cache compression using SVD',
        'Method': 'Dynamic-rank token compression with chunked fusion to minimize memory during inference',
        'Deployment': 'Dockerized + GPU on HPC',
        'Repository': 'github.com/Aadhavsb/chunkedDecomp'
      }
    },
    contact: {
      title: 'Contact Beacon',
      icon: Mail,
      content: {
        'Email': 'bharadwajaadhav@gmail.com',
        'GitHub': 'github.com/Aadhavsb',
        'LinkedIn': 'linkedin.com/in/aadhav-bharadwaj'
      }
    },
    resume: {
      title: 'Apprenticeship Documents',
      icon: FileText,
      content: {
        'Education': 'Computer Science',
        'Experience': 'Full Stack Development',
        'Research': 'Machine Learning & AI',
        'Download': 'Resume.pdf [Available Soon]'
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
          </div>

          <div className="space-y-6">
            {section === 'skills' ? (
              Object.entries(data.content).map(([category, skills]) => (
                <div key={category}>
                  <h3 className="text-xl font-semibold text-cyan-400 mb-3">{category}</h3>
                  <div className="flex flex-wrap gap-3">
                    {(skills as string[]).map((skill) => (
                      <span
                        key={skill}
                        className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))
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
