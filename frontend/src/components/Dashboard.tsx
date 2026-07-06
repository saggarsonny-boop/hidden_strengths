import React, { useState, useEffect } from 'react';
import { Sparkles, Sliders, CheckCircle, ChevronDown, ChevronUp, Lock, FileSpreadsheet, RefreshCw } from 'lucide-react';
import CVGenerator from './CVGenerator.tsx';

interface DashboardProps {
  token: string;
  isPremium: boolean;
  onUpgrade: () => void;
  onRetake: () => void;
}

interface Match {
  id: string;
  title: string;
  description: string;
  salaryRange: string;
  workType: string;
  score: number;
  constraintMatch: boolean;
  reasonForFilter: string;
  matchingSkills: string[];
  gaps: string[];
  rationale: string;
  pitchAngle: string;
}

interface Profile {
  name: string;
  ageRange: string;
  location: string;
  workPreference: string;
  constraints: string[];
  education: { degreeType: string };
  jobs: any[];
  military: { served: boolean; branch?: string; role?: string };
  parentingCaregiving: boolean;
  communityRoles: string[];
  hobbies: string[];
  personality: { prefersSolo: number; prefersStructure: number; stressTolerance: number; values: string[] };
  schedule: string[];
  incomeTarget: string;
  dealBreakers: string[];
}

function Dashboard({ token, isPremium, onUpgrade, onRetake }: DashboardProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // CV view state
  const [currentCv, setCurrentCv] = useState<any | null>(null);
  const [cvLoading, setCvLoading] = useState(false);

  // Upgrade Modal State
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Sidebar tweak states (synced with profile personality on load)
  const [prefersSolo, setPrefersSolo] = useState(3);
  const [prefersStructure, setPrefersStructure] = useState(3);
  const [stressTolerance, setStressTolerance] = useState(3);
  const [workPreference, setWorkPreference] = useState('remote');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch Profile
      const profileRes = await fetch('/api/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile(profileData);
        
        // Setup initial sliders
        if (profileData.personality) {
          setPrefersSolo(profileData.personality.prefersSolo || 3);
          setPrefersStructure(profileData.personality.prefersStructure || 3);
          setStressTolerance(profileData.personality.stressTolerance || 3);
        }
        setWorkPreference(profileData.workPreference || 'remote');
      }

      // Fetch Matches
      const matchesRes = await fetch('/api/matches', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (matchesRes.ok) {
        const matchesData = await matchesRes.json();
        setMatches(matchesData.matches);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTweakSubmit = async () => {
    if (!profile) return;
    setLoading(true);
    
    const updatedProfile = {
      ...profile,
      workPreference,
      personality: {
        ...profile.personality,
        prefersSolo,
        prefersStructure,
        stressTolerance
      }
    };

    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedProfile)
      });
      
      const data = await res.json();
      if (res.ok) {
        setMatches(data.matches);
        setProfile(updatedProfile);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCV = async (jobId: string) => {
    setCvLoading(true);
    try {
      const res = await fetch('/api/resumes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ jobFamilyId: jobId })
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.requiresPremium) {
          setModalMessage('You have reached the Free Tier limit of 1 tailored CV.');
          setShowUpgradeModal(true);
        } else {
          alert(data.error || 'Failed to generate tailored CV.');
        }
        return;
      }

      setCurrentCv(data);
    } catch (err) {
      console.error(err);
      alert('Error generating CV.');
    } finally {
      setCvLoading(false);
    }
  };

  if (currentCv) {
    return (
      <CVGenerator 
        cv={currentCv} 
        onBack={() => setCurrentCv(null)} 
        token={token} 
      />
    );
  }

  return (
    <div className="fade-in">
      
      {/* Premium Upgrade Modal Dialog */}
      {showUpgradeModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(5, 8, 16, 0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' }}>
          <div className="glass-card" style={{ maxWidth: '500px', width: '90%', padding: '40px', textAlign: 'center', position: 'relative', border: '1px solid var(--border-color-hover)' }}>
            <Lock size={48} color="#8b5cf6" style={{ margin: '0 auto 20px' }} />
            <h2 style={{ fontSize: '1.75rem', marginBottom: '12px' }}>Unlock Pro Features</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '24px' }}>
              {modalMessage || 'Upgrade to generate unlimited tailored resumes, cover letters, and unlock secondary job listings.'}
            </p>
            <div style={{ background: 'rgba(139,92,246,0.05)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(139,92,246,0.1)', marginBottom: '30px', textAlign: 'left' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#fff', marginBottom: '8px' }}>Pro Unlock — $19.00</div>
              <ul style={{ fontSize: '0.85rem', color: '#94a3b8', paddingLeft: '16px' }}>
                <li style={{ marginBottom: '6px' }}>Unlimited custom resumes for all jobs</li>
                <li style={{ marginBottom: '6px' }}>Customizable cover letter generation</li>
                <li>Ongoing job search matching logic updates</li>
              </ul>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowUpgradeModal(false)}>
                Maybe Later
              </button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={onUpgrade}>
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Welcome banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem' }}>Your Strengths Dashboard</h1>
          <p style={{ color: '#94a3b8' }}>
            We've mapped your background parameters to matching career families below. Adjust sliders to tweak rankings.
          </p>
        </div>
        <button className="btn btn-secondary" onClick={onRetake}>
          <RefreshCw size={16} /> Retake Questionnaire
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '40px' }}>
        
        {/* LEFT COLUMN: Sidebar Filter Adjustments */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <Sliders size={18} color="#8b5cf6" /> Tweak Preferences
            </h3>

            {/* Work style slider */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Work Preference</label>
                <span style={{ fontSize: '0.8rem', color: '#8b5cf6' }}>{prefersSolo >= 4 ? 'Solo Focus' : prefersSolo <= 2 ? 'Team Focus' : 'Balanced'}</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="5" 
                className="form-control"
                value={prefersSolo}
                onChange={e => setPrefersSolo(parseInt(e.target.value))}
                style={{ accentColor: '#8b5cf6', padding: 0 }}
              />
            </div>

            {/* Environment structure */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Role Structure</label>
                <span style={{ fontSize: '0.8rem', color: '#8b5cf6' }}>{prefersStructure >= 4 ? 'Routine' : prefersStructure <= 2 ? 'Dynamic' : 'Medium'}</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="5" 
                className="form-control"
                value={prefersStructure}
                onChange={e => setPrefersStructure(parseInt(e.target.value))}
                style={{ accentColor: '#8b5cf6', padding: 0 }}
              />
            </div>

            {/* Stress Tolerance */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Stress Tolerance</label>
                <span style={{ fontSize: '0.8rem', color: '#8b5cf6' }}>Lvl {stressTolerance} / 5</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="5" 
                className="form-control"
                value={stressTolerance}
                onChange={e => setStressTolerance(parseInt(e.target.value))}
                style={{ accentColor: '#8b5cf6', padding: 0 }}
              />
            </div>

            {/* Location buttons */}
            <div className="form-group">
              <label className="form-label">Location Type</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['remote', 'hybrid', 'in_person'].map(pref => (
                  <button
                    key={pref}
                    className={`btn ${workPreference === pref ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ justifyContent: 'flex-start', padding: '8px 12px', fontSize: '0.85rem', textTransform: 'capitalize' }}
                    onClick={() => setWorkPreference(pref)}
                  >
                    {pref.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }} onClick={handleTweakSubmit}>
              Apply & Re-Score
            </button>
          </div>

          {/* Profile Quick Summary Card */}
          {profile && (
            <div className="glass-card" style={{ padding: '24px', background: 'rgba(255,255,255,0.01)' }}>
              <h4 style={{ fontSize: '1rem', color: '#fff', marginBottom: '12px' }}>Your Target Profile</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: '#94a3b8' }}>
                <div><strong>Name:</strong> {profile.name}</div>
                <div><strong>Location:</strong> {profile.location || 'Not Specified'}</div>
                <div>
                  <strong>Constraints:</strong> 
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                    {profile.constraints.length > 0 ? (
                      profile.constraints.map(c => <span key={c} style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem' }}>{c.replace('_', ' ')}</span>)
                    ) : (
                      <span>None</span>
                    )}
                  </div>
                </div>
                <div>
                  <strong>Extracted Hobbies:</strong>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                    {profile.hobbies.map(h => <span key={h} style={{ background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.1)', color: '#c084fc', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem' }}>{h}</span>)}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Matching Job Family List */}
        <div>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
              <div style={{ width: '30px', height: '30px', border: '3px solid rgba(139, 92, 246, 0.2)', borderTopColor: '#8b5cf6', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            </div>
          ) : matches.length === 0 ? (
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
              No matches found. Try widening your schedule selections or adjusting your stress and work style parameters.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {matches.map(job => {
                const isExpanded = expandedId === job.id;
                return (
                  <div 
                    key={job.id} 
                    className="glass-card" 
                    style={{ 
                      padding: '24px', 
                      borderColor: isExpanded ? 'var(--border-color-hover)' : 'var(--border-color)',
                      background: isExpanded ? 'var(--bg-glass-hover)' : 'var(--bg-glass)'
                    }}
                  >
                    
                    {/* Collapsed view header */}
                    <div 
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                      onClick={() => setExpandedId(isExpanded ? null : job.id)}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                          <h3 style={{ fontSize: '1.35rem', color: '#fff' }}>{job.title}</h3>
                          <span className="badge badge-info">{job.workType}</span>
                        </div>
                        <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '90%' }}>{job.description}</p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', paddingLeft: '20px' }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#a78bfa', fontFamily: 'var(--font-display)', lineHeight: '1.1' }}>
                            {job.score}%
                          </div>
                          <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Compatibility</span>
                        </div>
                        {isExpanded ? <ChevronUp size={20} color="#64748b" /> : <ChevronDown size={20} color="#64748b" />}
                      </div>
                    </div>

                    {/* Expanded details panel */}
                    {isExpanded && (
                      <div className="fade-in" style={{ marginTop: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '20px' }}>
                        
                        <div className="grid-2" style={{ marginBottom: '24px' }}>
                          <div>
                            <h4 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '8px', fontWeight: 600 }}>Why It Fits Your Background</h4>
                            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>{job.rationale}</p>
                          </div>
                          <div>
                            <h4 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '8px', fontWeight: 600 }}>Positioning Pitch Angle</h4>
                            <p style={{ fontSize: '0.85rem', color: '#c084fc', fontStyle: 'italic', lineHeight: 1.5 }}>"{job.pitchAngle}"</p>
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.15)', padding: '16px 20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.02)' }}>
                          <div style={{ display: 'flex', gap: '30px' }}>
                            <div>
                              <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', textTransform: 'uppercase' }}>Salary Indicator</span>
                              <strong style={{ fontSize: '1rem', color: '#fff' }}>{job.salaryRange}</strong>
                            </div>
                            <div>
                              <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', textTransform: 'uppercase' }}>Matching Skills</span>
                              <div style={{ display: 'flex', gap: '4px', marginTop: '4px', flexWrap: 'wrap' }}>
                                {job.matchingSkills.map(s => <span key={s} style={{ background: 'rgba(16, 185, 129, 0.08)', color: '#34d399', border: '1px solid rgba(16,185,129,0.15)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem' }}>{s}</span>)}
                                {job.matchingSkills.length === 0 && <span style={{ color: '#64748b', fontSize: '0.75rem' }}>None</span>}
                              </div>
                            </div>
                          </div>

                          <button 
                            className="btn btn-primary" 
                            style={{ fontSize: '0.85rem', padding: '10px 18px' }}
                            onClick={() => handleGenerateCV(job.id)}
                            disabled={cvLoading}
                          >
                            <FileSpreadsheet size={16} /> Generate Tailored CV
                          </button>
                        </div>

                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;



<!-- Stripe Checkout Block -->
<div id="stripe-checkout-cta" style="margin: 2rem auto; padding: 2rem; border-radius: 12px; background: rgba(59,130,246,0.05); border: 1px solid rgba(59,130,246,0.2); text-align: center; font-family: sans-serif; max-width: 600px;">
    <h3 style="margin-top: 0; color: #fff;">Activate Premium License</h3>
    <p style="color: #9ca3af; font-size: 0.95rem; margin-bottom: 1.5rem;">Get instant access to all advanced capabilities and integration features.</p>
    <a href="https://buy.stripe.com/6oU00lb2L6F37bIazv0RG0J" target="_blank" style="display: inline-block; padding: 0.8rem 2rem; background: #3b82f6; color: #fff; font-weight: bold; border-radius: 8px; text-decoration: none; transition: background 0.2s;">Unlock Now</a>
</div>
