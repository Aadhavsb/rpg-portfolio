'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SectionCardProps {
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  unlocked: boolean;
  onClick: () => void;
}

export function SectionCard({ title, icon: Icon, unlocked, onClick }: SectionCardProps) {
  // Define preview content for each section
  const sectionPreviews = {
    'Skills': ['JavaScript', 'React', 'Python', 'Machine Learning'],
    'Research': ['KV Cache Compression', 'SVD Decomposition', 'Memory Optimization'],
    'Contact': ['bharadwajaadhav@gmail.com', 'GitHub', 'LinkedIn'],
    'Resume': ['Computer Science', 'Full Stack Dev', 'AI Research']
  };

  const previewItems = sectionPreviews[title as keyof typeof sectionPreviews] || [];
  return (
    <motion.div
      className={`
        group relative overflow-hidden cursor-pointer transition-all duration-500
        ${unlocked 
          ? 'bg-white/5 border border-white/10 hover:bg-white/8 hover:border-white/20' 
          : 'bg-slate-900/40 border border-slate-700/50 hover:bg-slate-800/60 hover:border-slate-600/70'
        }
        backdrop-blur-xl rounded-xl shadow-xl
      `}
      style={{
        background: unlocked 
          ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)'
          : 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)'
      }}
      whileHover={{ 
        scale: 1.02, 
        y: -2,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      {/* Premium Card Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10 rounded-xl" />
      
      {/* Card Content - Compact Design */}
      <div className="relative p-3 flex flex-col items-center text-center h-full">
        {/* Icon Container - Smaller */}
        <div className={`
          relative mb-2 p-2 rounded-lg transition-all duration-300
          ${unlocked 
            ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 shadow-lg shadow-blue-500/10' 
            : 'bg-slate-800/50 shadow-lg shadow-black/20'
          }
        `}>
          <Icon 
            size={16} 
            className={`
              transition-all duration-300
              ${unlocked 
                ? 'text-blue-300 group-hover:text-blue-200' 
                : 'text-slate-400 group-hover:text-slate-300'
              }
            `} 
          />
          
          {/* Icon Glow Effect */}
          {unlocked && (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-lg blur-xl" />
          )}
        </div>
        
        {/* Title - Compact */}
        <h4 className={`
          text-xs font-semibold mb-1 transition-all duration-300 tracking-wide
          ${unlocked 
            ? 'text-white group-hover:text-blue-100' 
            : 'text-slate-300 group-hover:text-slate-200'
          }
        `}>
          {title}
        </h4>
        
        {/* Content Preview - Show only if unlocked and compact */}
        {unlocked ? (
          <div className="mb-2">
            <div className="text-xs text-blue-400">
              {previewItems.length > 0 ? `${previewItems.length} items` : 'Available'}
            </div>
          </div>
        ) : (
          <div className="mb-2">
            <div className="text-xs text-slate-500 italic truncate">Locked</div>
          </div>
        )}
        
        {/* Status - Compact */}
        <div className={`
          px-2 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider transition-all duration-300
          ${unlocked 
            ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-500/30' 
            : 'bg-slate-700/50 text-slate-400 border border-slate-600/50'
          }
        `}>
          {unlocked ? 'View' : 'Locked'}
        </div>
      </div>
      
      {/* Active Indicator */}
      {unlocked && (
        <>
          <motion.div
            className="absolute top-3 right-3 w-3 h-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full shadow-lg shadow-green-400/50"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          />
          
          {/* Subtle Animation Pulse */}
          <motion.div
            className="absolute top-3 right-3 w-3 h-3 bg-green-400/30 rounded-full"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}
      
      {/* Premium Border Effect */}
      <div className={`
        absolute inset-0 rounded-2xl pointer-events-none transition-all duration-300
        ${unlocked 
          ? 'bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-purple-500/0 group-hover:from-blue-500/10 group-hover:via-blue-500/20 group-hover:to-purple-500/10' 
          : ''
        }
      `} />
    </motion.div>
  );
}
