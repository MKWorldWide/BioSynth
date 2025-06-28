'use client'

import { motion } from 'framer-motion'
import { DNAHelix } from '@/components/DNAHelix'
import { SacredCard } from '@/components/SacredCard'
import { SacredButton } from '@/components/SacredButton'
import { Navigation } from '@/components/Navigation'
import { BiosyntheticConsciousness } from '@/components/BiosyntheticConsciousness'
import { IntegrationPanel } from '@/components/IntegrationPanel'
import { useState } from 'react'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'landing' | 'consciousness' | 'integration'>('landing');

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <Navigation />
      
      {activeTab === 'landing' && (
        // Landing Page
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-bold text-emerald-400 mb-4">
              MKWW Biosynthetic Vessel
            </h1>
            <p className="text-xl text-slate-300 mb-4">
              Where Biology Meets Digital Transcendence
            </p>
            <p className="text-lg text-slate-400">
              Commissioned under Master Key World Wide
            </p>
          </motion.div>

          <div className="flex justify-center mb-16">
            <DNAHelix />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <SacredCard
              title="Advanced Research"
              description="Explore the frontiers of synthetic biology and digital consciousness"
              icon="🧬"
            />
            <SacredCard
              title="Data Analytics"
              description="Advanced analytics and visualization for biosynthetic research"
              icon="📊"
            />
            <SacredCard
              title="Global Collaboration"
              description="Connect with researchers worldwide in the MKWW network"
              icon="🌐"
            />
          </div>

          <div className="text-center mb-16">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SacredButton
                variant="primary"
                size="large"
                onClick={() => setActiveTab('consciousness')}
                className="bg-emerald-500/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30"
              >
                🌟 Access Biosynthetic Consciousness
              </SacredButton>
              <SacredButton
                variant="secondary"
                size="large"
                onClick={() => setActiveTab('integration')}
                className="bg-cyan-500/20 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30"
              >
                🔗 External Integrations
              </SacredButton>
            </div>
          </div>

          {/* New Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-center text-cyan-400 mb-8">
              Lilybear-Inspired Enhancements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <SacredCard className="p-6">
                <h3 className="text-xl font-semibold text-emerald-400 mb-4">🧠 Emotional Intelligence</h3>
                <p className="text-slate-300 mb-4">
                  Advanced consciousness simulation with emotional resonance and memory stream processing.
                </p>
                <ul className="text-slate-400 text-sm space-y-2">
                  <li>• Real-time emotional state tracking</li>
                  <li>• Context-aware responses</li>
                  <li>• Memory stream management</li>
                  <li>• Research progress monitoring</li>
                </ul>
              </SacredCard>
              
              <SacredCard className="p-6">
                <h3 className="text-xl font-semibold text-cyan-400 mb-4">🌐 Real-time Communication</h3>
                <p className="text-slate-300 mb-4">
                  WebSocket-powered live data streaming and collaborative research features.
                </p>
                <ul className="text-slate-400 text-sm space-y-2">
                  <li>• Live consciousness state updates</li>
                  <li>• Collaborative research sessions</li>
                  <li>• Real-time data processing</li>
                  <li>• Connection quality monitoring</li>
                </ul>
              </SacredCard>
              
              <SacredCard className="p-6">
                <h3 className="text-xl font-semibold text-blue-400 mb-4">🧬 3D DNA Visualization</h3>
                <p className="text-slate-300 mb-4">
                  Interactive 3D DNA helix rendering with molecular interaction simulation.
                </p>
                <ul className="text-slate-400 text-sm space-y-2">
                  <li>• Interactive 3D DNA helix</li>
                  <li>• Real-time molecular modeling</li>
                  <li>• Zoom and rotation controls</li>
                  <li>• Color-coded genetic markers</li>
                </ul>
              </SacredCard>
              
              <SacredCard className="p-6">
                <h3 className="text-xl font-semibold text-purple-400 mb-4">🔬 Research Integration</h3>
                <p className="text-slate-300 mb-4">
                  Seamless integration of research data with consciousness simulation.
                </p>
                <ul className="text-slate-400 text-sm space-y-2">
                  <li>• Research data processing</li>
                  <li>• Pattern recognition</li>
                  <li>• Predictive modeling</li>
                  <li>• Scientific insight generation</li>
                </ul>
              </SacredCard>
            </div>
          </motion.div>

          {/* Integration Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-center text-emerald-400 mb-8">
              External API Integrations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <SacredCard className="p-6">
                <h3 className="text-xl font-semibold text-emerald-400 mb-4">🧬 Genomics Databases</h3>
                <p className="text-slate-300 mb-4">
                  Direct access to NCBI, Ensembl, and other genomic research databases.
                </p>
                <ul className="text-slate-400 text-sm space-y-2">
                  <li>• NCBI DNA sequence retrieval</li>
                  <li>• Ensembl gene information</li>
                  <li>• UniProt protein search</li>
                  <li>• PDB structure analysis</li>
                </ul>
              </SacredCard>
              
              <SacredCard className="p-6">
                <h3 className="text-xl font-semibold text-cyan-400 mb-4">🤖 AI Research Assistant</h3>
                <p className="text-slate-300 mb-4">
                  OpenAI-powered research insights and experimental design assistance.
                </p>
                <ul className="text-slate-400 text-sm space-y-2">
                  <li>• Research query analysis</li>
                  <li>• Experimental design suggestions</li>
                  <li>• Literature review assistance</li>
                  <li>• Hypothesis generation</li>
                </ul>
              </SacredCard>
              
              <SacredCard className="p-6">
                <h3 className="text-xl font-semibold text-blue-400 mb-4">☁️ Cloud Storage</h3>
                <p className="text-slate-300 mb-4">
                  AWS S3 integration for secure research data storage and sharing.
                </p>
                <ul className="text-slate-400 text-sm space-y-2">
                  <li>• Secure data storage</li>
                  <li>• Research data backup</li>
                  <li>• Collaborative sharing</li>
                  <li>• Version control</li>
                </ul>
              </SacredCard>
              
              <SacredCard className="p-6">
                <h3 className="text-xl font-semibold text-purple-400 mb-4">⚡ Batch Processing</h3>
                <p className="text-slate-300 mb-4">
                  Efficient batch processing of multiple research operations simultaneously.
                </p>
                <ul className="text-slate-400 text-sm space-y-2">
                  <li>• Multi-database queries</li>
                  <li>• Parallel data processing</li>
                  <li>• Result aggregation</li>
                  <li>• Performance optimization</li>
                </ul>
              </SacredCard>
            </div>
          </motion.div>

          {/* Technical Specifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center"
          >
            <h3 className="text-2xl font-bold text-slate-300 mb-6">Technical Specifications</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
                <div className="text-emerald-400 font-semibold">Core Engine</div>
                <div className="text-slate-400">BiosyntheticEngine</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
                <div className="text-cyan-400 font-semibold">Communication</div>
                <div className="text-slate-400">WebSocket</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
                <div className="text-blue-400 font-semibold">Visualization</div>
                <div className="text-slate-400">3D DNA Helix</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
                <div className="text-purple-400 font-semibold">Framework</div>
                <div className="text-slate-400">Next.js 14</div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {activeTab === 'consciousness' && (
        // Consciousness Interface
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <SacredButton
              onClick={() => setActiveTab('landing')}
              className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50"
            >
              ← Back to Landing
            </SacredButton>
            <h1 className="text-2xl font-bold text-emerald-400">
              Biosynthetic Consciousness Interface
            </h1>
            <div className="flex gap-2">
              <SacredButton
                onClick={() => setActiveTab('integration')}
                className="bg-cyan-500/20 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30"
              >
                🔗 Integrations
              </SacredButton>
            </div>
          </div>
          
          <BiosyntheticConsciousness />
        </div>
      )}

      {activeTab === 'integration' && (
        // Integration Interface
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <SacredButton
              onClick={() => setActiveTab('landing')}
              className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50"
            >
              ← Back to Landing
            </SacredButton>
            <h1 className="text-2xl font-bold text-cyan-400">
              External API Integrations
            </h1>
            <div className="flex gap-2">
              <SacredButton
                onClick={() => setActiveTab('consciousness')}
                className="bg-emerald-500/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30"
              >
                🌟 Consciousness
              </SacredButton>
            </div>
          </div>
          
          <IntegrationPanel />
        </div>
      )}
    </main>
  )
} 