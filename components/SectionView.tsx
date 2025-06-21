'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, FileText, Brain, Code } from 'lucide-react';

interface SectionViewProps {
  section: string;
  onBack: () => void;
}

export function SectionView({ section, onBack }: SectionViewProps) {  const sectionData = {
    skills: {
      title: 'Skills Inventory',
      icon: Code,
      description: 'Technical abilities and expertise',
      content: {
        'Programming Languages': ['JavaScript', 'Python', 'Java', 'C#', 'C', 'R'],
        'Web Technologies': ['React', 'Node.js', 'Next.js'],
        'Note': 'Refer to the resume scroll for full list of skills.'
      }
    },
    research: {
      title: 'Research Scroll',
      icon: Brain,
      description: 'Advanced scroll chronicling ongoing research efforts',
      content: {
        'Focus': 'Transformer architecture optimization - investigating KV cache compression for large language models',
        'Method': 'Chunk-wise singular value decomposition (SVD) and dynamic token-rank strategies',
        'Goal': 'Make inference more memory-efficient without degrading output quality',
        'Implementation': 'Mathematical exploration, GPU-accelerated computation, and high-performance system design',
        'Deployment': 'Dockerized environments in HPC clusters',
        'Repository': 'GitHub: chunkedDecomp'
      }
    },
    contact: {
      title: 'Contact Beacon',
      icon: Mail,
      description: 'Connect and collaborate',
      content: {
        'Gmail': 'bharadwajaadhav@gmail.com',
        'GitHub': 'github.com/Aadhavsb',
        'LinkedIn': 'linkedin.com/in/aadhav-bharadwaj'
      }
    },
    resume: {
      title: 'Resume Scroll',
      icon: FileText,
      description: 'Professional experience and education',
      content: {
        'Download': 'Click the resume icon to download or open the PDF resume',
        'Note': 'Complete professional documentation available'
      }
    }
  };

  const data = sectionData[section as keyof typeof sectionData];
  const Icon = data.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-black text-gray-100 p-8"
    >
      <div className="max-w-4xl mx-auto">
        <motion.button
          className="mb-8 px-6 py-3 bg-slate-900/60 border border-slate-700/50 rounded-xl hover:border-slate-600 transition-colors shadow-lg"
          onClick={onBack}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          ← Back to Hub
        </motion.button>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 shadow-2xl"
        >
          <div className="flex items-center mb-8">
            <div className="p-3 bg-blue-500/20 rounded-xl mr-4">
              <Icon size={32} className="text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-slate-200">{data.title}</h1>
          </div>          <div className="space-y-6">
            {section === 'skills' ? (
              Object.entries(data.content).map(([category, value]) => (
                <div key={category}>
                  <h3 className="text-xl font-semibold text-blue-400 mb-3">{category}</h3>
                  {Array.isArray(value) ? (
                    <div className="flex flex-wrap gap-3">
                      {value.map((skill) => (
                        <span
                          key={skill}
                          className="px-4 py-2 bg-slate-800/60 border border-slate-600/50 rounded-lg text-slate-300 hover:bg-slate-700/60 transition-colors"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 italic">{value}</p>
                  )}
                </div>
              ))
            ) : section === 'contact' ? (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-slate-400 mb-6">Click the icons below to connect:</p>
                  <div className="flex justify-center space-x-8">
                    <motion.a
                      href="mailto:bharadwajaadhav@gmail.com"
                      className="flex flex-col items-center space-y-2 p-4 bg-slate-800/60 border border-slate-600/50 rounded-xl hover:bg-slate-700/60 transition-all duration-300 group"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center group-hover:bg-red-500/30 transition-colors">
                        <Mail size={24} className="text-red-400" />
                      </div>
                      <span className="text-sm font-medium text-slate-300">Gmail</span>
                    </motion.a>
                    
                    <motion.a
                      href="https://github.com/Aadhavsb"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center space-y-2 p-4 bg-slate-800/60 border border-slate-600/50 rounded-xl hover:bg-slate-700/60 transition-all duration-300 group"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                        <Code size={24} className="text-purple-400" />
                      </div>
                      <span className="text-sm font-medium text-slate-300">GitHub</span>
                    </motion.a>
                    
                    <motion.a
                      href="https://linkedin.com/in/aadhav-bharadwaj"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center space-y-2 p-4 bg-slate-800/60 border border-slate-600/50 rounded-xl hover:bg-slate-700/60 transition-all duration-300 group"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                        <Brain size={24} className="text-blue-400" />
                      </div>
                      <span className="text-sm font-medium text-slate-300">LinkedIn</span>
                    </motion.a>
                  </div>
                </div>
              </div>
            ) : section === 'resume' ? (
              <div className="text-center space-y-6">
                <motion.button
                  className="flex flex-col items-center space-y-4 p-8 bg-slate-800/60 border border-slate-600/50 rounded-xl hover:bg-slate-700/60 transition-all duration-300 group mx-auto"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    // Add resume download logic here
                    alert('Resume download will be implemented soon!');
                  }}
                >
                  <div className="w-16 h-16 bg-amber-500/20 rounded-xl flex items-center justify-center group-hover:bg-amber-500/30 transition-colors">
                    <FileText size={32} className="text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-200 mb-2">Download Resume</h3>
                    <p className="text-sm text-slate-400">Click to download or open PDF resume</p>
                  </div>
                </motion.button>
                <p className="text-slate-400 italic">Complete professional documentation available</p>
              </div>
            ) : (
              Object.entries(data.content).map(([key, value]) => (
                <div key={key} className="flex flex-col sm:flex-row sm:items-start gap-3">
                  <span className="text-blue-400 font-semibold min-w-32">{key}:</span>
                  <div className="text-slate-300">
                    {key === 'Repository' ? (
                      <a 
                        href="https://github.com/Aadhavsb/chunkedDecomp" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 underline"
                      >
                        {value}
                      </a>
                    ) : (
                      <span>{value}</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
