'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, FileText, Brain, Code } from 'lucide-react';
import { SkillIcon } from './SkillIcon';
import { ContactIcon } from './ContactIcon';

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
        'Programming Languages': [
          'JavaScript',
          'TypeScript', 
          'Python',
          'Java',
          'C#',
          'C',
          'R'
        ],
        'Frontend Technologies': [
          'React',
          'Next.js',
          'Tailwind CSS'
        ],
        'Backend & Runtime': [
          'Node.js'
        ],
        'Databases': [
          'PostgreSQL',
          'MongoDB'
        ],
        'DevOps & Cloud': [
          'Docker',
          'Kubernetes',
          'AWS',
          'Google Cloud',
          'Git'
        ],
        'Data Science & ML': [
          'TensorFlow',
          'PyTorch',
          'NumPy',
          'Pandas',
          'Scikit-learn',
          'Jupyter'
        ],
        'Note': 'Refer to the resume scroll for the complete list of skills and certifications.'
      }
    },research: {
      title: 'Research Scroll',
      icon: Brain,
      description: 'Advanced scroll chronicling ongoing research efforts',
      content: {
        'Overview': 'Gain access to an advanced scroll chronicling ongoing research efforts in transformer architecture optimization. I am investigating KV cache compression for large language models—specifically through chunk-wise singular value decomposition (SVD) and dynamic token-rank strategies.',
        'Technical Focus': 'The work combines mathematical exploration, GPU-accelerated computation, and high-performance system design to make inference more memory-efficient without degrading output quality.',
        'Deployment': 'This research is deployed across Dockerized environments in HPC clusters.',
        'Repository': 'GitHub: chunkedDecomp'
      }
    },    contact: {
      title: 'Contact Beacon',
      icon: Mail,
      description: 'Connect and collaborate',
      content: [
        { platform: 'Gmail', text: 'bharadwajaadhav@gmail.com', link: 'mailto:bharadwajaadhav@gmail.com' },
        { platform: 'GitHub', text: 'github.com/Aadhavsb', link: 'https://github.com/Aadhavsb' },
        { platform: 'LinkedIn', text: 'linkedin.com/in/aadhav-bharadwaj', link: 'https://linkedin.com/in/aadhav-bharadwaj' }
      ]
    },resume: {
      title: 'Resume Scroll',
      icon: FileText,
      description: 'Professional experience and education',
      content: {
        'Download': { text: 'Click to download or open PDF resume', icon: '📄', link: '#' }
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
          </div>          <div className="space-y-6">            {section === 'skills' ? (
              Object.entries(data.content).map(([category, value]) => (
                <div key={category}>
                  <h3 className="text-xl font-semibold text-blue-400 mb-4">{category}</h3>
                  {Array.isArray(value) ? (
                    <div className="flex flex-wrap gap-3">
                      {value.map((skillName: string) => (
                        <SkillIcon
                          key={skillName}
                          name={skillName}
                          category={category}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 italic text-sm bg-slate-800/40 p-3 rounded-lg border border-slate-700/50">
                      {value as string}
                    </p>
                  )}
                </div>
              ))            ) : section === 'contact' ? (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-slate-400 mb-8 text-lg">Click the icons below to connect:</p>
                  <div className="flex justify-center space-x-6">
                    {(data.content as Array<{ platform: string; text: string; link: string }>).map((contact) => (
                      <ContactIcon
                        key={contact.platform}
                        platform={contact.platform}
                        text={contact.text}
                        link={contact.link}
                      />
                    ))}
                  </div>
                </div>
              </div>) : section === 'resume' ? (
              <div className="text-center space-y-6">
                {Object.entries(data.content).map(([key, value]: [string, { text: string; icon: string; link: string }]) => (
                  <motion.a
                    key={key}
                    href={value.link}
                    className="inline-flex flex-col items-center space-y-4 p-8 bg-slate-800/60 border border-slate-600/50 rounded-xl hover:bg-slate-700/60 transition-all duration-300 group mx-auto"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (value.link === '#') {
                        alert('Resume download will be implemented soon!');
                      }
                    }}
                  >
                    <div className="w-16 h-16 bg-amber-500/20 rounded-xl flex items-center justify-center group-hover:bg-amber-500/30 transition-colors">
                      <span className="text-3xl">{value.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-200 mb-2">{key}</h3>
                      <p className="text-sm text-slate-400">{value.text}</p>
                    </div>
                  </motion.a>
                ))}
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
