import React, { useState, useEffect } from 'react';
import { FolderClock, FileText, Download, Calendar, ExternalLink, ArrowRight, Check, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export default function SavedResumes() {
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {resumes.length === 0 ? (
        <div className="card" style={{ padding: 48, textAlign: 'center' }}>
          <FolderClock size={44} color="var(--rose)" style={{ marginBottom: 12 }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 6 }}>No Saved Resumes Yet</h3>
          <p style={{ color: 'var(--muted)', fontSize: '0.88rem', maxWidth: 480, margin: '0 auto 16px auto' }}>
            Go to the "Job Resume Tailorer" tab, select a test Job Description (e.g. Senior Full-Stack vs AI Engineer), click "Analyze & Tailor with Gemini", and hit "Save Snapshot".
          </p>
        </div>
      ) : (
        <>
          {/* Side by Side Comparison Card */}
          {compareA && compareB && (
            <div className="card">
              <div className="card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Sparkles size={20} color="var(--rose-dark)" />
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                      Side-by-Side Dual-Role Resume Comparison
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                      Demonstrating 2 differently tailored resumes generated from the same candidate portfolio.
                    </p>
                  </div>
                </div>
                <span className="badge badge-sage">Verified Candidate Facts</span>
              </div>

              <div className="card-body">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 20 }}>
                  {/* Column A */}
                  <div style={{ background: '#fdf9fa', border: '1px solid #ebd0d9', borderRadius: 14, padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span className="badge badge-rose">Role 1: {compareA.targetRole}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                        Match: <strong>{compareA.jdAnalysis?.matchScore || 92}%</strong>
                      </span>
                    </div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--ink)' }}>{compareA.title}</h4>
                    <div style={{ fontSize: '0.82rem', color: 'var(--rose-dark)', fontWeight: 600, marginBottom: 12 }}>
                      {compareA.targetCompany || 'Target Employer'}
                    </div>

                    <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--muted)', marginBottom: 4 }}>
                      TAILORED PROFESSIONAL SUMMARY:
                    </div>
                    <p style={{ fontSize: '0.84rem', color: 'var(--ink)', lineHeight: 1.5, marginBottom: 14, background: '#ffffff', border: '1px solid var(--line)', padding: 12, borderRadius: 10 }}>
                      {compareA.customizedSummary}
                    </p>

                    <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--muted)', marginBottom: 4 }}>
                      KEY SKILLS SELECTED ({compareA.selectedSkills?.length || 0}):
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {(compareA.selectedSkills || []).map((s, idx) => (
                        <span key={idx} className="badge badge-sage" style={{ fontSize: '0.72rem' }}>{s}</span>
                      ))}
                    </div>
                  </div>

                  {/* Column B */}
                  <div style={{ background: '#f9f6fc', border: '1px solid #dfd3f5', borderRadius: 14, padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span className="badge badge-lilac">Role 2: {compareB.targetRole}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                        Match: <strong>{compareB.jdAnalysis?.matchScore || 88}%</strong>
                      </span>
                    </div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--ink)' }}>{compareB.title}</h4>
                    <div style={{ fontSize: '0.82rem', color: 'var(--rose-dark)', fontWeight: 600, marginBottom: 12 }}>
                      {compareB.targetCompany || 'Target Employer'}
                    </div>

                    <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--muted)', marginBottom: 4 }}>
                      TAILORED PROFESSIONAL SUMMARY:
                    </div>
                    <p style={{ fontSize: '0.84rem', color: 'var(--ink)', lineHeight: 1.5, marginBottom: 14, background: '#ffffff', border: '1px solid var(--line)', padding: 12, borderRadius: 10 }}>
                      {compareB.customizedSummary}
                    </p>

                    <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--muted)', marginBottom: 4 }}>
                      KEY SKILLS SELECTED ({compareB.selectedSkills?.length || 0}):
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {(compareB.selectedSkills || []).map((s, idx) => (
                        <span key={idx} className="badge badge-lilac" style={{ fontSize: '0.72rem' }}>{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* List of Saved Resumes */}
          <div className="card">
            <div className="card-header">
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>All Saved Resume Snapshots</h3>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {resumes.map((res, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#ffffff',
                    border: '1px solid var(--line)',
                    borderRadius: 12,
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 12,
                    boxShadow: 'var(--shadow-xs)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <FileText size={17} color="var(--rose-dark)" />
                      <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>{res.title}</h4>
                      <span className="badge badge-rose" style={{ fontSize: '0.7rem' }}>
                        {res.targetRole}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--muted)', display: 'flex', gap: 12 }}>
                      <span>Saved: {new Date(res.createdAt).toLocaleDateString()}</span>
                      <span>Skills: {res.selectedSkills?.length || 0}</span>
                      <span>Experiences: {res.selectedExperiences?.length || 0}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => setCompareA(res)}
                      className="btn btn-secondary btn-sm"
                    >
                      Compare as Role 1
                    </button>
                    <button
                      onClick={() => setCompareB(res)}
                      className="btn btn-secondary btn-sm"
                    >
                      Compare as Role 2
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
