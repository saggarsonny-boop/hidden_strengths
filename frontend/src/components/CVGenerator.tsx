import React, { useState } from 'react';
import { Copy, FileText, Printer, ArrowLeft, Check, Edit3, Save } from 'lucide-react';

interface ResumeDetails {
  id?: string;
  jobFamilyId: string;
  name: string;
  email: string;
  location: string;
  jobTitle: string;
  summary: string;
  experience: Array<{
    title: string;
    company: string;
    dateRange: string;
    responsibilities: string[];
  }>;
  skills: {
    hard: string[];
    soft: string[];
  };
  coverLetter: string;
}

interface CVGeneratorProps {
  cv: ResumeDetails;
  onBack: () => void;
  token: string;
}

function CVGenerator({ cv: initialCv, onBack, token }: CVGeneratorProps) {
  const [cv, setCv] = useState<ResumeDetails>(initialCv);
  const [copied, setCopied] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  // Editable fields local state
  const [editSummary, setEditSummary] = useState(cv.summary);
  const [editCoverLetter, setEditCoverLetter] = useState(cv.coverLetter || '');

  // Copy Plain Text representation to clipboard
  const handleCopyText = () => {
    const text = `
${cv.name.toUpperCase()}
${cv.location} | ${cv.email}
Target Role: ${cv.jobTitle}

SUMMARY
${cv.summary}

SKILLS
Hard Skills: ${cv.skills.hard.join(', ')}
Soft Skills: ${cv.skills.soft.join(', ')}

PROFESSIONAL EXPERIENCE
${cv.experience.map(exp => `
${exp.title} - ${exp.company}
${exp.dateRange}
${exp.responsibilities.map(r => `• ${r}`).join('\n')}
`).join('\n')}

COVER LETTER
${cv.coverLetter}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Save changes locally and to database
  const handleSaveEdits = async () => {
    if (!cv.id) return;
    setSaving(true);
    try {
      const updatedCv = {
        ...cv,
        summary: editSummary,
        coverLetter: editCoverLetter
      };

      const res = await fetch(`/api/resumes/${cv.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          summary: editSummary,
          coverLetter: editCoverLetter
        })
      });

      if (res.ok) {
        setCv(updatedCv);
        setEditMode(false);
      } else {
        alert('Failed to save CV changes.');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving CV.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fade-in" style={{ maxWidth: '850px', margin: '0 auto' }}>
      
      {/* Top action header (hidden on browser print) */}
      <div className="cv-actions-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <button className="btn btn-secondary" onClick={onBack}>
          <ArrowLeft size={16} /> Back to Matches
        </button>

        <div style={{ display: 'flex', gap: '12px' }}>
          {editMode ? (
            <button className="btn btn-primary" style={{ background: '#10b981' }} onClick={handleSaveEdits} disabled={saving}>
              <Save size={16} /> {saving ? 'Saving...' : 'Save Draft'}
            </button>
          ) : (
            cv.id && (
              <button className="btn btn-secondary" onClick={() => {
                setEditSummary(cv.summary);
                setEditCoverLetter(cv.coverLetter);
                setEditMode(true);
              }}>
                <Edit3 size={16} /> Edit CV Text
              </button>
            )
          )}

          <button className="btn btn-secondary" onClick={handleCopyText}>
            {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy Plain Text'}
          </button>

          <button className="btn btn-primary" onClick={handlePrint}>
            <Printer size={16} /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* Styled Printable CV Container */}
      <div id="cv-printable-document" className="glass-card" style={{ padding: '50px', background: '#fff', color: '#0f172a', borderColor: '#e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        
        {/* CV Header */}
        <div style={{ borderBottom: '2px solid #8b5cf6', paddingBottom: '20px', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1e1b4b', fontFamily: 'var(--font-display)', marginBottom: '4px' }}>
            {cv.name}
          </h1>
          <div style={{ display: 'flex', gap: '20px', color: '#475569', fontSize: '0.95rem' }}>
            <span>{cv.location}</span>
            <span>•</span>
            <span>{cv.email}</span>
          </div>
          <div style={{ marginTop: '12px', fontSize: '1.1rem', fontWeight: 600, color: '#6366f1' }}>
            Target Career Path: {cv.jobTitle}
          </div>
        </div>

        {/* Section: Summary */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e1b4b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
            Professional Summary
          </h3>
          {editMode ? (
            <textarea 
              className="form-control" 
              rows={4}
              value={editSummary}
              onChange={e => setEditSummary(e.target.value)}
              style={{ color: '#0f172a', background: '#f8fafc', borderColor: '#cbd5e1' }}
            />
          ) : (
            <p style={{ color: '#334155', fontSize: '0.95rem', lineHeight: 1.6 }}>
              {cv.summary}
            </p>
          )}
        </div>

        {/* Section: Skills */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e1b4b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
            Core Competencies
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <h4 style={{ fontSize: '0.95rem', color: '#6366f1', marginBottom: '6px', fontWeight: 600 }}>Technical & Practical Skills</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {cv.skills.hard.map(s => (
                  <span key={s} style={{ background: '#f1f5f9', color: '#334155', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 500 }}>{s}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', color: '#6366f1', marginBottom: '6px', fontWeight: 600 }}>Adaptive & Interpersonal Skills</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {cv.skills.soft.map(s => (
                  <span key={s} style={{ background: '#f1f5f9', color: '#334155', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 500 }}>{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section: Experience */}
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e1b4b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
            Experience & Reframed Accomplishments
          </h3>
          
          {cv.experience.map((exp, idx) => (
            <div key={idx} style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e1b4b' }}>{exp.title}</h4>
                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>{exp.dateRange}</span>
              </div>
              <div style={{ fontSize: '0.9rem', color: '#6366f1', fontWeight: 500, marginBottom: '8px' }}>
                {exp.company}
              </div>
              <ul style={{ paddingLeft: '20px', color: '#334155', fontSize: '0.9rem' }}>
                {exp.responsibilities.map((resp, rIdx) => (
                  <li key={rIdx} style={{ marginBottom: '6px', lineHeight: 1.5 }}>{resp}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Section: Cover Letter (starts on new page if printed) */}
        <div className="cover-letter-section" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '30px', marginTop: '30px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e1b4b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
            Tailored Cover Letter
          </h3>
          {editMode ? (
            <textarea 
              className="form-control" 
              rows={12}
              value={editCoverLetter}
              onChange={e => setEditCoverLetter(e.target.value)}
              style={{ color: '#0f172a', background: '#f8fafc', borderColor: '#cbd5e1' }}
            />
          ) : (
            <p style={{ color: '#334155', fontSize: '0.95rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
              {cv.coverLetter}
            </p>
          )}
        </div>

      </div>

      {/* Global CSS overrides specifically for printing */}
      <style>{`
        @media print {
          body {
            background: #fff !important;
            color: #000 !important;
          }
          header, footer, .cv-actions-header {
            display: none !important;
          }
          #cv-printable-document {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            background: #fff !important;
            color: #000 !important;
          }
          .cover-letter-section {
            page-break-before: always;
            border-top: none !important;
            padding-top: 0 !important;
          }
        }
      `}</style>

    </div>
  );
}

export default CVGenerator;



<!-- Stripe Checkout Block -->
<div id="stripe-checkout-cta" style="margin: 2rem auto; padding: 2rem; border-radius: 12px; background: rgba(59,130,246,0.05); border: 1px solid rgba(59,130,246,0.2); text-align: center; font-family: sans-serif; max-width: 600px;">
    <h3 style="margin-top: 0; color: #fff;">Activate Premium License</h3>
    <p style="color: #9ca3af; font-size: 0.95rem; margin-bottom: 1.5rem;">Get instant access to all advanced capabilities and integration features.</p>
    <a href="https://buy.stripe.com/6oU00lb2L6F37bIazv0RG0J" target="_blank" style="display: inline-block; padding: 0.8rem 2rem; background: #3b82f6; color: #fff; font-weight: bold; border-radius: 8px; text-decoration: none; transition: background 0.2s;">Unlock Now</a>
</div>
