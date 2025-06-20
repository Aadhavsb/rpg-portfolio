'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

interface TerminalProps {
  onBack: () => void;
  onStartJourney?: () => void;
  showStartJourney?: boolean;
}

export function Terminal({ onBack, onStartJourney, showStartJourney = false }: TerminalProps) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([
    showStartJourney 
      ? '🎮 Welcome, brave adventurer, to the Realm of Code!' 
      : 'Welcome back to Aadhav&apos;s RPG Terminal! 🎮',
    showStartJourney
      ? '⚔️ Type "start journey" to begin your epic quest!'
      : 'Type commands or click buttons below'
  ]);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (command: string) => {
    setHistory(prev => [...prev, `> ${command}`]);
    
    const cmd = command.toLowerCase().trim();
    
    if (cmd === 'start journey' && showStartJourney && onStartJourney) {
      setHistory(prev => [...prev, '🌟 Your epic quest begins now! Loading the RPG Hub...']);
      setTimeout(() => onStartJourney(), 1000);
      return;
    }
    
    if (cmd === 'back') {
      onBack();
      return;
    }
    
    setHistory(prev => [...prev, `Command received: ${command}`]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleCommand(input.trim());
      setInput('');
    }
  };

  const availableCommands = showStartJourney 
    ? ['start journey', 'help']
    : ['check inventory', 'consult scrolls', 'display beacon', 'back'];
  return (
    <div className="min-h-screen p-8 flex items-center justify-center bg-gradient-to-br from-slate-900 via-stone-900 to-amber-900">
      <div className="max-w-4xl w-full">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-amber-400">⚔️ Realm Terminal ⚔️</h1>
          {!showStartJourney && (
            <button
              onClick={onBack}
              className="text-amber-400 hover:text-amber-300 transition-colors"
            >
              ← Back to Hub
            </button>
          )}
        </div>
        
        <div className="flex-1 bg-black/80 backdrop-blur border-2 border-amber-500/30 rounded-lg overflow-hidden shadow-2xl shadow-amber-500/20">
      {/* Terminal Header */}
      <div className="bg-gradient-to-r from-amber-600/20 to-yellow-600/20 px-4 py-2 border-b border-amber-500/30 flex items-center gap-2">
        <div className="flex gap-1">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <span className="text-amber-300 text-sm font-mono ml-2">⚔️ Adventurer&apos;s Terminal ⚔️</span>
      </div>

      {/* Terminal Content */}
      <div
        ref={terminalRef}
        className="h-64 overflow-y-auto p-4 font-mono text-sm space-y-1"
      >
        {history.map((line, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="text-amber-200"
          >
            {line}
          </motion.div>
        ))}
      </div>

      {/* Terminal Input */}
      <div className="border-t border-amber-500/30 p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <span className="text-amber-400 font-mono">$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent text-amber-200 font-mono outline-none placeholder-amber-600"
            placeholder="Enter your command..."
          />
          <button
            type="submit"
            className="text-amber-400 hover:text-amber-300"          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
    
    {/* Quick Commands */}
    <div className="mt-4">
      <p className="text-amber-300 text-sm mb-2">Quick Commands:</p>
      <div className="flex flex-wrap gap-2">
        {availableCommands.map((cmd) => (
          <button
            key={cmd}
            onClick={() => handleCommand(cmd)}
            className="px-3 py-1 bg-amber-600/20 hover:bg-amber-600/40 border border-amber-500/30 rounded text-amber-200 text-xs transition-colors"
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
      </div>
    </div>
  );
}
