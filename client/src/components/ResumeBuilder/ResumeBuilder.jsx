import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  FileText, 
  Download, 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  FileDown, 
  Target, 
  Sliders, 
  Palette, 
  Loader2, 
  ExternalLink 
} from 'lucide-react';
import { api } from '../../services/api';

export default function ResumeBuilder({ portfolio, onSaveToHistory }) {
  // Step Tabs for Left Panel
  const [activeStep, setActiveStep] = useState('match'); // 'match' | 'content' | 'style'

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

  // Template Style: Default to Modern Blue as requested!
  const [templateStyle, setTemplateStyle] = useState('modern-blue');
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [isSavingResume, setIsSavingResume] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const resumePrintRef = useRef(null);

  // Available Themes
  const themes = [
    {
      id: 'modern-blue',
      name: 'Modern Blue (Recommended)',
      tagline: 'Crisp royal blue & deep navy accents with high ATS legibility',
      color: '#1d4ed8',
      previewBg: '#eff6ff'
    },
    {
      id: 'executive-clean',
      name: 'Executive Clean',
      tagline: 'Minimalist obsidian & charcoal monochrome for corporate roles',
      color: '#18181b',
      previewBg: '#f4f4f5'
    },
    {
      id: 'modern-rose',
      name: 'Modern Rose',
      tagline: 'Warm rose, plum, and soft lilac aesthetic palette',
      color: '#bd7289',
      previewBg: '#faeef2'
    },
    {
      id: 'compact-tech',
      name: 'Compact Technical',
      tagline: 'High-density tech layout with monospace headers & teal accents',
      color: '#0d9488',
      previewBg: '#f0fdfa'
    }
  ];

  // Load Sample JDs on mount
  useEffect(() => {
    api.getSampleJDs().then(res => {
      if (res.success && res.sampleJDs) {
        setSampleJDs(res.sampleJDs);
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

        if (a.recommendedSkillNames && a.recommendedSkillNames.length > 0) {
          setSelectedSkillNames(new Set(a.recommendedSkillNames));
        }

        const expSet = new Set();
        (portfolio.experience || []).forEach((_, idx) => expSet.add(String(idx)));
        setSelectedExpIds(expSet);

        const projSet = new Set();
        (portfolio.projects || []).forEach((_, idx) => projSet.add(String(idx)));
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

  // Toggle Helpers
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

  // Save to History
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
  const currentThemeObj = themes.find(t => t.id === templateStyle) || themes[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Action Bar */}
      <div className="no-print" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 14,
        background: '#ffffff',
        border: '1px solid var(--line)',
        borderRadius: '14px',
        padding: '12px 20px',
        boxShadow: 'var(--shadow-xs)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--ink)' }}>
            Target Role:
          </span>
          <span className="badge badge-rose" style={{ fontSize: '0.8rem' }}>
            {targetRole}
          </span>
          {targetCompany && (
            <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
              at <strong>{targetCompany}</strong>
            </span>
          )}
          <span style={{ margin: '0 4px', color: 'var(--line)' }}>|</span>
          <span style={{ fontSize: '0.82rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: currentThemeObj.color }} />
            Theme: <strong>{currentThemeObj.name.split(' ')[0]} {currentThemeObj.name.split(' ')[1]}</strong>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={handlePrintPdf}
            className="btn btn-primary btn-sm"
            title="Download ATS-ready vector PDF via browser print"
          >
            <Download size={15} />
            Download PDF
          </button>

          <button
            onClick={handleExportDocx}
            disabled={isExportingDocx}
            className="btn btn-secondary btn-sm"
            title="Download Microsoft Word document matching selected theme"
          >
            <FileDown size={15} />
            {isExportingDocx ? 'Generating Word...' : 'Download Word (.docx)'}
          </button>

          <button
            onClick={handleSaveToHistory}
            disabled={isSavingResume}
            className="btn btn-sage btn-sm"
            title="Save tailored snapshot to MongoDB database history"
          >
            <Save size={15} />
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
          color: '#2e593e',
          fontSize: '0.86rem',
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <CheckCircle2 size={16} />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Main Two-Column Studio Workspace */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(460px, 520px) 1fr',
        gap: 28,
        alignItems: 'start'
      }}>
        
        {/* ================= LEFT CONTROLS ================= */}
        <div className="no-print card" style={{ padding: 0, overflow: 'hidden' }}>
          {/* Uncluttered Step Tabs */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid var(--line)',
            background: '#faf4f6'
          }}>
            {[
              { id: 'match', label: '1. Target JD & Match', icon: Target },
              { id: 'content', label: '2. Select Content', icon: Sliders },
              { id: 'style', label: '3. Theme & Layout', icon: Palette }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeStep === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveStep(tab.id)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 7,
                    padding: '14px 10px',
                    border: 'none',
                    borderBottom: `2px solid ${isActive ? 'var(--rose)' : 'transparent'}`,
                    background: isActive ? '#ffffff' : 'transparent',
                    color: isActive ? 'var(--rose-dark)' : 'var(--muted)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="card-body" style={{ padding: 22 }}>
            {/* STEP 1: JD INPUT & MATCHING */}
            {activeStep === 'match' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {/* Sample JD Selector */}
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--rose-dark)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
                    Select Test Job Description:
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {sampleJDs.map((jd, idx) => (
                      <button
                        key={jd.id}
                        onClick={() => loadJD(jd)}
                        className="btn btn-sm"
                        style={{
                          flex: 1,
                          fontSize: '0.78rem',
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

                {/* JD Input */}
                <div className="form-group" style={{ marginBottom: 4 }}>
                  <label>Job Description Text</label>
                  <textarea
                    rows={7}
                    value={jobDescription}
                    onChange={e => setJobDescription(e.target.value)}
                    placeholder="Paste target job description requirements here..."
                    style={{ fontSize: '0.88rem', lineHeight: 1.5 }}
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
                      Gemini Analyzing & Matching...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      Analyze & Tailor with Gemini
                    </>
                  )}
                </button>

                {/* Match Results */}
                {analysis && (
                  <div style={{
                    background: '#fdf9fa',
                    border: '1px solid #ebd0d9',
                    borderRadius: 12,
                    padding: 16,
                    marginTop: 6
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: 800 }}>AI Match Assessment</span>
                      <span className="badge badge-sage" style={{ fontSize: '0.84rem', padding: '3px 10px' }}>
                        {analysis.matchScore}% Match
                      </span>
                    </div>

                    <p style={{ fontSize: '0.84rem', color: 'var(--ink)', marginBottom: 12, lineHeight: 1.45 }}>
                      {analysis.summary}
                    </p>

                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#2e593e', marginBottom: 5 }}>
                        MATCHING PORTFOLIO SKILLS:
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                        {(analysis.matchedSkills || []).map((ms, idx) => (
                          <span key={idx} className="badge badge-sage" style={{ fontSize: '0.72rem' }}>
                            <Check size={11} /> {ms}
                          </span>
                        ))}
                      </div>
                    </div>

                    {analysis.missingSkills && analysis.missingSkills.length > 0 && (
                      <div>
                        <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--muted)', marginBottom: 5 }}>
                          UNMATCHED REQUIREMENTS (NOT IN PORTFOLIO):
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                          {analysis.missingSkills.map((mis, idx) => (
                            <span key={idx} className="badge badge-neutral" style={{ fontSize: '0.72rem', textDecoration: 'line-through' }}>
                              {mis}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: CONTENT & SECTION CHECKLISTS */}
            {activeStep === 'content' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
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

                {/* Skills Checklist */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <label style={{ margin: 0 }}>Included Skills ({selectedSkillNames.size})</label>
                    <button
                      onClick={() => setSelectedSkillNames(new Set((portfolio?.skills || []).map(s => s.name)))}
                      style={{ background: 'none', border: 'none', fontSize: '0.75rem', color: 'var(--rose-dark)', cursor: 'pointer', fontWeight: 600 }}
                    >
                      Select All
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, maxHeight: 150, overflowY: 'auto', padding: 2 }}>
                    {(portfolio?.skills || []).map((skill, idx) => {
                      const isChecked = selectedSkillNames.has(skill.name);
                      return (
                        <button
                          key={idx}
                          onClick={() => toggleSkill(skill.name)}
                          style={{
                            padding: '4px 10px',
                            borderRadius: 16,
                            border: `1px solid ${isChecked ? 'var(--rose)' : 'var(--line)'}`,
                            background: isChecked ? 'var(--rose-light)' : '#ffffff',
                            color: isChecked ? 'var(--rose-dark)' : 'var(--muted)',
                            fontSize: '0.75rem',
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

                {/* Experience Checklist */}
                <div>
                  <label style={{ display: 'block', marginBottom: 8 }}>Included Work Experience ({selectedExpIds.size})</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {(portfolio?.experience || []).map((exp, idx) => {
                      const isChecked = selectedExpIds.has(String(idx));
                      return (
                        <label key={idx} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          fontSize: '0.84rem',
                          background: isChecked ? '#fffafb' : '#ffffff',
                          border: '1px solid var(--line)',
                          padding: '8px 12px',
                          borderRadius: 10,
                          cursor: 'pointer'
                        }}>
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
                  <label style={{ display: 'block', marginBottom: 8 }}>Included Projects ({selectedProjIds.size})</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {(portfolio?.projects || []).map((proj, idx) => {
                      const isChecked = selectedProjIds.has(String(idx));
                      return (
                        <label key={idx} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          fontSize: '0.84rem',
                          background: isChecked ? '#fffafb' : '#ffffff',
                          border: '1px solid var(--line)',
                          padding: '8px 12px',
                          borderRadius: 10,
                          cursor: 'pointer'
                        }}>
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
            )}

            {/* STEP 3: THEME & LAYOUT STYLE (NOW 100% WORKING!) */}
            {activeStep === 'style' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 10 }}>Select Resume Theme Style</label>
                  <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: 12 }}>
                    Click any theme below to instantly re-style the live resume preview and exported PDF/Word documents.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
                    {themes.map(tmpl => {
                      const isSelected = templateStyle === tmpl.id;
                      return (
                        <button
                          key={tmpl.id}
                          onClick={() => setTemplateStyle(tmpl.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 14,
                            padding: '14px 16px',
                            borderRadius: 12,
                            border: `2px solid ${isSelected ? tmpl.color : 'var(--line)'}`,
                            background: isSelected ? tmpl.previewBg : '#ffffff',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'var(--transition-fast)',
                            boxShadow: isSelected ? 'var(--shadow-sm)' : 'none'
                          }}
                        >
                          <div style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background: tmpl.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff',
                            flexShrink: 0
                          }}>
                            {isSelected ? <Check size={18} strokeWidth={3} /> : <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffffff' }} />}
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '0.94rem', color: isSelected ? tmpl.color : 'var(--ink)' }}>
                              {tmpl.name}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: 2 }}>
                              {tmpl.tagline}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ================= RIGHT LIVE RESUME PREVIEW ================= */}
        <div style={{ position: 'sticky', top: 88 }}>
          <div className="no-print" style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: 10,
            padding: '2px 4px'
          }}>
            <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <FileText size={15} /> Live Resume Preview
            </span>
            <span className="badge" style={{ 
              background: currentThemeObj.previewBg, 
              color: currentThemeObj.color, 
              border: `1px solid ${currentThemeObj.color}40`,
              fontSize: '0.74rem',
              fontWeight: 700 
            }}>
              Active: {currentThemeObj.name.split(' (')[0]}
            </span>
          </div>

          {/* Paper View Container with Dynamic Theme Class */}
          <div
            ref={resumePrintRef}
            className={`resume-paper theme-${templateStyle}`}
            style={{
              background: '#ffffff',
              borderRadius: '14px',
              padding: '52px 58px',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--line)',
              minHeight: '880px',
              color: 'var(--res-text, #0f172a)',
              lineHeight: 1.5,
              transition: 'var(--transition)'
            }}
          >
            {/* 1. Header */}
            <div style={{ 
              textAlign: 'center', 
              borderBottom: '2px solid var(--res-primary, #1d4ed8)', 
              paddingBottom: 16, 
              marginBottom: 20 
            }}>
              <h1 style={{ 
                fontSize: '2rem', 
                fontWeight: 800, 
                letterSpacing: '-0.03em', 
                marginBottom: 4 
              }}>
                {portfolio?.personalInfo?.fullName || 'Aarav Sharma'}
              </h1>
              <div className="res-role-title" style={{ fontSize: '1.08rem', fontWeight: 700, marginBottom: 8 }}>
                {targetRole}
              </div>

              {/* Contact Line */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                flexWrap: 'wrap', 
                gap: 12, 
                fontSize: '0.82rem', 
                color: 'var(--res-muted, #64748b)' 
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
                <div className="res-section-title" style={{ 
                  fontSize: '0.88rem', 
                  fontWeight: 800, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.06em', 
                  paddingBottom: 4,
                  marginBottom: 8
                }}>
                  Professional Summary
                </div>
                <p style={{ fontSize: '0.88rem', lineHeight: 1.55 }}>
                  {customSummary}
                </p>
              </div>
            )}

            {/* 3. Technical Skills */}
            {resumePayload.selectedSkills.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div className="res-section-title" style={{ 
                  fontSize: '0.88rem', 
                  fontWeight: 800, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.06em', 
                  paddingBottom: 4,
                  marginBottom: 8
                }}>
                  Technical Competencies & Skills
                </div>
                <div style={{ fontSize: '0.86rem', lineHeight: 1.6 }}>
                  <strong>Core Competencies:</strong> {resumePayload.selectedSkills.join('  •  ')}
                </div>
              </div>
            )}

            {/* 4. Work Experience */}
            {resumePayload.selectedExperiences.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div className="res-section-title" style={{ 
                  fontSize: '0.88rem', 
                  fontWeight: 800, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.06em', 
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
                          <span style={{ fontWeight: 800, fontSize: '0.94rem' }}>{exp.role}</span>
                          <span className="res-accent-text" style={{ fontWeight: 700, fontSize: '0.94rem' }}> — {exp.company}</span>
                        </div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--res-muted, #64748b)', fontWeight: 600 }}>
                          {exp.startDate} – {exp.endDate} | {exp.location || 'Remote'}
                        </span>
                      </div>

                      <ul style={{ paddingLeft: 18, margin: '6px 0 0 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {(exp.tailoredBullets || []).map((b, bi) => (
                          <li key={bi} style={{ fontSize: '0.85rem', lineHeight: 1.48 }}>{b}</li>
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
                <div className="res-section-title" style={{ 
                  fontSize: '0.88rem', 
                  fontWeight: 800, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.06em', 
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
                          <span style={{ fontWeight: 800, fontSize: '0.92rem' }}>{proj.title}</span>
                          {proj.techStack && proj.techStack.length > 0 && (
                            <span style={{ fontSize: '0.8rem', color: 'var(--res-muted, #64748b)', fontStyle: 'italic', marginLeft: 6 }}>
                              [{proj.techStack.join(', ')}]
                            </span>
                          )}
                        </div>
                        {proj.liveUrl && (
                          <span className="res-accent-text" style={{ fontSize: '0.78rem' }}>{proj.liveUrl.replace('https://', '')}</span>
                        )}
                      </div>

                      <ul style={{ paddingLeft: 18, margin: '4px 0 0 0', display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {(proj.tailoredBullets || []).map((b, bi) => (
                          <li key={bi} style={{ fontSize: '0.84rem', lineHeight: 1.48 }}>{b}</li>
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
                <div className="res-section-title" style={{ 
                  fontSize: '0.88rem', 
                  fontWeight: 800, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.06em', 
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
                    <span style={{ color: 'var(--res-muted, #64748b)', fontSize: '0.8rem' }}>{ed.endDate} {ed.gradeOrGpa && `| ${ed.gradeOrGpa}`}</span>
                  </div>
                ))}
              </div>
            )}

            {/* 7. Certifications */}
            {resumePayload.selectedCertifications.length > 0 && (
              <div>
                <div className="res-section-title" style={{ 
                  fontSize: '0.88rem', 
                  fontWeight: 800, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.06em', 
                  paddingBottom: 4,
                  marginBottom: 8
                }}>
                  Certifications & Credentials
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 18px', fontSize: '0.84rem' }}>
                  {resumePayload.selectedCertifications.map((c, idx) => (
                    <div key={idx}>
                      • <strong>{c.name}</strong> <span style={{ color: 'var(--res-muted, #64748b)' }}>— {c.issuingOrg}</span>
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
