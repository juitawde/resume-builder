import React, { useState } from 'react';
import { 
  User, 
  Briefcase, 
  FolderGit2, 
  GraduationCap, 
  Award, 
  BookOpen, 
  Languages, 
  Wrench, 
  Plus, 
  Trash2, 
  ExternalLink,
  Save,
  Check
} from 'lucide-react';

export default function PortfolioManager({ portfolio, setPortfolio, onSave, isSaving }) {
  const [activeCategory, setActiveCategory] = useState('personal');
  const [newItemModal, setNewItemModal] = useState(null);
  const [skillFilter, setSkillFilter] = useState('All');

  // Handlers for Personal Info & Summary
  const handlePersonalInfoChange = (field, value) => {
    setPortfolio(prev => ({
      ...prev,
      personalInfo: {
        ...(prev.personalInfo || {}),
        [field]: value
      }
    }));
  };

  const handleSummaryChange = (value) => {
    setPortfolio(prev => ({
      ...prev,
      professionalSummary: value
    }));
  };

  // Add Item to Array Category
  const handleAddItem = (category, itemData) => {
    setPortfolio(prev => ({
      ...prev,
      [category]: [...(prev[category] || []), itemData]
    }));
    setNewItemModal(null);
  };

  // Delete Item from Array Category
  const handleDeleteItem = (category, index) => {
    setPortfolio(prev => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index)
    }));
  };

  const categories = [
    { id: 'personal', label: 'Personal & Contact', icon: User, count: null },
    { id: 'skills', label: 'Skills Matrix', icon: Wrench, count: portfolio?.skills?.length || 0 },
    { id: 'experience', label: 'Work Experience', icon: Briefcase, count: portfolio?.experience?.length || 0 },
    { id: 'projects', label: 'Projects & Demos', icon: FolderGit2, count: portfolio?.projects?.length || 0 },
    { id: 'education', label: 'Education', icon: GraduationCap, count: portfolio?.education?.length || 0 },
    { id: 'certifications', label: 'Certifications', icon: Award, count: portfolio?.certifications?.length || 0 },
    { id: 'achievements', label: 'Achievements', icon: Award, count: portfolio?.achievements?.length || 0 },
    { id: 'publications', label: 'Publications', icon: BookOpen, count: portfolio?.publications?.length || 0 },
    { id: 'languages', label: 'Languages', icon: Languages, count: portfolio?.languages?.length || 0 }
  ];

  const skillCategories = ['All', 'Frontend', 'Backend', 'Database', 'Cloud & DevOps', 'AI & Machine Learning', 'Languages', 'Tools & Platforms', 'Soft Skills'];

  const filteredSkills = (portfolio?.skills || []).filter(s => {
    if (skillFilter === 'All') return true;
    return s.category === skillFilter;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Category Pills Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        overflowX: 'auto',
        paddingBottom: 4,
        scrollbarWidth: 'none'
      }}>
        {categories.map(cat => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '9px 16px',
                borderRadius: '12px',
                border: `1px solid ${isActive ? 'var(--rose)' : 'var(--line)'}`,
                background: isActive ? 'var(--rose-light)' : '#ffffff',
                color: isActive ? 'var(--rose-dark)' : 'var(--ink)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.86rem',
                cursor: 'pointer',
                transition: 'var(--transition-fast)',
                whiteSpace: 'nowrap',
                boxShadow: isActive ? 'var(--shadow-xs)' : 'none'
              }}
            >
              <Icon size={16} color={isActive ? 'var(--rose-dark)' : 'var(--muted)'} />
              <span>{cat.label}</span>
              {cat.count !== null && (
                <span className={isActive ? 'badge badge-rose' : 'badge badge-neutral'} style={{ fontSize: '0.7rem', padding: '1px 6px' }}>
                  {cat.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Content Area in Clean Card */}
      <div className="card">
        {/* ================= 1. PERSONAL INFO & SUMMARY ================= */}
        {activeCategory === 'personal' && (
          <div>
            <div className="card-header">
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Personal Information & Career Summary</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>Contact info, links, and baseline career objective.</p>
              </div>
            </div>

            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Basic Details */}
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--rose-dark)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
                  Contact & Identification
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={portfolio?.personalInfo?.fullName || ''}
                      onChange={e => handlePersonalInfoChange('fullName', e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                    />
                  </div>

                  <div className="form-group">
                    <label>Professional Title</label>
                    <input
                      type="text"
                      value={portfolio?.personalInfo?.title || ''}
                      onChange={e => handlePersonalInfoChange('title', e.target.value)}
                      placeholder="e.g. Senior Full-Stack & AI Systems Engineer"
                    />
                  </div>

                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      value={portfolio?.personalInfo?.email || ''}
                      onChange={e => handlePersonalInfoChange('email', e.target.value)}
                      placeholder="e.g. aarav.dev@example.com"
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      value={portfolio?.personalInfo?.phone || ''}
                      onChange={e => handlePersonalInfoChange('phone', e.target.value)}
                      placeholder="e.g. +1 (555) 749-2810"
                    />
                  </div>

                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      value={portfolio?.personalInfo?.location || ''}
                      onChange={e => handlePersonalInfoChange('location', e.target.value)}
                      placeholder="e.g. San Francisco, CA"
                    />
                  </div>

                  <div className="form-group">
                    <label>Portfolio / Personal Website</label>
                    <input
                      type="url"
                      value={portfolio?.personalInfo?.website || ''}
                      onChange={e => handlePersonalInfoChange('website', e.target.value)}
                      placeholder="https://aaravsharma.dev"
                    />
                  </div>
                </div>
              </div>

              {/* Online Profiles */}
              <div style={{ borderTop: '1px solid var(--line)', paddingTop: 18 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--rose-dark)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
                  Online Profiles & Socials
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                  <div className="form-group">
                    <label>LinkedIn Profile URL</label>
                    <input
                      type="url"
                      value={portfolio?.personalInfo?.linkedIn || ''}
                      onChange={e => handlePersonalInfoChange('linkedIn', e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>

                  <div className="form-group">
                    <label>GitHub Profile URL</label>
                    <input
                      type="url"
                      value={portfolio?.personalInfo?.github || ''}
                      onChange={e => handlePersonalInfoChange('github', e.target.value)}
                      placeholder="https://github.com/username"
                    />
                  </div>
                </div>
              </div>

              {/* Career Summary */}
              <div style={{ borderTop: '1px solid var(--line)', paddingTop: 18 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Default Professional Summary / Objective</label>
                  <textarea
                    rows={4}
                    value={portfolio?.professionalSummary || ''}
                    onChange={e => handleSummaryChange(e.target.value)}
                    placeholder="Provide an overview of your background, core strengths, and documented achievements..."
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. SKILLS MATRIX ================= */}
        {activeCategory === 'skills' && (
          <div>
            <div className="card-header">
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Technical & Soft Skills Matrix</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>Categorized competencies with proficiency levels.</p>
              </div>
              <button onClick={() => setNewItemModal('skills')} className="btn btn-primary btn-sm">
                <Plus size={15} /> Add Skill
              </button>
            </div>

            <div className="card-body">
              {/* Category Filter Pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
                {skillCategories.map(sc => (
                  <button
                    key={sc}
                    onClick={() => setSkillFilter(sc)}
                    className="btn btn-sm"
                    style={{
                      background: skillFilter === sc ? 'var(--rose-light)' : '#ffffff',
                      borderColor: skillFilter === sc ? 'var(--rose)' : 'var(--line)',
                      color: skillFilter === sc ? 'var(--rose-dark)' : 'var(--muted)',
                      fontWeight: skillFilter === sc ? 700 : 500,
                      fontSize: '0.78rem',
                      padding: '5px 12px'
                    }}
                  >
                    {sc}
                  </button>
                ))}
              </div>

              {/* Skills Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 12 }}>
                {filteredSkills.map((skill, idx) => (
                  <div 
                    key={idx}
                    style={{
                      background: '#ffffff',
                      border: '1px solid var(--line)',
                      borderRadius: '12px',
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      boxShadow: 'var(--shadow-xs)'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--ink)' }}>{skill.name}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--muted)', display: 'flex', gap: 6, marginTop: 2 }}>
                        <span>{skill.category}</span> • <span>{skill.proficiencyLevel}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteItem('skills', idx)}
                      style={{ background: 'none', border: 'none', color: '#c46274', cursor: 'pointer', padding: 4 }}
                      title="Delete skill"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= 3. WORK EXPERIENCE ================= */}
        {activeCategory === 'experience' && (
          <div>
            <div className="card-header">
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Work Experience & Internships</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>Employment history with verified highlights and technologies.</p>
              </div>
              <button onClick={() => setNewItemModal('experience')} className="btn btn-primary btn-sm">
                <Plus size={15} /> Add Experience
              </button>
            </div>

            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {(portfolio?.experience || []).map((exp, idx) => (
                <div 
                  key={idx}
                  style={{
                    background: '#ffffff',
                    border: '1px solid var(--line)',
                    borderRadius: '14px',
                    padding: '20px 24px',
                    boxShadow: 'var(--shadow-xs)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                    <div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--ink)' }}>{exp.role}</h4>
                      <div style={{ color: 'var(--rose-dark)', fontWeight: 700, fontSize: '0.92rem', marginTop: 2 }}>
                        {exp.company} <span style={{ color: 'var(--muted)', fontWeight: 400 }}>• {exp.location || 'Remote'}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span className="badge badge-rose">
                        {exp.startDate || 'Start'} – {exp.isCurrent ? 'Present' : (exp.endDate || 'Present')}
                      </span>
                      <button
                        onClick={() => handleDeleteItem('experience', idx)}
                        className="btn btn-sm btn-danger"
                        title="Delete entry"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {exp.description && (
                    <p style={{ fontSize: '0.88rem', color: 'var(--ink)', margin: '10px 0', fontStyle: 'italic' }}>
                      {exp.description}
                    </p>
                  )}

                  {exp.technologiesUsed && exp.technologiesUsed.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, margin: '10px 0' }}>
                      {exp.technologiesUsed.map((t, ti) => (
                        <span key={ti} className="badge badge-lilac" style={{ fontSize: '0.74rem' }}>{t}</span>
                      ))}
                    </div>
                  )}

                  <ul style={{ paddingLeft: 18, margin: '12px 0 0 0', display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {(exp.highlights || []).map((h, hi) => (
                      <li key={hi} style={{ fontSize: '0.86rem', color: 'var(--ink)', lineHeight: 1.5 }}>{h}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 4. PROJECTS ================= */}
        {activeCategory === 'projects' && (
          <div>
            <div className="card-header">
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Featured Projects & Demos</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>Shipped applications, GitHub repositories, and system demos.</p>
              </div>
              <button onClick={() => setNewItemModal('projects')} className="btn btn-primary btn-sm">
                <Plus size={15} /> Add Project
              </button>
            </div>

            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 18 }}>
                {(portfolio?.projects || []).map((proj, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: '#ffffff',
                      border: '1px solid var(--line)',
                      borderRadius: '14px',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: 'var(--shadow-xs)'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: 800 }}>{proj.title}</h4>
                          <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{proj.role || 'Developer'}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteItem('projects', idx)}
                          style={{ background: 'none', border: 'none', color: '#c46274', cursor: 'pointer' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <p style={{ fontSize: '0.86rem', color: 'var(--ink)', margin: '10px 0' }}>{proj.description}</p>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, margin: '10px 0' }}>
                        {(proj.techStack || []).map((t, ti) => (
                          <span key={ti} className="badge badge-sage" style={{ fontSize: '0.74rem' }}>{t}</span>
                        ))}
                      </div>

                      <ul style={{ paddingLeft: 18, margin: '10px 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {(proj.highlights || []).map((h, hi) => (
                          <li key={hi} style={{ fontSize: '0.83rem', color: 'var(--ink)' }}>{h}</li>
                        ))}
                      </ul>
                    </div>

                    <div style={{ display: 'flex', gap: 14, paddingTop: 12, borderTop: '1px solid var(--line)', marginTop: 12 }}>
                      {proj.liveUrl && (
                        <a href={proj.liveUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <ExternalLink size={13} /> Live Demo
                        </a>
                      )}
                      {proj.githubUrl && (
                        <a href={proj.githubUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <FolderGit2 size={13} /> Repository
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= 5. EDUCATION ================= */}
        {activeCategory === 'education' && (
          <div>
            <div className="card-header">
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Educational Qualifications</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>Universities, degrees, and academic performance.</p>
              </div>
              <button onClick={() => setNewItemModal('education')} className="btn btn-primary btn-sm">
                <Plus size={15} /> Add Education
              </button>
            </div>

            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {(portfolio?.education || []).map((ed, idx) => (
                <div 
                  key={idx}
                  style={{
                    background: '#ffffff',
                    border: '1px solid var(--line)',
                    borderRadius: '12px',
                    padding: '18px 22px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: 'var(--shadow-xs)'
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '1.02rem', fontWeight: 800 }}>{ed.degree} in {ed.fieldOfStudy}</h4>
                    <div style={{ color: 'var(--rose-dark)', fontSize: '0.9rem', fontWeight: 700 }}>
                      {ed.institution} <span style={{ color: 'var(--muted)', fontWeight: 400 }}>• {ed.gradeOrGpa}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: 3 }}>
                      {ed.startDate} – {ed.endDate} | {ed.location}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteItem('education', idx)}
                    className="btn btn-sm btn-danger"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 6. CERTIFICATIONS ================= */}
        {activeCategory === 'certifications' && (
          <div>
            <div className="card-header">
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Certifications & Credentials</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>Verified industry licenses, cloud certifications, and credentials.</p>
              </div>
              <button onClick={() => setNewItemModal('certifications')} className="btn btn-primary btn-sm">
                <Plus size={15} /> Add Certification
              </button>
            </div>

            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
                {(portfolio?.certifications || []).map((cert, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: '#ffffff',
                      border: '1px solid var(--line)',
                      borderRadius: '12px',
                      padding: '18px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: 'var(--shadow-xs)'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>{cert.name}</h4>
                        <button
                          onClick={() => handleDeleteItem('certifications', idx)}
                          style={{ background: 'none', border: 'none', color: '#c46274', cursor: 'pointer' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div style={{ color: 'var(--rose-dark)', fontSize: '0.88rem', fontWeight: 700, marginTop: 2 }}>{cert.issuingOrg}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: 4 }}>
                        Issued: {cert.issueDate} {cert.credentialId && `• ID: ${cert.credentialId}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= 7. ACHIEVEMENTS ================= */}
        {activeCategory === 'achievements' && (
          <div>
            <div className="card-header">
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Achievements & Honors</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>Hackathons, recognition, and performance honors.</p>
              </div>
              <button onClick={() => setNewItemModal('achievements')} className="btn btn-primary btn-sm">
                <Plus size={15} /> Add Achievement
              </button>
            </div>

            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {(portfolio?.achievements || []).map((ach, idx) => (
                <div 
                  key={idx}
                  style={{
                    background: '#ffffff',
                    border: '1px solid var(--line)',
                    borderRadius: '12px',
                    padding: '18px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: 'var(--shadow-xs)'
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>{ach.title}</h4>
                    <div style={{ color: 'var(--rose-dark)', fontSize: '0.86rem', fontWeight: 600 }}>{ach.issuer} ({ach.date})</div>
                    <p style={{ fontSize: '0.84rem', color: 'var(--muted)', marginTop: 4 }}>{ach.description}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteItem('achievements', idx)}
                    className="btn btn-sm btn-danger"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 8. PUBLICATIONS ================= */}
        {activeCategory === 'publications' && (
          <div>
            <div className="card-header">
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Research Papers & Publications</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>Published articles, academic journals, and technical papers.</p>
              </div>
              <button onClick={() => setNewItemModal('publications')} className="btn btn-primary btn-sm">
                <Plus size={15} /> Add Publication
              </button>
            </div>

            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {(portfolio?.publications || []).map((pub, idx) => (
                <div 
                  key={idx}
                  style={{
                    background: '#ffffff',
                    border: '1px solid var(--line)',
                    borderRadius: '12px',
                    padding: '18px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    boxShadow: 'var(--shadow-xs)'
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>{pub.title}</h4>
                    <div style={{ color: 'var(--rose-dark)', fontSize: '0.86rem', fontWeight: 600 }}>{pub.publisher} ({pub.publicationDate})</div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--ink)', marginTop: 6, lineHeight: 1.5 }}>{pub.summary}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteItem('publications', idx)}
                    className="btn btn-sm btn-danger"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 9. LANGUAGES ================= */}
        {activeCategory === 'languages' && (
          <div>
            <div className="card-header">
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Languages & Spoken Competencies</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>Spoken languages and international proficiencies.</p>
              </div>
              <button onClick={() => setNewItemModal('languages')} className="btn btn-primary btn-sm">
                <Plus size={15} /> Add Language
              </button>
            </div>

            <div className="card-body">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                {(portfolio?.languages || []).map((lang, idx) => (
                  <div 
                    key={idx}
                    style={{
                      background: '#ffffff',
                      border: '1px solid var(--line)',
                      borderRadius: '12px',
                      padding: '12px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      boxShadow: 'var(--shadow-xs)'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.94rem' }}>{lang.name}</div>
                      <span className="badge badge-lilac" style={{ fontSize: '0.74rem', marginTop: 3 }}>{lang.proficiency}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteItem('languages', idx)}
                      style={{ background: 'none', border: 'none', color: '#c46274', cursor: 'pointer', marginLeft: 6 }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* QUICK ADD MODAL */}
      {newItemModal && (
        <QuickAddModal
          category={newItemModal}
          onClose={() => setNewItemModal(null)}
          onAdd={data => handleAddItem(newItemModal, data)}
        />
      )}
    </div>
  );
}

// Subcomponent: Quick Add Modal
function QuickAddModal({ category, onClose, onAdd }) {
  const [formData, setFormData] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
  };

  const update = (k, v) => setFormData(p => ({ ...p, [k]: v }));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, textTransform: 'capitalize' }}>
            Add New {category.slice(0, -1) || category}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer' }}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          {category === 'skills' && (
            <>
              <div className="form-group">
                <label>Skill Name *</label>
                <input required type="text" placeholder="e.g. Docker, GraphQL, System Design" onChange={e => update('name', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select onChange={e => update('category', e.target.value)} defaultValue="Backend">
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Database">Database</option>
                  <option value="Cloud & DevOps">Cloud & DevOps</option>
                  <option value="AI & Machine Learning">AI & Machine Learning</option>
                  <option value="Languages">Languages</option>
                  <option value="Tools & Platforms">Tools & Platforms</option>
                  <option value="Soft Skills">Soft Skills</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Proficiency</label>
                <select onChange={e => update('proficiencyLevel', e.target.value)} defaultValue="Advanced">
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
              <div className="form-group">
                <label>Years of Experience</label>
                <input type="number" min={1} max={25} defaultValue={2} onChange={e => update('yearsOfExperience', Number(e.target.value))} />
              </div>
            </>
          )}

          {category === 'experience' && (
            <>
              <div className="form-group">
                <label>Company *</label>
                <input required type="text" placeholder="e.g. Acme Corp" onChange={e => update('company', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Role Title *</label>
                <input required type="text" placeholder="e.g. Senior Backend Engineer" onChange={e => update('role', e.target.value)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label>Start Date</label>
                  <input type="text" placeholder="YYYY-MM" onChange={e => update('startDate', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input type="text" placeholder="YYYY-MM or Present" onChange={e => update('endDate', e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label>Key Bullet Points (separate by new line)</label>
                <textarea 
                  rows={4} 
                  placeholder="Built microservices in Node.js...&#10;Reduced latency by 35%..." 
                  onChange={e => update('highlights', e.target.value.split('\n').filter(Boolean))} 
                />
              </div>
              <div className="form-group">
                <label>Technologies Used (comma separated)</label>
                <input type="text" placeholder="React, Node.js, AWS, Docker" onChange={e => update('technologiesUsed', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} />
              </div>
            </>
          )}

          {category === 'projects' && (
            <>
              <div className="form-group">
                <label>Project Title *</label>
                <input required type="text" placeholder="e.g. Cloud Matrix Platform" onChange={e => update('title', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows={2} placeholder="Brief summary of the application..." onChange={e => update('description', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Tech Stack (comma separated)</label>
                <input type="text" placeholder="React, Node.js, MongoDB, Gemini API" onChange={e => update('techStack', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} />
              </div>
              <div className="form-group">
                <label>Key Highlights / Impact (separate by new line)</label>
                <textarea rows={3} placeholder="Handled 10k daily requests...&#10;Integrated zero-hallucination guardrails..." onChange={e => update('highlights', e.target.value.split('\n').filter(Boolean))} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label>Live URL</label>
                  <input type="url" placeholder="https://..." onChange={e => update('liveUrl', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>GitHub URL</label>
                  <input type="url" placeholder="https://github.com/..." onChange={e => update('githubUrl', e.target.value)} />
                </div>
              </div>
            </>
          )}

          {category === 'education' && (
            <>
              <div className="form-group">
                <label>Institution / University *</label>
                <input required type="text" placeholder="e.g. Stanford University" onChange={e => update('institution', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Degree *</label>
                <input required type="text" placeholder="e.g. Bachelor of Science" onChange={e => update('degree', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Field of Study</label>
                <input type="text" placeholder="e.g. Computer Science" onChange={e => update('fieldOfStudy', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Grade / GPA</label>
                <input type="text" placeholder="e.g. 3.9 / 4.0" onChange={e => update('gradeOrGpa', e.target.value)} />
              </div>
            </>
          )}

          {category === 'certifications' && (
            <>
              <div className="form-group">
                <label>Certification Name *</label>
                <input required type="text" placeholder="e.g. AWS Certified Solutions Architect" onChange={e => update('name', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Issuing Organization *</label>
                <input required type="text" placeholder="e.g. Amazon Web Services" onChange={e => update('issuingOrg', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Issue Date</label>
                <input type="text" placeholder="YYYY-MM" onChange={e => update('issueDate', e.target.value)} />
              </div>
            </>
          )}

          {category === 'achievements' && (
            <>
              <div className="form-group">
                <label>Achievement Title *</label>
                <input required type="text" placeholder="e.g. 1st Place Hackathon Winner" onChange={e => update('title', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Issuer / Host</label>
                <input type="text" placeholder="e.g. TechSF & MLH" onChange={e => update('issuer', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows={2} onChange={e => update('description', e.target.value)} />
              </div>
            </>
          )}

          {category === 'publications' && (
            <>
              <div className="form-group">
                <label>Publication Title *</label>
                <input required type="text" onChange={e => update('title', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Publisher / Conference</label>
                <input type="text" onChange={e => update('publisher', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Summary</label>
                <textarea rows={2} onChange={e => update('summary', e.target.value)} />
              </div>
            </>
          )}

          {category === 'languages' && (
            <>
              <div className="form-group">
                <label>Language *</label>
                <input required type="text" placeholder="e.g. French, Japanese" onChange={e => update('name', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Proficiency</label>
                <select onChange={e => update('proficiency', e.target.value)} defaultValue="Professional Working">
                  <option value="Native">Native</option>
                  <option value="Fluent">Fluent</option>
                  <option value="Professional Working">Professional Working</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Elementary">Elementary</option>
                </select>
              </div>
            </>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 22 }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">Add to Database</button>
          </div>
        </form>
      </div>
    </div>
  );
}
