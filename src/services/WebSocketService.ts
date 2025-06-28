/**
 * 🌐 WebSocketService - Real-time communication bridge
 * 
 * Handles WebSocket connections for live research data streaming
 * Manages reconnection logic, message queuing, and connection state
 * 
 * @author MKWW (Master Key World Wide)
 * @version 1.0.0
 */

export interface WebSocketMessage {
  type: 'research_update' | 'consciousness_state' | 'memory_stream' | 'collaboration' | 'error' | 'ping';
  payload: any;
  timestamp: Date;
  sessionId?: string;
}

export interface ConnectionState {
  isConnected: boolean;
  isConnecting: boolean;
  reconnectAttempts: number;
  lastConnected: Date | null;
  connectionQuality: 'excellent' | 'good' | 'poor' | 'disconnected';
}

export interface ResearchUpdate {
  experimentId: string;
  data: any;
  userInteraction: string;
  emotionalContext: string;
  consciousnessImpact: number;
  researchValue: number;
}

export class WebSocketService {
  private socket: WebSocket | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 10;
  private reconnectDelay: number = 1000; // Start with 1 second
  private maxReconnectDelay: number = 30000; // Max 30 seconds
  private messageQueue: WebSocketMessage[] = [];
  private isReconnecting: boolean = false;
  private pingInterval: NodeJS.Timeout | null = null;
  private connectionState: ConnectionState = {
    isConnected: false,
    isConnecting: false,
    reconnectAttempts: 0,
    lastConnected: null,
    connectionQuality: 'disconnected'
  };

  // Event callbacks
  private onMessageCallbacks: ((message: WebSocketMessage) => void)[] = [];
  private onStateChangeCallbacks: ((state: ConnectionState) => void)[] = [];
  private onErrorCallbacks: ((error: Error) => void)[] = [];

  constructor(
    private url: string = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:8080',
    private sessionId?: string
  ) {
    this.sessionId = sessionId || this.generateSessionId();
  }

  /**
   * Connect to WebSocket server
   */
  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      if (this.isReconnecting) {
        reject(new Error('Connection already in progress'));
        return;
      }

      this.connectionState.isConnecting = true;
      this.notifyStateChange();

      try {
        this.socket = new WebSocket(this.url);
        this.setupEventHandlers(resolve, reject);
      } catch (error) {
        this.connectionState.isConnecting = false;
        this.notifyStateChange();
        reject(error);
      }
    });
  }

  /**
   * Disconnect from WebSocket server
   */
  public disconnect(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }

    if (this.socket) {
      this.socket.close(1000, 'Client disconnect');
      this.socket = null;
    }

    this.connectionState.isConnected = false;
    this.connectionState.isConnecting = false;
    this.notifyStateChange();
  }

  /**
   * Send research update to server
   */
  public sendResearchUpdate(update: ResearchUpdate): void {
    const message: WebSocketMessage = {
      type: 'research_update',
      payload: update,
      timestamp: new Date(),
      sessionId: this.sessionId
    };

    this.sendMessage(message);
  }

  /**
   * Send consciousness state update
   */
  public sendConsciousnessState(state: any): void {
    const message: WebSocketMessage = {
      type: 'consciousness_state',
      payload: state,
      timestamp: new Date(),
      sessionId: this.sessionId
    };

    this.sendMessage(message);
  }

  /**
   * Send memory stream update
   */
  public sendMemoryStream(memories: any[]): void {
    const message: WebSocketMessage = {
      type: 'memory_stream',
      payload: memories,
      timestamp: new Date(),
      sessionId: this.sessionId
    };

    this.sendMessage(message);
  }

  /**
   * Send collaboration update
   */
  public sendCollaborationUpdate(teamSize: number, interactionQuality: number): void {
    const message: WebSocketMessage = {
      type: 'collaboration',
      payload: { teamSize, interactionQuality },
      timestamp: new Date(),
      sessionId: this.sessionId
    };

    this.sendMessage(message);
  }

  /**
   * Subscribe to incoming messages
   */
  public onMessage(callback: (message: WebSocketMessage) => void): () => void {
    this.onMessageCallbacks.push(callback);
    return () => {
      const index = this.onMessageCallbacks.indexOf(callback);
      if (index > -1) {
        this.onMessageCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Subscribe to connection state changes
   */
  public onStateChange(callback: (state: ConnectionState) => void): () => void {
    this.onStateChangeCallbacks.push(callback);
    return () => {
      const index = this.onStateChangeCallbacks.indexOf(callback);
      if (index > -1) {
        this.onStateChangeCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Subscribe to error events
   */
  public onError(callback: (error: Error) => void): () => void {
    this.onErrorCallbacks.push(callback);
    return () => {
      const index = this.onErrorCallbacks.indexOf(callback);
      if (index > -1) {
        this.onErrorCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Get current connection state
   */
  public getConnectionState(): ConnectionState {
    return { ...this.connectionState };
  }

  /**
   * Check if connected
   */
  public isConnected(): boolean {
    return this.connectionState.isConnected;
  }

  /**
   * Get session ID
   */
  public getSessionId(): string {
    return this.sessionId || '';
  }

  /**
   * Setup WebSocket event handlers
   */
  private setupEventHandlers(resolve: () => void, reject: (error: Error) => void): void {
    if (!this.socket) return;

    this.socket.onopen = () => {
      console.log('🌟 WebSocket connected - Real-time research streaming active');
      this.connectionState.isConnected = true;
      this.connectionState.isConnecting = false;
      this.connectionState.reconnectAttempts = 0;
      this.connectionState.lastConnected = new Date();
      this.connectionState.connectionQuality = 'excellent';
      this.reconnectDelay = 1000; // Reset reconnect delay
      this.isReconnecting = false;
      
      this.notifyStateChange();
      this.startPingInterval();
      this.flushMessageQueue();
      resolve();
    };

    this.socket.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        this.handleIncomingMessage(message);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
        this.notifyError(new Error('Invalid message format'));
      }
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event.code, event.reason);
      this.connectionState.isConnected = false;
      this.connectionState.isConnecting = false;
      this.connectionState.connectionQuality = 'disconnected';
      
      this.stopPingInterval();
      this.notifyStateChange();

      // Attempt reconnection if not a clean close
      if (event.code !== 1000 && !this.isReconnecting) {
        this.attemptReconnection();
      }
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.connectionState.connectionQuality = 'poor';
      this.notifyStateChange();
      this.notifyError(new Error('WebSocket connection error'));
      reject(new Error('WebSocket connection failed'));
    };
  }

  /**
   * Handle incoming WebSocket messages
   */
  private handleIncomingMessage(message: WebSocketMessage): void {
    // Handle different message types
    switch (message.type) {
      case 'research_update':
        console.log('Received research update:', message.payload);
        break;
      case 'consciousness_state':
        console.log('Received consciousness state update:', message.payload);
        break;
      case 'memory_stream':
        console.log('Received memory stream update:', message.payload);
        break;
      case 'collaboration':
        console.log('Received collaboration update:', message.payload);
        break;
      case 'error':
        console.error('Server error:', message.payload);
        this.notifyError(new Error(message.payload.message || 'Server error'));
        break;
      case 'ping':
        // Respond to ping with pong
        this.sendPong();
        break;
      default:
        console.warn('Unknown message type:', message.type);
    }

    // Notify all message subscribers
    this.onMessageCallbacks.forEach(callback => callback(message));
  }

  /**
   * Send message to server
   */
  private sendMessage(message: WebSocketMessage): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      try {
        this.socket.send(JSON.stringify(message));
      } catch (error) {
        console.error('Failed to send message:', error);
        this.notifyError(error as Error);
      }
    } else {
      // Queue message for later if not connected
      this.messageQueue.push(message);
      console.log('Message queued, waiting for connection...');
    }
  }

  /**
   * Attempt to reconnect to server
   */
  private attemptReconnection(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      this.notifyError(new Error('Max reconnection attempts reached'));
      return;
    }

    this.isReconnecting = true;
    this.reconnectAttempts++;
    this.connectionState.reconnectAttempts = this.reconnectAttempts;

    console.log(`Attempting reconnection ${this.reconnectAttempts}/${this.maxReconnectAttempts}...`);

    setTimeout(() => {
      this.connect()
        .then(() => {
          console.log('Reconnection successful');
        })
        .catch((error) => {
          console.error('Reconnection failed:', error);
          this.attemptReconnection();
        });
    }, this.reconnectDelay);

    // Exponential backoff
    this.reconnectDelay = Math.min(this.reconnectDelay * 2, this.maxReconnectDelay);
  }

  /**
   * Start ping interval to keep connection alive
   */
  private startPingInterval(): void {
    this.pingInterval = setInterval(() => {
      if (this.socket?.readyState === WebSocket.OPEN) {
        this.sendPing();
      }
    }, 30000); // Send ping every 30 seconds
  }

  /**
   * Stop ping interval
   */
  private stopPingInterval(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  /**
   * Send ping message
   */
  private sendPing(): void {
    const pingMessage: WebSocketMessage = {
      type: 'ping',
      payload: { timestamp: Date.now() },
      timestamp: new Date(),
      sessionId: this.sessionId
    };

    this.sendMessage(pingMessage);
  }

  /**
   * Send pong response
   */
  private sendPong(): void {
    const pongMessage: WebSocketMessage = {
      type: 'ping', // Use same type for pong
      payload: { timestamp: Date.now(), response: 'pong' },
      timestamp: new Date(),
      sessionId: this.sessionId
    };

    this.sendMessage(pongMessage);
  }

  /**
   * Flush queued messages
   */
  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message) {
        this.sendMessage(message);
      }
    }
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `mkww-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Notify state change subscribers
   */
  private notifyStateChange(): void {
    this.onStateChangeCallbacks.forEach(callback => callback(this.connectionState));
  }

  /**
   * Notify error subscribers
   */
  private notifyError(error: Error): void {
    this.onErrorCallbacks.forEach(callback => callback(error));
  }
}

// Export singleton instance
export const webSocketService = new WebSocketService(); 