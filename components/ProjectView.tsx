'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, ArrowLeft, CheckCircle } from 'lucide-react';
import { Project } from '@/lib/types';
import { useGameStore } from '@/lib/store';

interface ProjectViewProps {
  project: Project;
  onBack: () => void;
}

export function ProjectView({ project, onBack }: ProjectViewProps) {
  const { completedProjects } = useGameStore();
  const isCompleted = completedProjects.includes(project.id);

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

        {/* Project Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <h1 className="text-5xl font-bold text-amber-300">
              {project.title}
            </h1>
            {isCompleted && (
              <CheckCircle size={32} className="text-amber-500" />
            )}
          </div>
          <p className="text-xl text-amber-400 mb-2">{project.pathLabel}</p>
          <p className="text-amber-200/50">{project.direction}</p>
        </motion.div>

        {/* Project Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-black/80 border-2 border-amber-500/30 rounded-lg p-8 mb-8"
        >
          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl text-amber-300 mb-4">About This Quest</h2>
            <p className="text-amber-200/80 text-lg leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Tech Stack */}
          <div className="mb-8">
            <h3 className="text-lg text-amber-300 mb-4">Arsenal</h3>
            <div className="flex flex-wrap gap-3">
              {getProjectTechStack(project.id).map((tech, index) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="px-3 py-1 bg-amber-600/20 border border-amber-500/30 rounded text-amber-300 text-sm"
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
                className="flex items-center gap-2 px-6 py-3 bg-amber-600/20 hover:bg-amber-600/40 border border-amber-500/30 rounded text-amber-200 transition-colors"
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
                className="flex items-center gap-2 px-6 py-3 bg-amber-600/20 hover:bg-amber-600/40 border border-amber-500/30 rounded text-amber-200 transition-colors"
              >
                Live Demo
                <ExternalLink size={16} />
              </motion.a>
            )}
          </div>
        </motion.div>

        {/* Project Complete Status */}
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600/20 border border-amber-500/30 rounded-lg text-amber-400 font-semibold">
              <CheckCircle size={20} />
              Quest Completed!
            </div>
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
    'brickd': ['C#', 'Unity', 'Game Development', 'Physics', 'Level Design'],
    'arguably': ['Next.js', 'Mediasoup', 'Socket.io', 'Prisma', 'PostgreSQL', 'OpenAI Whisper', 'Gemini LLM', 'WebRTC']
  };

  return techStacks[projectId] || [];
}
