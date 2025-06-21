'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  SiJavascript,
  SiTypescript,
  SiPython,
  SiOpenjdk,
  SiCplusplus,
  SiSharp,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiExpress,
  SiTailwindcss,
  SiHtml5
} from 'react-icons/si';
import { Code2 } from 'lucide-react';

const skillIconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  // Programming Languages
  'JavaScript': SiJavascript,
  'TypeScript': SiTypescript,
  'Python': SiPython,
  'Java': SiOpenjdk,
  'C++': SiCplusplus,
  'C#': SiSharp,
  
  // Web Technologies
  'React': SiReact,
  'Next.js': SiNextdotjs,
  'Node.js': SiNodedotjs,
  'Express': SiExpress,
  'Tailwind CSS': SiTailwindcss,
  'HTML/CSS': SiHtml5
};

interface SkillIconProps {
  skill: string;
  className?: string;
}

export function SkillIcon({ skill, className = "" }: SkillIconProps) {
  const IconComponent = skillIconMap[skill] || Code2;
  
  return (
    <motion.div
      className={`flex items-center gap-3 px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg hover:border-cyan-500/50 transition-colors ${className}`}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <IconComponent size={20} className="text-cyan-400" />
      <span className="text-slate-300 font-medium">{skill}</span>
    </motion.div>
  );
}
