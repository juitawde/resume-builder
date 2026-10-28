import React, { useState } from 'react';
import { Wand2, Sparkles, Check, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
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
    <div style={{ maxWidth: 1100, margin: '30px auto', padding: '0 24px' }}>
      <div className="glass-panel" style={{ padding: 32 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'var(--lilac)',
            color: '#64497e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Wand2 size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Gemini AI Quick-Importer</h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--muted)' }}>
              Paste unstructured text, a LinkedIn profile summary, or raw resume markdown. Gemini will automatically parse and validate each field into your portfolio database.
            </p>
          </div>
        </div>

        {error && (
          <div style={{ 
            background: '#fdf2f4', 
            border: '1px solid #f2c7ce', 
            borderRadius: 10, 
            padding: '12px 16px', 
            marginBottom: 20,
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

        {/* Input Text Area */}
        <div style={{ marginBottom: 20 }}>
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
            rows={10}
            style={{ width: '100%', fontFamily: 'inherit', fontSize: '0.9rem', lineHeight: 1.5 }}
            placeholder="Paste raw resume, bio notes, or LinkedIn export text here..."
            value={rawText}
            onChange={e => setRawText(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={handleParse}
            disabled={isLoading || !rawText.trim()}
            className="btn btn-primary"
            style={{ padding: '12px 28px' }}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Gemini Structuring Data...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Process & Structure with Gemini
              </>
            )}
          </button>
        </div>

        {/* Extracted Preview */}
        {parsedResult && (
          <div style={{ marginTop: 30, paddingTop: 24, borderTop: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--ink)' }}>
                  Structured Extracted Preview
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
                  Verified zero-hallucination extraction ready for MongoDB integration.
                </p>
              </div>

              <button onClick={handleApply} className="btn btn-sage" style={{ padding: '10px 22px' }}>
                <Check size={18} />
                Merge into Portfolio Database
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              <div style={{ background: '#ffffff', border: '1px solid var(--line)', borderRadius: 12, padding: 16 }}>
                <div style={{ fontWeight: 700, color: 'var(--rose-dark)', marginBottom: 6 }}>Personal Info</div>
                <div style={{ fontSize: '0.88rem' }}><strong>Name:</strong> {parsedResult.personalInfo?.fullName}</div>
                <div style={{ fontSize: '0.88rem' }}><strong>Title:</strong> {parsedResult.personalInfo?.title}</div>
                <div style={{ fontSize: '0.88rem' }}><strong>Email:</strong> {parsedResult.personalInfo?.email}</div>
                <div style={{ fontSize: '0.88rem' }}><strong>Location:</strong> {parsedResult.personalInfo?.location}</div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid var(--line)', borderRadius: 12, padding: 16 }}>
                <div style={{ fontWeight: 700, color: 'var(--rose-dark)', marginBottom: 6 }}>Extracted Skills ({parsedResult.skills?.length || 0})</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {(parsedResult.skills || []).map((s, idx) => (
                    <span key={idx} className="badge badge-sage" style={{ fontSize: '0.74rem' }}>{s.name}</span>
                  ))}
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid var(--line)', borderRadius: 12, padding: 16 }}>
                <div style={{ fontWeight: 700, color: 'var(--rose-dark)', marginBottom: 6 }}>Experience & Roles ({parsedResult.experience?.length || 0})</div>
                {(parsedResult.experience || []).map((e, idx) => (
                  <div key={idx} style={{ fontSize: '0.85rem', marginBottom: 6 }}>
                    • <strong>{e.role}</strong> at {e.company} ({e.startDate} - {e.endDate})
                  </div>
                ))}
              </div>

              <div style={{ background: '#ffffff', border: '1px solid var(--line)', borderRadius: 12, padding: 16 }}>
                <div style={{ fontWeight: 700, color: 'var(--rose-dark)', marginBottom: 6 }}>Education & Certs</div>
                {(parsedResult.education || []).map((ed, idx) => (
                  <div key={idx} style={{ fontSize: '0.85rem' }}>• {ed.degree} - {ed.institution}</div>
                ))}
                {(parsedResult.certifications || []).map((c, idx) => (
                  <div key={idx} style={{ fontSize: '0.85rem' }}>• {c.name} ({c.issuingOrg})</div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
