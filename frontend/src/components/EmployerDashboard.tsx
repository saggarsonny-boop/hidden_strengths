import React, { useState, useEffect } from 'react';
import { Search, Filter, ShieldCheck, User, MapPin, BookOpen, Heart, Award, ArrowRight, CheckCircle, Briefcase, Building } from 'lucide-react';

interface Candidate {
  id: string;
  name: string;
  location: string;
  education: { degreeType?: string };
  jobs: Array<{ title: string; employer: string; responsibilities: string }>;
  hobbies: string[];
  constraints: string[];
  military: { served: boolean; branch?: string; role?: string };
  clarifications: Record<string, string>;
  careerMatches: Array<{ title: string; score: number; rationale: string }>;
}

interface EmployerDashboardProps {
  token: string;
  onLogout: () => void;
}

function EmployerDashboard({ token, onLogout }: EmployerDashboardProps) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  
  // Filter States
  const [filterMilitary, setFilterMilitary] = useState(false);
  const [filterDoctorate, setFilterDoctorate] = useState(false);
  const [filterFelonyFriendly, setFilterFelonyFriendly] = useState(false);

  // Selected Candidate Modal
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [selectedMatchIdx, setSelectedMatchIdx] = useState<number>(0);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/employer/candidates', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        throw new Error('Failed to load candidate pools');
      }
      const data = await res.json();
      setCandidates(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getDegreeLabel = (type?: string) => {
    if (type === 'doctorate') return 'Doctorate / Professional (MD, JD, PhD)';
    if (type === 'master') return "Master's Degree";
    if (type === 'bachelor') return "Bachelor's Degree";
    if (type === 'associate') return "Associate / Certifications";
    return 'High School / No Degree';
  };

  // Filter Logic
  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase()) ||
      c.jobs.some(j => j.title.toLowerCase().includes(search.toLowerCase())) ||
      c.hobbies.some(h => h.toLowerCase().includes(search.toLowerCase()));

    if (filterMilitary && !c.military.served) return false;
    if (filterDoctorate && c.education.degreeType !== 'doctorate') return false;
    if (filterFelonyFriendly && !c.constraints.includes('felony')) return false;

    return matchesSearch;
  });

  return (
    <div className="fade-in" style={{ padding: '20px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, fontFamily: 'var(--font-display)' }}>Hiring Dashboard</h1>
          <p style={{ color: '#94a3b8', marginTop: '6px' }}>Scan and evaluate candidate matches based on life-experience mapping.</p>
        </div>
        <button className="btn btn-secondary" onClick={fetchCandidates}>Refresh Pools</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '30px', alignItems: 'start' }}>
        {/* Filters Sidebar */}
        <aside className="glass-card" style={{ padding: '24px', position: 'sticky', top: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <Filter size={18} color="#8b5cf6" />
            <h3 style={{ margin: 0, fontSize: '1.15rem' }}>Refine Talent Pool</h3>
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label">Search Keywords</label>
            <div style={{ position: 'relative' }}>
              <Search size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input 
                type="text" 
                className="form-control" 
                placeholder="Name, hobby, or job..." 
                value={search} 
                onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: '38px' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={filterMilitary} 
                onChange={e => setFilterMilitary(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#8b5cf6' }}
              />
              <span style={{ fontSize: '0.9rem', color: '#fff' }}>Military Service (MOS)</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={filterDoctorate} 
                onChange={e => setFilterDoctorate(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#8b5cf6' }}
              />
              <span style={{ fontSize: '0.9rem', color: '#fff' }}>Advanced Degree (MD/PhD)</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={filterFelonyFriendly} 
                onChange={e => setFilterFelonyFriendly(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#8b5cf6' }}
              />
              <span style={{ fontSize: '0.9rem', color: '#fff' }}>Felony Consideration</span>
            </label>
          </div>
        </aside>

        {/* Candidates List */}
        <div>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
              <div style={{ width: '30px', height: '30px', border: '2px solid rgba(139, 92, 246, 0.2)', borderTopColor: '#8b5cf6', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            </div>
          ) : error ? (
            <div className="glass-card" style={{ padding: '24px', color: '#fca5a5' }}>Error loading candidates: {error}</div>
          ) : filteredCandidates.length === 0 ? (
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
              No candidates matching the refined criteria.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {filteredCandidates.map(c => (
                <div key={c.id} className="glass-card fade-in" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', color: '#fff', margin: '0 0 4px 0' }}>{c.name}</h3>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={14} /> {c.location || 'Remote'}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <BookOpen size={14} /> {getDegreeLabel(c.education.degreeType)}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
                      {c.military.served && <span style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#a78bfa', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>🎖 {c.military.branch || 'Veteran'}</span>}
                      {c.constraints.includes('felony') && <span style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>⚖ Legal Considerations</span>}
                      {c.hobbies.map(h => <span key={h} style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#cbd5e1', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem' }}>🎯 {h}</span>)}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {c.careerMatches.length > 0 && (
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Top Target Career Track</span>
                        <span style={{ fontSize: '1rem', color: '#10b981', fontWeight: 700 }}>{c.careerMatches[0].title} ({c.careerMatches[0].score}%)</span>
                      </div>
                    )}
                    <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={() => { setSelectedCandidate(c); setSelectedMatchIdx(0); }}>
                      View Matches <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Candidate Profile Modal Overlay */}
      {selectedCandidate && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="glass-card fade-in" style={{
            width: '900px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '40px',
            background: 'rgba(15, 12, 30, 0.95)',
            position: 'relative'
          }}>
            <button 
              onClick={() => setSelectedCandidate(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                color: '#64748b',
                fontSize: '1.5rem',
                cursor: 'pointer'
              }}
            >
              ×
            </button>

            <h2 style={{ fontSize: '2rem', color: '#fff', margin: '0 0 4px 0' }}>{selectedCandidate.name}</h2>
            <div style={{ display: 'flex', gap: '16px', color: '#94a3b8', fontSize: '0.9rem', marginBottom: '24px' }}>
              <span>{selectedCandidate.location || 'Remote'}</span>
              <span>•</span>
              <span>{getDegreeLabel(selectedCandidate.education.degreeType)}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px' }}>
              {/* Left Column: Strengths & Experience */}
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Heart size={18} color="#8b5cf6" /> Strengths & Clarifications</h3>
                
                {/* Hobbies Answers */}
                {Object.keys(selectedCandidate.clarifications).length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                    {Object.entries(selectedCandidate.clarifications).map(([q, a]) => (
                      <div key={q} style={{ background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.1)', padding: '12px', borderRadius: '8px' }}>
                        <span style={{ fontSize: '0.85rem', color: '#c084fc', display: 'block', fontWeight: 600 }}>Q: {q}</span>
                        <span style={{ fontSize: '0.9rem', color: '#fff', marginTop: '4px', display: 'block' }}>A: {a}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '24px' }}>No hobby clarifications answers recorded.</p>
                )}

                <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Briefcase size={18} color="#8b5cf6" /> Work & Service History</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {selectedCandidate.jobs.map((j, idx) => (
                    <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px' }}>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: '#fff' }}>{j.title}</h4>
                      <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{j.employer}</span>
                      <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '8px', lineHeight: 1.4 }}>{j.responsibilities}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Matched Positions */}
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Award size={18} color="#8b5cf6" /> Matched Positioning</h3>
                
                {selectedCandidate.careerMatches.length > 0 ? (
                  <div>
                    {/* Horizontal matching role selectors */}
                    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '20px', paddingBottom: '8px' }}>
                      {selectedCandidate.careerMatches.map((m, idx) => (
                        <button 
                          key={idx}
                          className={`btn ${selectedMatchIdx === idx ? 'btn-primary' : 'btn-secondary'}`}
                          style={{ padding: '6px 12px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                          onClick={() => setSelectedMatchIdx(idx)}
                        >
                          {m.title} ({m.score}%)
                        </button>
                      ))}
                    </div>

                    {/* Matched rationale card */}
                    <div className="glass-card" style={{ padding: '24px', background: 'rgba(16, 185, 129, 0.02)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: 700, marginBottom: '12px' }}>
                        <CheckCircle size={18} />
                        <span>Rationale for {selectedCandidate.careerMatches[selectedMatchIdx].title} Match</span>
                      </div>
                      <p style={{ color: '#e2e8f0', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
                        {selectedCandidate.careerMatches[selectedMatchIdx].rationale}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p style={{ color: '#64748b' }}>No matches available.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployerDashboard;



<!-- Stripe Checkout Block -->
<div id="stripe-checkout-cta" style="margin: 2rem auto; padding: 2rem; border-radius: 12px; background: rgba(59,130,246,0.05); border: 1px solid rgba(59,130,246,0.2); text-align: center; font-family: sans-serif; max-width: 600px;">
    <h3 style="margin-top: 0; color: #fff;">Activate Premium License</h3>
    <p style="color: #9ca3af; font-size: 0.95rem; margin-bottom: 1.5rem;">Get instant access to all advanced capabilities and integration features.</p>
    <a href="https://buy.stripe.com/6oU00lb2L6F37bIazv0RG0J" target="_blank" style="display: inline-block; padding: 0.8rem 2rem; background: #3b82f6; color: #fff; font-weight: bold; border-radius: 8px; text-decoration: none; transition: background 0.2s;">Unlock Now</a>
</div>
