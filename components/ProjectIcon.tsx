'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Project } from '@/lib/types';
import { Code } from 'lucide-react';

interface ProjectIconProps {
  project: Project | undefined;
  direction: string;
  onClick: (direction: string) => void;
  unlockedProjects: string[];
  completedProjects: string[];
  projectIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>>;
}

export function ProjectIcon({ 
  project, 
  direction, 
  onClick, 
  unlockedProjects, 
  completedProjects, 
  projectIcons 
}: ProjectIconProps) {
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
    <div className={`flex ${getLayoutClasses()} gap-3 group`}>
      <motion.div
        className={`
          relative h-14 w-14 rounded-2xl cursor-pointer overflow-hidden
          flex items-center justify-center transition-all duration-500
          ${isCompleted 
            ? 'bg-gradient-to-br from-emerald-500 to-green-600 shadow-2xl shadow-emerald-500/40' 
            : isUnlocked 
            ? 'bg-gradient-to-br from-blue-500 to-cyan-600 shadow-2xl shadow-blue-500/40' 
            : 'bg-gradient-to-br from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 shadow-xl shadow-slate-500/30'
          }
          backdrop-blur-xl border border-white/10
        `}
        whileHover={{ 
          scale: 1.1, 
          y: -6,
          rotateY: 10,
          transition: { duration: 0.3, ease: "easeOut" }
        }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onClick(direction)}
      >
        {/* Premium Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 rounded-2xl" />
        
        <IconComponent 
          size={24} 
          className={`
            relative z-10 transition-all duration-300
            ${isCompleted ? 'text-emerald-100' : isUnlocked ? 'text-blue-100' : 'text-slate-300 group-hover:text-slate-200'} 
          `}
        />
        
        {isCompleted && (
          <motion.div
            className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-400/50 border-2 border-white/20"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
          >
            <span className="text-white text-xs font-bold">✓</span>
          </motion.div>
        )}
        
        {/* Hover Glow Effect */}
        <div className={`
          absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
          ${isCompleted 
            ? 'bg-gradient-to-br from-emerald-400/20 to-green-600/20' 
            : isUnlocked 
            ? 'bg-gradient-to-br from-blue-400/20 to-cyan-600/20' 
            : 'bg-gradient-to-br from-slate-400/20 to-slate-600/20'
          }
        `} />
      </motion.div>
      
      {/* Project Name Label - Professional Typography */}
      <motion.div
        className={`
          px-4 py-2 rounded-xl text-sm font-medium text-center backdrop-blur-xl border border-white/10
          transition-all duration-300 shadow-lg max-w-28
          ${isCompleted 
            ? 'bg-gradient-to-br from-emerald-900/60 to-green-900/80 text-emerald-200 shadow-emerald-500/20' 
            : isUnlocked 
            ? 'bg-gradient-to-br from-blue-900/60 to-cyan-900/80 text-blue-200 shadow-blue-500/20' 
            : 'bg-gradient-to-br from-slate-800/60 to-slate-900/80 text-slate-300 shadow-slate-500/20'
          }
          group-hover:scale-105 group-hover:shadow-xl
        `}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        {project.title}
      </motion.div>
    </div>
  );
}
