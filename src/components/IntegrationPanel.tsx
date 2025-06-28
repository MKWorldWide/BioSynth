/**
 * 🔗 IntegrationPanel - External API integration interface
 * 
 * Provides UI for managing external API connections, data exchange, and research integrations
 * Connects with NCBI, PDB, UniProt, Ensembl, OpenAI, and AWS S3
 * 
 * @author MKWW (Master Key World Wide)
 * @version 1.0.0
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIntegration } from '@/hooks/useIntegration';
import { SacredCard } from '@/components/SacredCard';
import { SacredButton } from '@/components/SacredButton';
import { SacredInput } from '@/components/SacredInput';
import { SacredProgress } from '@/components/SacredProgress';
import { SacredToast } from '@/components/SacredToast';
import { SacredTabs } from '@/components/SacredTabs';
import { SacredModal } from '@/components/SacredModal';
import { APICredentials } from '@/services/IntegrationService';

interface IntegrationPanelProps {
  className?: string;
}

export const IntegrationPanel: React.FC<IntegrationPanelProps> = ({
  className = ''
}) => {
  const {
    loading,
    error,
    lastResponse,
    integrationStatus,
    fetchDNASequence,
    getGeneInfo,
    fetchProteinStructure,
    searchUniProt,
    getAIInsights,
    storeResearchData,
    batchProcess,
    setCredentials: setIntegrationCredentials,
    getCachedData,
    clearCache
  } = useIntegration();

  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<string>('');
  const [credentials, setCredentialsState] = useState<APICredentials>({
    name: '',
    apiKey: '',
    baseUrl: '',
    enabled: true
  });

  // Form states
  const [dnaAccession, setDnaAccession] = useState('NM_000518.5');
  const [geneId, setGeneId] = useState('ENSG00000139618');
  const [pdbId, setPdbId] = useState('1CRN');
  const [uniprotQuery, setUniprotQuery] = useState('insulin human');
  const [aiPrompt, setAiPrompt] = useState('Analyze the potential applications of CRISPR in synthetic biology');
  const [researchData, setResearchData] = useState('{"type": "experiment", "results": {"efficiency": 0.85}}');

  // Toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'info' | 'warning' | 'error'>('info');

  const showNotification = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

  const handleSetCredentials = () => {
    setIntegrationCredentials(selectedIntegration, credentials);
    showNotification(`Credentials set for ${selectedIntegration}`, 'success');
    setShowCredentialsModal(false);
    setCredentialsState({ name: '', apiKey: '', baseUrl: '', enabled: true });
  };

  const handleFetchDNASequence = async () => {
    try {
      const response = await fetchDNASequence(dnaAccession);
      if (response.success) {
        showNotification(`DNA sequence fetched: ${dnaAccession}`, 'success');
      } else {
        showNotification(`Failed to fetch DNA sequence: ${response.error}`, 'error');
      }
    } catch (error) {
      showNotification(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    }
  };

  const handleGetGeneInfo = async () => {
    try {
      const response = await getGeneInfo(geneId);
      if (response.success) {
        showNotification(`Gene info fetched: ${geneId}`, 'success');
      } else {
        showNotification(`Failed to fetch gene info: ${response.error}`, 'error');
      }
    } catch (error) {
      showNotification(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    }
  };

  const handleFetchProteinStructure = async () => {
    try {
      const response = await fetchProteinStructure(pdbId);
      if (response.success) {
        showNotification(`Protein structure fetched: ${pdbId}`, 'success');
      } else {
        showNotification(`Failed to fetch protein structure: ${response.error}`, 'error');
      }
    } catch (error) {
      showNotification(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    }
  };

  const handleSearchUniProt = async () => {
    try {
      const response = await searchUniProt(uniprotQuery);
      if (response.success) {
        showNotification(`UniProt search completed: ${uniprotQuery}`, 'success');
      } else {
        showNotification(`Failed to search UniProt: ${response.error}`, 'error');
      }
    } catch (error) {
      showNotification(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    }
  };

  const handleGetAIInsights = async () => {
    try {
      const response = await getAIInsights(aiPrompt);
      if (response.success) {
        showNotification('AI insights generated successfully', 'success');
      } else {
        showNotification(`Failed to get AI insights: ${response.error}`, 'error');
      }
    } catch (error) {
      showNotification(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    }
  };

  const handleBatchProcess = async () => {
    try {
      const operations = [
        { type: 'dna' as const, params: { accession: dnaAccession } },
        { type: 'protein' as const, params: { pdbId } },
        { type: 'gene' as const, params: { geneId } },
        { type: 'ai' as const, params: { prompt: aiPrompt } }
      ];

      const responses = await batchProcess(operations);
      const successCount = responses.filter(r => r.success).length;
      showNotification(`Batch process completed: ${successCount}/${responses.length} successful`, 'success');
    } catch (error) {
      showNotification(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    }
  };

  const getStatusColor = (configured: boolean, hasCredentials: boolean) => {
    if (!configured) return 'text-red-400';
    if (!hasCredentials) return 'text-yellow-400';
    return 'text-emerald-400';
  };

  const getStatusIcon = (configured: boolean, hasCredentials: boolean) => {
    if (!configured) return '🔴';
    if (!hasCredentials) return '🟡';
    return '🟢';
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
          External Integrations
        </h2>
        <p className="text-slate-400 mt-2">
          Connect with research databases, AI services, and cloud storage
        </p>
      </motion.div>

      {/* Integration Status */}
      <SacredCard className="p-4">
        <h3 className="text-lg font-semibold text-cyan-400 mb-4">Integration Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {integrationStatus.map((integration) => (
            <motion.div
              key={integration.name}
              whileHover={{ scale: 1.05 }}
              className="bg-slate-800/50 rounded-lg p-3 border border-slate-600 text-center"
            >
              <div className="text-2xl mb-2">{getStatusIcon(integration.configured, integration.hasCredentials)}</div>
              <div className="text-sm font-semibold text-slate-300">{integration.name.toUpperCase()}</div>
              <div className={`text-xs ${getStatusColor(integration.configured, integration.hasCredentials)}`}>
                {integration.configured ? (integration.hasCredentials ? 'Ready' : 'No Credentials') : 'Not Configured'}
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-4 flex justify-center">
          <SacredButton
            onClick={() => setShowCredentialsModal(true)}
            className="bg-emerald-500/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30"
          >
            🔑 Configure Credentials
          </SacredButton>
        </div>
      </SacredCard>

      {/* Main Interface */}
      <SacredTabs
        tabs={[
          {
            label: '🧬 DNA/Genomics',
            icon: '🧬',
            content: (
              <div className="space-y-4">
                <SacredCard className="p-4">
                  <h4 className="text-lg font-semibold text-emerald-400 mb-4">DNA Sequence Retrieval</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">NCBI Accession Number</label>
                      <SacredInput
                        value={dnaAccession}
                        onChange={(e) => setDnaAccession(e.target.value)}
                        placeholder="e.g., NM_000518.5"
                        className="w-full"
                      />
                    </div>
                    <SacredButton
                      onClick={handleFetchDNASequence}
                      disabled={loading}
                      className="bg-emerald-500/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30"
                    >
                      {loading ? '🔍 Fetching...' : '🔍 Fetch DNA Sequence'}
                    </SacredButton>
                  </div>
                </SacredCard>

                <SacredCard className="p-4">
                  <h4 className="text-lg font-semibold text-cyan-400 mb-4">Gene Information</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">Ensembl Gene ID</label>
                      <SacredInput
                        value={geneId}
                        onChange={(e) => setGeneId(e.target.value)}
                        placeholder="e.g., ENSG00000139618"
                        className="w-full"
                      />
                    </div>
                    <SacredButton
                      onClick={handleGetGeneInfo}
                      disabled={loading}
                      className="bg-cyan-500/20 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30"
                    >
                      {loading ? '🧬 Fetching...' : '🧬 Get Gene Info'}
                    </SacredButton>
                  </div>
                </SacredCard>
              </div>
            )
          },
          {
            label: '🦠 Protein/Structure',
            icon: '🦠',
            content: (
              <div className="space-y-4">
                <SacredCard className="p-4">
                  <h4 className="text-lg font-semibold text-blue-400 mb-4">Protein Structure</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">PDB ID</label>
                      <SacredInput
                        value={pdbId}
                        onChange={(e) => setPdbId(e.target.value)}
                        placeholder="e.g., 1CRN"
                        className="w-full"
                      />
                    </div>
                    <SacredButton
                      onClick={handleFetchProteinStructure}
                      disabled={loading}
                      className="bg-blue-500/20 border-blue-500/30 text-blue-400 hover:bg-blue-500/30"
                    >
                      {loading ? '🦠 Fetching...' : '🦠 Fetch Protein Structure'}
                    </SacredButton>
                  </div>
                </SacredCard>

                <SacredCard className="p-4">
                  <h4 className="text-lg font-semibold text-purple-400 mb-4">UniProt Search</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">Search Query</label>
                      <SacredInput
                        value={uniprotQuery}
                        onChange={(e) => setUniprotQuery(e.target.value)}
                        placeholder="e.g., insulin human"
                        className="w-full"
                      />
                    </div>
                    <SacredButton
                      onClick={handleSearchUniProt}
                      disabled={loading}
                      className="bg-purple-500/20 border-purple-500/30 text-purple-400 hover:bg-purple-500/30"
                    >
                      {loading ? '🔍 Searching...' : '🔍 Search UniProt'}
                    </SacredButton>
                  </div>
                </SacredCard>
              </div>
            )
          },
          {
            label: '🤖 AI/Insights',
            icon: '🤖',
            content: (
              <div className="space-y-4">
                <SacredCard className="p-4">
                  <h4 className="text-lg font-semibold text-orange-400 mb-4">AI Research Assistant</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">Research Query</label>
                      <textarea
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="Ask about biosynthetic research, molecular biology, or experimental design..."
                        className="w-full h-24 bg-slate-800 border border-slate-600 rounded-lg p-3 text-slate-300 resize-none focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <SacredButton
                      onClick={handleGetAIInsights}
                      disabled={loading}
                      className="bg-orange-500/20 border-orange-500/30 text-orange-400 hover:bg-orange-500/30"
                    >
                      {loading ? '🤖 Generating...' : '🤖 Get AI Insights'}
                    </SacredButton>
                  </div>
                </SacredCard>
              </div>
            )
          },
          {
            label: '⚡ Batch Processing',
            icon: '⚡',
            content: (
              <div className="space-y-4">
                <SacredCard className="p-4">
                  <h4 className="text-lg font-semibold text-indigo-400 mb-4">Batch Processing</h4>
                  <p className="text-slate-400 mb-4">
                    Process multiple integrations simultaneously for comprehensive research analysis.
                  </p>
                  <SacredButton
                    onClick={handleBatchProcess}
                    disabled={loading}
                    className="bg-indigo-500/20 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/30"
                  >
                    {loading ? '⚡ Processing...' : '⚡ Run Batch Process'}
                  </SacredButton>
                </SacredCard>
              </div>
            )
          }
        ]}
        defaultIndex={0}
      >
      </SacredTabs>

      {/* Loading Indicator */}
      {loading && (
        <SacredCard className="p-4">
          <div className="flex items-center justify-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
            <span className="text-emerald-400">Processing integration request...</span>
          </div>
        </SacredCard>
      )}

      {/* Error Display */}
      {error && (
        <SacredCard className="p-4 border-red-500/30">
          <div className="text-red-400">
            <h4 className="font-semibold mb-2">Integration Error</h4>
            <p className="text-sm">{error}</p>
          </div>
        </SacredCard>
      )}

      {/* Last Response Display */}
      {lastResponse && (
        <SacredCard className="p-4">
          <h4 className="text-lg font-semibold text-emerald-400 mb-4">Last Response</h4>
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-slate-400">Source: {lastResponse.source}</span>
              <span className={`text-xs px-2 py-1 rounded ${
                lastResponse.success ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {lastResponse.success ? 'Success' : 'Error'}
              </span>
            </div>
            <div className="text-sm text-slate-300">
              {lastResponse.success ? (
                <pre className="whitespace-pre-wrap text-xs">
                  {JSON.stringify(lastResponse.data, null, 2)}
                </pre>
              ) : (
                <p className="text-red-400">{lastResponse.error}</p>
              )}
            </div>
            <div className="text-xs text-slate-500 mt-2">
              {lastResponse.timestamp.toLocaleString()}
            </div>
          </div>
        </SacredCard>
      )}

      {/* Credentials Modal */}
      <SacredModal
        isOpen={showCredentialsModal}
        onClose={() => setShowCredentialsModal(false)}
        title="Configure API Credentials"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Integration</label>
            <select
              value={selectedIntegration}
              onChange={(e) => setSelectedIntegration(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-slate-300 focus:border-emerald-500 focus:outline-none"
            >
              <option value="">Select Integration</option>
              <option value="openai">OpenAI</option>
              <option value="s3">AWS S3</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-slate-400 mb-2">API Key</label>
            <SacredInput
              type="password"
              value={credentials.apiKey}
              onChange={(e) => setCredentialsState({ ...credentials, apiKey: e.target.value })}
              placeholder="Enter API key"
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm text-slate-400 mb-2">Base URL</label>
            <SacredInput
              value={credentials.baseUrl}
              onChange={(e) => setCredentialsState({ ...credentials, baseUrl: e.target.value })}
              placeholder="Enter base URL (optional)"
              className="w-full"
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <SacredButton
              onClick={() => setShowCredentialsModal(false)}
              className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50"
            >
              Cancel
            </SacredButton>
            <SacredButton
              onClick={handleSetCredentials}
              disabled={!selectedIntegration || !credentials.apiKey}
              className="bg-emerald-500/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30"
            >
              Save Credentials
            </SacredButton>
          </div>
        </div>
      </SacredModal>

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