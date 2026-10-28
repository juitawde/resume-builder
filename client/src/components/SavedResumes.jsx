import React, { useState, useEffect } from 'react';
import { FolderClock, FileText, Download, Calendar, ExternalLink, ArrowRight, Check, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export default function SavedResumes({ onLoadResumeIntoBuilder }) {
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [compareA, setCompareA] = useState(null);
  const [compareB, setCompareB] = useState(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    setIsLoading(true);
    try {
      const res = await api.getResumes();
      if (res.success) {
        setResumes(res.resumes || []);
        if (res.resumes && res.resumes.length >= 2) {
          setCompareA(res.resumes[0]);
          setCompareB(res.resumes[1]);
        } else if (res.resumes && res.resumes.length === 1) {
          setCompareA(res.resumes[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1400, margin: '30px auto', padding: '0 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--ink)' }}>
          Saved Tailored Resumes & Role Comparison
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.92rem' }}>
          Compare resumes customized for different target Job Descriptions generated from the same core portfolio database.
        </p>
      </div>

      {resumes.length === 0 ? (
        <div className="glass-panel" style={{ padding: 48, textAlign: 'center' }}>
          <FolderClock size={48} color="var(--rose)" style={{ marginBottom: 12 }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 6 }}>No Tailored Resumes Saved Yet</h3>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', maxWidth: 500, margin: '0 auto 16px auto' }}>
            Go to the "Job Resume Tailorer" tab, select a sample Job Description (e.g. Senior Full-Stack vs AI Engineer), click "Analyze & Tailor with Gemini", and hit "Save Snapshot".
          </p>
        </div>
      ) : (
        <div>
          {/* Side by Side Comparison if 2 or more exist */}
          {compareA && compareB && (
            <div className="glass-panel" style={{ padding: 24, marginBottom: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <Sparkles size={20} color="var(--rose-dark)" />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                  Side-by-Side Dual-Role Resume Comparison
                </h2>
                <span className="badge badge-sage">Same Portfolio, 2 Distinct Targeted Resumes</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {/* Column A */}
                <div style={{ background: '#ffffff', border: '1px solid var(--line)', borderRadius: 14, padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span className="badge badge-rose">Role 1: {compareA.targetRole}</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
                      Match: <strong>{compareA.jdAnalysis?.matchScore || 92}%</strong>
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--ink)' }}>{compareA.title}</h3>
                  <div style={{ fontSize: '0.82rem', color: 'var(--rose-dark)', fontWeight: 600, marginBottom: 10 }}>
                    {compareA.targetCompany || 'Target Employer'}
                  </div>

                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--muted)', marginBottom: 4 }}>
                    TAILORED PROFESSIONAL SUMMARY:
                  </div>
                  <p style={{ fontSize: '0.84rem', color: 'var(--ink)', lineHeight: 1.45, marginBottom: 12, background: 'var(--rose-light)', padding: 10, borderRadius: 8 }}>
                    {compareA.customizedSummary}
                  </p>

                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--muted)', marginBottom: 4 }}>
                    SELECTED SKILLS ({compareA.selectedSkills?.length || 0}):
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {(compareA.selectedSkills || []).map((s, idx) => (
                      <span key={idx} className="badge badge-sage" style={{ fontSize: '0.72rem' }}>{s}</span>
                    ))}
                  </div>
                </div>

                {/* Column B */}
                <div style={{ background: '#ffffff', border: '1px solid var(--line)', borderRadius: 14, padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span className="badge badge-lilac">Role 2: {compareB.targetRole}</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
                      Match: <strong>{compareB.jdAnalysis?.matchScore || 88}%</strong>
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--ink)' }}>{compareB.title}</h3>
                  <div style={{ fontSize: '0.82rem', color: 'var(--rose-dark)', fontWeight: 600, marginBottom: 10 }}>
                    {compareB.targetCompany || 'Target Employer'}
                  </div>

                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--muted)', marginBottom: 4 }}>
                    TAILORED PROFESSIONAL SUMMARY:
                  </div>
                  <p style={{ fontSize: '0.84rem', color: 'var(--ink)', lineHeight: 1.45, marginBottom: 12, background: 'var(--lilac)', padding: 10, borderRadius: 8 }}>
                    {compareB.customizedSummary}
                  </p>

                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--muted)', marginBottom: 4 }}>
                    SELECTED SKILLS ({compareB.selectedSkills?.length || 0}):
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {(compareB.selectedSkills || []).map((s, idx) => (
                      <span key={idx} className="badge badge-lilac" style={{ fontSize: '0.72rem' }}>{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* List of All Saved Resumes */}
          <div className="glass-panel" style={{ padding: 24 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>All Saved Resume Snapshots</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {resumes.map((res, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#ffffff',
                    border: '1px solid var(--line)',
                    borderRadius: 12,
                    padding: 18,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 12
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <FileText size={18} color="var(--rose-dark)" />
                      <h4 style={{ fontSize: '1.02rem', fontWeight: 700 }}>{res.title}</h4>
                      <span className="badge badge-rose" style={{ fontSize: '0.7rem' }}>
                        {res.targetRole}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'flex', gap: 12 }}>
                      <span>Saved: {new Date(res.createdAt).toLocaleDateString()}</span>
                      <span>Skills Selected: {res.selectedSkills?.length || 0}</span>
                      <span>Experiences: {res.selectedExperiences?.length || 0}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => {
                        setCompareA(res);
                      }}
                      className="btn btn-secondary btn-sm"
                    >
                      Compare as Role 1
                    </button>
                    <button
                      onClick={() => {
                        setCompareB(res);
                      }}
                      className="btn btn-secondary btn-sm"
                    >
                      Compare as Role 2
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
