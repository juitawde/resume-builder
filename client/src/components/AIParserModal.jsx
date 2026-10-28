import React, { useState } from 'react';
import { Wand2, Sparkles, Check, Loader2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export default function AIParserModal({ onMerge, onCancel }) {
  const [rawText, setRawText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [parsedResult, setParsedResult] = useState(null);
  const [error, setError] = useState(null);

  const sampleBio = `Aarav Sharma - Senior Full-Stack & AI Systems Engineer
Contact: aarav.sharma.dev@gmail.com | +1 555-749-2810 | San Francisco, CA
LinkedIn: https://linkedin.com/in/aarav-sharma-tech | GitHub: https://github.com/aaravsharma-dev

Summary:
Full-Stack Software Engineer with 5+ years of experience designing scalable microservices, interactive React applications, and production GenAI pipelines. Track record of reducing API latency by 45% and architecting robust distributed cloud systems on AWS.

Skills:
React.js, Node.js, Express, Python, MongoDB, PostgreSQL, Gemini API, RAG, Pinecone, Docker, AWS, TypeScript, RESTful APIs

Experience:
Senior Full-Stack Software Engineer at Nexus Cloud Technologies (2023 - Present)
- Architected scalable microservices using Node.js and MongoDB handling 15M+ monthly API requests with 99.98% uptime.
- Built responsive real-time analytics UI in React reducing page render times by 38%.
- Integrated Google Gemini API to build an automated executive summary generator.

Education:
BS in Computer Science & Data Science from University of California, Berkeley (2015 - 2019), GPA: 3.85 / 4.0

Certifications:
AWS Certified Solutions Architect – Associate (2023)`;

  const handleParse = async () => {
    if (!rawText.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.parseUnstructured(rawText);
      if (res.success && res.structuredData) {
        setParsedResult(res.structuredData);
      } else {
        throw new Error(res.error || 'Failed to parse text');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (parsedResult) {
      onMerge(parsedResult);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: 'var(--lilac)',
            color: '#64497e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Wand2 size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Gemini AI Quick-Importer</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
              Paste raw resumes or bio notes. Gemini extracts verified fields into MongoDB.
            </p>
          </div>
        </div>
      </div>

      <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {error && (
          <div style={{ 
            background: '#fdf2f4', 
            border: '1px solid #f2c7ce', 
            borderRadius: 10, 
            padding: '12px 16px', 
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            color: '#b3394b',
            fontSize: '0.88rem'
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <label style={{ fontWeight: 700 }}>Unstructured Resume / Bio Text</label>
            <button
              type="button"
              onClick={() => setRawText(sampleBio)}
              style={{ background: 'none', border: 'none', color: 'var(--rose-dark)', fontSize: '0.82rem', cursor: 'pointer', fontWeight: 600 }}
            >
              Paste Sample Bio
            </button>
          </div>

          <textarea
            rows={8}
            style={{ width: '100%', fontFamily: 'inherit', fontSize: '0.9rem', lineHeight: 1.5 }}
            placeholder="Paste raw text or LinkedIn summary here..."
            value={rawText}
            onChange={e => setRawText(e.target.value)}
          />
        </div>

        <div>
          <button
            onClick={handleParse}
            disabled={isLoading || !rawText.trim()}
            className="btn btn-primary"
            style={{ padding: '10px 24px' }}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Gemini Structuring Data...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Process & Structure with Gemini
              </>
            )}
          </button>
        </div>

        {/* Extracted Preview */}
        {parsedResult && (
          <div style={{ borderTop: '1px solid var(--line)', paddingTop: 24, marginTop: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--ink)' }}>
                  Structured Extracted Preview
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                  Grounded candidate facts ready for database merge.
                </p>
              </div>

              <button onClick={handleApply} className="btn btn-sage btn-sm">
                <Check size={16} />
                Merge into Portfolio Database
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
              <div style={{ background: '#ffffff', border: '1px solid var(--line)', borderRadius: 12, padding: 14 }}>
                <div style={{ fontWeight: 700, color: 'var(--rose-dark)', fontSize: '0.82rem', marginBottom: 4 }}>Personal Info</div>
                <div style={{ fontSize: '0.85rem' }}><strong>Name:</strong> {parsedResult.personalInfo?.fullName}</div>
                <div style={{ fontSize: '0.85rem' }}><strong>Title:</strong> {parsedResult.personalInfo?.title}</div>
                <div style={{ fontSize: '0.85rem' }}><strong>Email:</strong> {parsedResult.personalInfo?.email}</div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid var(--line)', borderRadius: 12, padding: 14 }}>
                <div style={{ fontWeight: 700, color: 'var(--rose-dark)', fontSize: '0.82rem', marginBottom: 4 }}>Extracted Skills ({parsedResult.skills?.length || 0})</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {(parsedResult.skills || []).map((s, idx) => (
                    <span key={idx} className="badge badge-sage" style={{ fontSize: '0.72rem' }}>{s.name}</span>
                  ))}
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid var(--line)', borderRadius: 12, padding: 14 }}>
                <div style={{ fontWeight: 700, color: 'var(--rose-dark)', fontSize: '0.82rem', marginBottom: 4 }}>Experience ({parsedResult.experience?.length || 0})</div>
                {(parsedResult.experience || []).map((e, idx) => (
                  <div key={idx} style={{ fontSize: '0.82rem', marginBottom: 4 }}>
                    • <strong>{e.role}</strong> at {e.company}
                  </div>
                ))}
              </div>

              <div style={{ background: '#ffffff', border: '1px solid var(--line)', borderRadius: 12, padding: 14 }}>
                <div style={{ fontWeight: 700, color: 'var(--rose-dark)', fontSize: '0.82rem', marginBottom: 4 }}>Education & Certs</div>
                {(parsedResult.education || []).map((ed, idx) => (
                  <div key={idx} style={{ fontSize: '0.82rem' }}>• {ed.degree} ({ed.institution})</div>
                ))}
                {(parsedResult.certifications || []).map((c, idx) => (
                  <div key={idx} style={{ fontSize: '0.82rem' }}>• {c.name}</div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
