'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CompletionScreenProps {
  onBack: () => void;
}

export function CompletionScreen({ onBack }: CompletionScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-black text-gray-100 flex items-center justify-center p-8 relative overflow-hidden"
    >
      {/* Celebratory background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-green-500/5"></div>
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,_white_1px,_transparent_0)]" style={{backgroundSize: '60px 60px'}}></div>
      
      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 200 - 100, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 4,
          }}
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${80 + Math.random() * 20}%`,
          }}
        />
      ))}

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="text-8xl mb-6">🎉</div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-4 tracking-tight">
            QUEST COMPLETE!
          </h1>
          <div className="text-2xl text-slate-300 mb-6">
            Portfolio Mastery Achieved
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-8 shadow-2xl"
        >
          <h2 className="text-2xl font-semibold text-blue-400 mb-6">Achievement Unlocked</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-slate-300">✅ All 5 Projects Completed</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span className="text-slate-300">✅ Skills Inventory Accessed</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                <span className="text-slate-300">✅ Research Archives Unlocked</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                <span className="text-slate-300">✅ Contact & Resume Revealed</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >          <p className="text-xl text-slate-400 leading-relaxed">
            You&apos;ve successfully explored every corner of this interactive portfolio.<br/>
            From full-stack development to AI research, you&apos;ve seen it all!
          </p>
          
          <div className="text-lg text-blue-400 font-semibold">
            🚀 Ready to build something together?
          </div>
        </motion.div>        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-2xl shadow-blue-500/25 transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBack}
          >
            Return to Portfolio Hub
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
