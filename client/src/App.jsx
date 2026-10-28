import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import PortfolioManager from './components/PortfolioManager/PortfolioManager';
import AIParserModal from './components/AIParserModal';
import ResumeBuilder from './components/ResumeBuilder/ResumeBuilder';
import GoogleSheetsModal from './components/GoogleSheetsModal';
import SavedResumes from './components/SavedResumes';
import { api } from './services/api';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('portfolio');
  const [portfolio, setPortfolio] = useState(null);
  const [health, setHealth] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const [hRes, pRes] = await Promise.all([
        api.getHealth().catch(() => null),
        api.getPortfolio().catch(() => null)
      ]);

      if (hRes) setHealth(hRes);
      if (pRes && pRes.portfolio) {
        setPortfolio(pRes.portfolio);
      }
    } catch (e) {
      console.error('Error loading data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3800);
  };

  const handleSavePortfolio = async () => {
    if (!portfolio) return;
    setIsSaving(true);
    try {
      const res = await api.savePortfolio(portfolio);
      if (res.success) {
        showToast('Portfolio changes successfully saved to database!');
      } else {
        throw new Error(res.error || 'Failed to save');
      }
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadSample = async () => {
    try {
      const res = await api.loadSample();
      if (res.success && res.portfolio) {
        setPortfolio(res.portfolio);
        showToast('Rich sample portfolio loaded across all categories!');
      }
    } catch (err) {
      showToast(`Error loading sample: ${err.message}`, 'error');
    }
  };

  const handleAIMerge = async (structuredData) => {
    try {
      const merged = {
        ...portfolio,
        personalInfo: { ...(portfolio?.personalInfo || {}), ...(structuredData.personalInfo || {}) },
        professionalSummary: structuredData.professionalSummary || portfolio?.professionalSummary,
        skills: [...(portfolio?.skills || []), ...(structuredData.skills || [])],
        experience: [...(portfolio?.experience || []), ...(structuredData.experience || [])],
        projects: [...(portfolio?.projects || []), ...(structuredData.projects || [])],
        education: [...(portfolio?.education || []), ...(structuredData.education || [])],
        certifications: [...(portfolio?.certifications || []), ...(structuredData.certifications || [])]
      };
      setPortfolio(merged);
      await api.savePortfolio(merged);
      setActiveTab('portfolio');
      showToast('AI-structured data merged and saved to database!');
    } catch (err) {
      showToast(`Merge failed: ${err.message}`, 'error');
    }
  };

  return (
    <div className="app-layout">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLoadSample={handleLoadSample}
        health={health}
      />

      {/* 2. Main Studio Area */}
      <div className="main-content">
        <TopHeader
          activeTab={activeTab}
          portfolio={portfolio}
          onSave={handleSavePortfolio}
          isSaving={isSaving}
        />

        {/* Content Container */}
        <div className="content-container">
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '120px 20px', color: 'var(--muted)' }}>
              <Loader2 size={36} className="animate-spin" style={{ margin: '0 auto 16px auto', color: 'var(--rose)' }} />
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--ink)' }}>Connecting to ProFolio Studio...</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: 4 }}>Loading candidate portfolio & MongoDB records</p>
            </div>
          ) : (
            <>
              {activeTab === 'portfolio' && (
                <PortfolioManager
                  portfolio={portfolio}
                  setPortfolio={setPortfolio}
                  onSave={handleSavePortfolio}
                  isSaving={isSaving}
                />
              )}

              {activeTab === 'resume-builder' && (
                <ResumeBuilder
                  portfolio={portfolio}
                  onSaveToHistory={() => {
                    showToast('Resume snapshot saved to history!');
                  }}
                />
              )}

              {activeTab === 'ai-parser' && (
                <AIParserModal
                  onMerge={handleAIMerge}
                  onCancel={() => setActiveTab('portfolio')}
                />
              )}

              {activeTab === 'sheets' && (
                <GoogleSheetsModal
                  portfolio={portfolio}
                  onSyncSuccess={(lastSynced) => {
                    setPortfolio(prev => ({ ...prev, lastSyncedWithSheets: lastSynced }));
                    showToast('Synchronized with Google Sheets successfully!');
                  }}
                />
              )}

              {activeTab === 'history' && (
                <SavedResumes />
              )}
            </>
          )}
        </div>
      </div>

      {/* Floating Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 9999,
          background: toast.type === 'success' ? '#2e593e' : '#b3394b',
          color: '#ffffff',
          borderRadius: 12,
          padding: '12px 20px',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontSize: '0.88rem',
          fontWeight: 600,
          animation: 'slideUp 0.22s ease-out'
        }}>
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
