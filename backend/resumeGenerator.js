export function generateTailoredResume(profile, jobFamily) {
  const name = profile.name || "Job Seeker";
  const location = profile.location || "";
  const email = profile.email || "hello@example.com";
  
  // 1. Generate Summary pitch based on profile + job
  const summary = generateSummary(profile, jobFamily);

  // 2. Generate Reframed Experience items
  const experience = generateExperience(profile, jobFamily);

  // 3. Compile Skills (combining hard and soft skills)
  const skills = generateSkills(profile, jobFamily);

  // 4. Generate cover letter
  const coverLetter = generateCoverLetter(profile, jobFamily);

  return {
    name,
    location,
    email,
    jobTitle: jobFamily.title,
    summary,
    experience,
    skills,
    coverLetter
  };
}

function generateSummary(profile, jobFamily) {
  const hasMilitary = profile.military && profile.military.served;
  const hasParenting = profile.parenting_caregiving === 1 || profile.parenting_caregiving === true;
  
  let basePitch = `Meticulous and motivated professional with a diverse background in logistics, coordination, and problem-solving. Adaptable and eager to leverage strong transferable skills for a career as a ${jobFamily.title}.`;

  if (jobFamily.id === "clinical_reviewer" || jobFamily.id === "clinical_documentation_specialist" || jobFamily.id === "medical_writer" || jobFamily.id === "clinical_policy_analyst" || jobFamily.id === "healthcare_data_analyst") {
    basePitch = `Distinguished healthcare communications and systems analyst with extensive clinical diagnostics and triage experience. Combines deep medical record analysis with advanced technical writing, guidelines compliance, and policy synthesis to bridge the gap between clinical operations and administrative compliance.`;
  } else if (jobFamily.id === "adventure_guide" || jobFamily.id === "fitness_coach") {
    basePitch = `Dynamic, high-endurance coordinator and coach with extensive experience in safety management, risk assessment, and physical instruction. ${hasMilitary ? "Leverages military planning protocols to keep groups secure." : ""} Passionate about motivating individuals and organizing complex logistics under pressure.`;
  } else if (jobFamily.id === "boutique_alterations") {
    basePitch = `Detail-oriented artisan with a specialized background in apparel construction, custom sewing alterations, and boutique support operations. Excels in high-accuracy craftsmanship and structured, precision-driven workflows.`;
  } else if (jobFamily.id === "vibe_coder") {
    basePitch = `Agile technical builder specializing in rapid prototyping, AI-guided script automation, and responsive web design. Self-starter who combines logical programming analysis with swift product turnaround.`;
  } else if (jobFamily.id === "pet_care_specialist") {
    basePitch = `Reliable and patient caregiver with specialized experience in animal husbandry, dog behavioral management, and scheduling logistics. Trusted advisor committed to stable daily operations.`;
  }

  return basePitch;
}

function generateExperience(profile, jobFamily) {
  const list = [];
  
  // A. Add past jobs (reframed slightly)
  const jobs = Array.isArray(profile.jobs) ? profile.jobs : JSON.parse(profile.jobs || "[]");
  jobs.forEach(job => {
    let title = job.title;
    let responsibilities = job.responsibilities || "";

    // Reframe clinical titles slightly if license is inactive
    if (jobFamily.id.includes("clinical") || jobFamily.id.includes("medical") || jobFamily.id.includes("health")) {
      if (title.toLowerCase().includes("physician") || title.toLowerCase().includes("doctor")) {
        title = "Clinical Diagnostic & Triage Consultant (Former Physician)";
      }
    }

    list.push({
      title: title,
      company: job.employer || "Professional Services",
      dateRange: `${job.startDate || "Past"} - ${job.endDate || "Present"}`,
      responsibilities: formatBulletPoints(responsibilities, jobFamily.id)
    });
  });

  // B. Reframe Military Service (if present)
  if (profile.military && profile.military.served) {
    const mil = profile.military;
    list.push({
      title: `Operations Specialist / Section Leader (${mil.branch})`,
      company: `United States Armed Services`,
      dateRange: `Service: ${mil.years || "4"} Years`,
      responsibilities: [
        "Enforced strict safety rules, operational checks, and risk analysis procedures.",
        "Managed section equipment maintenance, inventory audits, and logistical dispatch sheets.",
        "Collaborated in fast-paced multi-functional squads to resolve mission-critical objectives.",
        "Adhered strictly to federal regulatory codes, guidelines compliance, and record reporting standards."
      ]
    });
  }

  // C. Reframe Parenting / Caregiving
  if (profile.parenting_caregiving === 1 || profile.parenting_caregiving === true) {
    list.push({
      title: "Family Operations & Logistics Coordinator",
      company: "Caregiving & Household Administration",
      dateRange: "Extended Service Interval",
      responsibilities: [
        "Supervised daily medical, financial, and educational records; scheduled multi-person calendars and routing schedules.",
        "Navigated budgeting and expense allocation, negotiating vendor support costs for repairs and service contracts.",
        "Exercised crisis management and dispute resolution techniques under high-stress emotional pressure.",
        "Coordinated preventative health schedules, nutritional planning, and strict sanitation safety standards."
      ]
    });
  }

  // D. Reframe Hobbies (if relevant to the target job)
  const hobbies = Array.isArray(profile.hobbies) ? profile.hobbies : JSON.parse(profile.hobbies || "[]");
  const isCreative = hobbies.some(h => ["poetry", "art", "writing"].includes(h.toLowerCase()));
  const isAthletic = hobbies.some(h => ["climbing", "marathon", "sports"].includes(h.toLowerCase()));
  const isSewing = hobbies.some(h => ["seamstress", "sewing", "craft"].includes(h.toLowerCase()));

  if (isAthletic && (jobFamily.id === "adventure_guide" || jobFamily.id === "fitness_coach")) {
    list.push({
      title: "Adventure Athletics & Risk Planning Coordinator",
      company: "Independent Sports & Outdoor Activities",
      dateRange: "Ongoing Practice",
      responsibilities: [
        "Organized climbing routes, hydration logistics, and trail run maps for local groups.",
        "Instructed peers in stamina conditioning, breathing control, and heat-safety guidelines.",
        "Maintained, inspected, and certified safety harnesses, ropes, and outdoor survival kits.",
        "Conducted environmental weather checks and physical readiness triage before expeditions."
      ]
    });
  }

  if (isSewing && jobFamily.id === "boutique_alterations") {
    list.push({
      title: "Custom Apparel Design & Tailoring Specialist",
      company: "Creative Studio / Alterations Portfolio",
      dateRange: "Ongoing Practice",
      responsibilities: [
        "Crafted custom sewing alterations, tailored hems, and restored garment lining integrity.",
        "Managed fabric inventories, pattern layouts, and thread tensile strength matching.",
        "Operated sewing machines, sergers, and pressing stations with high precision.",
        "Consulted with clients on style guides, dimensions, and customized wear fit."
      ]
    });
  }

  if (isCreative && (jobFamily.id === "medical_writer" || jobFamily.id === "vibe_coder")) {
    list.push({
      title: "Independent Writer & Digital Content Planner",
      company: "Creative Writing & Communications Portfolio",
      dateRange: "Ongoing Practice",
      responsibilities: [
        "Researched theme formulations, drafted editorial structures, and synthesized abstract topics into narrative prose.",
        "Self-published collections, managed digital formatting templates, and proofread syntax.",
        "Created digital design mockups, editing layouts for maximum visual clarity and engagement."
      ]
    });
  }

  return list;
}

function formatBulletPoints(descText, jobId) {
  if (!descText) return ["Managed daily operations and team communications."];
  
  // Split raw text into sentences and format nicely
  const sentences = descText.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 5);
  
  // Reframe standard medical items if doing clinical reviews
  if (jobId.includes("clinical") || jobId.includes("medical")) {
    return sentences.map(s => {
      let r = s;
      if (r.includes("diagnos") || r.includes("treat")) {
        r = "Evaluated complex clinical profiles and cross-referenced case notes with evidence standards.";
      }
      if (r.includes("patient") || r.includes("saw")) {
        r = "Conducted medical reviews and managed intake triage for high-volume operational systems.";
      }
      return r;
    }).slice(0, 4);
  }

  return sentences.slice(0, 4);
}

function generateSkills(profile, jobFamily) {
  const baseSkills = {
    adventure_guide: {
      hard: ["Risk Management", "Logistics Planning", "Equipment Safety", "Triage / First Aid", "Route Navigation"],
      soft: ["Leadership", "Crisis Control", "Clear Communication", "Encouragement", "Adaptability"]
    },
    fitness_coach: {
      hard: ["Exercise Physiology", "Training Schedule Construction", "Stamina Conditioning", "Nutrition Basics"],
      soft: ["Motivational Coaching", "Patient Listening", "Empathy", "Goal Alignment", "Instructional Clarity"]
    },
    pet_care_specialist: {
      hard: ["Animal Behavior Support", "Pet Administration Schedules", "Safety Inspections", "Sanitation Checklists"],
      soft: ["Patience", "Reliability", "Attentiveness", "Calm Under Pressure", "Independent Focus"]
    },
    boutique_alterations: {
      hard: ["Apparel Construction", "Tailoring / Alterations", "Pattern Layout Drafting", "Serger & Machine Operation"],
      soft: ["Visual Precision", "High Attentiveness", "Time Budgeting", "Active Listening", "Detail Focus"]
    },
    event_organizer: {
      hard: ["Vendor Coordination", "Micro-Logistics Scheduling", "Budget Audits", "Digital Booking Tools"],
      soft: ["Creative Planning", "Crisis Resolution", "Enthusiasm", "Negotiation", "Problem Solving"]
    },
    veteran_peer_support: {
      hard: ["Resource Navigation", "Intake Evaluation", "Crisis Guidelines Checklists", "Case Logging"],
      soft: ["Military Rapport", "Active Listening", "Deep Empathy", "Non-Judgmental Support", "Confidentiality"]
    },
    clinical_reviewer: {
      hard: ["Utilization Review (UM)", "Clinical Diagnostics Audit", "Medical Record Screening", "Documentation Standards"],
      soft: ["Analytical Diagnostics", "Pattern Recognition", "Detail Focus", "Objectivity", "Written Reporting"]
    },
    clinical_documentation_specialist: {
      hard: ["CDI Audit Checklists", "Medical Terminology Validation", "Chart Audit Review", "Billing / Coding Compliance"],
      soft: ["Meticulous Review", "Collaborative Inquiries", "Professional Integrity", "Clarity in Technical Writing"]
    },
    medical_writer: {
      hard: ["Clinical Research Synthesis", "Evidence Summary Construction", "Technical Writing", "Regulatory Guidelines Check"],
      soft: ["Self-Directed Research", "Abstract Synthesis", "Draft Formatting", "Precision Focus", "Information Flow"]
    },
    clinical_policy_analyst: {
      hard: ["Public Health Policy Review", "Regulatory Code Interpretation", "Database Research", "Guideline Formulation"],
      soft: ["Structural Evaluation", "Logical Diagnostics", "Risk Mitigation", "Objective Policy Reporting"]
    },
    healthcare_data_analyst: {
      hard: ["Database Analysis (Excel/SQL)", "Metric Reporting", "Utilization Trend Modelling", "Healthcare KPI Audit"],
      soft: ["Logical Troubleshooting", "Structured Visualizations", "Detail Attention", "Quantitative Focus"]
    },
    vibe_coder: {
      hard: ["Rapid Software Prototyping", "AI Code Orchestration", "HTML/CSS & JavaScript", "Automation Workflows"],
      soft: ["Logical Analysis", "Self-Starter Drive", "Fast Loop Iteration", "Functional Adaptability"]
    }
  };

  const set = baseSkills[jobFamily.id] || {
    hard: ["Logistics Coordination", "Project Scheduling", "Data Organization"],
    soft: ["Problem Solving", "Adaptability", "Collaboration", "Patience"]
  };

  return set;
}

function generateCoverLetter(profile, jobFamily) {
  const name = profile.name || "Job Seeker";
  return `Dear Hiring Manager,

I am writing to express my enthusiasm for the ${jobFamily.title} position. I bring a highly adaptable, non-traditional background that equips me with a unique perspective, resilient work ethic, and deeply tested transferable skills that corporate job descriptions often overlook.

My experience spans both structured environments and high-responsibility roles, including managing complex household logistics, coordinating safety protocols, and leading self-directed projects. These roles have tested my crisis management, triage, and scheduling abilities under pressure. I know how to focus on details, align with regulatory codes, and optimize resource budgets.

I am particularly excited to join your team because I value environments that look past credential filters to find real-world capabilities. I am eager to apply my strengths in risk management, clear communication, and dedicated execution to help your operations succeed.

Thank you for your time and consideration.

Sincerely,
${name}`;
}
