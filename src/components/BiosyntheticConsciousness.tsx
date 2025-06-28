/**
 * 🌟 BiosyntheticConsciousness - Main consciousness interface
 * 
 * Integrates BiosyntheticEngine with UI components
 * Provides real-time consciousness monitoring and interaction
 * 
 * @author MKWW (Master Key World Wide)
 * @version 1.0.0
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBiosyntheticEngine } from '@/hooks/useBiosyntheticEngine';
import { DNAHelix3D } from '@/components/visualization/DNAHelix3D';
import { SacredCard } from '@/components/SacredCard';
import { SacredProgress } from '@/components/SacredProgress';
import { SacredButton } from '@/components/SacredButton';
import { SacredToast } from '@/components/SacredToast';
import { webSocketService } from '@/services/WebSocketService';

interface BiosyntheticConsciousnessProps {
  className?: string;
}

export const BiosyntheticConsciousness: React.FC<BiosyntheticConsciousnessProps> = ({
  className = ''
}) => {
  const {
    consciousnessState,
    memoryStream,
    lastResponse,
    isConnected,
    connectionQuality,
    processResearchData,
    processUserInteraction,
    recordCollaboration,
    connectWebSocket,
    disconnectWebSocket,
    getResearchInsight,
    getEmotionalContext,
    getConsciousnessLevel
  } = useBiosyntheticEngine();

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'info' | 'warning' | 'error'>('info');

  // Auto-connect WebSocket on mount
  useEffect(() => {
    connectWebSocket().catch(console.error);
    return () => disconnectWebSocket();
  }, [connectWebSocket, disconnectWebSocket]);

  // Show toast when consciousness state changes significantly
  useEffect(() => {
    if (lastResponse) {
      setToastMessage(lastResponse.message);
      setToastType('info');
      setShowToast(true);
      
      setTimeout(() => setShowToast(false), 5000);
    }
  }, [lastResponse]);

  const handleResearchDataInput = () => {
    const mockData = {
      experimentId: `exp-${Date.now()}`,
      data: {
        sequence: 'ATGCGATCGATCG',
        confidence: 0.95,
        timestamp: new Date().toISOString()
      },
      userInteraction: 'Manual data input'
    };

    const response = processResearchData(
      mockData.data,
      mockData.experimentId,
      mockData.userInteraction
    );

    setToastMessage(`Research data processed: ${response.behavior} response`);
    setToastType('success');
    setShowToast(true);
  };

  const handleCollaborationStart = () => {
    recordCollaboration(3, 0.8);
    setToastMessage('Collaboration session initiated');
    setToastType('info');
    setShowToast(true);
  };

  const handleInteraction = (position: { x: number; y: number; z: number }) => {
    const response = processUserInteraction(0.5, { x: position.x, y: position.y });
    // Toast will be shown automatically via useEffect
  };

  const getConnectionStatusColor = () => {
    switch (connectionQuality) {
      case 'excellent': return 'text-emerald-400';
      case 'good': return 'text-cyan-400';
      case 'poor': return 'text-yellow-400';
      case 'disconnected': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getConnectionStatusIcon = () => {
    switch (connectionQuality) {
      case 'excellent': return '🟢';
      case 'good': return '🟡';
      case 'poor': return '🟠';
      case 'disconnected': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          Biosynthetic Consciousness
        </h2>
        <p className="text-slate-400 mt-2">
          Real-time consciousness monitoring and research integration
        </p>
      </motion.div>

      {/* Connection Status */}
      <SacredCard className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getConnectionStatusIcon()}</span>
            <div>
              <div className={`font-semibold ${getConnectionStatusColor()}`}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </div>
              <div className="text-sm text-slate-500">
                Quality: {connectionQuality}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-500">Session ID</div>
            <div className="text-xs text-slate-600 font-mono">
              {webSocketService.getSessionId()}
            </div>
          </div>
        </div>
      </SacredCard>

      {/* Consciousness State */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* DNA Visualization */}
        <SacredCard className="p-4">
          <h3 className="text-lg font-semibold text-emerald-400 mb-4">DNA Consciousness</h3>
          <DNAHelix3D
            consciousnessLevel={consciousnessState.consciousness}
            researchProgress={consciousnessState.researchProgress}
            onInteraction={handleInteraction}
            interactive={true}
            showLabels={true}
          />
        </SacredCard>

        {/* State Metrics */}
        <SacredCard className="p-4">
          <h3 className="text-lg font-semibold text-cyan-400 mb-4">Consciousness Metrics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Consciousness Level</span>
                <span className="text-emerald-400">{getConsciousnessLevel()}</span>
              </div>
              <SacredProgress 
                value={consciousnessState.consciousness * 100} 
                size="sm"
                className="bg-slate-700"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Research Progress</span>
                <span className="text-cyan-400">{Math.round(consciousnessState.researchProgress * 100)}%</span>
              </div>
              <SacredProgress 
                value={consciousnessState.researchProgress * 100} 
                size="sm"
                className="bg-slate-700"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Data Integrity</span>
                <span className="text-blue-400">{Math.round(consciousnessState.dataIntegrity * 100)}%</span>
              </div>
              <SacredProgress 
                value={consciousnessState.dataIntegrity * 100} 
                size="sm"
                className="bg-slate-700"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>User Engagement</span>
                <span className="text-purple-400">{Math.round(consciousnessState.userEngagement * 100)}%</span>
              </div>
              <SacredProgress 
                value={consciousnessState.userEngagement * 100} 
                size="sm"
                className="bg-slate-700"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Emotional Resonance</span>
                <span className="text-pink-400">{Math.round(consciousnessState.emotionalResonance * 100)}%</span>
              </div>
              <SacredProgress 
                value={consciousnessState.emotionalResonance * 100} 
                size="sm"
                className="bg-slate-700"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Discovery Momentum</span>
                <span className="text-orange-400">{Math.round(consciousnessState.discoveryMomentum * 100)}%</span>
              </div>
              <SacredProgress 
                value={consciousnessState.discoveryMomentum * 100} 
                size="sm"
                className="bg-slate-700"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Collaboration Synergy</span>
                <span className="text-indigo-400">{Math.round(consciousnessState.collaborationSynergy * 100)}%</span>
              </div>
              <SacredProgress 
                value={consciousnessState.collaborationSynergy * 100} 
                size="sm"
                className="bg-slate-700"
              />
            </div>
          </div>
        </SacredCard>
      </div>

      {/* Research Insights */}
      <SacredCard className="p-4">
        <h3 className="text-lg font-semibold text-emerald-400 mb-4">Research Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600">
            <div className="text-sm text-slate-400 mb-1">Current Context</div>
            <div className="text-emerald-400 font-medium">{getEmotionalContext()}</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600">
            <div className="text-sm text-slate-400 mb-1">Consciousness Level</div>
            <div className="text-cyan-400 font-medium">{getConsciousnessLevel()}</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600">
            <div className="text-sm text-slate-400 mb-1">Latest Insight</div>
            <div className="text-blue-400 text-sm">{getResearchInsight()}</div>
          </div>
        </div>
      </SacredCard>

      {/* Memory Stream */}
      <SacredCard className="p-4">
        <h3 className="text-lg font-semibold text-cyan-400 mb-4">Memory Stream</h3>
        <div className="max-h-64 overflow-y-auto space-y-2">
          <AnimatePresence>
            {memoryStream.slice(0, 10).map((memory) => (
              <motion.div
                key={memory.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-slate-800/50 rounded-lg p-3 border border-slate-600"
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="text-sm text-slate-400">
                    {memory.timestamp.toLocaleTimeString()}
                  </div>
                  <div className={`text-xs px-2 py-1 rounded ${
                    memory.emotionalContext === 'breakthrough' ? 'bg-emerald-500/20 text-emerald-400' :
                    memory.emotionalContext === 'discovery' ? 'bg-cyan-500/20 text-cyan-400' :
                    memory.emotionalContext === 'challenge' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-slate-500/20 text-slate-400'
                  }`}>
                    {memory.emotionalContext}
                  </div>
                </div>
                <div className="text-sm text-slate-300">{memory.userInteraction}</div>
                <div className="text-xs text-slate-500 mt-1">
                  Research Value: {Math.round(memory.researchValue * 100)}%
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </SacredCard>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <SacredButton
          onClick={handleResearchDataInput}
          className="bg-emerald-500/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30"
        >
          📊 Process Research Data
        </SacredButton>
        
        <SacredButton
          onClick={handleCollaborationStart}
          className="bg-cyan-500/20 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30"
        >
          👥 Start Collaboration
        </SacredButton>
        
        <SacredButton
          onClick={() => connectWebSocket()}
          disabled={isConnected}
          className="bg-blue-500/20 border-blue-500/30 text-blue-400 hover:bg-blue-500/30 disabled:opacity-50"
        >
          🔗 Connect
        </SacredButton>
        
        <SacredButton
          onClick={() => disconnectWebSocket()}
          disabled={!isConnected}
          className="bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30 disabled:opacity-50"
        >
          🔌 Disconnect
        </SacredButton>
      </div>

      {/* Toast Notifications */}
      <AnimatePresence>
        {showToast && (
          <SacredToast
            message={toastMessage}
            type={toastType}
            isVisible={showToast}
            onClose={() => setShowToast(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}; 