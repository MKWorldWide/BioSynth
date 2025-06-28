/**
 * 🔗 IntegrationService - External system integration hub
 * 
 * Connects MKWW Biosynthetic Vessel with external APIs, databases, and research platforms
 * Provides unified interface for data exchange and system interoperability
 * 
 * @author MKWW (Master Key World Wide)
 * @version 1.0.0
 */

export interface IntegrationConfig {
  apiKey?: string;
  baseUrl: string;
  timeout?: number;
  retryAttempts?: number;
}

export interface ResearchData {
  id: string;
  type: 'dna' | 'protein' | 'cell' | 'experiment' | 'analysis';
  data: any;
  metadata: {
    source: string;
    timestamp: Date;
    confidence: number;
    tags: string[];
  };
}

export interface IntegrationResponse {
  success: boolean;
  data?: any;
  error?: string;
  timestamp: Date;
  source: string;
}

export interface APICredentials {
  name: string;
  apiKey: string;
  baseUrl: string;
  enabled: boolean;
}

export class IntegrationService {
  private integrations: Map<string, IntegrationConfig> = new Map();
  private credentials: Map<string, APICredentials> = new Map();
  private dataCache: Map<string, ResearchData[]> = new Map();

  constructor() {
    this.initializeDefaultIntegrations();
  }

  /**
   * Initialize default integrations
   */
  private initializeDefaultIntegrations(): void {
    // NCBI (National Center for Biotechnology Information)
    this.addIntegration('ncbi', {
      baseUrl: 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils',
      timeout: 10000,
      retryAttempts: 3
    });

    // PDB (Protein Data Bank)
    this.addIntegration('pdb', {
      baseUrl: 'https://data.rcsb.org/rest/v1',
      timeout: 15000,
      retryAttempts: 3
    });

    // UniProt (Universal Protein Resource)
    this.addIntegration('uniprot', {
      baseUrl: 'https://rest.uniprot.org',
      timeout: 12000,
      retryAttempts: 3
    });

    // Ensembl (Genome Database)
    this.addIntegration('ensembl', {
      baseUrl: 'https://rest.ensembl.org',
      timeout: 10000,
      retryAttempts: 3
    });

    // OpenAI (AI Research Assistant)
    this.addIntegration('openai', {
      baseUrl: 'https://api.openai.com/v1',
      timeout: 30000,
      retryAttempts: 2
    });

    // AWS S3 (Data Storage)
    this.addIntegration('s3', {
      baseUrl: 'https://s3.amazonaws.com',
      timeout: 20000,
      retryAttempts: 3
    });

    console.log('🔗 IntegrationService initialized with default integrations');
  }

  /**
   * Add new integration
   */
  public addIntegration(name: string, config: IntegrationConfig): void {
    this.integrations.set(name, config);
    console.log(`🔗 Added integration: ${name}`);
  }

  /**
   * Set API credentials
   */
  public setCredentials(name: string, credentials: APICredentials): void {
    this.credentials.set(name, credentials);
    console.log(`🔑 Set credentials for: ${name}`);
  }

  /**
   * Get integration config
   */
  public getIntegration(name: string): IntegrationConfig | undefined {
    return this.integrations.get(name);
  }

  /**
   * Fetch DNA sequence from NCBI
   */
  public async fetchDNASequence(accession: string): Promise<IntegrationResponse> {
    try {
      const config = this.getIntegration('ncbi');
      if (!config) {
        throw new Error('NCBI integration not configured');
      }

      const url = `${config.baseUrl}/efetch.fcgi?db=nucleotide&id=${accession}&rettype=fasta&retmode=text`;
      const response = await this.makeRequest(url, 'GET');
      
      return {
        success: true,
        data: {
          accession,
          sequence: response,
          source: 'ncbi'
        },
        timestamp: new Date(),
        source: 'ncbi'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
        source: 'ncbi'
      };
    }
  }

  /**
   * Fetch protein structure from PDB
   */
  public async fetchProteinStructure(pdbId: string): Promise<IntegrationResponse> {
    try {
      const config = this.getIntegration('pdb');
      if (!config) {
        throw new Error('PDB integration not configured');
      }

      const url = `${config.baseUrl}/core/entry/${pdbId}`;
      const response = await this.makeRequest(url, 'GET');
      
      return {
        success: true,
        data: {
          pdbId,
          structure: response,
          source: 'pdb'
        },
        timestamp: new Date(),
        source: 'pdb'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
        source: 'pdb'
      };
    }
  }

  /**
   * Search UniProt for protein information
   */
  public async searchUniProt(query: string): Promise<IntegrationResponse> {
    try {
      const config = this.getIntegration('uniprot');
      if (!config) {
        throw new Error('UniProt integration not configured');
      }

      const url = `${config.baseUrl}/uniprotkb/search?query=${encodeURIComponent(query)}&format=json`;
      const response = await this.makeRequest(url, 'GET');
      
      return {
        success: true,
        data: response,
        timestamp: new Date(),
        source: 'uniprot'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
        source: 'uniprot'
      };
    }
  }

  /**
   * Get gene information from Ensembl
   */
  public async getGeneInfo(geneId: string): Promise<IntegrationResponse> {
    try {
      const config = this.getIntegration('ensembl');
      if (!config) {
        throw new Error('Ensembl integration not configured');
      }

      const url = `${config.baseUrl}/lookup/human/${geneId}?content-type=application/json`;
      const response = await this.makeRequest(url, 'GET');
      
      return {
        success: true,
        data: {
          geneId,
          info: response,
          source: 'ensembl'
        },
        timestamp: new Date(),
        source: 'ensembl'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
        source: 'ensembl'
      };
    }
  }

  /**
   * Get AI research insights from OpenAI
   */
  public async getAIInsights(prompt: string, context?: any): Promise<IntegrationResponse> {
    try {
      const config = this.getIntegration('openai');
      const credentials = this.credentials.get('openai');
      
      if (!config || !credentials?.apiKey) {
        throw new Error('OpenAI integration not configured');
      }

      const url = `${config.baseUrl}/chat/completions`;
      const body = {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert biosynthetic research assistant. Provide insights based on the research context provided.'
          },
          {
            role: 'user',
            content: `Context: ${JSON.stringify(context || {})}\n\nQuery: ${prompt}`
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      };

      const response = await this.makeRequest(url, 'POST', body, {
        'Authorization': `Bearer ${credentials.apiKey}`,
        'Content-Type': 'application/json'
      });
      
      return {
        success: true,
        data: {
          insight: response.choices[0].message.content,
          model: response.model,
          source: 'openai'
        },
        timestamp: new Date(),
        source: 'openai'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
        source: 'openai'
      };
    }
  }

  /**
   * Store research data in S3
   */
  public async storeResearchData(data: ResearchData, bucket: string): Promise<IntegrationResponse> {
    try {
      const config = this.getIntegration('s3');
      const credentials = this.credentials.get('s3');
      
      if (!config || !credentials?.apiKey) {
        throw new Error('S3 integration not configured');
      }

      const key = `research/${data.id}/${Date.now()}.json`;
      const url = `${config.baseUrl}/${bucket}/${key}`;
      
      const response = await this.makeRequest(url, 'PUT', data, {
        'Authorization': `AWS4-HMAC-SHA256 Credential=${credentials.apiKey}`,
        'Content-Type': 'application/json'
      });
      
      return {
        success: true,
        data: {
          bucket,
          key,
          url: `s3://${bucket}/${key}`,
          source: 's3'
        },
        timestamp: new Date(),
        source: 's3'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
        source: 's3'
      };
    }
  }

  /**
   * Batch process multiple integrations
   */
  public async batchProcess(operations: Array<{
    type: 'dna' | 'protein' | 'gene' | 'ai' | 'storage';
    params: any;
  }>): Promise<IntegrationResponse[]> {
    const results: IntegrationResponse[] = [];
    
    for (const operation of operations) {
      try {
        let result: IntegrationResponse;
        
        switch (operation.type) {
          case 'dna':
            result = await this.fetchDNASequence(operation.params.accession);
            break;
          case 'protein':
            result = await this.fetchProteinStructure(operation.params.pdbId);
            break;
          case 'gene':
            result = await this.getGeneInfo(operation.params.geneId);
            break;
          case 'ai':
            result = await this.getAIInsights(operation.params.prompt, operation.params.context);
            break;
          case 'storage':
            result = await this.storeResearchData(operation.params.data, operation.params.bucket);
            break;
          default:
            result = {
              success: false,
              error: `Unknown operation type: ${operation.type}`,
              timestamp: new Date(),
              source: 'batch'
            };
        }
        
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date(),
          source: operation.type
        });
      }
    }
    
    return results;
  }

  /**
   * Cache research data
   */
  public cacheData(source: string, data: ResearchData[]): void {
    this.dataCache.set(source, data);
  }

  /**
   * Get cached data
   */
  public getCachedData(source: string): ResearchData[] | undefined {
    return this.dataCache.get(source);
  }

  /**
   * Clear cache
   */
  public clearCache(source?: string): void {
    if (source) {
      this.dataCache.delete(source);
    } else {
      this.dataCache.clear();
    }
  }

  /**
   * Get integration status
   */
  public getIntegrationStatus(): Array<{
    name: string;
    configured: boolean;
    hasCredentials: boolean;
    lastUsed?: Date;
  }> {
    const status = [];
    
    for (const [name, config] of this.integrations) {
      status.push({
        name,
        configured: !!config,
        hasCredentials: !!this.credentials.get(name),
        lastUsed: undefined // Could track this in the future
      });
    }
    
    return status;
  }

  /**
   * Make HTTP request with retry logic
   */
  private async makeRequest(
    url: string, 
    method: string, 
    body?: any, 
    headers?: Record<string, string>
  ): Promise<any> {
    const config = this.getIntegration(this.getIntegrationNameFromUrl(url));
    const retryAttempts = config?.retryAttempts || 3;
    const timeout = config?.timeout || 10000;
    
    for (let attempt = 1; attempt <= retryAttempts; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...headers
          },
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
          return await response.json();
        } else {
          return await response.text();
        }
      } catch (error) {
        if (attempt === retryAttempts) {
          throw error;
        }
        
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }

  /**
   * Extract integration name from URL
   */
  private getIntegrationNameFromUrl(url: string): string {
    if (url.includes('ncbi')) return 'ncbi';
    if (url.includes('rcsb.org')) return 'pdb';
    if (url.includes('uniprot')) return 'uniprot';
    if (url.includes('ensembl')) return 'ensembl';
    if (url.includes('openai')) return 'openai';
    if (url.includes('s3.amazonaws.com')) return 's3';
    return 'unknown';
  }
}

// Export singleton instance
export const integrationService = new IntegrationService(); 