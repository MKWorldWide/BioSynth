'use client'

import { motion } from 'framer-motion'
import { DNAHelix } from '@/components/DNAHelix'
import { SacredCard } from '@/components/SacredCard'
import { SacredButton } from '@/components/SacredButton'
import { Navigation } from '@/components/Navigation'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <Navigation />
      
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

        <div className="text-center">
          <SacredButton
            variant="primary"
            size="large"
            onClick={() => console.log('MKWW Biosynthetic Vessel journey begins...')}
          >
            Begin Your Journey
          </SacredButton>
        </div>
      </div>
    </main>
  )
} 