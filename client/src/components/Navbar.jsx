import React from 'react';
import { 
  Sparkles, 
  Database, 
  FileText, 
  Sheet, 
  Wand2, 
  FolderClock, 
  Download, 
  RotateCw, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onLoadSample, isSyncing, health }) {
  return (
    <header className="no-print" style={{
      borderBottom: '1px solid var(--line)',
      background: 'rgba(255, 254, 253, 0.95)',
      backdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        maxWidth: 1400,
        margin: '0 auto',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: 'linear-gradient(135deg, var(--rose) 0%, var(--rose-dark) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 14px var(--rose-glow)'
          }}>
            <Sparkles size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
                ProFolio <span style={{ color: 'var(--rose)' }}>AI</span>
              </span>
              <span className="badge badge-rose" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                Gemini 2.5
              </span>
            </div>
            <p style={{ fontSize: '0.76rem', color: 'var(--muted)', margin: 0 }}>
              Centralized Portfolio & Job-Tailored Resume System
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#faf3f5', padding: '4px', borderRadius: '12px' }}>
          <button
            onClick={() => setActiveTab('portfolio')}
            className="btn btn-sm"
            style={{
              background: activeTab === 'portfolio' ? '#ffffff' : 'transparent',
              color: activeTab === 'portfolio' ? 'var(--rose-dark)' : 'var(--ink)',
              boxShadow: activeTab === 'portfolio' ? 'var(--shadow-sm)' : 'none',
              fontWeight: activeTab === 'portfolio' ? 700 : 500
            }}
          >
            <Database size={15} />
            Portfolio Database
          </button>

          <button
            onClick={() => setActiveTab('ai-parser')}
            className="btn btn-sm"
            style={{
              background: activeTab === 'ai-parser' ? '#ffffff' : 'transparent',
              color: activeTab === 'ai-parser' ? 'var(--rose-dark)' : 'var(--ink)',
              boxShadow: activeTab === 'ai-parser' ? 'var(--shadow-sm)' : 'none',
              fontWeight: activeTab === 'ai-parser' ? 700 : 500
            }}
          >
            <Wand2 size={15} />
            AI Quick Parse
          </button>

          <button
            onClick={() => setActiveTab('resume-builder')}
            className="btn btn-sm"
            style={{
              background: activeTab === 'resume-builder' ? '#ffffff' : 'transparent',
              color: activeTab === 'resume-builder' ? 'var(--rose-dark)' : 'var(--ink)',
              boxShadow: activeTab === 'resume-builder' ? 'var(--shadow-sm)' : 'none',
              fontWeight: activeTab === 'resume-builder' ? 700 : 500
            }}
          >
            <FileText size={15} />
            Job Resume Tailorer
          </button>

          <button
            onClick={() => setActiveTab('sheets')}
            className="btn btn-sm"
            style={{
              background: activeTab === 'sheets' ? '#ffffff' : 'transparent',
              color: activeTab === 'sheets' ? 'var(--rose-dark)' : 'var(--ink)',
              boxShadow: activeTab === 'sheets' ? 'var(--shadow-sm)' : 'none',
              fontWeight: activeTab === 'sheets' ? 700 : 500
            }}
          >
            <Sheet size={15} />
            Google Sheets Hub
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className="btn btn-sm"
            style={{
              background: activeTab === 'history' ? '#ffffff' : 'transparent',
              color: activeTab === 'history' ? 'var(--rose-dark)' : 'var(--ink)',
              boxShadow: activeTab === 'history' ? 'var(--shadow-sm)' : 'none',
              fontWeight: activeTab === 'history' ? 700 : 500
            }}
          >
            <FolderClock size={15} />
            Saved Resumes
          </button>
        </nav>

        {/* Global Action Buttons & Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={onLoadSample}
            className="btn btn-secondary btn-sm"
            title="Load realistic sample data covering all categories"
          >
            <RotateCw size={14} />
            Load Sample Data
          </button>

          <a
            href="/api/sheets/export"
            className="btn btn-primary btn-sm"
            title="Export full portfolio database to Google Sheets / Excel workbook"
            download
          >
            <Download size={14} />
            Export Sheets (.xlsx)
          </a>

          {health && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 6, 
              padding: '4px 10px', 
              background: '#ffffff', 
              border: '1px solid var(--line)', 
              borderRadius: '20px',
              fontSize: '0.74rem' 
            }}>
              <span style={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                background: health.database === 'Connected' ? '#34a853' : '#ea4335' 
              }} />
              <span>MongoDB: <strong>{health.database}</strong></span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
