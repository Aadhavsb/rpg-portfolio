'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  SiJavascript, 
  SiPython, 
  SiOpenjdk, 
  SiSharp, 
  SiC, 
  SiR,
  SiReact, 
  SiNodedotjs, 
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiPostgresql,
  SiMongodb,
  SiGit,
  SiDocker,
  SiAmazon,
  SiGooglecloud,
  SiKubernetes,
  SiTensorflow,
  SiPytorch,
  SiNumpy,
  SiPandas,
  SiScikitlearn,
  SiJupyter,
  


} from 'react-icons/si';
import { IconType } from 'react-icons';

interface SkillIconProps {
  name: string;
  category?: string;
  className?: string;
}

const skillIconMap: Record<string, { icon: IconType; color: string }> = {
  // Programming Languages
  'JavaScript': { icon: SiJavascript, color: 'text-yellow-400' },
  'TypeScript': { icon: SiTypescript, color: 'text-blue-400' },
  'Python': { icon: SiPython, color: 'text-green-400' },
  'Java': { icon: SiOpenjdk, color: 'text-orange-500' },
  'C#': { icon: SiSharp, color: 'text-purple-400' },
  'C': { icon: SiC, color: 'text-blue-500' },
  'R': { icon: SiR, color: 'text-blue-600' },
  
  // Frameworks & Libraries
  'React': { icon: SiReact, color: 'text-cyan-400' },
  'Node.js': { icon: SiNodedotjs, color: 'text-green-500' },
  'Next.js': { icon: SiNextdotjs, color: 'text-white' },
  'Tailwind CSS': { icon: SiTailwindcss, color: 'text-cyan-400' },
  
  // Databases
  'PostgreSQL': { icon: SiPostgresql, color: 'text-blue-400' },
  'MongoDB': { icon: SiMongodb, color: 'text-green-500' },
  
  // Tools & Technologies
  'Git': { icon: SiGit, color: 'text-orange-500' },
  'Docker': { icon: SiDocker, color: 'text-blue-400' },
  'AWS': { icon: SiAmazon, color: 'text-orange-400' },
  'Google Cloud': { icon: SiGooglecloud, color: 'text-blue-400' },
  'Kubernetes': { icon: SiKubernetes, color: 'text-blue-500' },
  
  // Data Science & ML
  'TensorFlow': { icon: SiTensorflow, color: 'text-orange-500' },
  'PyTorch': { icon: SiPytorch, color: 'text-red-500' },
  'NumPy': { icon: SiNumpy, color: 'text-blue-400' },
  'Pandas': { icon: SiPandas, color: 'text-blue-500' },
  'Scikit-learn': { icon: SiScikitlearn, color: 'text-orange-400' },
  'Jupyter': { icon: SiJupyter, color: 'text-orange-500' }
};

export function SkillIcon({ name, category, className = '' }: SkillIconProps) {
  const skillData = skillIconMap[name];
  
  if (!skillData) {
    // Fallback for skills not in the map
    return (
      <motion.div
        className={`px-4 py-2 bg-slate-800/60 border border-slate-600/50 rounded-lg text-slate-300 hover:bg-slate-700/60 transition-colors flex items-center gap-2 ${className}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="w-5 h-5 bg-slate-600/50 rounded flex items-center justify-center">
          <span className="text-xs">?</span>
        </div>
        <span className="text-sm font-medium">{name}</span>
      </motion.div>
    );
  }

  const Icon = skillData.icon;

  return (
    <motion.div
      className={`px-4 py-2 bg-slate-800/60 border border-slate-600/50 rounded-lg hover:bg-slate-700/60 transition-all duration-300 flex items-center gap-3 group ${className}`}
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      title={category ? `${name} - ${category}` : name}
    >
      <div className="flex items-center justify-center">
        <Icon 
          className={`w-5 h-5 ${skillData.color} group-hover:scale-110 transition-transform duration-300`} 
        />
      </div>
      <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
        {name}
      </span>
    </motion.div>
  );
}
