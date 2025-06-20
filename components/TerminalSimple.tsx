'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

interface TerminalSimpleProps {
  history: string[];
  onCommand: (command: string) => void;
  quickCommands?: { label: string; command: string; icon?: string }[];
}

export function TerminalSimple({ history, onCommand, quickCommands = [] }: TerminalSimpleProps) {
  const [input, setInput] = useState('');
  const outputRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onCommand(input.trim());
      setInput('');
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-900/50 rounded-lg border border-slate-700/50">
      {/* Terminal Header */}
      <div className="flex items-center gap-2 p-3 border-b border-slate-700/50">
        <div className="flex gap-1">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <span className="text-slate-400 text-sm font-mono">terminal</span>
      </div>

      {/* Terminal Output */}
      <div 
        ref={outputRef}
        className="flex-1 p-4 overflow-y-auto text-sm font-mono space-y-1 min-h-0"
      >
        {history.map((line, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="text-slate-300"
          >
            {line}
          </motion.div>
        ))}      </div>

      {/* Quick Command Buttons */}
      {quickCommands.length > 0 && (
        <div className="px-3 py-2 border-t border-slate-700/50 bg-slate-800/30">
          <div className="flex flex-wrap gap-1">
            {quickCommands.map((cmd, index) => (
              <motion.button
                key={index}
                onClick={() => onCommand(cmd.command)}
                className="px-2 py-1 text-xs bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 hover:border-slate-500/50 rounded text-slate-300 hover:text-cyan-300 transition-all duration-200 flex items-center gap-1"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {cmd.icon && <span>{cmd.icon}</span>}
                {cmd.label}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Terminal Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-slate-700/50">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 font-mono">$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent text-slate-300 font-mono outline-none placeholder-slate-500"
            placeholder="Enter command..."
            autoFocus
          />
          <motion.button
            type="submit"
            className="p-1 text-slate-400 hover:text-cyan-400 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Send size={16} />
          </motion.button>
        </div>
      </form>
    </div>
  );
}
