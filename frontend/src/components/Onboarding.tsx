import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Sparkles, User, Briefcase, Heart, BookOpen, Clock, AlertTriangle, UploadCloud, HelpCircle } from 'lucide-react';

interface OnboardingProps {
  token: string;
  onSuccess: () => void;
}

interface JobHistory {
  title: string;
  employer: string;
  startDate: string;
  endDate: string;
  responsibilities: string;
}

function Onboarding({ token, onSuccess }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const totalSteps = 7;

  // --- QUESTIONNAIRE STATE ---
  const [name, setName] = useState('');
  const [ageRange, setAgeRange] = useState('30-39');
  const [location, setLocation] = useState('');
  const [workPreference, setWorkPreference] = useState('remote');
  
  // Constraints (Degree, Felony, License)
  const [constraints, setConstraints] = useState<string[]>([]);
  
  // Formal Background
  const [degreeType, setDegreeType] = useState('none');
  const [jobs, setJobs] = useState<JobHistory[]>([]);
  const [newJob, setNewJob] = useState<JobHistory>({ title: '', employer: '', startDate: '', endDate: '', responsibilities: '' });

  // Informal & Life Roles
  const [parentingCaregiving, setParentingCaregiving] = useState(false);
  const [militaryServed, setMilitaryServed] = useState(false);
  const [militaryBranch, setMilitaryBranch] = useState('');
  const [militaryRole, setMilitaryRole] = useState('');
  const [militaryYears, setMilitaryYears] = useState(4);
  const [communityRoles, setCommunityRoles] = useState<string[]>([]);

  // Hobbies & Interests
  const [hobbiesInput, setHobbiesInput] = useState('');
  const [hobbies, setHobbies] = useState<string[]>([]);

  // Personality
  const [prefersSolo, setPrefersSolo] = useState(3);
  const [prefersStructure, setPrefersStructure] = useState(3);
  const [stressTolerance, setStressTolerance] = useState(3);
  const [values, setValues] = useState<string[]>([]);

  // Constraints & Desires
  const [schedule, setSchedule] = useState<string[]>([]);
  const [incomeTarget, setIncomeTarget] = useState('50k-80k');
  const [dealBreakersInput, setDealBreakersInput] = useState('');
  const [dealBreakers, setDealBreakers] = useState<string[]>([]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // CV Upload & Clarifications State
  const [cvParsing, setCvParsing] = useState(false);
  const [cvParsedMessage, setCvParsedMessage] = useState('');
  const [clarificationQuestions, setClarificationQuestions] = useState<string[]>([]);
  const [clarificationAnswers, setClarificationAnswers] = useState<Record<string, string>>({});
  const [clarificationsLoading, setClarificationsLoading] = useState(false);

  // --- DEBUG LOAD BUTTONS FOR MOCK PERSONAS ---
  const loadRada = () => {
    setName('Rada');
    setAgeRange('30-39');
    setLocation('USA');
    setWorkPreference('in_person');
    setConstraints(['no_degree']);
    setDegreeType('none');
    setJobs([]);
    setParentingCaregiving(true);
    setMilitaryServed(true);
    setMilitaryBranch('USAF');
    setMilitaryRole('airman');
    setMilitaryYears(4);
    setCommunityRoles([]);
    setHobbies(['poetry', 'rock climbing', 'marathons', 'seamstress', 'vegan', 'crazy dancing', 'picnics']);
    setPrefersSolo(3);
    setPrefersStructure(3);
    setStressTolerance(4);
    setValues(['meaning', 'autonomy']);
    setSchedule(['flexible', 'weekends']);
    setIncomeTarget('30k-50k');
    setDealBreakers([]);
    setStep(6); // Jump directly to final review step
  };

  const loadSonny = () => {
    setName('Sonny');
    setAgeRange('50-59');
    setLocation('St. Louis, MO');
    setWorkPreference('remote');
    setConstraints(['felony', 'no_active_license']);
    setDegreeType('doctorate');
    setJobs([
      {
        title: 'Emergency Medicine Physician',
        employer: 'Barnes-Jewish Hospital',
        startDate: '2000',
        endDate: '2020',
        responsibilities: 'Provided rapid clinical diagnostics, emergency room triage, patient evaluation, documentation compliance reviews, and medical staff supervision.'
      }
    ]);
    setParentingCaregiving(true);
    setMilitaryServed(false);
    setMilitaryBranch('');
    setMilitaryRole('');
    setCommunityRoles(['teaching', 'communication']);
    setHobbies(['writing', 'vibe coding', 'Tibetan rites']);
    setPrefersSolo(4);
    setPrefersStructure(2);
    setStressTolerance(5);
    setValues(['meaning', 'stability', 'autonomy']);
    setSchedule(['weekdays']);
    setIncomeTarget('80k-120k');
    setDealBreakers(['no sales', 'no night shifts', 'no high-stress clinical work']);
    setStep(6); // Jump directly to final review step
  };

  // Helper arrays
  const valueOptions = [
    { id: 'money', label: 'Financial Security' },
    { id: 'meaning', label: 'Purpose & Community Impact' },
    { id: 'autonomy', label: 'Autonomy & Flexibility' },
    { id: 'stability', label: 'Stability & Routine' }
  ];

  const constraintOptions = [
    { id: 'no_degree', label: 'No College Degree' },
    { id: 'felony', label: 'Have a Criminal Record / Felony' },
    { id: 'no_active_license', label: 'No Active Professional Licensure (e.g. medical/nursing)' }
  ];

  const scheduleOptions = [
    { id: 'school_hours', label: 'School Hours (9 AM - 3 PM)' },
    { id: 'weekdays', label: 'Standard Weekdays' },
    { id: 'evenings', label: 'Evenings' },
    { id: 'weekends', label: 'Weekends' },
    { id: 'flexible', label: 'Flexible / Shift Work' }
  ];

  const handleCheckboxToggle = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, id: string) => {
    if (list.includes(id)) {
      setList(list.filter(item => item !== id));
    } else {
      setList([...list, id]);
    }
  };

  const addJob = () => {
    if (!newJob.title || !newJob.employer) return;
    setJobs([...jobs, newJob]);
    setNewJob({ title: '', employer: '', startDate: '', endDate: '', responsibilities: '' });
  };

  const removeJob = (idx: number) => {
    setJobs(jobs.filter((_, i) => i !== idx));
  };

  const handleAddHobby = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && hobbiesInput.trim()) {
      e.preventDefault();
      if (!hobbies.includes(hobbiesInput.trim().toLowerCase())) {
        setHobbies([...hobbies, hobbiesInput.trim().toLowerCase()]);
      }
      setHobbiesInput('');
    }
  };

  const handleAddDealBreaker = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && dealBreakersInput.trim()) {
      e.preventDefault();
      if (!dealBreakers.includes(dealBreakersInput.trim().toLowerCase())) {
        setDealBreakers([...dealBreakers, dealBreakersInput.trim().toLowerCase()]);
      }
      setDealBreakersInput('');
    }
  };

  const handleCVUpload = async (file: File) => {
    setCvParsing(true);
    setCvParsedMessage('');
    
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileText = e.target?.result as string;
        
        const res = await fetch('/api/profile/parse-cv', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ text: fileText || file.name })
        });
        
        if (!res.ok) {
          throw new Error('Failed to parse CV');
        }
        
        const data = await res.json();
        
        if (data.name) setName(data.name);
        if (data.location) setLocation(data.location);
        if (data.education && data.education.degreeType) setDegreeType(data.education.degreeType);
        if (Array.isArray(data.jobs)) setJobs(data.jobs);
        if (data.military) {
          setMilitaryServed(data.military.served || false);
          setMilitaryBranch(data.military.branch || '');
          setMilitaryRole(data.military.role || '');
          setMilitaryYears(data.military.years || 4);
        }
        if (Array.isArray(data.hobbies)) setHobbies(data.hobbies);
        if (Array.isArray(data.constraints)) setConstraints(data.constraints);
        
        setCvParsedMessage(`Successfully parsed CV for ${data.name || 'user'}! Onboarding fields have been pre-filled.`);
      };
      reader.readAsText(file);
    } catch (err: any) {
      console.error(err);
      setCvParsedMessage('Failed to parse document. Please fill in details manually.');
    } finally {
      setCvParsing(false);
    }
  };

  const fetchClarifications = async () => {
    if (hobbies.length === 0) {
      setClarificationQuestions([]);
      return;
    }
    setClarificationsLoading(true);
    try {
      const res = await fetch('/api/profile/clarifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ hobbies })
      });
      if (res.ok) {
        const data = await res.json();
        setClarificationQuestions(data.questions || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setClarificationsLoading(false);
    }
  };

  const handleSubmitProfile = async () => {
    setSaving(true);
    setError('');

    // Ensure degree constraints align with selection
    let updatedConstraints = [...constraints];
    if (degreeType === 'none' && !updatedConstraints.includes('no_degree')) {
      updatedConstraints.push('no_degree');
    }

    const payload = {
      name,
      ageRange,
      location,
      workPreference,
      constraints: updatedConstraints,
      education: { degreeType },
      jobs,
      military: { served: militaryServed, branch: militaryBranch, role: militaryRole, years: militaryYears },
      parentingCaregiving,
      communityRoles,
      hobbies,
      personality: { prefersSolo, prefersStructure, stressTolerance, values },
      schedule,
      incomeTarget,
      dealBreakers,
      clarifications: clarificationAnswers
    };

    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit questionnaire');
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const nextStep = async () => {
    if (step === 0 && !name) {
      alert('Please tell us your name before moving forward.');
      return;
    }
    if (step === 3) {
      await fetchClarifications();
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(Math.max(0, step - 1));

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Debug Header Cards */}
      <div className="glass-card" style={{ padding: '16px 24px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderColor: 'var(--border-color-hover)' }}>
        <div>
          <span style={{ fontSize: '0.85rem', color: '#8b5cf6', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} /> DEVELOPER SANDBOX QUICK-FILL
          </span>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '2px' }}>Autopopulate mock questionnaire data to verify scoring logic.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={loadRada}>
            Load Rada Profile
          </button>
          <button className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={loadSonny}>
            Load Sonny Profile
          </button>
        </div>
      </div>

      {/* Progress Metric */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.85rem', marginBottom: '8px' }}>
          <span>Questionnaire Progress</span>
          <span>Step {step + 1} of {totalSteps}</span>
        </div>
        <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ width: `${((step + 1) / totalSteps) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #8b5cf6, #6366f1)', transition: 'width 0.3s ease' }} />
        </div>
      </div>

      <div className="glass-card fade-in" style={{ padding: '40px' }}>
        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '12px', borderRadius: '8px', color: '#fca5a5', fontSize: '0.85rem', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        {/* STEP 0: Basic Info */}
        {step === 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <User size={28} color="#8b5cf6" />
              <h2 style={{ fontSize: '1.75rem' }}>Let's start with the basics</h2>
            </div>
            
            <div className="form-group">
              <label className="form-label">What should we call you?</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Name or nickname" 
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Age Range</label>
                <select className="form-control" value={ageRange} onChange={e => setAgeRange(e.target.value)}>
                  <option value="18-29">18 - 29</option>
                  <option value="30-39">30 - 39</option>
                  <option value="40-49">40 - 49</option>
                  <option value="50-59">50 - 59</option>
                  <option value="60+">60 or older</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Where do you live? (City, State)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. St. Louis, MO" 
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '10px' }}>
              <label className="form-label">Workplace Location Preference</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                {['remote', 'hybrid', 'in_person'].map(pref => (
                  <button 
                    key={pref}
                    type="button"
                    className={`btn ${workPreference === pref ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flex: 1, textTransform: 'capitalize' }}
                    onClick={() => setWorkPreference(pref)}
                  >
                    {pref.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 1: Formal Background */}
        {step === 1 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <Briefcase size={28} color="#8b5cf6" />
              <h2 style={{ fontSize: '1.75rem' }}>Your past work & studies</h2>
            </div>

            {/* CV Upload Section */}
            <div className="form-group" style={{ marginBottom: '32px' }}>
              <label className="form-label">Optional: Upload or Drag & Drop your CV / Resume</label>
              <div 
                onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = '#8b5cf6'; e.currentTarget.style.background = 'rgba(139, 92, 246, 0.05)'; }}
                onDragLeave={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.01)'; }}
                onDrop={async (e) => {
                  e.preventDefault();
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.01)';
                  const files = e.dataTransfer.files;
                  if (files && files.length > 0) {
                    await handleCVUpload(files[0]);
                  }
                }}
                onClick={() => document.getElementById('cv-file-input')?.click()}
                style={{
                  border: '2px dashed rgba(255, 255, 255, 0.15)',
                  borderRadius: '12px',
                  padding: '30px 20px',
                  textAlign: 'center',
                  background: 'rgba(255, 255, 255, 0.01)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <UploadCloud size={32} color="#8b5cf6" />
                <div>
                  <span style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>Drag and drop your CV here, or click to browse</span>
                  <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '4px' }}>Supports PDF, Word, RTF, JSON, or Plain Text. Even if it's years old, we can extract valuable hidden strengths!</p>
                </div>
                <input 
                  type="file" 
                  id="cv-file-input" 
                  accept=".txt,.pdf,.docx,.doc,.rtf,.json" 
                  style={{ display: 'none' }}
                  onChange={async (e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      await handleCVUpload(files[0]);
                    }
                  }}
                />
              </div>
              {cvParsing && (
                <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: '#a78bfa', fontSize: '0.85rem' }}>
                  <div style={{ width: '14px', height: '14px', border: '2px solid rgba(139, 92, 246, 0.2)', borderTopColor: '#8b5cf6', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  Analyzing CV and extracting hidden strengths...
                </div>
              )}
              {cvParsedMessage && (
                <div style={{ marginTop: '12px', color: '#10b981', fontSize: '0.85rem', fontWeight: 500 }}>
                  ✓ {cvParsedMessage}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Highest Education Attained</label>
              <select className="form-control" value={degreeType} onChange={e => setDegreeType(e.target.value)}>
                <option value="none">High School / No College Degree</option>
                <option value="associate">Associate's Degree or Certifications</option>
                <option value="bachelor">Bachelor's Degree</option>
                <option value="master">Master's Degree</option>
                <option value="doctorate">Doctorate or Advanced Professional (MD, JD, PhD)</option>
              </select>
            </div>

            <div style={{ marginTop: '30px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px' }}>
              <label className="form-label" style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Tell us about past jobs (Optional)</label>
              
              {/* Dynamic Job List */}
              {jobs.map((job, idx) => (
                <div key={idx} className="glass-card" style={{ padding: '16px', marginBottom: '16px', background: 'rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ color: '#fff' }}>{job.title}</h4>
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{job.employer} | {job.startDate} - {job.endDate}</span>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '6px' }}>{job.responsibilities}</p>
                  </div>
                  <button className="btn btn-danger" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => removeJob(idx)}>
                    Remove
                  </button>
                </div>
              ))}

              <div className="glass-card" style={{ padding: '20px', background: 'rgba(255,255,255,0.01)' }}>
                <h4 style={{ marginBottom: '12px', fontSize: '0.95rem' }}>Add a Role</h4>
                <div className="grid-2">
                  <input 
                    type="text" 
                    className="form-control form-group" 
                    placeholder="Job Title (e.g. Caregiver, Specialist)"
                    value={newJob.title}
                    onChange={e => setNewJob({ ...newJob, title: e.target.value })}
                  />
                  <input 
                    type="text" 
                    className="form-control form-group" 
                    placeholder="Employer / Company"
                    value={newJob.employer}
                    onChange={e => setNewJob({ ...newJob, employer: e.target.value })}
                  />
                </div>
                <div className="grid-2" style={{ marginTop: '-10px' }}>
                  <input 
                    type="text" 
                    className="form-control form-group" 
                    placeholder="Start Year (e.g. 2018)"
                    value={newJob.startDate}
                    onChange={e => setNewJob({ ...newJob, startDate: e.target.value })}
                  />
                  <input 
                    type="text" 
                    className="form-control form-group" 
                    placeholder="End Year (or Present)"
                    value={newJob.endDate}
                    onChange={e => setNewJob({ ...newJob, endDate: e.target.value })}
                  />
                </div>
                <textarea 
                  className="form-control" 
                  rows={2} 
                  placeholder="Key tasks / responsibilities (reframe your strengths here)"
                  value={newJob.responsibilities}
                  onChange={e => setNewJob({ ...newJob, responsibilities: e.target.value })}
                  style={{ resize: 'none', marginBottom: '12px' }}
                />
                <button type="button" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={addJob}>
                  + Add Experience Card
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Informal & Life Roles */}
        {step === 2 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <Heart size={28} color="#8b5cf6" />
              <h2 style={{ fontSize: '1.75rem' }}>Life experiences & community roles</h2>
            </div>

            <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '24px' }}>
              Many valuable coordination and management skills come from unpaid roles. Let's make sure they count.
            </p>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={parentingCaregiving}
                  onChange={e => setParentingCaregiving(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: '#8b5cf6' }}
                />
                <span>I have active Parenting or Caregiving responsibilities (e.g. kids, elderly, sick relatives)</span>
              </label>
            </div>

            <div className="form-group" style={{ marginTop: '24px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={militaryServed}
                  onChange={e => setMilitaryServed(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: '#8b5cf6' }}
                />
                <span>I served in the military (Army, USAF, Navy, Marines, etc.)</span>
              </label>

              {militaryServed && (
                <div className="glass-card fade-in" style={{ padding: '20px', marginTop: '16px', background: 'rgba(255,255,255,0.02)' }}>
                  <div className="grid-3">
                    <div>
                      <label className="form-label">Branch</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="e.g. USAF" 
                        value={militaryBranch}
                        onChange={e => setMilitaryBranch(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="form-label">Last Role</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="e.g. Airman" 
                        value={militaryRole}
                        onChange={e => setMilitaryRole(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="form-label">Years Served</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        value={militaryYears}
                        onChange={e => setMilitaryYears(parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="form-group" style={{ marginTop: '24px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
              <label className="form-label">Community Roles (Check all that apply)</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                {['Coaching Sports', 'Organizing Events', 'Teaching/Tutoring', 'Community Volunteering', 'Religious Leadership', 'Local Club Coordinator'].map(role => (
                  <button
                    key={role}
                    type="button"
                    className={`btn ${communityRoles.includes(role) ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.85rem', padding: '8px 12px' }}
                    onClick={() => handleCheckboxToggle(communityRoles, setCommunityRoles, role)}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Hobbies & Interests */}
        {step === 3 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <BookOpen size={28} color="#8b5cf6" />
              <h2 style={{ fontSize: '1.75rem' }}>Hobbies & Lifestyle Interests</h2>
            </div>
            
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '24px' }}>
              Hobbies build real competencies. Tell us what you like to do in your free time (e.g. writing, marathons, rock climbing, seamstress sewing, dog training, plant-based vegan diet).
            </p>

            <div className="form-group">
              <label className="form-label">Type a hobby and press Enter to save:</label>
              <input 
                type="text"
                className="form-control"
                placeholder="e.g. rock climbing, poetry, alterations, dog walking"
                value={hobbiesInput}
                onChange={e => setHobbiesInput(e.target.value)}
                onKeyDown={handleAddHobby}
              />
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
              {hobbies.map(hobby => (
                <span 
                  key={hobby} 
                  style={{ 
                    background: 'rgba(139, 92, 246, 0.12)', 
                    border: '1px solid rgba(139, 92, 246, 0.3)', 
                    padding: '6px 12px', 
                    borderRadius: '20px', 
                    fontSize: '0.85rem', 
                    color: '#c084fc', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    cursor: 'pointer' 
                  }}
                  onClick={() => setHobbies(hobbies.filter(h => h !== hobby))}
                >
                  {hobby} <span style={{ fontWeight: 'bold' }}>×</span>
                </span>
              ))}
              {hobbies.length === 0 && <span style={{ color: '#64748b', fontSize: '0.9rem' }}>No hobbies added yet. Type one above!</span>}
            </div>
          </div>
        )}

        {/* STEP 4: Hobby Clarification Questions */}
        {step === 4 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <HelpCircle size={28} color="#8b5cf6" />
              <h2 style={{ fontSize: '1.75rem' }}>Strengths Clarification</h2>
            </div>
            
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '24px' }}>
              We noticed some interesting hobbies in your profile. Clarifying these details helps us highlight specific credentials and hidden capabilities for target career paths.
            </p>

            {clarificationsLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 0', gap: '12px' }}>
                <div style={{ width: '30px', height: '30px', border: '2px solid rgba(139, 92, 246, 0.2)', borderTopColor: '#8b5cf6', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Analyzing hobbies...</span>
              </div>
            ) : clarificationQuestions.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', background: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                <p style={{ color: '#64748b', fontSize: '0.95rem' }}>No additional clarification needed for your listed hobbies! Click Next to proceed.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {clarificationQuestions.map((q, idx) => (
                  <div key={idx} className="glass-card" style={{ padding: '24px', background: 'rgba(255,255,255,0.01)', borderColor: 'rgba(139, 92, 246, 0.15)' }}>
                    <label className="form-label" style={{ fontSize: '1rem', color: '#fff', marginBottom: '12px', display: 'block' }}>
                      {q}
                    </label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. Yes, PADI certified / No / Specific ratings" 
                      value={clarificationAnswers[q] || ''}
                      onChange={e => setClarificationAnswers({
                        ...clarificationAnswers,
                        [q]: e.target.value
                      })}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 5: Personality & Preferences */}
        {step === 5 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <Heart size={28} color="#8b5cf6" />
              <h2 style={{ fontSize: '1.75rem' }}>Work Environment & Values</h2>
            </div>

            {/* Range Sliders */}
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label className="form-label">Work Style Preference</label>
                <span style={{ fontSize: '0.85rem', color: '#8b5cf6' }}>{prefersSolo === 1 ? 'Strong Team' : prefersSolo === 5 ? 'Strong Solo' : 'Balanced'}</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="5" 
                className="form-control"
                value={prefersSolo}
                onChange={e => setPrefersSolo(parseInt(e.target.value))}
                style={{ accentColor: '#8b5cf6', padding: '0' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                <span>Highly Collaborative</span>
                <span>Fully Independent</span>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label className="form-label">Environment Structure Preference</label>
                <span style={{ fontSize: '0.85rem', color: '#8b5cf6' }}>{prefersStructure === 1 ? 'Dynamic / Agile' : prefersStructure === 5 ? 'Highly Structured' : 'Medium'}</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="5" 
                className="form-control"
                value={prefersStructure}
                onChange={e => setPrefersStructure(parseInt(e.target.value))}
                style={{ accentColor: '#8b5cf6', padding: '0' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                <span>Flexible / Changing Roles</span>
                <span>Strict Checklists & Routines</span>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label className="form-label">Stress Tolerance Scale</label>
                <span style={{ fontSize: '0.85rem', color: '#8b5cf6' }}>Level {stressTolerance} / 5</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="5" 
                className="form-control"
                value={stressTolerance}
                onChange={e => setStressTolerance(parseInt(e.target.value))}
                style={{ accentColor: '#8b5cf6', padding: '0' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                <span>Low Stress / Quiet Environment</span>
                <span>Fast-Paced / Crisis Comfort</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">What do you value most in a job? (Select up to 3)</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                {valueOptions.map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`btn ${values.includes(opt.id) ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.9rem', justifyContent: 'flex-start', padding: '12px' }}
                    onClick={() => handleCheckboxToggle(values, setValues, opt.id)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Constraints & Desires */}
        {step === 6 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <Clock size={28} color="#8b5cf6" />
              <h2 style={{ fontSize: '1.75rem' }}>Constraints & Availability</h2>
            </div>

            <div className="form-group">
              <label className="form-label">Background & Credential Considerations (Optional, check if applicable)</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {constraintOptions.map(opt => (
                  <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', background: 'rgba(255,255,255,0.01)', padding: '12px', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                    <input 
                      type="checkbox"
                      checked={constraints.includes(opt.id)}
                      onChange={() => handleCheckboxToggle(constraints, setConstraints, opt.id)}
                      style={{ width: '18px', height: '18px', accentColor: '#8b5cf6' }}
                    />
                    <span style={{ fontSize: '0.9rem' }}>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '24px' }}>
              <label className="form-label">Available Work Hours</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {scheduleOptions.map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`btn ${schedule.includes(opt.id) ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.85rem' }}
                    onClick={() => handleCheckboxToggle(schedule, setSchedule, opt.id)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Income Target Range</label>
                <select className="form-control" value={incomeTarget} onChange={e => setIncomeTarget(e.target.value)}>
                  <option value="30k-50k">$30,000 - $50,000</option>
                  <option value="50k-80k">$50,000 - $80,000</option>
                  <option value="80k-120k">$80,000 - $120,000</option>
                  <option value="120k+">$120,000+</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Deal-Breakers (e.g. no night shifts, no sales)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Type a breaker and press Enter"
                  value={dealBreakersInput}
                  onChange={e => setDealBreakersInput(e.target.value)}
                  onKeyDown={handleAddDealBreaker}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
              {dealBreakers.map(breaker => (
                <span 
                  key={breaker} 
                  style={{ 
                    background: 'rgba(239, 68, 68, 0.1)', 
                    border: '1px solid rgba(239, 68, 68, 0.3)', 
                    padding: '6px 12px', 
                    borderRadius: '20px', 
                    fontSize: '0.85rem', 
                    color: '#fca5a5', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    cursor: 'pointer' 
                  }}
                  onClick={() => setDealBreakers(dealBreakers.filter(d => d !== breaker))}
                >
                  {breaker} <span style={{ fontWeight: 'bold' }}>×</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px' }}>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={prevStep}
            disabled={step === 0}
            style={{ opacity: step === 0 ? 0.4 : 1, cursor: step === 0 ? 'not-allowed' : 'pointer' }}
          >
            <ChevronLeft size={16} /> Back
          </button>

          {step < totalSteps - 1 ? (
            <button type="button" className="btn btn-primary" onClick={nextStep}>
              Next Section <ChevronRight size={16} />
            </button>
          ) : (
            <button 
              type="button" 
              className="btn btn-primary" 
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.4)' }}
              onClick={handleSubmitProfile}
              disabled={saving}
            >
              {saving ? 'Analyzing Profiles...' : 'Calculate Strengths & Matches'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Onboarding;
