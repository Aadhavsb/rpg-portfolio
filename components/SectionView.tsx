'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, FileText, Brain, Code } from 'lucide-react';

interface SectionViewProps {
  section: string;
  onBack: () => void;
}

export function SectionView({ section, onBack }: SectionViewProps) {
  const sectionData = {
    skills: {
      title: 'Skills Inventory',
      icon: Code,
      description: 'Technical abilities and expertise',
      content: {
        'Programming Languages': ['JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'SQL'],
        'Web Technologies': ['React', 'Next.js', 'Node.js', 'Express', 'Tailwind CSS', 'HTML/CSS'],
        'Backend & Cloud': ['MongoDB', 'PostgreSQL', 'Docker', 'Git', 'AWS', 'REST APIs'],
        'AI/ML': ['TensorFlow', 'Scikit-learn', 'Pandas', 'OpenAI API', 'Computer Vision', 'PyTorch']
      }
    },
    research: {
      title: 'Research Archives',
      icon: Brain,
      description: 'Current research project and publications',
      content: {
        'Project': 'chunkedDecomp - Transformer KV Cache Compression',
        'Focus': 'Token-wise transformer KV Cache compression using SVD decomposition',
        'Method': 'Dynamic-rank token compression with chunked fusion to minimize memory during inference',
        'Results': 'Significant memory reduction while maintaining model performance',
        'Deployment': 'Dockerized application with GPU acceleration on HPC clusters',
        'Repository': 'github.com/Aadhavsb/chunkedDecomp'
      }
    },
    contact: {
      title: 'Contact Beacon',
      icon: Mail,
      description: 'Connect and collaborate',
      content: {
        'Email': 'bharadwajaadhav@gmail.com',
        'GitHub': 'github.com/Aadhavsb',
        'LinkedIn': 'linkedin.com/in/aadhav-bharadwaj',
        'Location': 'Montreal, QC',
        'Status': 'Open to opportunities'
      }
    },
    resume: {
      title: 'Apprenticeship Documents',
      icon: FileText,
      description: 'Professional experience and education',
      content: {
        'Education': 'Computer Science',
        'Experience': 'Full Stack Development',
        'Research': 'Machine Learning & AI',
        'Download': 'Resume.pdf [Available Soon]'
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
          </div>

          <div className="space-y-6">
            {section === 'skills' ? (
              Object.entries(data.content).map(([category, skills]) => (
                <div key={category}>
                  <h3 className="text-xl font-semibold text-blue-400 mb-3">{category}</h3>
                  <div className="flex flex-wrap gap-3">
                    {(skills as string[]).map((skill) => (
                      <span
                        key={skill}
                        className="px-4 py-2 bg-slate-800/60 border border-slate-600/50 rounded-lg text-slate-300 hover:bg-slate-700/60 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              Object.entries(data.content).map(([key, value]) => (
                <div key={key} className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="text-blue-400 font-semibold min-w-32">{key}:</span>
                  <span className="text-slate-300">{value}</span>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
