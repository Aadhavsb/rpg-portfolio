'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sword, Shield, Compass, Scroll, TreePine, Castle, Send, Sparkles } from 'lucide-react';
import { useGameStore } from '@/lib/store';
import { Project } from '@/lib/types';

interface RPGHubProps {
  onProjectSelect: (project: Project) => void;
  onCommandsView: () => void;
}

export function RPGHub({ onProjectSelect, onCommandsView }: RPGHubProps) {
  const { projects, unlockedProjects, completedProjects, unlockProject } = useGameStore();
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    "🏰 Welcome to the Realm of Code, brave adventurer!",
    "🗡️ You stand at the crossroads of destiny...",
    "✨ Type 'help' to see available commands, or begin your quest with 'go north'"
  ]);
  const [input, setInput] = useState('');
  const [availableCommands, setAvailableCommands] = useState(['go north', 'help', 'look around']);  const [discoveredPaths, setDiscoveredPaths] = useState<string[]>([]);
  const [autoTimeoutId, setAutoTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  // Auto-timeout for first command if no action taken
  useEffect(() => {
    if (discoveredPaths.length === 0 && !autoTimeoutId) {
      const timeoutId = setTimeout(() => {
        addToHistory("🕐 Time passes... Perhaps you should venture north to begin your quest?");
        setTimeout(() => {
          addToHistory("🤖 Auto-executing: go north");
          handleCommand('go north');
        }, 2000);
      }, 10000); // 10 seconds timeout
      
      setAutoTimeoutId(timeoutId);
    }

    return () => {
      if (autoTimeoutId) {
        clearTimeout(autoTimeoutId);
      }
    };
  }, [discoveredPaths.length, autoTimeoutId]);

  // Update available commands based on progress
  useEffect(() => {
    const newCommands = ['help', 'look around'];
    
    // Add directional commands based on discovered paths
    if (!discoveredPaths.includes('north') && !unlockedProjects.includes('palate')) {
      newCommands.push('go north');
    }
    if (discoveredPaths.includes('north') && !discoveredPaths.includes('east')) {
      newCommands.push('go east');
    }
    if (discoveredPaths.includes('east') && !discoveredPaths.includes('south')) {
      newCommands.push('go south');
    }
    if (discoveredPaths.includes('south') && !discoveredPaths.includes('west')) {
      newCommands.push('go west');
    }
    if (discoveredPaths.includes('west') && !discoveredPaths.includes('northeast')) {
      newCommands.push('go northeast');
    }
    
    // Add special commands when all projects are complete
    if (completedProjects.length === projects.length) {
      newCommands.push('check inventory', 'consult scrolls', 'display beacon', 'get apprenticeship');
    }
    
    setAvailableCommands(newCommands);
  }, [discoveredPaths, unlockedProjects, completedProjects.length, projects.length]);

  const addToHistory = (message: string) => {
    setTerminalHistory(prev => [...prev, message]);
  };
  const handleCommand = (command: string) => {
    // Clear auto-timeout when user takes action
    if (autoTimeoutId) {
      clearTimeout(autoTimeoutId);
      setAutoTimeoutId(null);
    }
    
    addToHistory(`> ${command}`);
    const cmd = command.toLowerCase().trim();

    switch (cmd) {
      case 'go north':
        if (!discoveredPaths.includes('north')) {
          setDiscoveredPaths(prev => [...prev, 'north']);
          unlockProject('palate');
          addToHistory("🌟 You venture north through ancient cobblestone paths...");
          addToHistory("🏗️ A mystical portal appears! You've discovered: PALATE");
          addToHistory("✨ Full-stack recipe generation magic awaits!");
        } else {
          onProjectSelect(projects.find(p => p.id === 'palate')!);
        }
        break;
        
      case 'go east':
        if (discoveredPaths.includes('north') && !discoveredPaths.includes('east')) {
          setDiscoveredPaths(prev => [...prev, 'east']);
          unlockProject('expressink');
          addToHistory("🌅 You journey eastward through enchanted forests...");
          addToHistory("🎨 A shimmering gateway manifests! You've found: EXPRESSINK");
          addToHistory("🧠 AI-powered emotion analysis from children's art!");
        } else if (discoveredPaths.includes('east')) {
          onProjectSelect(projects.find(p => p.id === 'expressink')!);
        } else {
          addToHistory("🚫 The eastern path remains shrouded in mystery. Explore north first!");
        }
        break;
        
      case 'go south':
        if (discoveredPaths.includes('east') && !discoveredPaths.includes('south')) {
          setDiscoveredPaths(prev => [...prev, 'south']);
          unlockProject('premier-league');
          addToHistory("⚽ You trek south to the fields of competition...");
          addToHistory("🏆 A grand arena portal opens! You've unlocked: PREMIER LEAGUE PREDICTOR");
          addToHistory("📊 Machine learning prophecies for football matches!");
        } else if (discoveredPaths.includes('south')) {
          onProjectSelect(projects.find(p => p.id === 'premier-league')!);
        } else {
          addToHistory("🚫 The southern plains are blocked. Continue your eastern journey first!");
        }
        break;
        
      case 'go west':
        if (discoveredPaths.includes('south') && !discoveredPaths.includes('west')) {
          setDiscoveredPaths(prev => [...prev, 'west']);
          unlockProject('inventory360');
          addToHistory("🌄 You venture west into professional territories...");
          addToHistory("🏢 A corporate stronghold emerges! You've discovered: INVENTORY360");
          addToHistory("💼 Enterprise-grade inventory management system!");
        } else if (discoveredPaths.includes('west')) {
          onProjectSelect(projects.find(p => p.id === 'inventory360')!);
        } else {
          addToHistory("🚫 The western mountains are impassable. Explore the south first!");
        }
        break;
        
      case 'go northeast':
        if (discoveredPaths.includes('west') && !discoveredPaths.includes('northeast')) {
          setDiscoveredPaths(prev => [...prev, 'northeast']);
          unlockProject('brickd');
          addToHistory("🎮 You climb northeast to the creative peaks...");
          addToHistory("🧱 A playful portal sparkles! You've found: BRICK'D");
          addToHistory("🕹️ A charming C# platformer adventure!");
        } else if (discoveredPaths.includes('northeast')) {
          onProjectSelect(projects.find(p => p.id === 'brickd')!);
        } else {
          addToHistory("🚫 The northeast passage is sealed. Complete your western quest first!");
        }
        break;
        
      case 'look around':
        addToHistory("🏰 You stand in a mystical coding realm...");
        addToHistory(`📍 Paths discovered: ${discoveredPaths.length}/5`);
        addToHistory(`⚔️ Quests completed: ${completedProjects.length}/${projects.length}`);
        if (discoveredPaths.length === 0) {
          addToHistory("🧭 Ancient runes suggest starting your journey northward...");
        }
        break;
        
      case 'help':
        addToHistory("🎮 ADVENTURER&apos;S COMMAND GUIDE:");
        addToHistory("🧭 Navigation: go [north/east/south/west/northeast]");
        addToHistory("👁️ Observation: look around");
        if (completedProjects.length === projects.length) {
          addToHistory("🎯 Special: check inventory, consult scrolls, display beacon, get apprenticeship");
        }
        addToHistory("💡 Click the glowing command buttons below for quick access!");
        break;
        
      case 'check inventory':
      case 'consult scrolls':
      case 'display beacon':
      case 'get apprenticeship':
        if (completedProjects.length === projects.length) {
          onCommandsView();
        } else {
          addToHistory("🔒 These advanced commands require completing all quests first!");
        }
        break;
        
      default:
        addToHistory(`❓ Unknown command: "${command}"`);        addToHistory("💡 Type 'help' for available commands!");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleCommand(input.trim());
      setInput('');
    }
  };

  const getPathPosition = (direction: string) => {
    const positions: Record<string, { x: number; y: number; rotation: number }> = {
      'go north': { x: 0, y: -180, rotation: 0 },
      'go east': { x: 180, y: 0, rotation: 90 },
      'go south': { x: 0, y: 180, rotation: 180 },
      'go west': { x: -180, y: 0, rotation: 270 },
      'go northeast': { x: 127, y: -127, rotation: 45 }
    };
    return positions[direction] || { x: 0, y: 0, rotation: 0 };
  };

  const getPathTheme = (direction: string) => {
    const themes: Record<string, { bg: string; border: string; icon: React.ComponentType<{ size?: number; className?: string }>; emoji: string }> = {
      'go north': { bg: 'from-blue-600/30 to-cyan-500/30', border: 'border-blue-400/50', icon: Compass, emoji: '🧭' },
      'go east': { bg: 'from-green-600/30 to-emerald-500/30', border: 'border-green-400/50', icon: TreePine, emoji: '🌲' },
      'go south': { bg: 'from-red-600/30 to-orange-500/30', border: 'border-red-400/50', icon: Sword, emoji: '⚔️' },
      'go west': { bg: 'from-yellow-600/30 to-amber-500/30', border: 'border-yellow-400/50', icon: Castle, emoji: '🏰' },
      'go northeast': { bg: 'from-purple-600/30 to-pink-500/30', border: 'border-purple-400/50', icon: Sparkles, emoji: '✨' }
    };
    return themes[direction] || themes['go north'];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-stone-900 to-amber-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        {/* Floating particles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-400 rounded-full"
            animate={{
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 8 + 5,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      <div className="flex h-screen">
        {/* Left Panel - Terminal */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-1/2 p-6 flex flex-col"
        >
          {/* Title */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-6"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-400 bg-clip-text text-transparent mb-2">
              ⚔️ Aadhav&apos;s Quest ⚔️
            </h1>
            <p className="text-amber-200 text-lg">Code Adventurer & AI Researcher</p>
          </motion.div>

          {/* Terminal Window */}
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
              {terminalHistory.map((line, index) => (
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
                  className="text-amber-400 hover:text-amber-300"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </div>

          {/* Command Buttons */}
          <div className="mt-4">
            <p className="text-amber-300 text-sm mb-2">Quick Commands:</p>
            <div className="flex flex-wrap gap-2">
              {availableCommands.map((cmd) => (
                <motion.button
                  key={cmd}
                  onClick={() => handleCommand(cmd)}
                  className="px-3 py-1 bg-amber-600/20 hover:bg-amber-600/40 border border-amber-500/30 rounded text-amber-200 text-xs transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {cmd}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Panel - Map/World */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-1/2 p-6 flex items-center justify-center relative"
        >
          {/* Central Hub */}
          <div className="relative">
            {/* Hero Avatar */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
              className="relative z-20 w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-2xl shadow-amber-500/50 border-4 border-yellow-400"
            >
              <Shield className="w-8 h-8" />
            </motion.div>

            {/* Discovered Paths */}
            <AnimatePresence>
              {discoveredPaths.map((direction) => {
                const project = projects.find(p => p.direction === direction);
                if (!project) return null;
                
                const position = getPathPosition(direction);
                const theme = getPathTheme(direction);
                const isCompleted = completedProjects.includes(project.id);
                
                return (
                  <motion.div
                    key={direction}
                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      x: position.x,
                      y: position.y
                    }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 200, 
                      damping: 20,
                      delay: 0.5 
                    }}
                    className="absolute"
                  >
                    {/* Path Line */}
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                      className="absolute w-32 h-1 bg-gradient-to-r from-amber-500/50 to-transparent"
                      style={{
                        transform: `rotate(${position.rotation}deg)`,
                        transformOrigin: 'left center',
                        left: position.x > 0 ? '-40px' : position.x < 0 ? '40px' : '-40px',
                        top: '50%'
                      }}
                    />
                    
                    {/* Project Portal */}
                    <motion.button
                      onClick={() => onProjectSelect(project)}
                      className={`
                        relative w-24 h-24 rounded-xl border-2 backdrop-blur-sm transition-all duration-300
                        bg-gradient-to-br ${theme.bg} ${theme.border}
                        hover:scale-110 cursor-pointer shadow-lg
                        ${isCompleted ? 'ring-2 ring-green-400/50' : ''}
                      `}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="flex flex-col items-center justify-center h-full p-2">
                        <theme.icon size={20} className="mb-1" />
                        <span className="text-xs font-bold text-center">{project.title}</span>
                        {isCompleted && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                          >
                            ✓
                          </motion.div>
                        )}
                      </div>
                      
                      {/* Magical Glow Effect */}
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute -inset-1 bg-gradient-to-r from-amber-400/20 via-transparent to-amber-400/20 rounded-xl"
                      />
                    </motion.button>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Progress Indicator */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 }}
              className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 text-center"
            >
              <div className="bg-black/60 backdrop-blur px-4 py-2 rounded-lg border border-amber-500/30">
                <p className="text-amber-200 text-sm">
                  🗺️ Paths: {discoveredPaths.length}/5 | ⚔️ Quests: {completedProjects.length}/{projects.length}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Special Commands Portal */}
          {completedProjects.length === projects.length && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 3, type: "spring" }}
              className="absolute top-10 right-10"
            >
              <button
                onClick={onCommandsView}
                className="w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center border-4 border-purple-400 shadow-2xl shadow-purple-500/50 hover:scale-110 transition-transform"
              >
                <Scroll className="w-8 h-8 text-white" />
              </button>
              <p className="text-center text-purple-300 text-xs mt-2">Ancient<br/>Scrolls</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
