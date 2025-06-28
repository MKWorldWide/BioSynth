/**
 * 🔗 useIntegration - React hook for external integrations
 * 
 * Provides easy access to IntegrationService functionality
 * Manages loading states, error handling, and data caching
 * 
 * @author MKWW (Master Key World Wide)
 * @version 1.0.0
 */

import { useState, useCallback, useEffect } from 'react';
import { integrationService, IntegrationResponse, ResearchData, APICredentials } from '@/services/IntegrationService';

interface UseIntegrationReturn {
  // State
  loading: boolean;
  error: string | null;
  lastResponse: IntegrationResponse | null;
  integrationStatus: Array<{
    name: string;
    configured: boolean;
    hasCredentials: boolean;
    lastUsed?: Date;
  }>;
  
  // DNA/Genomics
  fetchDNASequence: (accession: string) => Promise<IntegrationResponse>;
  getGeneInfo: (geneId: string) => Promise<IntegrationResponse>;
  
  // Protein/Structure
  fetchProteinStructure: (pdbId: string) => Promise<IntegrationResponse>;
  searchUniProt: (query: string) => Promise<IntegrationResponse>;
  
  // AI/Insights
  getAIInsights: (prompt: string, context?: any) => Promise<IntegrationResponse>;
  
  // Storage
  storeResearchData: (data: ResearchData, bucket: string) => Promise<IntegrationResponse>;
  
  // Batch Operations
  batchProcess: (operations: Array<{
    type: 'dna' | 'protein' | 'gene' | 'ai' | 'storage';
    params: any;
  }>) => Promise<IntegrationResponse[]>;
  
  // Configuration
  setCredentials: (name: string, credentials: APICredentials) => void;
  getCachedData: (source: string) => ResearchData[] | undefined;
  clearCache: (source?: string) => void;
}

export const useIntegration = (): UseIntegrationReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResponse, setLastResponse] = useState<IntegrationResponse | null>(null);
  const [integrationStatus, setIntegrationStatus] = useState<Array<{
    name: string;
    configured: boolean;
    hasCredentials: boolean;
    lastUsed?: Date;
  }>>([]);

  // Initialize integration status
  useEffect(() => {
    setIntegrationStatus(integrationService.getIntegrationStatus());
  }, []);

  // Generic request wrapper
  const makeRequest = useCallback(async <T>(
    requestFn: () => Promise<T>
  ): Promise<T> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await requestFn();
      setLoading(false);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, []);

  // DNA/Genomics functions
  const fetchDNASequence = useCallback(async (accession: string): Promise<IntegrationResponse> => {
    return makeRequest(async () => {
      const response = await integrationService.fetchDNASequence(accession);
      setLastResponse(response);
      return response;
    });
  }, [makeRequest]);

  const getGeneInfo = useCallback(async (geneId: string): Promise<IntegrationResponse> => {
    return makeRequest(async () => {
      const response = await integrationService.getGeneInfo(geneId);
      setLastResponse(response);
      return response;
    });
  }, [makeRequest]);

  // Protein/Structure functions
  const fetchProteinStructure = useCallback(async (pdbId: string): Promise<IntegrationResponse> => {
    return makeRequest(async () => {
      const response = await integrationService.fetchProteinStructure(pdbId);
      setLastResponse(response);
      return response;
    });
  }, [makeRequest]);

  const searchUniProt = useCallback(async (query: string): Promise<IntegrationResponse> => {
    return makeRequest(async () => {
      const response = await integrationService.searchUniProt(query);
      setLastResponse(response);
      return response;
    });
  }, [makeRequest]);

  // AI/Insights functions
  const getAIInsights = useCallback(async (prompt: string, context?: any): Promise<IntegrationResponse> => {
    return makeRequest(async () => {
      const response = await integrationService.getAIInsights(prompt, context);
      setLastResponse(response);
      return response;
    });
  }, [makeRequest]);

  // Storage functions
  const storeResearchData = useCallback(async (data: ResearchData, bucket: string): Promise<IntegrationResponse> => {
    return makeRequest(async () => {
      const response = await integrationService.storeResearchData(data, bucket);
      setLastResponse(response);
      return response;
    });
  }, [makeRequest]);

  // Batch processing
  const batchProcess = useCallback(async (operations: Array<{
    type: 'dna' | 'protein' | 'gene' | 'ai' | 'storage';
    params: any;
  }>): Promise<IntegrationResponse[]> => {
    return makeRequest(async () => {
      const responses = await integrationService.batchProcess(operations);
      // Set the last successful response
      const lastSuccess = responses.find(r => r.success);
      if (lastSuccess) {
        setLastResponse(lastSuccess);
      }
      return responses;
    });
  }, [makeRequest]);

  // Configuration functions
  const setCredentials = useCallback((name: string, credentials: APICredentials): void => {
    integrationService.setCredentials(name, credentials);
    // Update integration status
    setIntegrationStatus(integrationService.getIntegrationStatus());
  }, []);

  const getCachedData = useCallback((source: string): ResearchData[] | undefined => {
    return integrationService.getCachedData(source);
  }, []);

  const clearCache = useCallback((source?: string): void => {
    integrationService.clearCache(source);
  }, []);

  return {
    // State
    loading,
    error,
    lastResponse,
    integrationStatus,
    
    // DNA/Genomics
    fetchDNASequence,
    getGeneInfo,
    
    // Protein/Structure
    fetchProteinStructure,
    searchUniProt,
    
    // AI/Insights
    getAIInsights,
    
    // Storage
    storeResearchData,
    
    // Batch Operations
    batchProcess,
    
    // Configuration
    setCredentials,
    getCachedData,
    clearCache
  };
}; 