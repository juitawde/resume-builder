import React, { useState, useEffect } from 'react';
import { 
  Sheet, 
  Download, 
  RefreshCw, 
  Copy, 
  Check, 
  Code, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { api } from '../services/api';

export default function GoogleSheetsModal({ portfolio, onSyncSuccess }) {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);
  const [scriptCode, setScriptCode] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [showCode, setShowCode] = useState(false);

  useEffect(() => {
    api.getAppsScriptCode().then(res => {
      if (res.success) setScriptCode(res.scriptCode);
    }).catch(() => {});
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncStatus(null);
    try {
      const res = await api.syncGoogleSheets({
        syncType: 'webhook',
        webhookUrl: webhookUrl || undefined
      });
      if (res.success) {
        setSyncStatus({ type: 'success', message: 'Successfully synced portfolio to Google Sheets!' });
        if (onSyncSuccess) onSyncSuccess(res.lastSyncedWithSheets);
      } else {
        throw new Error(res.error || 'Sync failed');
      }
    } catch (err) {
      setSyncStatus({ type: 'error', message: err.message });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(scriptCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const sheetTabs = [
    { name: 'Personal Info', desc: 'Contact, title, location, and summary' },
    { name: 'Skills Matrix', desc: 'Categorized technical and soft skills' },
    { name: 'Work Experience', desc: 'Companies, dates, metrics, and highlights' },
    { name: 'Projects', desc: 'Titles, tech stack, and live URLs' },
    { name: 'Education & Certs', desc: 'Degrees, institutions, and credentials' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* 2-Column Options Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 24 }}>
        
        {/* Option 1: Live Webhook Sync */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--lilac)', color: '#64497e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <RefreshCw size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Live Google Sheets Webhook Sync</h3>
                <span className="badge badge-lilac" style={{ fontSize: '0.7rem' }}>Real-Time Two-Way Sync</span>
              </div>
            </div>
          </div>

          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p style={{ fontSize: '0.88rem', color: 'var(--ink)', lineHeight: 1.5 }}>
              Push updates made in ProFolio AI directly into your live Google Sheet in real-time using Google Apps Script.
            </p>

            {syncStatus && (
              <div style={{
                background: syncStatus.type === 'success' ? '#edf7f0' : '#fdf2f4',
                border: `1px solid ${syncStatus.type === 'success' ? '#c4e3cd' : '#f2c7ce'}`,
                borderRadius: 10,
                padding: '10px 14px',
                fontSize: '0.84rem',
                color: syncStatus.type === 'success' ? '#2e593e' : '#b3394b',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}>
                {syncStatus.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{syncStatus.message}</span>
              </div>
            )}

            <div className="form-group" style={{ marginBottom: 4 }}>
              <label>Google Apps Script Web App URL</label>
              <input
                type="url"
                placeholder="https://script.google.com/macros/s/.../exec"
                value={webhookUrl}
                onChange={e => setWebhookUrl(e.target.value)}
                style={{ fontSize: '0.86rem' }}
              />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={handleSync}
                disabled={isSyncing}
                className="btn btn-sage"
                style={{ flex: 1 }}
              >
                <RefreshCw size={15} className={isSyncing ? 'animate-spin' : ''} />
                {isSyncing ? 'Pushing Data...' : 'Sync to Google Sheets Now'}
              </button>
              <button
                onClick={() => setShowCode(!showCode)}
                className="btn btn-secondary btn-sm"
              >
                <Code size={15} />
                {showCode ? 'Hide Code' : 'Setup Script'}
              </button>
            </div>
          </div>
        </div>

        {/* Option 2: Direct Multi-Tab Download */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--sage)', color: '#2b543b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Download size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Multi-Sheet Excel / Sheets Export</h3>
                <span className="badge badge-sage" style={{ fontSize: '0.7rem' }}>Zero Setup Needed</span>
              </div>
            </div>
          </div>

          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 16 }}>
            <p style={{ fontSize: '0.88rem', color: 'var(--ink)', lineHeight: 1.5 }}>
              Generates a structured multi-tab Excel (.xlsx) file that maps 1-to-1 with Google Sheets. You can upload it directly into Google Drive or open it locally.
            </p>

            <div style={{ background: '#fcf8f9', border: '1px solid var(--line)', borderRadius: 10, padding: 12 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--rose-dark)', marginBottom: 6 }}>
                INCLUDES 8 STRUCTURED WORKSHEETS:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {sheetTabs.map((tab, idx) => (
                  <span key={idx} className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>{tab.name}</span>
                ))}
              </div>
            </div>

            <a
              href="/api/sheets/export"
              className="btn btn-primary"
              style={{ width: '100%' }}
              download
            >
              <Download size={16} />
              Download Multi-Tab Workbook (.xlsx)
            </a>
          </div>
        </div>
      </div>

      {/* Script Code Viewer */}
      {showCode && (
        <div className="card">
          <div className="card-header">
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Google Apps Script Snippet</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
                Paste into Google Sheets &gt; Extensions &gt; Apps Script, then Deploy as Web App (Access: Anyone).
              </p>
            </div>
            <button onClick={handleCopyCode} className="btn btn-secondary btn-sm">
              {copiedCode ? <Check size={14} color="#34a853" /> : <Copy size={14} />}
              {copiedCode ? 'Copied!' : 'Copy Script Code'}
            </button>
          </div>

          <div className="card-body" style={{ padding: 16 }}>
            <pre style={{
              background: '#2b2327',
              color: '#fbeff3',
              padding: 16,
              borderRadius: 10,
              fontSize: '0.82rem',
              overflowX: 'auto',
              maxHeight: 280,
              fontFamily: 'monospace'
            }}>
              {scriptCode}
            </pre>
          </div>
        </div>
      )}

      {/* Mappings Overview */}
      <div className="card">
        <div className="card-header">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Category Worksheet Architecture</h3>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
            {sheetTabs.map((tab, idx) => (
              <div key={idx} style={{ background: '#ffffff', border: '1px solid var(--line)', borderRadius: 10, padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <Sheet size={16} color="var(--rose-dark)" />
                  <strong style={{ fontSize: '0.9rem' }}>Tab {idx + 1}: {tab.name}</strong>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--muted)', margin: 0 }}>{tab.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
