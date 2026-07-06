import React, { useState } from 'react';
import { Briefcase, Building, ChevronRight, Sparkles } from 'lucide-react';

interface EmployerProfileOnboardingProps {
  token: string;
  onSuccess: () => void;
}

function EmployerProfileOnboarding({ token, onSuccess }: EmployerProfileOnboardingProps) {
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [hiringNeeds, setHiringNeeds] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName) {
      setError('Company Name is required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/employer/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ companyName, industry, hiringNeeds })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save employer profile');
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fade-in" style={{ maxWidth: '600px', margin: '40px auto' }}>
      <div className="glass-card" style={{ padding: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <Building size={32} color="#8b5cf6" />
          <div>
            <h2 style={{ fontSize: '1.8rem', color: '#fff', margin: 0 }}>Hiring Manager Profile</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '4px 0 0' }}>Configure your hiring context to match talent pools.</p>
          </div>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '12px', borderRadius: '8px', color: '#fca5a5', fontSize: '0.85rem', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label">Company Name</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. Acme Health Solutions" 
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label">Industry Sector</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. Healthcare / Logistics / Tech" 
              value={industry}
              onChange={e => setIndustry(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '30px' }}>
            <label className="form-label">Primary Talent / Hiring Needs</label>
            <textarea 
              className="form-control" 
              rows={4}
              placeholder="e.g. Looking for detail-oriented analysts, administrative advisors, clinical compliance reviewers, or hands-on operations specialists..." 
              value={hiringNeeds}
              onChange={e => setHiringNeeds(e.target.value)}
              style={{ resize: 'vertical' }}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '12px', justifyContent: 'center' }}
            disabled={saving}
          >
            {saving ? 'Creating Account...' : 'Continue to Hiring Dashboard'} <ChevronRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default EmployerProfileOnboarding;



<!-- Stripe Checkout Block -->
<div id="stripe-checkout-cta" style="margin: 2rem auto; padding: 2rem; border-radius: 12px; background: rgba(59,130,246,0.05); border: 1px solid rgba(59,130,246,0.2); text-align: center; font-family: sans-serif; max-width: 600px;">
    <h3 style="margin-top: 0; color: #fff;">Activate Premium License</h3>
    <p style="color: #9ca3af; font-size: 0.95rem; margin-bottom: 1.5rem;">Get instant access to all advanced capabilities and integration features.</p>
    <a href="https://buy.stripe.com/6oU00lb2L6F37bIazv0RG0J" target="_blank" style="display: inline-block; padding: 0.8rem 2rem; background: #3b82f6; color: #fff; font-weight: bold; border-radius: 8px; text-decoration: none; transition: background 0.2s;">Unlock Now</a>
</div>
