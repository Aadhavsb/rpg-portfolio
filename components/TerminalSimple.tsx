'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowLeft, Terminal as TerminalIcon, Package, Brain, Mail, FileText } from 'lucide-react';

interface TerminalProps {
  onBack: () => void;
}

interface TerminalEntry {
  type: 'command' | 'output' | 'system';
  content: string;
  timestamp: Date;
}

export function Terminal({ onBack }: TerminalProps) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<TerminalEntry[]>([
    {
      type: 'system',
      content: 'Welcome to Aadhav\'s RPG Terminal! 🎮',
      timestamp: new Date()
    },
    {
      type: 'system',
      content: 'Available commands: check inventory, consult the scrolls, display beacon, get apprenticeship',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Scroll to bottom when new entries are added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const addEntry = (type: TerminalEntry['type'], content: string) => {
    setHistory(prev => [...prev, {
      type,
      content,
      timestamp: new Date()
    }]);
  };

  const typeWriterEffect = async (text: string) => {
    setIsTyping(true);
    const words = text.split(' ');
    let currentText = '';
    
    for (let i = 0; i < words.length; i++) {
      currentText += (i > 0 ? ' ' : '') + words[i];
      setHistory(prev => {
        const newHistory = [...prev];
        if (newHistory[newHistory.length - 1]?.type === 'output') {
          newHistory[newHistory.length - 1].content = currentText;
        }
        return newHistory;
      });
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    setIsTyping(false);
  };

  const executeCommand = async (command: string) => {
    addEntry('command', `> ${command}`);
    addEntry('output', '');

    const cmd = command.toLowerCase().trim();

    switch (cmd) {
      case 'check inventory':
        await typeWriterEffect(
          `📜 INVENTORY SCROLL 📜

🎯 CORE ABILITIES ACQUIRED:

💻 Programming Languages:
  ⚡ JavaScript (Advanced) | 🔷 TypeScript (Advanced) | 🐍 Python (Expert)
  ☕ Java (Intermediate) | 🔵 C# (Intermediate) | ⚙️ C++ (Intermediate)

🌐 Web Technologies:
  ⚛️ React (Expert) | ▲ Next.js (Advanced) | 🟢 Node.js (Advanced)
  🚀 Express (Advanced) | 🎨 HTML/CSS (Expert) | 💨 Tailwind CSS (Advanced)

💾 Database & Cloud:
  🍃 MongoDB (Advanced) | 🐘 PostgreSQL (Intermediate) | ☁️ AWS (Intermediate)
  🐳 Docker (Intermediate) | 📚 Git (Expert)

🤖 AI/ML & Data:
  🧠 TensorFlow (Advanced) | 📊 Scikit-learn (Advanced) | 🐼 Pandas (Advanced)
  🤖 OpenAI API (Advanced) | 👁️ Computer Vision (Intermediate)

✨ Special abilities unlocked through countless battles with bugs and features!`
        );
        break;

      case 'consult the scrolls':
        await typeWriterEffect(
          `📚 RESEARCH SCROLLS 📚

🧠 Current Investigation: KV Cache Compression in Transformers

📋 Quest Details:
  Exploring mathematical tools like Singular Value Decomposition (SVD) and dynamic rank adjustment to reduce memory usage during inference on large language models without significant quality loss.

⚔️ Active Project: chunkedDecomp
  - Chunk-wise SVD compression for transformer KV caches
  - Low memory usage, high accuracy on HPC GPUs
  - Dockerized environment for reproducible research
  - GitHub: https://github.com/Aadhavsb/chunkedDecomp

🎯 Mission: Contributing to the advancement of efficient AI inference technologies while maintaining model performance standards.

📜 The scrolls reveal deep knowledge of mathematical optimization and distributed computing...`
        );
        break;

      case 'display beacon':
        await typeWriterEffect(
          `📡 BEACON TRANSMISSION ACTIVE 📡

🗺️ Hero's Coordinates Located:

📧 Communication Crystal: bharadwajaadhav@gmail.com
🔗 Code Repository Portal: https://github.com/Aadhavsb  
💼 Professional Network Node: https://www.linkedin.com/in/aadhav-bharadwaj/

🌟 Signal strength: MAXIMUM
🚀 Ready for collaboration quests and apprenticeship opportunities!
📍 Currently accepting new adventures in software engineering and AI research...

Beacon broadcasting on all frequencies. Awaiting response from fellow adventurers! 🎮`
        );
        break;

      case 'get apprenticeship':
        await typeWriterEffect(
          `📋 ADVENTURER'S OFFICIAL SCROLL OF DEEDS 📋

🎓 Currently pursuing the sacred knowledge at McGill University
⚔️ Specializing in Software Engineering with AI/ML focus
🏆 Battle-tested through 5 major project quests
🧠 Research experience in transformer optimization

📜 The complete scroll of achievements and qualifications will be materialized soon...
🔄 Resume loading... Please standby for the full documentation of heroic deeds!

💡 For immediate review of capabilities, use 'check inventory' to see current skill loadout!`
        );
        break;

      case 'help':
        await typeWriterEffect(
          `🎮 AVAILABLE TERMINAL COMMANDS 🎮

✅ check inventory - View your acquired skills and abilities
✅ consult the scrolls - Access current research and investigations  
✅ display beacon - Transmit hero's contact coordinates
✅ get apprenticeship - Review the adventurer's scroll of deeds
🔧 help - Display this command list
🏠 back - Return to the central hub

Type any command above or click the suggested commands below! 🎮`
        );
        break;

      case 'back':
        onBack();
        return;

      default:
        await typeWriterEffect(
          `❌ Unknown command: "${command}"
          
🤔 Perhaps you meant one of these legendary commands?
  • check inventory
  • consult the scrolls  
  • display beacon
  • get apprenticeship
  • help
  
Type 'help' to see all available commands! 🎮`
        );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isTyping) {
      executeCommand(input.trim());
      setInput('');
    }
  };

  const suggestedCommands = [
    { cmd: 'check inventory', icon: Package, desc: 'View skills' },
    { cmd: 'consult the scrolls', icon: Brain, desc: 'Research' },
    { cmd: 'display beacon', icon: Mail, desc: 'Contact info' },
    { cmd: 'get apprenticeship', icon: FileText, desc: 'Resume' }
  ];

  return (
    <div className="min-h-screen p-8 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <TerminalIcon className="text-green-400" size={24} />
            <h1 className="text-2xl font-bold text-green-400">RPG Terminal</h1>
          </div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Hub
          </button>
        </motion.div>

        {/* Terminal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-black/90 backdrop-blur-sm border border-green-500/30 rounded-lg overflow-hidden shadow-2xl shadow-green-500/10"
        >
          {/* Terminal Header */}
          <div className="bg-gray-800/50 px-4 py-2 border-b border-green-500/30 flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <span className="text-green-400 text-sm font-mono ml-2">Aadhav@RPG-Portfolio:~$</span>
          </div>

          {/* Terminal Content */}
          <div
            ref={terminalRef}
            className="h-96 overflow-y-auto p-4 font-mono text-sm"
          >
            <AnimatePresence mode="popLayout">
              {history.map((entry, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`mb-2 ${
                    entry.type === 'command' 
                      ? 'text-yellow-400' 
                      : entry.type === 'system'
                      ? 'text-blue-400'
                      : 'text-green-300'
                  }`}
                >
                  <pre className="whitespace-pre-wrap font-mono">
                    {entry.content}
                  </pre>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isTyping && (
              <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="text-green-400"
              >
                ▋
              </motion.div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-green-500/30 p-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <div className="flex-1 flex items-center gap-2">
                <span className="text-green-400 font-mono">$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 bg-transparent text-green-300 font-mono outline-none placeholder-green-600"
                  placeholder="Enter command..."
                  disabled={isTyping}
                />
              </div>
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="p-2 text-green-400 hover:text-green-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </motion.div>

        {/* Suggested Commands */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6"
        >
          <h3 className="text-gray-400 text-sm mb-3">Quick Commands:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {suggestedCommands.map((cmd) => (
              <motion.button
                key={cmd.cmd}
                onClick={() => !isTyping && executeCommand(cmd.cmd)}
                disabled={isTyping}
                className="p-3 bg-gray-800/50 border border-green-500/30 rounded-lg hover:bg-gray-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <cmd.icon size={16} className="text-green-400" />
                  <span className="text-green-300 text-xs font-mono">{cmd.cmd}</span>
                </div>
                <p className="text-gray-500 text-xs">{cmd.desc}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
