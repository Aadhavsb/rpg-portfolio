'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SiGmail, SiGithub, SiLinkedin } from 'react-icons/si';
import { ExternalLink } from 'lucide-react';

interface ContactIconProps {
  type: 'email' | 'github' | 'linkedin';
  value: string;
  href: string;
  className?: string;
}

const contactConfig = {
  email: {
    icon: SiGmail,
    label: 'Email',
    color: 'text-red-400',
    hoverColor: 'hover:text-red-300'
  },
  github: {
    icon: SiGithub,
    label: 'GitHub',
    color: 'text-gray-400',
    hoverColor: 'hover:text-gray-300'
  },
  linkedin: {
    icon: SiLinkedin,
    label: 'LinkedIn',
    color: 'text-blue-400',
    hoverColor: 'hover:text-blue-300'
  }
};

export function ContactIcon({ type, value, href, className = "" }: ContactIconProps) {
  const config = contactConfig[type];
  const IconComponent = config.icon;
  
  return (
    <motion.a
      href={href}
      target={type !== 'email' ? '_blank' : undefined}
      rel={type !== 'email' ? 'noopener noreferrer' : undefined}
      className={`
        flex items-center gap-4 p-4 bg-slate-800/50 border border-slate-600 rounded-lg 
        hover:border-cyan-500/50 transition-colors group cursor-pointer
        ${className}
      `}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <IconComponent 
        size={24} 
        className={`${config.color} ${config.hoverColor} transition-colors`} 
      />
      <div className="flex-1">
        <span className="block text-cyan-400 font-semibold group-hover:text-cyan-300 transition-colors">
          {config.label}
        </span>
        <span className="text-slate-300 group-hover:text-slate-200 transition-colors">
          {value}
        </span>
      </div>
      {type !== 'email' && (
        <ExternalLink 
          size={16} 
          className="text-slate-500 group-hover:text-slate-400 transition-colors" 
        />
      )}
    </motion.a>
  );
}
