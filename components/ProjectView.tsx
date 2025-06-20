'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, ArrowLeft, CheckCircle } from 'lucide-react';
import { Project } from '@/lib/types';
import { useGameStore } from '@/lib/store';

interface ProjectViewProps {
  project: Project;
  onBack: () => void;
  onComplete: () => void;
}

export function ProjectView({ project, onBack, onComplete }: ProjectViewProps) {
  const { completedProjects } = useGameStore();
  const isCompleted = completedProjects.includes(project.id);

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

        {/* Project Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {project.title}
            </h1>
            {isCompleted && (
              <CheckCircle size={32} className="text-green-500" />
            )}
          </div>
          <p className="text-xl text-blue-300 mb-2">{project.pathLabel}</p>
          <p className="text-gray-400">{project.direction}</p>
        </motion.div>

        {/* Project Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 mb-8"
        >
          {/* Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">About This Project</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Tech Stack Visualization */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Technologies Used</h3>
            <div className="flex flex-wrap gap-3">
              {getProjectTechStack(project.id).map((tech, index) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-300 text-sm font-medium"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-4">
            {project.githubUrl && (
              <motion.a
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
              >
                <Github size={20} />
                View on GitHub
                <ExternalLink size={16} />
              </motion.a>
            )}
            {project.demoUrl && (
              <motion.a
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition-colors"
              >
                Live Demo
                <ExternalLink size={16} />
              </motion.a>
            )}
          </div>
        </motion.div>

        {/* Complete Button */}
        {!isCompleted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center"
          >
            <button
              onClick={onComplete}
              className="px-8 py-4 bg-green-600 hover:bg-green-500 rounded-lg text-white font-semibold transition-colors text-lg"
            >
              Mark as Explored
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// Helper function to get tech stack for each project
function getProjectTechStack(projectId: string): string[] {
  const techStacks: Record<string, string[]> = {
    'palate': ['React', 'Node.js', 'Express', 'MongoDB', 'OpenAI API', 'Image Processing'],
    'expressink': ['Python', 'TensorFlow', 'Computer Vision', 'React', 'Machine Learning'],
    'premier-league': ['Python', 'Pandas', 'Scikit-learn', 'Statistics', 'Data Analysis'],
    'inventory360': ['React', 'MongoDB', 'Zod', 'Authentication', 'Node.js', 'Express'],
    'brickd': ['C#', 'Unity', 'Game Development', 'Physics', 'Level Design']
  };
  
  return techStacks[projectId] || [];
}
