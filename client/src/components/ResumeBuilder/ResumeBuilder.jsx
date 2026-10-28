import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  FileText, 
  Download, 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  Wand2, 
  Save, 
  FileDown, 
  RotateCcw, 
  Target, 
  Briefcase, 
  FolderGit2, 
  Award, 
  GraduationCap, 
  Layers, 
  Loader2, 
  ExternalLink 
} from 'lucide-react';
import { api } from '../../services/api';

export default function ResumeBuilder({ portfolio, onSaveToHistory }) {
  // JD Input State
  const [sampleJDs, setSampleJDs] = useState([]);
  const [selectedJdId, setSelectedJdId] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  // Resume Customization State
  const [targetRole, setTargetRole] = useState('');
  const [targetCompany, setTargetCompany] = useState('');
  const [customSummary, setCustomSummary] = useState('');
  const [selectedSkillNames, setSelectedSkillNames] = useState(new Set());
  const [selectedExpIds, setSelectedExpIds] = useState(new Set());
  const [selectedProjIds, setSelectedProjIds] = useState(new Set());
  const [selectedCertIds, setSelectedCertIds] = useState(new Set());
  const [selectedEduIds, setSelectedEduIds] = useState(new Set());

  // Template Style
  const [templateStyle, setTemplateStyle] = useState('modern-rose');
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [isSavingResume, setIsSavingResume] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const resumePrintRef = useRef(null);

  // Load Sample JDs on mount
  useEffect(() => {
    api.getSampleJDs().then(res => {
      if (res.success && res.sampleJDs) {
        setSampleJDs(res.sampleJDs);
        // Default to first sample JD
        if (res.sampleJDs.length > 0) {
          loadJD(res.sampleJDs[0]);
        }
      }
    }).catch(console.error);
  }, []);

  // Initialize selected items when portfolio loads
  useEffect(() => {
    if (portfolio) {
      if (!targetRole) setTargetRole(portfolio.personalInfo?.title || 'Senior Software Engineer');
      if (!customSummary) setCustomSummary(portfolio.professionalSummary || '');
      
      // Default: select all portfolio items
      setSelectedSkillNames(new Set((portfolio.skills || []).map(s => s.name)));
      setSelectedExpIds(new Set((portfolio.experience || []).map((_, i) => String(i))));
      setSelectedProjIds(new Set((portfolio.projects || []).map((_, i) => String(i))));
      setSelectedCertIds(new Set((portfolio.certifications || []).map((_, i) => String(i))));
      setSelectedEduIds(new Set((portfolio.education || []).map((_, i) => String(i))));
    }
  }, [portfolio]);

  const loadJD = (jd) => {
    setSelectedJdId(jd.id);
    setJobDescription(jd.description);
    setTargetRole(jd.title);
    setTargetCompany(jd.company);
  };

  // Run Gemini Analysis & Matching
  const handleAnalyzeJD = async () => {
    if (!jobDescription.trim()) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const res = await api.analyzeJD(jobDescription, portfolio);
      if (res.success && res.analysis) {
        const a = res.analysis;
        setAnalysis(a);
        if (a.targetRoleTitle) setTargetRole(a.targetRoleTitle);
        if (a.targetCompany) setTargetCompany(a.targetCompany);
        if (a.customizedProfessionalSummary) setCustomSummary(a.customizedProfessionalSummary);

        // Pre-select recommended skills
        if (a.recommendedSkillNames && a.recommendedSkillNames.length > 0) {
          setSelectedSkillNames(new Set(a.recommendedSkillNames));
        }

        // Match experiences and projects with highest relevance
        const expSet = new Set();
        (portfolio.experience || []).forEach((exp, idx) => {
          // If match reason or in relevant list, select
          expSet.add(String(idx));
        });
        setSelectedExpIds(expSet);

        const projSet = new Set();
        (portfolio.projects || []).forEach((proj, idx) => {
          projSet.add(String(idx));
        });
        setSelectedProjIds(projSet);

      } else {
        throw new Error(res.error || 'Failed to analyze Job Description');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Toggle Selection Helpers
  const toggleSkill = (name) => {
    const next = new Set(selectedSkillNames);
    if (next.has(name)) next.delete(name);
    else next.add(name);
    setSelectedSkillNames(next);
  };

  const toggleExp = (id) => {
    const next = new Set(selectedExpIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedExpIds(next);
  };

  const toggleProj = (id) => {
    const next = new Set(selectedProjIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedProjIds(next);
  };

  const toggleCert = (id) => {
    const next = new Set(selectedCertIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedCertIds(next);
  };

  // Generate Tailored Resume Payload
  const getTailoredResumePayload = () => {
    const selectedSkills = (portfolio.skills || [])
      .filter(s => selectedSkillNames.has(s.name))
      .map(s => s.name);

    const selectedExperiences = (portfolio.experience || [])
      .filter((_, i) => selectedExpIds.has(String(i)))
      .map(e => ({
        company: e.company,
        role: e.role,
        startDate: e.startDate,
        endDate: e.isCurrent ? 'Present' : e.endDate,
        location: e.location,
        tailoredBullets: e.highlights || []
      }));

    const selectedProjects = (portfolio.projects || [])
      .filter((_, i) => selectedProjIds.has(String(i)))
      .map(p => ({
        title: p.title,
        role: p.role,
        techStack: p.techStack || [],
        liveUrl: p.liveUrl,
        githubUrl: p.githubUrl,
        tailoredBullets: p.highlights || []
      }));

    const selectedEducation = (portfolio.education || [])
      .filter((_, i) => selectedEduIds.has(String(i)))
      .map(ed => ({
        institution: ed.institution,
        degree: ed.degree,
        fieldOfStudy: ed.fieldOfStudy,
        endDate: ed.endDate,
        gradeOrGpa: ed.gradeOrGpa
      }));

    const selectedCertifications = (portfolio.certifications || [])
      .filter((_, i) => selectedCertIds.has(String(i)))
      .map(c => ({
        name: c.name,
        issuingOrg: c.issuingOrg,
        issueDate: c.issueDate
      }));

    return {
      title: `${targetRole} — ${targetCompany || 'Application'}`,
      targetRole,
      targetCompany,
      jobDescription,
      jdAnalysis: analysis || {},
      customizedSummary: customSummary,
      selectedSkills,
      selectedExperiences,
      selectedProjects,
      selectedEducation,
      selectedCertifications,
      templateStyle
    };
  };

  // Export DOCX
  const handleExportDocx = async () => {
    setIsExportingDocx(true);
    try {
      const payload = getTailoredResumePayload();
      const blob = await api.exportDocx(payload, portfolio.personalInfo);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Resume_${targetRole.replace(/\s+/g, '_')}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(`DOCX export failed: ${err.message}`);
    } finally {
      setIsExportingDocx(false);
    }
  };

  // Print PDF
  const handlePrintPdf = () => {
    window.print();
  };

  // Save to MongoDB History
  const handleSaveToHistory = async () => {
    setIsSavingResume(true);
    try {
      const payload = getTailoredResumePayload();
      const res = await api.saveResume(payload);
      if (res.success) {
        setSaveSuccessMsg('Tailored resume snapshot saved to database history!');
        if (onSaveToHistory) onSaveToHistory();
        setTimeout(() => setSaveSuccessMsg(''), 4000);
      }
    } catch (err) {
      alert(`Save failed: ${err.message}`);
    } finally {
      setIsSavingResume(false);
    }
  };

  const resumePayload = getTailoredResumePayload();

  return (
    <div style={{ maxWidth: 1560, margin: '24px auto', padding: '0 20px' }}>
      {/* Top Banner */}
      <div className="no-print" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 20
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--ink)' }}>
            Dynamic Job-Specific Resume Generator
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
            Match any Job Description against your verified portfolio. Gemini identifies optimal keywords, tailors the summary, and formats a download-ready ATS resume.
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={handlePrintPdf}
            className="btn btn-primary"
            title="Download vector PDF via browser print"
          >
            <Download size={16} />
            Download PDF
          </button>

          <button
            onClick={handleExportDocx}
            disabled={isExportingDocx}
            className="btn btn-secondary"
            title="Download editable Microsoft Word document"
          >
            <FileDown size={16} />
            {isExportingDocx ? 'Generating Word...' : 'Download Word (.docx)'}
          </button>

          <button
            onClick={handleSaveToHistory}
            disabled={isSavingResume}
            className="btn btn-sage"
            title="Save tailored snapshot to database history"
          >
            <Save size={16} />
            Save Snapshot
          </button>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="no-print" style={{
          background: '#edf7f0',
          border: '1px solid #c4e3cd',
          borderRadius: 10,
          padding: '10px 16px',
          marginBottom: 16,
          color: '#2e593e',
          fontSize: '0.88rem',
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <CheckCircle2 size={16} />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Main Split Layout: Left Controls | Right Live Resume */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(420px, 480px) 1fr',
        gap: 24,
        alignItems: 'start'
      }}>
        
        {/* ================= LEFT PANEL: JD INPUT & CONTROLS ================= */}
        <div className="no-print" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* 1. Job Description Input Box */}
          <div className="glass-panel" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Target size={18} color="var(--rose-dark)" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Target Job Description</h3>
              </div>
              <span className="badge badge-rose" style={{ fontSize: '0.72rem' }}>Gemini Analysis</span>
            </div>

            {/* Quick Sample Selector */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: '0.78rem', color: 'var(--muted)', display: 'block', marginBottom: 4 }}>
                LOAD PRE-CONFIGURED SAMPLE JD (TEST WITH 2 DIFFERENT ROLES):
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                {sampleJDs.map((jd, idx) => (
                  <button
                    key={jd.id}
                    onClick={() => loadJD(jd)}
                    className="btn btn-sm"
                    style={{
                      flex: 1,
                      fontSize: '0.76rem',
                      padding: '7px 10px',
                      background: selectedJdId === jd.id ? 'var(--rose-light)' : '#ffffff',
                      borderColor: selectedJdId === jd.id ? 'var(--rose)' : 'var(--line)',
                      color: selectedJdId === jd.id ? 'var(--rose-dark)' : 'var(--ink)'
                    }}
                  >
                    Role {idx + 1}: {jd.title.split(' ')[0]} {jd.title.split(' ')[1]}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <textarea
                rows={6}
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                placeholder="Paste the target job description here..."
                style={{ fontSize: '0.86rem', lineHeight: 1.45 }}
              />
            </div>

            <button
              onClick={handleAnalyzeJD}
              disabled={isAnalyzing || !jobDescription.trim()}
              className="btn btn-primary"
              style={{ width: '100%', padding: '11px' }}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Gemini Matching with Portfolio...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Analyze & Tailor with Gemini
                </>
              )}
            </button>
          </div>

          {/* 2. Gemini Match & Gap Analysis Card */}
          {analysis && (
            <div className="glass-panel" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>AI Match & Gap Assessment</h3>
                <div style={{
                  background: analysis.matchScore >= 80 ? 'var(--sage)' : 'var(--lilac)',
                  color: analysis.matchScore >= 80 ? '#2b543b' : '#553e6b',
                  padding: '4px 12px',
                  borderRadius: 20,
                  fontWeight: 800,
                  fontSize: '0.9rem'
                }}>
                  {analysis.matchScore}% Match
                </div>
              </div>

              <p style={{ fontSize: '0.84rem', color: 'var(--ink)', marginBottom: 12, lineHeight: 1.45 }}>
                {analysis.summary}
              </p>

              {/* Matched Skills */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#2e593e', marginBottom: 6 }}>
                  VERIFIED MATCHING SKILLS ({analysis.matchedSkills?.length || 0}):
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {(analysis.matchedSkills || []).map((ms, idx) => (
                    <span key={idx} className="badge badge-sage" style={{ fontSize: '0.72rem' }}>
                      <Check size={11} /> {ms}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Skills / Growth Gaps */}
              {analysis.missingSkills && analysis.missingSkills.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--muted)', marginBottom: 6 }}>
                    UNMATCHED JD REQUIREMENTS (NOT IN PORTFOLIO):
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {analysis.missingSkills.map((mis, idx) => (
                      <span key={idx} className="badge badge-neutral" style={{ fontSize: '0.72rem', textDecoration: 'line-through' }}>
                        {mis}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Strengths */}
              {analysis.strengths && analysis.strengths.length > 0 && (
                <div style={{ background: '#ffffff', borderRadius: 8, padding: 10, border: '1px solid var(--line)', marginTop: 10 }}>
                  <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--rose-dark)', marginBottom: 4 }}>
                    KEY CANDIDATE ADVANTAGES:
                  </div>
                  <ul style={{ paddingLeft: 16, margin: 0, fontSize: '0.8rem', color: 'var(--ink)' }}>
                    {analysis.strengths.map((st, idx) => (
                      <li key={idx} style={{ marginBottom: 3 }}>{st}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* 3. Role & Summary Customizer */}
          <div className="glass-panel" style={{ padding: 20 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 12 }}>
              Resume Header & Objective Customizer
            </h3>

            <div className="form-group">
              <label>Target Role Title on Resume</label>
              <input
                type="text"
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Tailored Professional Summary</label>
              <textarea
                rows={4}
                value={customSummary}
                onChange={e => setCustomSummary(e.target.value)}
                style={{ fontSize: '0.86rem' }}
              />
            </div>

            {/* Template Selector */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Layout Aesthetic</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {[
                  { id: 'modern-rose', label: 'Modern Rose' },
                  { id: 'executive-clean', label: 'Executive Clean' },
                  { id: 'compact-tech', label: 'Compact Technical' }
                ].map(tmpl => (
                  <button
                    key={tmpl.id}
                    onClick={() => setTemplateStyle(tmpl.id)}
                    className="btn btn-sm"
                    style={{
                      flex: 1,
                      fontSize: '0.78rem',
                      background: templateStyle === tmpl.id ? 'var(--rose-light)' : '#ffffff',
                      borderColor: templateStyle === tmpl.id ? 'var(--rose)' : 'var(--line)',
                      color: templateStyle === tmpl.id ? 'var(--rose-dark)' : 'var(--ink)',
                      fontWeight: templateStyle === tmpl.id ? 700 : 500
                    }}
                  >
                    {tmpl.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Interactive Checklist: Select/Deselect Items */}
          <div className="glass-panel" style={{ padding: 20 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 14 }}>
              Include / Exclude Resume Sections
            </h3>

            {/* Skills Checklist */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink)', marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                <span>Select Skills ({selectedSkillNames.size} of {portfolio?.skills?.length || 0})</span>
                <button
                  onClick={() => setSelectedSkillNames(new Set((portfolio.skills || []).map(s => s.name)))}
                  style={{ background: 'none', border: 'none', fontSize: '0.74rem', color: 'var(--rose-dark)', cursor: 'pointer' }}
                >
                  Select All
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, maxHeight: 160, overflowY: 'auto', padding: 4 }}>
                {(portfolio?.skills || []).map((skill, idx) => {
                  const isChecked = selectedSkillNames.has(skill.name);
                  return (
                    <button
                      key={idx}
                      onClick={() => toggleSkill(skill.name)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 20,
                        border: `1px solid ${isChecked ? 'var(--rose)' : 'var(--line)'}`,
                        background: isChecked ? 'var(--rose-light)' : '#ffffff',
                        color: isChecked ? 'var(--rose-dark)' : 'var(--muted)',
                        fontSize: '0.76rem',
                        fontWeight: isChecked ? 700 : 500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                      }}
                    >
                      {isChecked && <Check size={11} />}
                      {skill.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Experiences Checklist */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>
                Select Work Experience ({selectedExpIds.size})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {(portfolio?.experience || []).map((exp, idx) => {
                  const isChecked = selectedExpIds.has(String(idx));
                  return (
                    <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleExp(String(idx))}
                        style={{ accentColor: 'var(--rose)' }}
                      />
                      <span><strong>{exp.role}</strong> — {exp.company}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Projects Checklist */}
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>
                Select Projects ({selectedProjIds.size})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {(portfolio?.projects || []).map((proj, idx) => {
                  const isChecked = selectedProjIds.has(String(idx));
                  return (
                    <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleProj(String(idx))}
                        style={{ accentColor: 'var(--rose)' }}
                      />
                      <span><strong>{proj.title}</strong></span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT PANEL: LIVE RESUME PREVIEW ================= */}
        <div style={{ position: 'sticky', top: 90 }}>
          <div className="no-print" style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: 10,
            padding: '4px 8px'
          }}>
            <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <FileText size={15} /> Real-Time Live Document Preview (ATS Optimized)
            </span>
            <span className="badge badge-rose" style={{ fontSize: '0.72rem' }}>
              Style: {templateStyle}
            </span>
          </div>

          {/* Paper View Container */}
          <div
            ref={resumePrintRef}
            className="resume-paper"
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '48px 54px',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--line)',
              minHeight: '900px',
              color: '#382b32',
              lineHeight: 1.45,
              fontFamily: "'DM Sans', sans-serif"
            }}
          >
            {/* 1. Header */}
            <div style={{ textAlign: 'center', borderBottom: '2px solid var(--rose)', paddingBottom: 16, marginBottom: 20 }}>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: 4 }}>
                {portfolio?.personalInfo?.fullName || 'Aarav Sharma'}
              </h1>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--rose-dark)', marginBottom: 8 }}>
                {targetRole}
              </div>

              {/* Contact Line */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                flexWrap: 'wrap', 
                gap: 12, 
                fontSize: '0.82rem', 
                color: 'var(--muted)' 
              }}>
                {portfolio?.personalInfo?.email && <span>{portfolio.personalInfo.email}</span>}
                {portfolio?.personalInfo?.phone && <span>• {portfolio.personalInfo.phone}</span>}
                {portfolio?.personalInfo?.location && <span>• {portfolio.personalInfo.location}</span>}
                {portfolio?.personalInfo?.linkedIn && <span>• {portfolio.personalInfo.linkedIn.replace('https://', '')}</span>}
                {portfolio?.personalInfo?.github && <span>• {portfolio.personalInfo.github.replace('https://', '')}</span>}
              </div>
            </div>

            {/* 2. Professional Summary */}
            {customSummary && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ 
                  fontSize: '0.88rem', 
                  fontWeight: 800, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.06em', 
                  color: 'var(--rose-dark)',
                  borderBottom: '1px solid var(--line)',
                  paddingBottom: 4,
                  marginBottom: 8
                }}>
                  Professional Summary
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--ink)', lineHeight: 1.5 }}>
                  {customSummary}
                </p>
              </div>
            )}

            {/* 3. Technical Skills */}
            {resumePayload.selectedSkills.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ 
                  fontSize: '0.88rem', 
                  fontWeight: 800, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.06em', 
                  color: 'var(--rose-dark)',
                  borderBottom: '1px solid var(--line)',
                  paddingBottom: 4,
                  marginBottom: 8
                }}>
                  Technical Competencies & Skills
                </div>
                <div style={{ fontSize: '0.86rem', color: 'var(--ink)', lineHeight: 1.6 }}>
                  <strong>Key Technologies:</strong> {resumePayload.selectedSkills.join('  •  ')}
                </div>
              </div>
            )}

            {/* 4. Work Experience */}
            {resumePayload.selectedExperiences.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ 
                  fontSize: '0.88rem', 
                  fontWeight: 800, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.06em', 
                  color: 'var(--rose-dark)',
                  borderBottom: '1px solid var(--line)',
                  paddingBottom: 4,
                  marginBottom: 12
                }}>
                  Work Experience
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {resumePayload.selectedExperiences.map((exp, idx) => (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
                        <div>
                          <span style={{ fontWeight: 800, fontSize: '0.94rem', color: 'var(--ink)' }}>{exp.role}</span>
                          <span style={{ fontWeight: 700, fontSize: '0.94rem', color: 'var(--rose-dark)' }}> — {exp.company}</span>
                        </div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 600 }}>
                          {exp.startDate} – {exp.endDate} | {exp.location || 'Remote'}
                        </span>
                      </div>

                      <ul style={{ paddingLeft: 18, margin: '6px 0 0 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {(exp.tailoredBullets || []).map((b, bi) => (
                          <li key={bi} style={{ fontSize: '0.85rem', color: 'var(--ink)', lineHeight: 1.45 }}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Projects */}
            {resumePayload.selectedProjects.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ 
                  fontSize: '0.88rem', 
                  fontWeight: 800, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.06em', 
                  color: 'var(--rose-dark)',
                  borderBottom: '1px solid var(--line)',
                  paddingBottom: 4,
                  marginBottom: 12
                }}>
                  Featured Projects
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {resumePayload.selectedProjects.map((proj, idx) => (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <div>
                          <span style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--ink)' }}>{proj.title}</span>
                          {proj.techStack && proj.techStack.length > 0 && (
                            <span style={{ fontSize: '0.8rem', color: 'var(--muted)', fontStyle: 'italic', marginLeft: 6 }}>
                              [{proj.techStack.join(', ')}]
                            </span>
                          )}
                        </div>
                        {proj.liveUrl && (
                          <span style={{ fontSize: '0.78rem', color: 'var(--rose-dark)' }}>{proj.liveUrl.replace('https://', '')}</span>
                        )}
                      </div>

                      <ul style={{ paddingLeft: 18, margin: '4px 0 0 0', display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {(proj.tailoredBullets || []).map((b, bi) => (
                          <li key={bi} style={{ fontSize: '0.84rem', color: 'var(--ink)', lineHeight: 1.45 }}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. Education */}
            {resumePayload.selectedEducation.length > 0 && (
              <div style={{ marginBottom: 18 }}>
                <div style={{ 
                  fontSize: '0.88rem', 
                  fontWeight: 800, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.06em', 
                  color: 'var(--rose-dark)',
                  borderBottom: '1px solid var(--line)',
                  paddingBottom: 4,
                  marginBottom: 8
                }}>
                  Education
                </div>

                {resumePayload.selectedEducation.map((ed, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', marginBottom: 4 }}>
                    <div>
                      <strong>{ed.degree} in {ed.fieldOfStudy}</strong> — <span>{ed.institution}</span>
                    </div>
                    <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>{ed.endDate} {ed.gradeOrGpa && `| ${ed.gradeOrGpa}`}</span>
                  </div>
                ))}
              </div>
            )}

            {/* 7. Certifications */}
            {resumePayload.selectedCertifications.length > 0 && (
              <div>
                <div style={{ 
                  fontSize: '0.88rem', 
                  fontWeight: 800, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.06em', 
                  color: 'var(--rose-dark)',
                  borderBottom: '1px solid var(--line)',
                  paddingBottom: 4,
                  marginBottom: 8
                }}>
                  Certifications & Credentials
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 18px', fontSize: '0.84rem' }}>
                  {resumePayload.selectedCertifications.map((c, idx) => (
                    <div key={idx}>
                      • <strong>{c.name}</strong> <span style={{ color: 'var(--muted)' }}>— {c.issuingOrg}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
