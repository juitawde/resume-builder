import React from 'react';
import { 
  Sparkles, 
  Database, 
  FileText, 
  Sheet, 
  Wand2, 
  FolderClock, 
  RotateCw, 
  Download,
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onLoadSample, health }) {
  const navItems = [
    { id: 'portfolio', label: 'Portfolio Database', icon: Database, badge: null },
    { id: 'resume-builder', label: 'Job Resume Tailorer', icon: FileText, badge: 'AI Match' },
    { id: 'ai-parser', label: 'AI Quick Importer', icon: Wand2, badge: null },
    { id: 'sheets', label: 'Google Sheets Hub', icon: Sheet, badge: null },
    { id: 'history', label: 'Saved Resumes', icon: FolderClock, badge: null }
  ];

  return (
    <aside className="sidebar no-print">
      {/* Top Brand Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28, padding: '0 6px' }}>
          <div style={{
            width: 42,
            height: 42,
            borderRadius: 12,
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
                ProFolio <span style={{ color: 'var(--rose)' }}>AI</span>
              </span>
            </div>
            <p style={{ fontSize: '0.74rem', color: 'var(--muted)', margin: 0 }}>
              AI Portfolio & Resume Studio
            </p>
          </div>
        </div>

        {/* Navigation Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0 12px 6px 12px' }}>
            Navigation
          </div>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} color={isActive ? 'var(--rose-dark)' : 'var(--muted)'} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && (
                  <span className="badge badge-rose" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Actions & Status Section */}
      <div style={{ borderTop: '1px solid var(--line)', paddingTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Quick Action Button */}
        <button
          onClick={onLoadSample}
          className="btn btn-secondary btn-sm"
          style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 12px' }}
          title="Load rich sample data covering all categories"
        >
          <RotateCw size={14} color="var(--rose-dark)" />
          <span>Load Sample Portfolio</span>
        </button>

        <a
          href="/api/sheets/export"
          className="btn btn-primary btn-sm"
          style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 12px' }}
          download
        >
          <Download size={14} />
          <span>Export Multi-Sheet (.xlsx)</span>
        </a>

        {/* System Health Status */}
        {health && (
          <div style={{
            background: '#ffffff',
            border: '1px solid var(--line)',
            borderRadius: '10px',
            padding: '10px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            fontSize: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--muted)' }}>MongoDB</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ 
                  width: 7, 
                  height: 7, 
                  borderRadius: '50%', 
                  background: health.database === 'Connected' ? '#34a853' : '#ea4335' 
                }} />
                <strong>{health.database}</strong>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--muted)' }}>Gemini API</span>
              <span style={{ color: health.geminiConfigured ? '#34a853' : 'var(--muted)', fontWeight: 600 }}>
                {health.geminiConfigured ? 'Ready' : 'Heuristics'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--muted)' }}>Google Sheets</span>
              <span style={{ color: health.sheetsConfigured ? '#34a853' : 'var(--muted)', fontWeight: 600 }}>
                {health.sheetsConfigured ? 'Connected' : 'Ready'}
              </span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
