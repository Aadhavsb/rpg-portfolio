'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Lock, CheckCircle } from 'lucide-react';
import { useGameStore } from '@/lib/store';
import { Project } from '@/lib/types';
import { cn } from '@/lib/utils';

interface RPGHubProps {
  onProjectSelect: (project: Project) => void;
}

export function RPGHub({ onProjectSelect }: RPGHubProps) {
  const { projects, unlockedProjects, completedProjects } = useGameStore();

  const getPathStyle = (direction: string) => {
    const baseClasses = "absolute w-24 h-24 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all duration-300";
    
    switch (direction) {
      case 'go north':
        return `${baseClasses} -top-32 left-1/2 -translate-x-1/2`;
      case 'go east':
        return `${baseClasses} top-1/2 -translate-y-1/2 -right-32`;
      case 'go south':
        return `${baseClasses} -bottom-32 left-1/2 -translate-x-1/2`;
      case 'go west':
        return `${baseClasses} top-1/2 -translate-y-1/2 -left-32`;
      case 'go northeast':
        return `${baseClasses} -top-24 -right-24`;
      default:
        return baseClasses;
    }
  };

  const getPathVariant = (project: Project) => {
    const isUnlocked = unlockedProjects.includes(project.id);
    const isCompleted = completedProjects.includes(project.id);
    
    if (isCompleted) {
      return "border-green-500 bg-green-500/20 text-green-300 shadow-green-500/50";
    } else if (isUnlocked) {
      return "border-blue-500 bg-blue-500/20 text-blue-300 shadow-blue-500/50 hover:bg-blue-500/30";
    } else {
      return "border-gray-600 bg-gray-800/20 text-gray-500";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      {/* Hero Avatar at Center */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-32 h-32 mb-16"
      >
        {/* Central Avatar */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/50">
          <User size={48} className="text-white" />
        </div>
        
        {/* Animated Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-4 border-2 border-dashed border-purple-500/30 rounded-full"
        />

        {/* Project Paths */}
        {projects.map((project, index) => {
          const isUnlocked = unlockedProjects.includes(project.id);
          const isCompleted = completedProjects.includes(project.id);
          
          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + index * 0.2, duration: 0.5 }}
              className={cn(getPathStyle(project.direction), getPathVariant(project))}
              onClick={() => isUnlocked ? onProjectSelect(project) : null}
              style={{ boxShadow: isUnlocked ? `0 0 20px currentColor` : 'none' }}
            >
              <div className="flex flex-col items-center text-center p-2">
                {isCompleted ? (
                  <CheckCircle size={24} className="mb-1" />
                ) : isUnlocked ? (
                  <MapPin size={24} className="mb-1" />
                ) : (
                  <Lock size={24} className="mb-1" />
                )}
                <div className="text-xs font-semibold">{project.title}</div>
              </div>
              
              {/* Path Label */}
              {isUnlocked && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-center whitespace-nowrap px-2 py-1 bg-black/50 rounded border border-current/30"
                >
                  {project.pathLabel}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Hero Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="text-center space-y-2"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Aadhav Bharadwaj
        </h1>
        <p className="text-gray-400 text-lg">
          Full Stack Developer & AI Researcher
        </p>
        <p className="text-gray-500 text-sm max-w-md">
          Welcome to my interactive portfolio! Navigate through the paths to discover my projects and skills.
        </p>
      </motion.div>

      {/* Progress Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="mt-8 flex items-center gap-2 text-sm text-gray-400"
      >
        <span>Progress:</span>
        <div className="flex gap-1">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={cn(
                "w-3 h-3 rounded-full border",
                completedProjects.includes(project.id) 
                  ? "bg-green-500 border-green-500" 
                  : unlockedProjects.includes(project.id)
                  ? "bg-blue-500 border-blue-500"
                  : "bg-gray-700 border-gray-600"
              )}
            />
          ))}
        </div>
        <span>{completedProjects.length}/{projects.length}</span>
      </motion.div>
    </div>
  );
}
