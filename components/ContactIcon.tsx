'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SiGmail, SiGithub, SiLinkedin } from 'react-icons/si';
import { Mail } from 'lucide-react';
import { IconType } from 'react-icons';

interface ContactIconProps {
  platform: string;
  link: string;
  text: string;
  className?: string;
}

const contactIconMap: Record<string, { icon: IconType; color: string; bgColor: string }> = {
  'Gmail': { 
    icon: SiGmail, 
    color: 'text-red-400', 
    bgColor: 'bg-red-500/20 group-hover:bg-red-500/30' 
  },
  'GitHub': { 
    icon: SiGithub, 
    color: 'text-gray-300', 
    bgColor: 'bg-gray-500/20 group-hover:bg-gray-500/30' 
  },
  'LinkedIn': { 
    icon: SiLinkedin, 
    color: 'text-blue-400', 
    bgColor: 'bg-blue-500/20 group-hover:bg-blue-500/30' 
  }
};

export function ContactIcon({ platform, link, text, className = '' }: ContactIconProps) {
  const contactData = contactIconMap[platform];
  
  if (!contactData) {
    // Fallback for unknown platforms
    return (
      <motion.a
        href={link}
        target={link.startsWith('http') ? '_blank' : undefined}
        rel={link.startsWith('http') ? 'noopener noreferrer' : undefined}
        className={`flex flex-col items-center space-y-2 p-4 bg-slate-800/60 border border-slate-600/50 rounded-xl hover:bg-slate-700/60 transition-all duration-300 group ${className}`}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="w-12 h-12 bg-slate-500/20 rounded-xl flex items-center justify-center group-hover:bg-slate-500/30 transition-colors">
          <Mail className="w-6 h-6 text-slate-400" />
        </div>
        <span className="text-sm font-medium text-slate-300">{platform}</span>
        <span className="text-xs text-slate-500 text-center max-w-32 truncate">{text}</span>
      </motion.a>
    );
  }

  const Icon = contactData.icon;

  return (
    <motion.a
      href={link}
      target={link.startsWith('http') ? '_blank' : undefined}
      rel={link.startsWith('http') ? 'noopener noreferrer' : undefined}
      className={`flex flex-col items-center space-y-3 p-6 bg-slate-800/60 border border-slate-600/50 rounded-xl hover:bg-slate-700/60 transition-all duration-300 group cursor-pointer ${className}`}
      whileHover={{ scale: 1.05, y: -3 }}
      whileTap={{ scale: 0.95 }}
      title={`Contact via ${platform}: ${text}`}
    >
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${contactData.bgColor}`}>
        <Icon className={`w-7 h-7 ${contactData.color} group-hover:scale-110 transition-transform duration-300`} />
      </div>
      <div className="text-center">
        <span className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors block">
          {platform}
        </span>
        <span className="text-xs text-slate-500 group-hover:text-slate-400 text-center max-w-32 truncate block mt-1">
          {text}
        </span>
      </div>
    </motion.a>
  );
}
