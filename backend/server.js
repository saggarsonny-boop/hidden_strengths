import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import Stripe from 'stripe';
import { query } from './database.js';
import { calculateMatches, JOB_FAMILIES } from './matchingEngine.js';
import { generateTailoredResume } from './resumeGenerator.js';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'hidden_strengths_secret_jwt_key_2026';

// Initialize Stripe (fallback to mock if key is missing)
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
let stripe = null;
if (stripeSecretKey) {
  try {
    stripe = new Stripe(stripeSecretKey);
    console.log('Stripe SDK initialized successfully.');
  } catch (err) {
    console.error('Failed to initialize Stripe SDK:', err.message);
  }
} else {
  console.log('No STRIPE_SECRET_KEY found. Running Stripe in Mock Mode.');
}

// Enable CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// --- STRIPE WEBHOOK ROUTE (Must be declared BEFORE express.json()) ---
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  let event;

  if (stripe && sig && endpointSecret) {
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  } else {
    // Mock Webhook behavior for local testing if Stripe setup isn't complete
    console.log('Mock Webhook or Unverified webhook triggered.');
    try {
      const payload = JSON.parse(req.body.toString());
      event = {
        type: payload.type || 'checkout.session.completed',
        data: payload.data || { object: { client_reference_id: payload.userId || 'test_user_id' } }
      };
    } catch (e) {
      return res.status(400).send('Invalid JSON payload');
    }
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.client_reference_id;

    if (userId) {
      try {
        await query.run('UPDATE users SET is_premium = 1 WHERE id = ?', [userId]);
        console.log(`User ${userId} successfully upgraded to Premium via Stripe Checkout!`);
      } catch (err) {
        console.error('Failed to update user premium status in database:', err.message);
      }
    } else {
      console.warn('Stripe checkout completed session does not contain client_reference_id.');
    }
  }

  res.json({ received: true });
});

// Use standard JSON body parsing for all other routes
app.use(express.json());

// --- JWT MIDDLEWARE ---
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = decoded;
    next();
  });
}

// --- AUTHENTICATION ROUTES ---

// 1. Register User
app.post('/api/auth/register', async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const userRole = role === 'employer' ? 'employer' : 'jobseeker';

  try {
    const existingUser = await query.get('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const userId = 'usr_' + Math.random().toString(36).substr(2, 9);
    const passwordHash = await bcrypt.hash(password, 10);

    await query.run(
      'INSERT INTO users (id, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [userId, email.toLowerCase().trim(), passwordHash, userRole]
    );

    const token = jwt.sign({ id: userId, email, role: userRole }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, userId, isPremium: 0, role: userRole });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Login User
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await query.get('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role || 'jobseeker' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, userId: user.id, isPremium: user.is_premium, role: user.role || 'jobseeker' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Get Current User info
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await query.get('SELECT id, email, is_premium, role FROM users WHERE id = ?', [req.user.id]);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ id: user.id, email: user.email, isPremium: user.is_premium, role: user.role || 'jobseeker' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- CV PARSING & AI SUPPORT HELPERS ---

const CLARIFICATION_RULES = {
  "scuba diving": "Are you PADI or NAUI certified? What is your maximum depth comfort?",
  "scuba": "Are you PADI or NAUI certified? What is your maximum depth comfort?",
  "flying": "Do you hold a private pilot license (PPL) or commercial license? Any specific ratings (Instrument, Multi-engine)?",
  "aviation": "Do you hold a private pilot license (PPL) or commercial license? Any specific ratings (Instrument, Multi-engine)?",
  "rock climbing": "Do you primarily climb indoor, sport lead, or traditional outdoor? Are you belay certified?",
  "climbing": "Do you primarily climb indoor, sport lead, or traditional outdoor? Are you belay certified?",
  "sewing": "Do you specialize in alterations, pattern making, or custom garment construction?",
  "alterations": "Do you specialize in alterations, pattern making, or custom garment construction?",
  "seamstress": "Do you specialize in alterations, pattern making, or custom garment construction?",
  "marathons": "Have you organized or completed ultra-marathons, trail runs, or standard road races?",
  "running": "Have you organized or completed ultra-marathons, trail runs, or standard road races?",
  "dog training": "Do you have experience with specific breeds, reactive dogs, or obedience certifications?",
  "dog walking": "Do you have experience with specific breeds, reactive dogs, or obedience certifications?",
  "writing": "Do you write technical documentation, medical articles, creative fiction, or blog posts?",
  "poetry": "Do you write technical documentation, medical articles, creative fiction, or blog posts?",
  "vibe coding": "What AI coding assistants (Cursor, Copilot, ChatGPT) do you use? Any specific languages or frameworks?",
  "programming": "What AI coding assistants (Cursor, Copilot, ChatGPT) do you use? Any specific languages or frameworks?"
};

async function parseCVWithAI(cvText, apiKey) {
  const model = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6';
  const prompt = `Analyze this resume and extract the following details into a JSON structure:
- name (string: full name of the candidate)
- location (string: city, state or country)
- education (object: { degreeType: 'none' | 'associate' | 'bachelor' | 'master' | 'doctorate' })
- jobs (array of objects: { title, employer, startDate, endDate, responsibilities })
- military (object: { served: boolean, branch: string, role: string, years: number })
- hobbies (array of strings: extract sports, hobbies, or personal interests mentioned)
- constraints (array of strings: e.g. "felony" if a criminal record is mentioned, "no_degree" if no degree is listed, "no_active_license" if licensing constraints are mentioned)
- seeminglyUselessFacts (array of strings: extract interesting trivia, certifications, or random facts about this candidate that might represent hidden strengths)

Resume Text:
"""
${cvText}
"""

Respond ONLY with raw valid JSON matching this schema, no markdown wrapping, no introductory or concluding text.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: model,
      max_tokens: 2500,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Anthropic API error: ${errText}`);
  }

  const resData = await response.json();
  const text = resData.content[0].text.trim();
  let cleanText = text;
  if (cleanText.startsWith('```')) {
    cleanText = cleanText.replace(/^```json\s*/, '').replace(/```$/, '').trim();
  }
  return JSON.parse(cleanText);
}

function parseCVFallback(cvText) {
  const text = cvText || '';
  const nameMatch = text.match(/^([A-Z][a-z]+(?:[ \t]+[A-Z][a-z]+){1,2})/);
  const name = nameMatch ? nameMatch[1] : 'Job Seeker';
  
  let location = '';
  const locMatch = text.match(/\b([A-Za-z \t]+,\s*[A-Z]{2})\b/);
  if (locMatch) {
    location = locMatch[1];
  }

  let degreeType = 'none';
  if (/\b(MD|MD\b|Doctor of Medicine|Flight Surgeon)\b/i.test(text)) degreeType = 'doctorate';
  else if (/\b(PhD|JD|doctorate)\b/i.test(text)) degreeType = 'doctorate';
  else if (/\b(Master|MS\b|MA\b|MBA|MPH)\b/i.test(text)) degreeType = 'master';
  else if (/\b(Bachelor|BS\b|BA\b|BSc)\b/i.test(text)) degreeType = 'bachelor';
  else if (/\b(Associate|certification|cert)\b/i.test(text)) degreeType = 'associate';

  const hobbies = [];
  const commonHobbies = [
    { term: 'climbing', label: 'rock climbing' },
    { term: 'marathon', label: 'marathons' },
    { term: 'running', label: 'running' },
    { term: 'cyclist', label: 'cycling' },
    { term: 'sewing', label: 'sewing' },
    { term: 'seamstress', label: 'sewing' },
    { term: 'poetry', label: 'poetry' },
    { term: 'writing', label: 'writing' },
    { term: 'dog', label: 'dog training' },
    { term: 'scuba', label: 'scuba diving' },
    { term: 'aviation', label: 'aviation' },
    { term: 'flying', label: 'aviation' },
    { term: 'vibe coding', label: 'vibe coding' },
    { term: 'coding', label: 'programming' }
  ];
  commonHobbies.forEach(h => {
    if (new RegExp(`\\b${h.term}\\b`, 'i').test(text)) {
      hobbies.push(h.label);
    }
  });

  const hasMilitary = /\b(military|army|usaf|navy|marines|coast guard|served|soldier|officer|surgeon)\b/i.test(text);
  let branch = '';
  if (/\b(army)\b/i.test(text)) branch = 'Army';
  else if (/\b(usaf|air force)\b/i.test(text)) branch = 'USAF';
  else if (/\b(navy)\b/i.test(text)) branch = 'Navy';
  else if (/\b(marines|marine corps)\b/i.test(text)) branch = 'Marines';

  const jobs = [];
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  let currentJob = null;
  lines.forEach(line => {
    if (/\b(physician|surgeon|manager|analyst|developer|specialist|coordinator|assistant|guide|coach|engineer)\b/i.test(line) && line.length < 100) {
      if (currentJob) jobs.push(currentJob);
      currentJob = {
        title: line,
        employer: 'Experience Source',
        startDate: 'Past',
        endDate: 'Present',
        responsibilities: ''
      };
    } else if (currentJob && line.length > 20 && currentJob.responsibilities.length < 500) {
      currentJob.responsibilities += (currentJob.responsibilities ? ' ' : '') + line;
    }
  });
  if (currentJob) jobs.push(currentJob);

  const seeminglyUselessFacts = [];
  if (/\bscuba\b/i.test(text)) seeminglyUselessFacts.push("Loves underwater exploration and scuba diving.");
  if (/\b(pilot|flying|aviation)\b/i.test(text)) seeminglyUselessFacts.push("Fascinated by flight dynamics and private piloting.");
  if (/\b(cyclist|marathon|running)\b/i.test(text)) seeminglyUselessFacts.push("Committed to long-endurance athletics.");
  if (/\b(sewing|alterations|craft)\b/i.test(text)) seeminglyUselessFacts.push("Active in garment construction and fabric tailoring.");
  if (/\b(vegan|plant-based)\b/i.test(text)) seeminglyUselessFacts.push("Practices clean plant-based meal planning.");

  const constraints = [];
  if (degreeType === 'none') constraints.push('no_degree');
  if (/\b(felon|felony|record|misdemeanor|prosecut|kickback|convict)\b/i.test(text)) constraints.push('felony');
  if (/\b(no active license|unlicensed|expired license)\b/i.test(text)) constraints.push('no_active_license');

  return {
    name,
    location,
    education: { degreeType },
    jobs: jobs.slice(0, 3),
    military: { served: hasMilitary, branch, role: hasMilitary ? 'Veteran' : '', years: 4 },
    hobbies,
    constraints,
    seeminglyUselessFacts
  };
}

async function generateClarificationsWithAI(hobbies, apiKey) {
  const model = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6';
  const prompt = `Based on the following hobbies: ${JSON.stringify(hobbies)}, generate up to 5 clear, brief, single-sentence clarification questions (e.g. asking if they are PADI certified for scuba diving, or if they have specific licenses/ratings for aviation).
Respond ONLY with a JSON array of strings: ["question 1", "question 2", ...], no markdown blocks, no introductory text.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: model,
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    throw new Error('Failed to generate clarifications via Claude');
  }
  const resData = await response.json();
  const text = resData.content[0].text.trim();
  let cleanText = text;
  if (cleanText.startsWith('```')) {
    cleanText = cleanText.replace(/^```json\s*/, '').replace(/```$/, '').trim();
  }
  return JSON.parse(cleanText);
}

function generateClarificationsFallback(hobbies) {
  const questions = [];
  hobbies.forEach(hobby => {
    const h = hobby.toLowerCase();
    Object.keys(CLARIFICATION_RULES).forEach(key => {
      if (h.includes(key) && !questions.includes(CLARIFICATION_RULES[key])) {
        questions.push(CLARIFICATION_RULES[key]);
      }
    });
  });
  return questions.slice(0, 5);
}

// Parse CV Text Route
app.post('/api/profile/parse-cv', authenticateToken, async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'CV text content is required' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY || '';

  try {
    if (apiKey) {
      console.log('Parsing CV via Anthropic Claude API...');
      const parsed = await parseCVWithAI(text, apiKey);
      return res.json(parsed);
    } else {
      console.log('No ANTHROPIC_API_KEY. Using local regex CV parser...');
      const parsed = parseCVFallback(text);
      return res.json(parsed);
    }
  } catch (err) {
    console.error('CV Parsing failed, using local fallback:', err.message);
    const parsed = parseCVFallback(text);
    return res.json(parsed);
  }
});

// Get Hobby Clarification Questions Route
app.post('/api/profile/clarifications', authenticateToken, async (req, res) => {
  const { hobbies } = req.body;
  if (!Array.isArray(hobbies)) {
    return res.status(400).json({ error: 'Hobbies array is required' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY || '';

  try {
    if (apiKey && hobbies.length > 0) {
      console.log('Generating clarifications via Anthropic Claude API...');
      const questions = await generateClarificationsWithAI(hobbies, apiKey);
      return res.json({ questions });
    } else {
      console.log('Using local rule-based clarifications...');
      const questions = generateClarificationsFallback(hobbies);
      return res.json({ questions });
    }
  } catch (err) {
    console.error('Clarification generation failed, using local fallback:', err.message);
    const questions = generateClarificationsFallback(hobbies);
    return res.json({ questions });
  }
});

// --- QUESTIONNAIRE & PROFILE ROUTES ---

// 1. Get User Questionnaire Profile
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const profile = await query.get('SELECT * FROM profiles WHERE user_id = ?', [req.user.id]);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Parse JSON text blocks back to structures
    res.json({
      name: profile.name,
      ageRange: profile.age_range,
      location: profile.location,
      workPreference: profile.work_preference,
      constraints: JSON.parse(profile.constraints || '[]'),
      education: JSON.parse(profile.education || '{}'),
      jobs: JSON.parse(profile.jobs || '[]'),
      military: JSON.parse(profile.military || '{"served":false}'),
      parentingCaregiving: profile.parenting_caregiving === 1,
      communityRoles: JSON.parse(profile.community_roles || '[]'),
      hobbies: JSON.parse(profile.hobbies || '[]'),
      personality: JSON.parse(profile.personality || '{}'),
      schedule: JSON.parse(profile.schedule || '[]'),
      incomeTarget: profile.income_target,
      dealBreakers: JSON.parse(profile.deal_breakers || '[]'),
      clarifications: JSON.parse(profile.clarifications || '{}')
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Save / Update User Profile
app.post('/api/profile', authenticateToken, async (req, res) => {
  const p = req.body;
  if (!p.name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    const sql = `
      INSERT INTO profiles (
        user_id, name, age_range, location, work_preference, constraints,
        education, jobs, military, parenting_caregiving, community_roles,
        hobbies, personality, schedule, income_target, deal_breakers, clarifications, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id) DO UPDATE SET
        name=excluded.name, age_range=excluded.age_range, location=excluded.location,
        work_preference=excluded.work_preference, constraints=excluded.constraints,
        education=excluded.education, jobs=excluded.jobs, military=excluded.military,
        parenting_caregiving=excluded.parenting_caregiving, community_roles=excluded.community_roles,
        hobbies=excluded.hobbies, personality=excluded.personality, schedule=excluded.schedule,
        income_target=excluded.income_target, deal_breakers=excluded.deal_breakers, 
        clarifications=excluded.clarifications, updated_at=CURRENT_TIMESTAMP
    `;

    await query.run(sql, [
      req.user.id,
      p.name,
      p.ageRange || '',
      p.location || '',
      p.workPreference || 'remote',
      JSON.stringify(p.constraints || []),
      JSON.stringify(p.education || {}),
      JSON.stringify(p.jobs || []),
      JSON.stringify(p.military || { served: false }),
      p.parentingCaregiving ? 1 : 0,
      JSON.stringify(p.communityRoles || []),
      JSON.stringify(p.hobbies || []),
      JSON.stringify(p.personality || {}),
      JSON.stringify(p.schedule || []),
      p.incomeTarget || '',
      JSON.stringify(p.dealBreakers || []),
      JSON.stringify(p.clarifications || {})
    ]);

    // Re-evaluate matching jobs
    const fullProfile = await query.get('SELECT * FROM profiles WHERE user_id = ?', [req.user.id]);
    const matches = calculateMatches(fullProfile);

    res.json({ message: 'Profile saved successfully', matches });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- MATCHING ENGINE ROUTE ---

// Get Matched Job Families based on saved profile
app.get('/api/matches', authenticateToken, async (req, res) => {
  try {
    const profile = await query.get('SELECT * FROM profiles WHERE user_id = ?', [req.user.id]);
    if (!profile) {
      return res.status(404).json({ error: 'Please complete onboarding questionnaire first' });
    }

    const matches = calculateMatches(profile);
    res.json({ matches });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- TAILORED RESUME GENERATOR ROUTES ---

// 1. Get saved resumes for user
app.get('/api/resumes', authenticateToken, async (req, res) => {
  try {
    const resumes = await query.all('SELECT * FROM resumes WHERE user_id = ?', [req.user.id]);
    res.json(resumes.map(r => ({
      id: r.id,
      jobFamilyId: r.job_family_id,
      summary: r.summary,
      experience: JSON.parse(r.experience || '[]'),
      skills: JSON.parse(r.skills || '{"hard":[],"soft":[]}'),
      coverLetter: r.cover_letter,
      createdAt: r.created_at
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Generate a new Tailored Resume
app.post('/api/resumes', authenticateToken, async (req, res) => {
  const { jobFamilyId } = req.body;
  if (!jobFamilyId) {
    return res.status(400).json({ error: 'Job family ID is required' });
  }

  try {
    // A. Check if user is premium or already generated a resume (Free tier limit)
    const user = await query.get('SELECT is_premium FROM users WHERE id = ?', [req.user.id]);
    const existingResumes = await query.all('SELECT id FROM resumes WHERE user_id = ?', [req.user.id]);

    if (!user.is_premium && existingResumes.length >= 1) {
      return res.status(403).json({
        error: 'Free tier limits exceeded. You can only generate 1 tailored CV.',
        requiresPremium: true
      });
    }

    // B. Load user profile
    const profile = await query.get('SELECT * FROM profiles WHERE user_id = ?', [req.user.id]);
    if (!profile) {
      return res.status(400).json({ error: 'Onboarding profile is required before resume compilation' });
    }

    const parsedProfile = {
      name: profile.name,
      location: profile.location,
      email: req.user.email,
      parenting_caregiving: profile.parenting_caregiving === 1,
      hobbies: JSON.parse(profile.hobbies || '[]'),
      military: JSON.parse(profile.military || '{"served":false}'),
      community_roles: JSON.parse(profile.community_roles || '[]'),
      jobs: JSON.parse(profile.jobs || '[]'),
      personality: JSON.parse(profile.personality || '{}')
    };

    const jobFamily = JOB_FAMILIES.find(j => j.id === jobFamilyId);
    if (!jobFamily) {
      return res.status(400).json({ error: 'Invalid target job family selection' });
    }

    // C. Compile resume
    const cv = generateTailoredResume(parsedProfile, jobFamily);

    const resumeId = 'cv_' + Math.random().toString(36).substr(2, 9);
    await query.run(
      `INSERT INTO resumes (id, user_id, job_family_id, summary, experience, skills, cover_letter)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        resumeId,
        req.user.id,
        jobFamilyId,
        cv.summary,
        JSON.stringify(cv.experience),
        JSON.stringify(cv.skills),
        cv.coverLetter
      ]
    );

    res.status(201).json({
      id: resumeId,
      jobFamilyId,
      summary: cv.summary,
      experience: cv.experience,
      skills: cv.skills,
      coverLetter: cv.coverLetter
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Edit details of a generated resume
app.put('/api/resumes/:id', authenticateToken, async (req, res) => {
  const { summary, experience, skills, coverLetter } = req.body;
  
  try {
    const resume = await query.get('SELECT * FROM resumes WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (!resume) {
      return res.status(404).json({ error: 'CV details not found' });
    }

    await query.run(
      `UPDATE resumes SET summary = ?, experience = ?, skills = ?, cover_letter = ?
       WHERE id = ? AND user_id = ?`,
      [
        summary || resume.summary,
        experience ? JSON.stringify(experience) : resume.experience,
        skills ? JSON.stringify(skills) : resume.skills,
        coverLetter || resume.cover_letter,
        req.params.id,
        req.user.id
      ]
    );

    res.json({ message: 'Resume details updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- STRIPE CHECKOUT PAYMENT INITIATION ---
app.post('/api/stripe/create-checkout', authenticateToken, async (req, res) => {
  try {
    const user = await query.get('SELECT email, is_premium FROM users WHERE id = ?', [req.user.id]);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.is_premium) {
      return res.status(400).json({ error: 'User is already premium.' });
    }

    const host = process.env.APP_URL || `http://localhost:${PORT}`;

    if (stripe) {
      // Create actual Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Hidden Strengths Pro Unlock',
                description: 'Generate unlimited tailored resumes, cover letters, and unlock premium profile suggestions.',
              },
              unit_amount: 1900, // $19.00
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        client_reference_id: req.user.id,
        customer_email: user.email,
        success_url: `${host}/dashboard?payment=success`,
        cancel_url: `${host}/dashboard?payment=cancel`,
      });

      res.json({ url: session.url });
    } else {
      // Mock payment bypass for sandbox testing
      console.log('Generating mock stripe checkout URL for local developer sandbox.');
      res.json({
        url: `${host}/api/stripe/mock-success?userId=${req.user.id}`,
        isMock: true
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Handle mock checkout redirect loop locally
app.get('/api/stripe/mock-success', async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).send('Missing userId in query parameters');
  }

  try {
    await query.run('UPDATE users SET is_premium = 1 WHERE id = ?', [userId]);
    console.log(`[MOCK] Upgraded user ${userId} to Premium.`);
    res.redirect(`/dashboard?payment=success`);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// --- EMPLOYER PORTAL ENDPOINTS ---

// 1. Get Employer Profile
app.get('/api/employer/profile', authenticateToken, async (req, res) => {
  try {
    const profile = await query.get('SELECT * FROM employer_profiles WHERE user_id = ?', [req.user.id]);
    if (!profile) {
      return res.status(404).json({ error: 'Employer profile not found' });
    }
    res.json({
      companyName: profile.company_name,
      industry: profile.industry,
      hiringNeeds: profile.hiring_needs
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Save / Update Employer Profile
app.post('/api/employer/profile', authenticateToken, async (req, res) => {
  const { companyName, industry, hiringNeeds } = req.body;
  if (!companyName) {
    return res.status(400).json({ error: 'Company Name is required' });
  }

  try {
    const sql = `
      INSERT INTO employer_profiles (user_id, company_name, industry, hiring_needs, updated_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id) DO UPDATE SET
        company_name=excluded.company_name,
        industry=excluded.industry,
        hiring_needs=excluded.hiring_needs,
        updated_at=CURRENT_TIMESTAMP
    `;
    await query.run(sql, [req.user.id, companyName, industry || '', hiringNeeds || '']);
    res.json({ message: 'Employer profile saved successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Get Anonymized Jobseeker Candidates List
app.get('/api/employer/candidates', authenticateToken, async (req, res) => {
  try {
    const profiles = await query.all('SELECT p.*, u.email FROM profiles p JOIN users u ON p.user_id = u.id');
    const candidates = profiles.map(p => {
      const matches = calculateMatches(p);
      return {
        id: p.user_id,
        name: p.name,
        location: p.location,
        education: JSON.parse(p.education || '{}'),
        jobs: JSON.parse(p.jobs || '[]'),
        hobbies: JSON.parse(p.hobbies || '[]'),
        constraints: JSON.parse(p.constraints || '[]'),
        military: JSON.parse(p.military || '{"served":false}'),
        clarifications: JSON.parse(p.clarifications || '{}'),
        careerMatches: matches.map(m => ({
          title: m.title,
          score: m.score,
          rationale: m.rationale
        }))
      };
    });
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve frontend assets statically in production
const frontendBuildPath = join(__dirname, '../frontend/dist');
app.use(express.static(frontendBuildPath));

// Fallback routing for SPA
app.get('*', (req, res) => {
  res.sendFile(join(frontendBuildPath, 'index.html'));
});

// Start express server
app.listen(PORT, () => {
  console.log(`Hidden Strengths MVP server running at http://localhost:${PORT}`);
});
