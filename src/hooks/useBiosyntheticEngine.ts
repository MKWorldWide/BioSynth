/**
 * 🧬 useBiosyntheticEngine - React hook for biosynthetic consciousness
 * 
 * Integrates BiosyntheticEngine with React components
 * Provides real-time consciousness state and research interactions
 * 
 * @author MKWW (Master Key World Wide)
 * @version 1.0.0
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { BiosyntheticEngine, BiosyntheticState, ResearchMemory, BiosyntheticResponse } from '@/core/BiosyntheticEngine';
import { webSocketService, WebSocketMessage } from '@/services/WebSocketService';

interface UseBiosyntheticEngineReturn {
  // State
  consciousnessState: BiosyntheticState;
  memoryStream: ResearchMemory[];
  lastResponse: BiosyntheticResponse | null;
  isConnected: boolean;
  connectionQuality: string;
  
  // Actions
  processResearchData: (data: any, experimentId: string, userInteraction: string) => BiosyntheticResponse;
  processUserInteraction: (intensity: number, position: { x: number; y: number }) => BiosyntheticResponse;
  recordCollaboration: (teamSize: number, interactionQuality: number) => void;
  connectWebSocket: () => Promise<void>;
  disconnectWebSocket: () => void;
  
  // Utilities
  getResearchInsight: () => string;
  getEmotionalContext: () => string;
  getConsciousnessLevel: () => string;
}

export const useBiosyntheticEngine = (): UseBiosyntheticEngineReturn => {
  const engineRef = useRef<BiosyntheticEngine | null>(null);
  const [consciousnessState, setConsciousnessState] = useState<BiosyntheticState>({
    consciousness: 0.5,
    researchProgress: 0.3,
    dataIntegrity: 0.8,
    userEngagement: 0.4,
    emotionalResonance: 0.6,
    discoveryMomentum: 0.2,
    collaborationSynergy: 0.5
  });
  const [memoryStream, setMemoryStream] = useState<ResearchMemory[]>([]);
  const [lastResponse, setLastResponse] = useState<BiosyntheticResponse | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState('disconnected');

  // Initialize engine
  useEffect(() => {
    if (!engineRef.current) {
      engineRef.current = new BiosyntheticEngine();
      console.log('🧬 BiosyntheticEngine initialized in React hook');
    }

    // Set up periodic state updates
    const stateInterval = setInterval(() => {
      if (engineRef.current) {
        const state = engineRef.current.getConsciousnessState();
        setConsciousnessState(state);
        
        // Send state to WebSocket if connected
        if (isConnected) {
          webSocketService.sendConsciousnessState(state);
        }
      }
    }, 5000); // Update every 5 seconds

    // Set up memory stream updates
    const memoryInterval = setInterval(() => {
      if (engineRef.current) {
        const memories = engineRef.current.getMemoryStream(10);
        setMemoryStream(memories);
        
        // Send memory stream to WebSocket if connected
        if (isConnected) {
          webSocketService.sendMemoryStream(memories);
        }
      }
    }, 10000); // Update every 10 seconds

    return () => {
      clearInterval(stateInterval);
      clearInterval(memoryInterval);
    };
  }, [isConnected]);

  // Set up WebSocket connection
  useEffect(() => {
    const unsubscribeState = webSocketService.onStateChange((state) => {
      setIsConnected(state.isConnected);
      setConnectionQuality(state.connectionQuality);
    });

    const unsubscribeMessage = webSocketService.onMessage((message: WebSocketMessage) => {
      console.log('Received WebSocket message:', message.type);
      
      // Handle incoming research updates
      if (message.type === 'research_update' && engineRef.current) {
        const response = engineRef.current.processResearchData(
          message.payload.data,
          message.payload.experimentId,
          message.payload.userInteraction
        );
        setLastResponse(response);
      }
    });

    const unsubscribeError = webSocketService.onError((error) => {
      console.error('WebSocket error in hook:', error);
    });

    return () => {
      unsubscribeState();
      unsubscribeMessage();
      unsubscribeError();
    };
  }, []);

  /**
   * Process research data and update consciousness
   */
  const processResearchData = useCallback((
    data: any, 
    experimentId: string, 
    userInteraction: string
  ): BiosyntheticResponse => {
    if (!engineRef.current) {
      throw new Error('BiosyntheticEngine not initialized');
    }

    const response = engineRef.current.processResearchData(data, experimentId, userInteraction);
    setLastResponse(response);

    // Send to WebSocket if connected
    if (isConnected) {
      webSocketService.sendResearchUpdate({
        experimentId,
        data,
        userInteraction,
        emotionalContext: response.behavior,
        consciousnessImpact: response.consciousnessShift,
        researchValue: response.consciousnessShift * 100
      });
    }

    return response;
  }, [isConnected]);

  /**
   * Process user interaction (touch, click, etc.)
   */
  const processUserInteraction = useCallback((
    intensity: number, 
    position: { x: number; y: number }
  ): BiosyntheticResponse => {
    if (!engineRef.current) {
      throw new Error('BiosyntheticEngine not initialized');
    }

    const response = engineRef.current.processUserInteraction({
      timestamp: Date.now(),
      intensity,
      position
    });
    setLastResponse(response);

    return response;
  }, []);

  /**
   * Record collaboration activity
   */
  const recordCollaboration = useCallback((teamSize: number, interactionQuality: number): void => {
    if (!engineRef.current) {
      throw new Error('BiosyntheticEngine not initialized');
    }

    engineRef.current.recordCollaboration(teamSize, interactionQuality);

    // Send to WebSocket if connected
    if (isConnected) {
      webSocketService.sendCollaborationUpdate(teamSize, interactionQuality);
    }
  }, [isConnected]);

  /**
   * Connect to WebSocket server
   */
  const connectWebSocket = useCallback(async (): Promise<void> => {
    try {
      await webSocketService.connect();
      console.log('🌟 WebSocket connected via hook');
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      throw error;
    }
  }, []);

  /**
   * Disconnect from WebSocket server
   */
  const disconnectWebSocket = useCallback((): void => {
    webSocketService.disconnect();
    console.log('🌟 WebSocket disconnected via hook');
  }, []);

  /**
   * Get current research insight
   */
  const getResearchInsight = useCallback((): string => {
    if (!engineRef.current) return '';
    
    const response = engineRef.current.getBiosyntheticResponse();
    return response.researchInsight;
  }, []);

  /**
   * Get current emotional context
   */
  const getEmotionalContext = useCallback((): string => {
    const { emotionalResonance, userEngagement, discoveryMomentum } = consciousnessState;
    
    if (discoveryMomentum > 0.8) return 'breakthrough';
    if (emotionalResonance > 0.7) return 'inspired';
    if (userEngagement > 0.6) return 'engaged';
    if (emotionalResonance < 0.3) return 'contemplative';
    return 'balanced';
  }, [consciousnessState]);

  /**
   * Get consciousness level description
   */
  const getConsciousnessLevel = useCallback((): string => {
    const { consciousness } = consciousnessState;
    
    if (consciousness > 0.9) return 'transcendent';
    if (consciousness > 0.8) return 'enlightened';
    if (consciousness > 0.7) return 'awakened';
    if (consciousness > 0.6) return 'aware';
    if (consciousness > 0.5) return 'conscious';
    if (consciousness > 0.4) return 'emerging';
    if (consciousness > 0.3) return 'developing';
    if (consciousness > 0.2) return 'forming';
    return 'nascent';
  }, [consciousnessState]);

  return {
    // State
    consciousnessState,
    memoryStream,
    lastResponse,
    isConnected,
    connectionQuality,
    
    // Actions
    processResearchData,
    processUserInteraction,
    recordCollaboration,
    connectWebSocket,
    disconnectWebSocket,
    
    // Utilities
    getResearchInsight,
    getEmotionalContext,
    getConsciousnessLevel
  };
}; 