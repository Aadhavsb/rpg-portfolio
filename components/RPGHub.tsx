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
  const { projects, completedProjects, unlockProject, discoveredPaths, addDiscoveredPath } = useGameStore();
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    "🏰 Welcome to the Realm of Code, brave adventurer!",
    "🗡️ You stand at the crossroads of destiny...",
    "✨ Type 'help' to see available commands, or begin your quest with 'go north'"
  ]);
  const [input, setInput] = useState('');
  const [availableCommands, setAvailableCommands] = useState(['go north', 'help', 'look around']);
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
    if (discoveredPaths.length === 0 && !autoTimeoutId && input === '') {
      const timeoutId = setTimeout(() => {
        addToHistory("🕐 Time passes... Perhaps you should venture north to begin your quest?");
        setTimeout(() => {
          addToHistory("🤖 Auto-executing: go north");
          handleCommand('go north');
        }, 2000);
      }, 15000); // 15 seconds timeout
      
      setAutoTimeoutId(timeoutId);
    }

    // Clear timeout if user starts typing or takes action
    if (input !== '' || discoveredPaths.length > 0) {
      if (autoTimeoutId) {
        clearTimeout(autoTimeoutId);
        setAutoTimeoutId(null);
      }
    }

    return () => {
      if (autoTimeoutId) {
        clearTimeout(autoTimeoutId);
      }
    };
  }, [discoveredPaths.length, autoTimeoutId, input]);  // Update available commands based on progress
  useEffect(() => {
    const newCommands = ['help', 'look around'];
    
    // Only add the NEXT available direction command that hasn't been discovered yet
    // This ensures that once a command is used, it disappears from quick commands
    if (!discoveredPaths.includes('north')) {
      newCommands.push('go north');
    } else if (!discoveredPaths.includes('east') && discoveredPaths.includes('north')) {
      newCommands.push('go east');
    } else if (!discoveredPaths.includes('south') && discoveredPaths.includes('east')) {
      newCommands.push('go south');
    } else if (!discoveredPaths.includes('west') && discoveredPaths.includes('south')) {
      newCommands.push('go west');
    } else if (!discoveredPaths.includes('northeast') && discoveredPaths.includes('west')) {
      newCommands.push('go northeast');
    }
    
    // Add special commands when all paths are discovered
    if (discoveredPaths.length === 5) {
      newCommands.push('check inventory', 'consult scrolls', 'display beacon', 'get apprenticeship');
    }
    
    // Add reset command for testing
    newCommands.push('reset progress');
    
    setAvailableCommands(newCommands);
  }, [discoveredPaths, completedProjects.length, projects.length]);

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
    const cmd = command.toLowerCase().trim();    switch (cmd) {      case 'go north':
        if (!discoveredPaths.includes('north')) {
          addDiscoveredPath('north');
          unlockProject('palate');
          addToHistory("🌟 You venture north through ancient cobblestone paths...");
          addToHistory("🏗️ A mystical portal appears! You've discovered: PALATE");
          addToHistory("✨ Full-stack recipe generation magic awaits!");
        } else {
          addToHistory("🔄 You've already explored the northern path. Click the project card to enter!");
        }
        break;
        
      case 'go east':
        if (discoveredPaths.includes('north') && !discoveredPaths.includes('east')) {
          addDiscoveredPath('east');
          unlockProject('expressink');
          addToHistory("🌅 You journey eastward through enchanted forests...");
          addToHistory("🎨 A shimmering gateway manifests! You've found: EXPRESSINK");
          addToHistory("🧠 AI-powered emotion analysis from children's art!");
        } else if (discoveredPaths.includes('east')) {
          addToHistory("🔄 You've already explored the eastern path. Click the project card to enter!");
        } else {
          addToHistory("🚫 The eastern path remains shrouded in mystery. Explore north first!");
        }
        break;
        
      case 'go south':
        if (discoveredPaths.includes('east') && !discoveredPaths.includes('south')) {
          addDiscoveredPath('south');
          unlockProject('premier-league');
          addToHistory("⚽ You trek south to the fields of competition...");
          addToHistory("🏆 A grand arena portal opens! You've unlocked: PREMIER LEAGUE PREDICTOR");
          addToHistory("📊 Machine learning prophecies for football matches!");
        } else if (discoveredPaths.includes('south')) {
          addToHistory("🔄 You've already explored the southern path. Click the project card to enter!");
        } else {
          addToHistory("🚫 The southern plains are blocked. Continue your eastern journey first!");
        }
        break;
        
      case 'go west':
        if (discoveredPaths.includes('south') && !discoveredPaths.includes('west')) {
          addDiscoveredPath('west');
          unlockProject('inventory360');
          addToHistory("🌄 You venture west into professional territories...");
          addToHistory("🏢 A corporate stronghold emerges! You've discovered: INVENTORY360");
          addToHistory("💼 Enterprise-grade inventory management system!");
        } else if (discoveredPaths.includes('west')) {
          addToHistory("🔄 You've already explored the western path. Click the project card to enter!");
        } else {
          addToHistory("🚫 The western mountains are impassable. Explore the south first!");
        }
        break;
        
      case 'go northeast':
        if (discoveredPaths.includes('west') && !discoveredPaths.includes('northeast')) {
          addDiscoveredPath('northeast');
          unlockProject('brickd');
          addToHistory("🎮 You climb northeast to the creative peaks...");
          addToHistory("🧱 A playful portal sparkles! You've found: BRICK'D");
          addToHistory("🕹️ A charming C# platformer adventure!");
        } else if (discoveredPaths.includes('northeast')) {
          addToHistory("🔄 You've already explored the northeastern path. Click the project card to enter!");
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
        addToHistory("🔄 Utility: reset progress");
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
          case 'reset progress':
        addToHistory("🔄 Resetting all progress...");
        // Reset both discovered paths and completed projects
        const { resetGame } = useGameStore.getState();
        resetGame();
        addToHistory("✨ Progress reset! Ready to start a new adventure.");
        break;
        
      default:
        addToHistory(`❓ Unknown command: "${command}"`);        addToHistory("💡 Type 'help' for available commands!");
    }
  };  const handleQuickCommand = (command: string) => {
    // Auto-type the command in the terminal
    setInput(command);
    // Give a small delay then execute
    setTimeout(() => {
      handleCommand(command);
      setInput('');
    }, 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleCommand(input.trim());
      setInput('');
    }
  };  const getPathPosition = (direction: string) => {
    // Fixed path positioning - cards at actual end of paths in correct directions
    const pathLength = 180;
    const positions: Record<string, { x: number; y: number; rotation: number; pathLength: number }> = {
      'north': { x: 0, y: -pathLength, rotation: -90, pathLength }, // North = up = negative Y, rotate path upward
      'east': { x: pathLength, y: 0, rotation: 0, pathLength },     // East = right = positive X, horizontal path
      'south': { x: 0, y: pathLength, rotation: 90, pathLength },   // South = down = positive Y, rotate path downward  
      'west': { x: -pathLength, y: 0, rotation: 180, pathLength },  // West = left = negative X, horizontal path flipped
      'northeast': { x: pathLength * 0.7, y: -pathLength * 0.7, rotation: -45, pathLength } // 45 degrees up-right
    };
    return positions[direction] || { x: 0, y: 0, rotation: 0, pathLength };
  };
  const getPathTheme = (direction: string) => {
    const themes: Record<string, { bg: string; border: string; icon: React.ComponentType<{ size?: number; className?: string }>; emoji: string }> = {
      'north': { bg: 'from-blue-600/30 to-cyan-500/30', border: 'border-blue-400/50', icon: Compass, emoji: '🧭' },
      'east': { bg: 'from-green-600/30 to-emerald-500/30', border: 'border-green-400/50', icon: TreePine, emoji: '🌲' },
      'south': { bg: 'from-red-600/30 to-orange-500/30', border: 'border-red-400/50', icon: Sword, emoji: '⚔️' },
      'west': { bg: 'from-yellow-600/30 to-amber-500/30', border: 'border-yellow-400/50', icon: Castle, emoji: '🏰' },
      'northeast': { bg: 'from-purple-600/30 to-pink-500/30', border: 'border-purple-400/50', icon: Sparkles, emoji: '✨' }
    };
    return themes[direction] || themes['north'];
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
            <div className="flex flex-wrap gap-2">              {availableCommands.map((cmd) => (
                <motion.button
                  key={cmd}
                  onClick={() => handleQuickCommand(cmd)}
                  className="px-3 py-1 bg-amber-600/20 hover:bg-amber-600/40 border border-amber-500/30 rounded text-amber-200 text-xs transition-colors cursor-pointer"
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
          <div className="relative">            {/* Hero Avatar - Central Hub */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
              className="relative z-30 w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-2xl shadow-amber-500/50 border-4 border-yellow-400"
            >
              <Shield className="w-8 h-8" />
            </motion.div>            {/* Discovered Paths with Animated Lines and Icons */}
            <AnimatePresence>
              {discoveredPaths.map((direction) => {
                const project = projects.find(p => p.direction === `go ${direction}`);
                if (!project) return null;
                
                const position = getPathPosition(direction);
                const theme = getPathTheme(direction);
                const isCompleted = completedProjects.includes(project.id);
                
                return (
                  <React.Fragment key={direction}>                    {/* Animated Path Line */}
                    <motion.div
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: 1 }}
                      exit={{ scaleX: 0, opacity: 0 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 100, 
                        damping: 15,
                        delay: 0.3,
                        duration: 1.2
                      }}
                      className="absolute z-10"
                      style={{
                        width: `${position.pathLength}px`,
                        height: '4px',
                        background: `linear-gradient(90deg, rgba(245, 158, 11, 0.8) 0%, rgba(245, 158, 11, 0.4) 70%, transparent 100%)`,
                        transform: `rotate(${position.rotation}deg)`,
                        transformOrigin: '0 center', // Start from the beginning of the line
                        left: '50%',
                        top: '50%',
                        marginTop: '-2px'
                      }}
                    />
                      {/* Path Icons */}
                    {[...Array(3)].map((_, iconIndex) => {
                      // Calculate position along the path towards the final destination
                      const progress = (iconIndex + 1) / 4; // 25%, 50%, 75% along the path
                      const iconX = position.x * progress;
                      const iconY = position.y * progress;
                      
                      return (
                        <motion.div
                          key={`${direction}-icon-${iconIndex}`}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 0.7 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ 
                            delay: 0.5 + iconIndex * 0.2,
                            type: "spring",
                            stiffness: 200
                          }}
                          className="absolute z-20"
                          style={{
                            left: '50%',
                            top: '50%',
                            transform: `translate(-50%, -50%) translate(${iconX}px, ${iconY}px)`
                          }}
                        >
                          <div className="w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center border border-amber-400/30 backdrop-blur-sm">
                            <span className="text-xs">{theme.emoji}</span>
                          </div>
                        </motion.div>
                      );
                    })}
                      {/* Project Card at End of Path */}
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ 
                        scale: 1, 
                        opacity: 1
                      }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 150, 
                        damping: 20,
                        delay: 1.0
                      }}
                      className="absolute z-20"
                      style={{
                        left: '50%',
                        top: '50%',
                        transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px)`
                      }}
                    >
                      <motion.button
                        onClick={() => onProjectSelect(project)}
                        className={`
                          relative w-32 h-32 rounded-xl border-2 backdrop-blur-sm transition-all duration-300
                          bg-gradient-to-br ${theme.bg} ${theme.border}
                          hover:scale-105 cursor-pointer shadow-xl shadow-black/20
                          ${isCompleted ? 'ring-2 ring-green-400/50' : ''}
                        `}
                        whileHover={{ scale: 1.05, rotate: 2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="flex flex-col items-center justify-center h-full p-3">
                          <theme.icon size={24} className="mb-2 text-white" />
                          <span className="text-sm font-bold text-center text-white leading-tight">{project.title}</span>
                          <span className="text-xs text-amber-200 mt-1">Click to explore</span>
                          {isCompleted && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs"
                            >
                              ✓
                            </motion.div>
                          )}
                        </div>
                        
                        {/* Magical Glow Effect */}
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                          className="absolute -inset-1 bg-gradient-to-r from-amber-400/20 via-transparent to-amber-400/20 rounded-xl -z-10"
                        />
                      </motion.button>
                    </motion.div>
                  </React.Fragment>
                );
              })}
            </AnimatePresence>            {/* Progress Indicator - Removed to avoid overlap with shield */}
          </div>          {/* Special Commands Portal */}
          {completedProjects.length === projects.length && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 3, type: "spring" }}
              className="absolute top-20 right-20"
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
