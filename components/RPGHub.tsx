import React, { useState, useEffect, useRef } from 'react';
import { Sword, Shield, Compass, Scroll, TreePine, Castle, Send, Sparkles } from 'lucide-react';

// Mock store for demo
const mockStore = {
  projects: [
    { id: 'palate', title: 'PALATE', direction: 'go north' },
    { id: 'expressink', title: 'EXPRESSINK', direction: 'go east' },
    { id: 'premier-league', title: 'PREMIER LEAGUE', direction: 'go south' },
    { id: 'inventory360', title: 'INVENTORY360', direction: 'go west' },
    { id: 'brickd', title: 'BRICK\'D', direction: 'go northeast' }
  ],
  completedProjects: [],
  discoveredPaths: [],
  unlockProject: () => {},
  addDiscoveredPath: () => {},
  resetGame: () => {}
};

export default function RPGHub() {
  const [projects] = useState(mockStore.projects);
  const [completedProjects, setCompletedProjects] = useState<string[]>(mockStore.completedProjects);
  const [discoveredPaths, setDiscoveredPaths] = useState<string[]>([]);
  
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

  // Update available commands based on progress
  useEffect(() => {
    const newCommands = ['help', 'look around'];
    
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
    
    if (discoveredPaths.length === 5) {
      newCommands.push('check inventory', 'consult scrolls', 'display beacon', 'get apprenticeship');
    }
    
    newCommands.push('reset progress');
    setAvailableCommands(newCommands);
  }, [discoveredPaths, completedProjects.length, projects.length]);
  const addToHistory = (message: string) => {
    setTerminalHistory(prev => [...prev, message]);
  };

  const unlockProject = (projectId: string) => {
    console.log(`Unlocking project: ${projectId}`);
  };

  const addDiscoveredPath = (direction: string) => {
    setDiscoveredPaths(prev => [...prev, direction]);
  };

  const handleCommand = (command: string) => {
    if (autoTimeoutId) {
      clearTimeout(autoTimeoutId);
      setAutoTimeoutId(null);
    }
    
    addToHistory(`> ${command}`);
    const cmd = command.toLowerCase().trim();

    switch (cmd) {
      case 'go north':
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
        addToHistory("🎮 ADVENTURER'S COMMAND GUIDE:");
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
          addToHistory("🎯 Advanced commands activated! (Mock implementation)");
        } else {
          addToHistory("🔒 These advanced commands require completing all quests first!");
        }
        break;
          
      case 'reset progress':
        addToHistory("🔄 Resetting all progress...");
        setDiscoveredPaths([]);
        setCompletedProjects([]);
        addToHistory("✨ Progress reset! Ready to start a new adventure.");
        break;
        
      default:
        addToHistory(`❓ Unknown command: "${command}"`);
        addToHistory("💡 Type 'help' for available commands!");
    }
  };
  const handleQuickCommand = (command: string) => {
    setInput(command);
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
  const onProjectSelect = (project: { id: string; title: string; direction: string }) => {
    addToHistory(`🚀 Opening ${project.title}...`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-stone-900 to-amber-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-amber-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          />
        ))}
      </div>

      <div className="flex h-screen">
        {/* Left Panel - Terminal */}
        <div className="w-1/2 p-6 flex flex-col animate-fade-in">
          {/* Title */}
          <div className="text-center mb-6">            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-400 bg-clip-text text-transparent mb-2">
              ⚔️ Aadhav&apos;s Quest ⚔️
            </h1>
            <p className="text-amber-200 text-lg">Code Adventurer & AI Researcher</p>
          </div>

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
                <div
                  key={index}
                  className="text-amber-200 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {line}
                </div>
              ))}
            </div>

            {/* Terminal Input */}
            <div className="border-t border-amber-500/30 p-4">
              <div className="flex gap-2">
                <span className="text-amber-400 font-mono">$</span>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSubmit(e);
                    }
                  }}
                  className="flex-1 bg-transparent text-amber-200 font-mono outline-none placeholder-amber-600"
                  placeholder="Enter your command..."
                />
                <button
                  onClick={handleSubmit}
                  className="text-amber-400 hover:text-amber-300 transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Command Buttons */}
          <div className="mt-4">
            <p className="text-amber-300 text-sm mb-2">Quick Commands:</p>
            <div className="flex flex-wrap gap-2">
              {availableCommands.map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => handleQuickCommand(cmd)}
                  className="px-3 py-1 bg-amber-600/20 hover:bg-amber-600/40 border border-amber-500/30 rounded text-amber-200 text-xs transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Map/World */}
        <div className="w-1/2 p-6 flex items-center justify-center relative">
          {/* Map Container - Fixed size with center point */}
          <div className="relative w-96 h-96">
            {/* Hero Avatar - Absolute center */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-2xl shadow-amber-500/50 border-4 border-yellow-400 animate-pulse">
              <Shield className="w-8 h-8" />
            </div>

            {/* Discovered Paths */}
            {discoveredPaths.map((direction) => {
              const project = projects.find(p => p.direction === `go ${direction}`);
              if (!project) return null;
              
              const theme = getPathTheme(direction);
              const isCompleted = completedProjects.includes(project.id);              // Define path end positions from center (192px, 192px)
              let pathEndX: number = 192;
              let pathEndY: number = 192;
              let pathWidth: number = 4;
              let pathHeight: number = 4;
              let pathLeft: number = 192;
              let pathTop: number = 192;
              
              switch (direction) {
                case 'north':
                  pathEndX = 192; pathEndY = 50; pathWidth = 4; pathHeight = 142; pathLeft = 190; pathTop = 50;
                  break;
                case 'east':
                  pathEndX = 346; pathEndY = 192; pathWidth = 154; pathHeight = 4; pathLeft = 192; pathTop = 190;
                  break;
                case 'south':
                  pathEndX = 192; pathEndY = 334; pathWidth = 4; pathHeight = 142; pathLeft = 190; pathTop = 192;
                  break;
                case 'west':
                  pathEndX = 38; pathEndY = 192; pathWidth = 154; pathHeight = 4; pathLeft = 38; pathTop = 190;
                  break;
                case 'northeast':
                  pathEndX = 284; pathEndY = 100; pathWidth = 130; pathHeight = 4; pathLeft = 192; pathTop = 144;
                  break;
                default:
                  return null;
              }

              return (
                <div key={direction} className="animate-fade-in">
                  {/* Path Line */}
                  <div
                    className="absolute bg-gradient-to-r from-amber-500 to-amber-400 rounded-sm shadow-lg shadow-amber-500/50 animate-path-grow"
                    style={{
                      width: `${pathWidth}px`,
                      height: `${pathHeight}px`,
                      left: `${pathLeft}px`,
                      top: `${pathTop}px`,
                      transform: direction === 'northeast' ? 'rotate(-45deg)' : 'none'
                    }}
                  />

                  {/* Path Icons */}
                  {[...Array(3)].map((_, iconIndex) => {
                    const progress = (iconIndex + 1) / 4;
                    const iconX = 192 + (pathEndX - 192) * progress;
                    const iconY = 192 + (pathEndY - 192) * progress;
                    
                    return (
                      <div
                        key={`${direction}-icon-${iconIndex}`}
                        className="absolute z-20 w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center border border-amber-400/30 backdrop-blur-sm animate-bounce"
                        style={{
                          left: `${iconX - 12}px`,
                          top: `${iconY - 12}px`,
                          animationDelay: `${iconIndex * 0.5}s`
                        }}
                      >
                        <span className="text-xs">{theme.emoji}</span>
                      </div>
                    );
                  })}

                  {/* Project Card at path end */}
                  <div
                    className="absolute z-20 animate-scale-in"
                    style={{
                      left: `${pathEndX - 64}px`,
                      top: `${pathEndY - 64}px`,
                      animationDelay: '1s'
                    }}
                  >
                    <button
                      onClick={() => onProjectSelect(project)}
                      className={`
                        relative w-32 h-32 rounded-xl border-2 backdrop-blur-sm transition-all duration-300
                        bg-gradient-to-br ${theme.bg} ${theme.border}
                        hover:scale-105 cursor-pointer shadow-xl shadow-black/20
                        ${isCompleted ? 'ring-2 ring-green-400/50' : ''}
                        hover:rotate-1 active:scale-95
                      `}
                    >
                      <div className="flex flex-col items-center justify-center h-full p-3">
                        <theme.icon size={24} className="mb-2 text-white" />
                        <span className="text-sm font-bold text-center text-white leading-tight">{project.title}</span>
                        <span className="text-xs text-amber-200 mt-1">Click to explore</span>
                        {isCompleted && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs animate-bounce">
                            ✓
                          </div>
                        )}
                      </div>
                      
                      {/* Magical Glow Effect */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/20 via-transparent to-amber-400/20 rounded-xl -z-10 animate-spin" style={{ animationDuration: '8s' }} />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Special Commands Portal */}
            {completedProjects.length === projects.length && (
              <div className="absolute top-20 right-20 animate-scale-in" style={{ animationDelay: '3s' }}>
                <button className="w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center border-4 border-purple-400 shadow-2xl shadow-purple-500/50 hover:scale-110 transition-transform animate-pulse">
                  <Scroll className="w-8 h-8 text-white" />
                </button>
                <p className="text-center text-purple-300 text-xs mt-2">Ancient<br/>Scrolls</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scale-in {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        @keyframes path-grow {
          from { transform: scaleX(0) scaleY(0); }
          to { transform: scaleX(1) scaleY(1); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        
        .animate-scale-in {
          animation: scale-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        
        .animate-path-grow {
          animation: path-grow 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </div>
  );
}