import React, { useState, useEffect } from 'react';
import { Sparkles, LogOut, ArrowRight, User, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Onboarding from './components/Onboarding.tsx';
import Dashboard from './components/Dashboard.tsx';
import EmployerProfileOnboarding from './components/EmployerProfileOnboarding.tsx';
import EmployerDashboard from './components/EmployerDashboard.tsx';

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<{ id: string; email: string; isPremium: number; role: 'jobseeker' | 'employer' } | null>(null);
  const [hasProfile, setHasProfile] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [route, setRoute] = useState<string>('home'); // home, auth, onboarding, dashboard, employerOnboarding, employerDashboard
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  
  // Auth Form State
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [selectedRole, setSelectedRole] = useState<'jobseeker' | 'employer'>('jobseeker');
  const [authError, setAuthError] = useState('');
  
  // Payment Alert Banner state
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    // Check payment callbacks
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success') {
      setPaymentSuccess(true);
      // Clean URL params
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchUserAndProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUserAndProfile = async () => {
    try {
      setLoading(true);
      // 1. Get Me info
      const userRes = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!userRes.ok) {
        throw new Error('Session expired');
      }
      const userData = await userRes.json();
      setUser(userData);

      const userRole = userData.role || 'jobseeker';

      if (userRole === 'employer') {
        // 2. Get Employer Profile info
        const profileRes = await fetch('/api/employer/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (profileRes.ok) {
          setHasProfile(true);
          setRoute('employerDashboard');
        } else {
          setHasProfile(false);
          setRoute('employerOnboarding');
        }
      } else {
        // 2. Get Jobseeker Profile info
        const profileRes = await fetch('/api/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (profileRes.ok) {
          setHasProfile(true);
          setRoute('dashboard');
        } else {
          setHasProfile(false);
          setRoute('onboarding');
        }
      }
    } catch (err) {
      console.error(err);
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setHasProfile(false);
    setRoute('home');
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const url = authMode === 'register' ? '/api/auth/register' : '/api/auth/login';
    
    try {
      const payload: any = { email: emailInput, password: passwordInput };
      if (authMode === 'register') {
        payload.role = selectedRole;
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }
      
      localStorage.setItem('token', data.token);
      setToken(data.token);
    } catch (err: any) {
      setAuthError(err.message);
    }
  };

  const handleUpgrade = async () => {
    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to initiate Stripe Checkout Session.');
      }
    } catch (err) {
      console.error(err);
      alert('Stripe error occured.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Payment Banner */}
      {paymentSuccess && (
        <div style={{
          background: 'linear-gradient(90deg, #10b981, #059669)',
          color: '#fff',
          padding: '12px 24px',
          textAlign: 'center',
          fontWeight: 600,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px'
        }}>
          <CheckCircle2 size={18} />
          Payment Successful! Your Hidden Strengths Pro features have been fully unlocked.
          <button 
            onClick={() => setPaymentSuccess(false)}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#fff', 
              marginLeft: '20px', 
              cursor: 'pointer',
              textDecoration: 'underline',
              fontWeight: 'normal'
            }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Navigation Header */}
      <header className="container">
        <nav className="navbar">
          <div className="navbar-brand" style={{ cursor: 'pointer' }} onClick={() => setRoute(token ? (user?.role === 'employer' ? 'employerDashboard' : 'dashboard') : 'home')}>
            <Sparkles size={26} color="#8b5cf6" />
            <span>Hidden Strengths</span>
          </div>
 
           <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
             {token && user ? (
               <>
                 <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                   <User size={16} color="#94a3b8" />
                   <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>{user.email}</span>
                   {user.role === 'employer' ? (
                     <span className="badge badge-info" style={{ marginLeft: '6px' }}>Employer</span>
                   ) : user.isPremium ? (
                     <span className="badge badge-success" style={{ marginLeft: '6px' }}>Pro</span>
                   ) : (
                     <button className="badge badge-info" style={{ marginLeft: '6px', cursor: 'pointer' }} onClick={handleUpgrade}>
                       Free (Upgrade)
                     </button>
                   )}
                 </div>
                 {hasProfile && user?.role === 'jobseeker' && (
                   <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }} onClick={() => setRoute('onboarding')}>
                     Retake Scan
                   </button>
                 )}
                <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.85rem' }} onClick={handleLogout}>
                  <LogOut size={14} /> Log Out
                </button>
              </>
            ) : (
              route !== 'auth' && (
                <button className="btn btn-primary" onClick={() => { setAuthMode('login'); setRoute('auth'); }}>
                  Sign In
                </button>
              )
            )}
          </div>
        </nav>
      </header>

      {/* Primary Page Layout router */}
      <main className="container" style={{ flex: 1, paddingBottom: '60px' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '40px', height: '40px', border: '3px solid rgba(139, 92, 246, 0.2)', borderTopColor: '#8b5cf6', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              <p style={{ color: '#94a3b8' }}>Loading Hidden Strengths Engine...</p>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : route === 'home' ? (
          <div className="fade-in" style={{ padding: '60px 0', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '24px', fontFamily: 'var(--font-display)' }}>
              Discover your <span style={{ background: 'linear-gradient(135deg, #a78bfa, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>hidden strengths</span>.
            </h1>
            <p style={{ fontSize: '1.25rem', color: '#94a3b8', marginBottom: '40px', lineHeight: 1.6 }}>
              This is not a traditional job board. Hidden Strengths is a strengths-mapping engine designed to translate your hobbies, caregiving, military background, and life skills into realistic, fulfilling career paths.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '60px' }}>
              <button className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem' }} onClick={() => {
                if (token) {
                  setRoute(hasProfile ? (user?.role === 'employer' ? 'employerDashboard' : 'dashboard') : 'onboarding');
                } else {
                  setAuthMode('register');
                  setSelectedRole('jobseeker');
                  setRoute('auth');
                }
              }}>
                Start the Strengths Scan <ArrowRight size={18} />
              </button>

              <button className="btn btn-secondary" style={{ padding: '16px 32px', fontSize: '1.1rem', borderColor: 'rgba(139, 92, 246, 0.4)' }} onClick={() => {
                  if (token) {
                    setRoute(hasProfile ? (user?.role === 'employer' ? 'employerDashboard' : 'dashboard') : 'employerOnboarding');
                  } else {
                    setAuthMode('register');
                    setSelectedRole('employer');
                    setRoute('auth');
                  }
                }}
                aria-label="I am Hiring/Employer Portal">
                  I am Hiring/Employer Portal
                </button>
            </div>

            <div className="grid-3" style={{ textAlign: 'left', marginTop: '40px' }}>
              <div className="glass-card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>For Job Seekers</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>We analyze your military service codes, caregiving, volunteering, and sports interests to map direct civilian career matches.</p>
              </div>
              <div className="glass-card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>For Employers</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Search vetted talent pools based on demonstrated capabilities, hobbies, and certifications, bypassing standard credential gaps.</p>
              </div>
              <div className="glass-card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>Custom CV Reframing</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Generate custom CV positioning paragraphs and summaries detailing your hidden capabilities for modern recruiters.</p>
              </div>
            </div>
          </div>
        ) : route === 'auth' ? (
          <div className="fade-in" style={{ maxWidth: '450px', margin: '60px auto' }}>
            <div className="glass-card" style={{ padding: '40px' }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '8px', textAlign: 'center' }}>
                {authMode === 'register' ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p style={{ color: '#94a3b8', textAlign: 'center', marginBottom: '30px', fontSize: '0.9rem' }}>
                {authMode === 'register' ? 'Discover and map non-degree career paths.' : 'Access your dashboard and generated resumes.'}
              </p>

              {authError && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '12px', borderRadius: '8px', color: '#fca5a5', fontSize: '0.85rem', marginBottom: '20px' }}>
                  {authError}
                </div>
              )}

              <form onSubmit={handleAuthSubmit}>
                {authMode === 'register' && (
                  <div className="form-group" style={{ marginBottom: '24px' }}>
                    <label className="form-label">I want to use the platform as a:</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        type="button"
                        className={`btn ${selectedRole === 'jobseeker' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ flex: 1, padding: '10px', fontSize: '0.95rem', justifyContent: 'center' }}
                        onClick={() => setSelectedRole('jobseeker')}
                      >
                        Job Seeker
                      </button>
                      <button
                        type="button"
                        className={`btn ${selectedRole === 'employer' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ flex: 1, padding: '10px', fontSize: '0.95rem', justifyContent: 'center' }}
                        onClick={() => setSelectedRole('employer')}
                      >
                        Hiring Manager
                      </button>
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    placeholder="name@domain.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    placeholder="••••••••"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '10px' }}>
                  {authMode === 'register' ? 'Sign Up & Continue' : 'Sign In'}
                </button>
              </form>

              <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: '#94a3b8' }}>
                {authMode === 'register' ? (
                  <span>Already have an account? <a href="#" style={{ color: '#8b5cf6', textDecoration: 'none' }} onClick={() => setAuthMode('login')}>Sign In</a></span>
                ) : (
                  <span>Don't have an account? <a href="#" style={{ color: '#8b5cf6', textDecoration: 'none' }} onClick={() => setAuthMode('register')}>Sign Up</a></span>
                )}
              </div>
            </div>
          </div>
        ) : route === 'onboarding' ? (
          <Onboarding 
            token={token!} 
            onSuccess={() => {
              setHasProfile(true);
              setRoute('dashboard');
            }} 
          />
        ) : route === 'dashboard' ? (
          <Dashboard 
            token={token!} 
            isPremium={user?.isPremium === 1}
            onUpgrade={handleUpgrade}
            onRetake={() => setRoute('onboarding')}
          />
        ) : route === 'employerOnboarding' ? (
          <EmployerProfileOnboarding 
            token={token!} 
            onSuccess={() => {
              setHasProfile(true);
              setRoute('employerDashboard');
            }}
          />
        ) : route === 'employerDashboard' ? (
          <EmployerDashboard 
            token={token!} 
            onLogout={handleLogout}
          />
        ) : null}
      </main>

      <footer style={{ padding: '30px 0', borderTop: '1px solid rgba(255, 255, 255, 0.05)', marginTop: '60px', color: '#64748b', fontSize: '0.85rem' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>© {new Date().getFullYear()} Hidden Strengths Engine. Designed for diverse career backgrounds.</div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="#" style={{ color: '#64748b', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#" style={{ color: '#64748b', textDecoration: 'none' }}>Terms of Use</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
