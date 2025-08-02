'use client'

import { DNAEditor } from '@/components/DNAEditor'

export default function EditorPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-8">
      <h1 className="text-3xl font-bold text-emerald-400 mb-6 text-center">DNA Editor Lab</h1>
      <DNAEditor />
    </main>
  )
}
