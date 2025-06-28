/**
 * 🧬 DNAHelix3D - Interactive 3D DNA visualization component
 * 
 * Renders interactive 3D DNA helix with real-time data integration
 * Supports zoom, rotation, and molecular interaction simulation
 * 
 * @author MKWW (Master Key World Wide)
 * @version 1.0.0
 */

'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DNAHelixProps {
  data?: any;
  interactive?: boolean;
  showLabels?: boolean;
  animationSpeed?: number;
  onInteraction?: (position: { x: number; y: number; z: number }) => void;
  consciousnessLevel?: number;
  researchProgress?: number;
}

interface DNAStrand {
  id: string;
  sequence: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  color: string;
  opacity: number;
}

interface Nucleotide {
  id: string;
  base: 'A' | 'T' | 'G' | 'C';
  position: { x: number; y: number; z: number };
  color: string;
  size: number;
  isHighlighted: boolean;
}

export const DNAHelix3D: React.FC<DNAHelixProps> = ({
  data,
  interactive = true,
  showLabels = true,
  animationSpeed = 1,
  onInteraction,
  consciousnessLevel = 0.5,
  researchProgress = 0.3
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const [zoom, setZoom] = useState(1);
  const [strands, setStrands] = useState<DNAStrand[]>([]);
  const [nucleotides, setNucleotides] = useState<Nucleotide[]>([]);
  const [selectedNucleotide, setSelectedNucleotide] = useState<string | null>(null);
  const [hoveredNucleotide, setHoveredNucleotide] = useState<string | null>(null);

  // Generate DNA strands based on consciousness level
  useEffect(() => {
    const generateDNAStrands = () => {
      const newStrands: DNAStrand[] = [];
      const newNucleotides: Nucleotide[] = [];
      
      // Generate two complementary strands
      for (let strandIndex = 0; strandIndex < 2; strandIndex++) {
        const strandLength = Math.floor(20 + consciousnessLevel * 30); // 20-50 nucleotides
        const strandSequence = generateRandomSequence(strandLength);
        
        const strand: DNAStrand = {
          id: `strand-${strandIndex}`,
          sequence: strandSequence,
          position: { x: 0, y: 0, z: strandIndex * 2 },
          rotation: { x: 0, y: 0, z: strandIndex * Math.PI },
          color: strandIndex === 0 ? '#00FF9D' : '#00FFFF',
          opacity: 0.8 + consciousnessLevel * 0.2
        };
        
        newStrands.push(strand);
        
        // Generate nucleotides for this strand
        for (let i = 0; i < strandLength; i++) {
          const angle = (i / strandLength) * 2 * Math.PI * 10; // 10 complete turns
          const radius = 3 + Math.sin(i * 0.5) * 0.5; // Varying radius for helix effect
          
          const nucleotide: Nucleotide = {
            id: `nucleotide-${strandIndex}-${i}`,
            base: strandSequence[i] as 'A' | 'T' | 'G' | 'C',
            position: {
              x: Math.cos(angle) * radius,
              y: Math.sin(angle) * radius,
              z: i * 0.5 + strandIndex * 2
            },
            color: getNucleotideColor(strandSequence[i] as 'A' | 'T' | 'G' | 'C'),
            size: 0.5 + researchProgress * 0.5,
            isHighlighted: false
          };
          
          newNucleotides.push(nucleotide);
        }
      }
      
      setStrands(newStrands);
      setNucleotides(newNucleotides);
    };
    
    generateDNAStrands();
  }, [consciousnessLevel, researchProgress]);

  // Auto-rotation effect
  useEffect(() => {
    if (!isRotating) return;
    
    const interval = setInterval(() => {
      setRotation(prev => ({
        ...prev,
        y: prev.y + 0.5 * animationSpeed
      }));
    }, 50);
    
    return () => clearInterval(interval);
  }, [isRotating, animationSpeed]);

  // Handle mouse interactions
  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!interactive || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    
    // Update rotation based on mouse position
    setRotation(prev => ({
      x: prev.x + y * 0.01,
      y: prev.y + x * 0.01,
      z: prev.z
    }));
    
    // Find closest nucleotide
    const closestNucleotide = findClosestNucleotide(x, y);
    setHoveredNucleotide(closestNucleotide);
    
    if (onInteraction) {
      onInteraction({ x, y, z: 0 });
    }
  }, [interactive, onInteraction]);

  const handleClick = useCallback((event: React.MouseEvent) => {
    if (!interactive) return;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    
    const closestNucleotide = findClosestNucleotide(x, y);
    setSelectedNucleotide(closestNucleotide);
    
    // Highlight the selected nucleotide
    setNucleotides(prev => prev.map(n => ({
      ...n,
      isHighlighted: n.id === closestNucleotide
    })));
  }, [interactive]);

  const handleWheel = useCallback((event: React.WheelEvent) => {
    if (!interactive) return;
    
    event.preventDefault();
    const zoomDelta = event.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.5, Math.min(3, prev * zoomDelta)));
  }, [interactive]);

  const findClosestNucleotide = (mouseX: number, mouseY: number): string | null => {
    let closest = null;
    let minDistance = Infinity;
    
    nucleotides.forEach(nucleotide => {
      const distance = Math.sqrt(
        Math.pow(nucleotide.position.x - mouseX * 5, 2) +
        Math.pow(nucleotide.position.y - mouseY * 5, 2)
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        closest = nucleotide.id;
      }
    });
    
    return closest;
  };

  const getNucleotideColor = (base: 'A' | 'T' | 'G' | 'C'): string => {
    const colors = {
      A: '#FF6B6B', // Red
      T: '#4ECDC4', // Teal
      G: '#45B7D1', // Blue
      C: '#96CEB4'  // Green
    };
    return colors[base];
  };

  const generateRandomSequence = (length: number): string => {
    const bases = ['A', 'T', 'G', 'C'];
    return Array.from({ length }, () => bases[Math.floor(Math.random() * bases.length)]).join('');
  };

  const toggleRotation = () => setIsRotating(!isRotating);

  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg overflow-hidden">
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleRotation}
          className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-md text-emerald-400 text-sm hover:bg-emerald-500/30 transition-colors"
        >
          {isRotating ? '⏸️' : '▶️'}
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setZoom(1)}
          className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-md text-cyan-400 text-sm hover:bg-cyan-500/30 transition-colors"
        >
          🔍
        </motion.button>
      </div>

      {/* 3D Container */}
      <div
        ref={containerRef}
        className="w-full h-full relative perspective-1000"
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        onWheel={handleWheel}
      >
        <motion.div
          className="w-full h-full flex items-center justify-center"
          style={{
            transformStyle: 'preserve-3d',
            transform: `
              rotateX(${rotation.x}deg) 
              rotateY(${rotation.y}deg) 
              rotateZ(${rotation.z}deg) 
              scale(${zoom})
            `
          }}
          animate={{
            rotateY: isRotating ? rotation.y : rotation.y
          }}
          transition={{ duration: 0.1 }}
        >
          {/* DNA Strands */}
          <AnimatePresence>
            {strands.map((strand) => (
              <motion.div
                key={strand.id}
                className="absolute"
                style={{
                  transform: `translate3d(${strand.position.x}rem, ${strand.position.y}rem, ${strand.position.z}rem)`,
                  opacity: strand.opacity
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: strand.opacity, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Strand backbone */}
                <div
                  className="w-1 h-32 bg-gradient-to-b from-transparent via-current to-transparent"
                  style={{ color: strand.color }}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Nucleotides */}
          <AnimatePresence>
            {nucleotides.map((nucleotide) => (
              <motion.div
                key={nucleotide.id}
                className="absolute cursor-pointer"
                style={{
                  transform: `translate3d(${nucleotide.position.x}rem, ${nucleotide.position.y}rem, ${nucleotide.position.z}rem)`,
                  width: `${nucleotide.size}rem`,
                  height: `${nucleotide.size}rem`
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: nucleotide.isHighlighted ? 1 : 0.7,
                  scale: nucleotide.isHighlighted ? 1.5 : 1
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.2 }}
                onHoverStart={() => setHoveredNucleotide(nucleotide.id)}
                onHoverEnd={() => setHoveredNucleotide(null)}
              >
                {/* Nucleotide sphere */}
                <div
                  className="w-full h-full rounded-full border-2 border-white/20 shadow-lg"
                  style={{ 
                    backgroundColor: nucleotide.color,
                    boxShadow: nucleotide.isHighlighted 
                      ? `0 0 20px ${nucleotide.color}` 
                      : `0 0 10px ${nucleotide.color}40`
                  }}
                />
                
                {/* Base label */}
                {showLabels && (nucleotide.isHighlighted || hoveredNucleotide === nucleotide.id) && (
                  <motion.div
                    className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800/90 border border-slate-600 rounded px-2 py-1 text-xs text-white whitespace-nowrap"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    {nucleotide.base}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Connection lines between complementary bases */}
          {nucleotides.length > 0 && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {nucleotides.slice(0, Math.floor(nucleotides.length / 2)).map((n1, index) => {
                const n2 = nucleotides[Math.floor(nucleotides.length / 2) + index];
                if (n1 && n2) {
                  return (
                    <motion.line
                      key={`connection-${n1.id}-${n2.id}`}
                      x1={`${50 + n1.position.x * 10}%`}
                      y1={`${50 + n1.position.y * 10}%`}
                      x2={`${50 + n2.position.x * 10}%`}
                      y2={`${50 + n2.position.y * 10}%`}
                      stroke="#00FF9D"
                      strokeWidth="1"
                      opacity="0.3"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  );
                }
                return null;
              })}
            </svg>
          )}
        </motion.div>
      </div>

      {/* Status overlay */}
      <div className="absolute bottom-4 left-4 z-10">
        <div className="bg-slate-800/80 border border-slate-600 rounded-lg p-3 text-sm">
          <div className="text-emerald-400 mb-1">Consciousness Level</div>
          <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400"
              initial={{ width: 0 }}
              animate={{ width: `${consciousnessLevel * 100}%` }}
              transition={{ duration: 1 }}
            />
          </div>
          <div className="text-cyan-400 mt-2 mb-1">Research Progress</div>
          <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-400"
              initial={{ width: 0 }}
              animate={{ width: `${researchProgress * 100}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Instructions */}
      {interactive && (
        <div className="absolute bottom-4 right-4 z-10">
          <div className="bg-slate-800/80 border border-slate-600 rounded-lg p-3 text-xs text-slate-300">
            <div>🖱️ Drag to rotate</div>
            <div>🔍 Scroll to zoom</div>
            <div>👆 Click to select</div>
          </div>
        </div>
      )}
    </div>
  );
}; 