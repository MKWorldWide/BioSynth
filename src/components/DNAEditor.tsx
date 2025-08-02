'use client'

import React, { useState } from 'react'
import { DNAHelix3D } from './visualization/DNAHelix3D'
import { SacredCard } from './SacredCard'
import { SacredInput } from './SacredInput'
import { SacredButton } from './SacredButton'

/**
 * 🧬 DNAEditor - simple real-time DNA editing simulator
 *
 * Allows choosing a template (Naga or Celestial) and editing the base sequence.
 * Updates the 3D helix visualization on every change.
 */
export const DNAEditor: React.FC = () => {
  const templates: Record<string, string> = {
    naga: 'ATGCGTACCGTTAGCTAGCTAGCTAGCTAGC',
    celestial: 'CGTAGCTAGGATCGATCGATCGATCGATCGA'
  }

  const [template, setTemplate] = useState<'naga' | 'celestial'>('naga')
  const [sequence, setSequence] = useState(templates['naga'])
  const [mutationIndex, setMutationIndex] = useState(0)
  const [mutationBase, setMutationBase] = useState<'A' | 'T' | 'G' | 'C'>('A')

  const handleTemplateChange = (value: 'naga' | 'celestial') => {
    setTemplate(value)
    setSequence(templates[value])
  }

  const applyMutation = () => {
    if (mutationIndex < 0 || mutationIndex >= sequence.length) return
    const updated = sequence.split('')
    updated[mutationIndex] = mutationBase
    setSequence(updated.join(''))
  }

  return (
    <div className="space-y-6">
      <SacredCard className="p-4">
        <h3 className="text-lg font-semibold text-emerald-400 mb-4">Template</h3>
        <div className="flex gap-4 mb-4">
          <SacredButton onClick={() => handleTemplateChange('naga')} className={`bg-emerald-500/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 ${template==='naga'?'opacity-100':'opacity-50'}`}>Naga</SacredButton>
          <SacredButton onClick={() => handleTemplateChange('celestial')} className={`bg-cyan-500/20 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30 ${template==='celestial'?'opacity-100':'opacity-50'}`}>Celestial</SacredButton>
        </div>
        <div className="space-y-2">
          <label className="block text-sm text-slate-400">DNA Sequence</label>
          <textarea
            value={sequence}
            onChange={e => setSequence(e.target.value.toUpperCase().replace(/[^ATGC]/g, ''))}
            className="w-full h-24 bg-slate-800 border border-slate-600 rounded-lg p-3 text-slate-300 resize-none focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </SacredCard>

      <SacredCard className="p-4">
        <h3 className="text-lg font-semibold text-cyan-400 mb-4">Mutation</h3>
        <div className="grid grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Index</label>
            <SacredInput
              type="number"
              value={mutationIndex}
              onChange={e => setMutationIndex(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Base</label>
            <select
              value={mutationBase}
              onChange={e => setMutationBase(e.target.value as any)}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-slate-300 focus:border-emerald-500 focus:outline-none"
            >
              {['A', 'T', 'G', 'C'].map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          <div>
            <SacredButton onClick={applyMutation} className="bg-purple-500/20 border-purple-500/30 text-purple-400 hover:bg-purple-500/30 w-full">Apply</SacredButton>
          </div>
        </div>
      </SacredCard>

      <DNAHelix3D sequence={sequence} />
    </div>
  )
}
