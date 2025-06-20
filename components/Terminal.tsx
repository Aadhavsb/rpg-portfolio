'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Terminal } from 'lucide-react';
import { useGameStore } from '@/lib/store';
import { cn } from '@/lib/utils';

interface TerminalProps {
  onCommand: (command: string) => void;
  availableCommands: string[];
}

export function TerminalComponent({ onCommand, availableCommands }: TerminalProps) {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { terminalHistory, addTerminalEntry } = useGameStore();
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const command = input.trim().toLowerCase();
    addTerminalEntry(`> ${input}`);
    setInput('');
    setIsTyping(false);
    onCommand(command);
  };

  const handleCommandClick = (command: string) => {
    setInput(command);
    setIsTyping(true);
    
    setTimeout(() => {
      addTerminalEntry(`> ${command}`);
      setInput('');
      setIsTyping(false);
      onCommand(command.toLowerCase());
    }, 1000);
  };

  const typewriterEffect = (text: string, delay: number = 50) => {
    return new Promise<void>((resolve) => {
      let i = 0;
      const timer = setInterval(() => {
        if (i < text.length) {
          setInput(prev => prev + text[i]);
          i++;
        } else {
          clearInterval(timer);
          resolve();
        }
      }, delay);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/90 backdrop-blur-sm border border-green-500/30 rounded-lg p-4 font-mono text-sm max-w-2xl w-full"
    >
      {/* Terminal Header */}
      <div className="flex items-center gap-2 mb-4 text-green-400">
        <Terminal size={16} />
        <span>RPG Portfolio Terminal</span>
        <div className="flex gap-1 ml-auto">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
      </div>

      {/* Terminal History */}
      <div 
        ref={terminalRef}
        className="h-64 overflow-y-auto mb-4 space-y-1 text-green-300"
      >
        {terminalHistory.map((line, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "whitespace-pre-wrap",
              line.startsWith('>') ? 'text-yellow-300' : 'text-green-300'
            )}
          >
            {line}
          </motion.div>
        ))}
      </div>

      {/* Available Commands */}
      {availableCommands.length > 0 && (
        <div className="mb-4">
          <div className="text-cyan-400 mb-2">Available commands:</div>
          <div className="flex flex-wrap gap-2">
            {availableCommands.map((cmd, index) => (
              <motion.button
                key={cmd}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleCommandClick(cmd)}
                className="px-3 py-1 bg-green-600/20 hover:bg-green-600/40 border border-green-500/30 rounded text-green-300 hover:text-green-100 transition-colors text-xs"
                disabled={isTyping}
              >
                {cmd}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <span className="text-green-400 absolute left-3 top-1/2 -translate-y-1/2">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-transparent border border-green-500/30 rounded pl-8 pr-4 py-2 text-green-300 focus:border-green-400 focus:outline-none"
            placeholder="Enter command..."
            disabled={isTyping}
          />
        </div>
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="px-4 py-2 bg-green-600/20 hover:bg-green-600/40 border border-green-500/30 rounded text-green-300 hover:text-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={16} />
        </button>
      </form>
    </motion.div>
  );
}
