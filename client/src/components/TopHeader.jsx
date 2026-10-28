import React from 'react';
import { User, CheckCircle2 } from 'lucide-react';

export default function TopHeader({ activeTab, portfolio, onSave, isSaving }) {
  const titles = {
    'portfolio': { title: 'Portfolio Database Manager', subtitle: 'Manage all verified professional records and competencies' },
    'resume-builder': { title: 'Dynamic Job-Specific Resume Tailorer', subtitle: 'Match JDs, select verified skills, and generate ATS resumes' },
    'ai-parser': { title: 'Gemini AI Quick-Importer', subtitle: 'Structure raw resumes or bio notes with zero hallucination' },
    'sheets': { title: 'Google Sheets Integration Hub', subtitle: 'Sync and export structured data across 8 dedicated category tabs' },
    'history': { title: 'Saved Resumes & Role Comparison', subtitle: 'Review and compare resumes tailored for distinct target roles' }
  };

  const current = titles[activeTab] || titles['portfolio'];
  const userName = portfolio?.personalInfo?.fullName || 'Aarav Sharma';
  const userTitle = portfolio?.personalInfo?.title || 'Professional Candidate';

  return (
    <header className="top-navbar no-print">
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--ink)' }}>
          {current.title}
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--muted)', margin: 0 }}>
          {current.subtitle}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {activeTab === 'portfolio' && onSave && (
          <button
            onClick={onSave}
            disabled={isSaving}
            className="btn btn-primary btn-sm"
            style={{ padding: '8px 18px' }}
          >
            {isSaving ? 'Saving...' : 'Save Database'}
          </button>
        )}

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: '#ffffff',
          border: '1px solid var(--line)',
          borderRadius: '30px',
          padding: '5px 14px 5px 6px'
        }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'var(--rose-light)',
            color: 'var(--rose-dark)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.82rem'
          }}>
            {userName.charAt(0) || 'U'}
          </div>
          <div>
            <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.2 }}>
              {userName}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--muted)', lineHeight: 1.2 }}>
              {userTitle.length > 28 ? userTitle.slice(0, 28) + '...' : userTitle}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
