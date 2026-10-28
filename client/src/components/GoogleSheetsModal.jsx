import React, { useState, useEffect } from 'react';
import { 
  Sheet, 
  Download, 
  RefreshCw, 
  Copy, 
  Check, 
  ExternalLink, 
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
    // Fetch apps script code
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
    { name: 'Personal Info', desc: 'Contact, title, location, and professional summary' },
    { name: 'Skills Matrix', desc: 'Categorized technical and soft skills with ratings' },
    { name: 'Work Experience', desc: 'Companies, dates, responsibilities, and achievements' },
    { name: 'Projects', desc: 'Project titles, stack, live links, and impact' },
    { name: 'Education', desc: 'Degrees, institutions, GPA, and coursework' },
    { name: 'Certifications', desc: 'Licenses, issuers, and verification credentials' },
    { name: 'Achievements', desc: 'Hackathons, awards, and recognitions' },
    { name: 'Languages', desc: 'Spoken languages and proficiencies' }
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '30px auto', padding: '0 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--ink)' }}>
          Google Sheets Integration Hub
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.92rem' }}>
          Synchronize and export your structured MongoDB portfolio records across dedicated category sheets in Google Sheets.
        </p>
      </div>

      {/* Grid of Options */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24, marginBottom: 28 }}>
        
        {/* Option 1: Direct Multi-Tab Download */}
        <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--sage)', color: '#2b543b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Download size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>One-Click Multi-Sheet Workbook</h3>
                <span className="badge badge-sage" style={{ fontSize: '0.7rem' }}>Instant / No Setup Needed</span>
              </div>
            </div>

            <p style={{ fontSize: '0.86rem', color: 'var(--ink)', lineHeight: 1.5, marginBottom: 16 }}>
              Generates a fully structured multi-tab Excel (.xlsx) file that maps 1-to-1 with Google Sheets. You can open it directly in Google Drive or upload it to any Google Sheet.
            </p>

            <div style={{ background: '#ffffff', border: '1px solid var(--line)', borderRadius: 10, padding: 12, marginBottom: 16 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--rose-dark)', marginBottom: 6 }}>
                INCLUDES 8 STRUCTURED WORKSHEETS:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {sheetTabs.map((tab, idx) => (
                  <span key={idx} className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>{tab.name}</span>
                ))}
              </div>
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

        {/* Option 2: Live Google Apps Script Sync */}
        <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--lilac)', color: '#64497e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <RefreshCw size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Live Google Sheets Webhook Sync</h3>
                <span className="badge badge-lilac" style={{ fontSize: '0.7rem' }}>Real-Time Two-Way Sync</span>
              </div>
            </div>

            <p style={{ fontSize: '0.86rem', color: 'var(--ink)', lineHeight: 1.5, marginBottom: 14 }}>
              Push updates made in this web app straight into your live Google Sheet in real-time using a lightweight Google Apps Script endpoint.
            </p>

            {syncStatus && (
              <div style={{
                background: syncStatus.type === 'success' ? '#edf7f0' : '#fdf2f4',
                border: `1px solid ${syncStatus.type === 'success' ? '#c4e3cd' : '#f2c7ce'}`,
                borderRadius: 8,
                padding: '10px 12px',
                marginBottom: 12,
                fontSize: '0.82rem',
                color: syncStatus.type === 'success' ? '#2e593e' : '#b3394b',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}>
                {syncStatus.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{syncStatus.message}</span>
              </div>
            )}

            <div className="form-group" style={{ marginBottom: 12 }}>
              <label style={{ fontSize: '0.8rem' }}>Google Apps Script Web App URL</label>
              <input
                type="url"
                placeholder="https://script.google.com/macros/s/.../exec"
                value={webhookUrl}
                onChange={e => setWebhookUrl(e.target.value)}
                style={{ fontSize: '0.85rem' }}
              />
            </div>
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
              title="View Setup Code"
            >
              <Code size={15} />
              {showCode ? 'Hide Code' : 'Setup Script'}
            </button>
          </div>
        </div>
      </div>

      {/* Script Code Viewer & Instructions */}
      {showCode && (
        <div className="glass-panel" style={{ padding: 24, marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Google Apps Script Setup (Takes 30 Seconds)</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
                1. Open Google Sheets &gt; Extensions &gt; Apps Script &gt; Paste code &gt; Click Deploy &gt; New deployment &gt; Select 'Web app' (Access: Anyone) &gt; Copy URL.
              </p>
            </div>
            <button onClick={handleCopyCode} className="btn btn-secondary btn-sm">
              {copiedCode ? <Check size={14} color="#34a853" /> : <Copy size={14} />}
              {copiedCode ? 'Copied!' : 'Copy Script Code'}
            </button>
          </div>

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
      )}

      {/* Worksheet Architecture Reference */}
      <div className="glass-panel" style={{ padding: 24 }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 14 }}>
          Structured Google Sheet Category Mappings
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
          {sheetTabs.map((tab, idx) => (
            <div key={idx} style={{ background: '#ffffff', border: '1px solid var(--line)', borderRadius: 10, padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <Sheet size={16} color="var(--rose-dark)" />
                <strong style={{ fontSize: '0.92rem' }}>Tab {idx + 1}: {tab.name}</strong>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{tab.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
