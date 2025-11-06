'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Briefcase } from 'lucide-react';
import { WorkExperience } from '@/lib/types';

interface WorkExperienceViewProps {
  experience: WorkExperience;
  onBack: () => void;
}

export function WorkExperienceView({ experience, onBack }: WorkExperienceViewProps) {
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

        {/* Experience Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              {experience.title}
            </h1>
            {experience.viewed && (
              <CheckCircle size={32} className="text-green-500" />
            )}
          </div>
          <p className="text-xl text-orange-300 mb-2">{experience.company}</p>
          <p className="text-gray-400">{experience.duration}</p>
        </motion.div>

        {/* Experience Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 mb-8"
        >
          {/* Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Overview</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              {experience.description}
            </p>
          </div>

          {/* Achievements */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Key Contributions</h3>
            <ul className="space-y-3">
              {experience.achievements.map((achievement, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-start gap-3 text-gray-300"
                >
                  <span className="text-orange-400 mt-1">•</span>
                  <span>{achievement}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Technologies */}
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-white mb-4">Technologies Used</h3>
            <div className="flex flex-wrap gap-3">
              {experience.technologies.map((tech, index) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="px-4 py-2 bg-orange-600/20 border border-orange-500/30 rounded-full text-orange-300 text-sm font-medium"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Experience Viewed Status */}
        {experience.viewed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-600/20 border border-green-500/30 rounded-lg text-green-400 font-semibold">
              <CheckCircle size={20} />
              Experience Reviewed!
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
