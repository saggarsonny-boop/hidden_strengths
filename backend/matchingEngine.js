// Predefined Job Families database
export const JOB_FAMILIES = [
  {
    id: "adventure_guide",
    title: "Outdoor & Adventure Guide",
    description: "Lead climbing, trail running, hiking, or survival programs for fitness clubs, tourists, or youth groups.",
    salaryRange: "$35,000 - $55,000",
    workType: "Local (In-Person)",
    skillsRequired: ["physical", "endurance", "leadership", "risk management", "teaching"],
    requiredLicence: false,
    requiresDegree: false,
    felonyFriendly: true,
    idealSchedule: ["flexible", "weekends"],
    valuesAligned: ["autonomy", "meaning"]
  },
  {
    id: "fitness_coach",
    title: "Fitness & Running Coach",
    description: "Provide personalized fitness plans, running program training, or local class coaching either in-person or remotely.",
    salaryRange: "$30,000 - $65,000",
    workType: "Hybrid / Remote-friendly",
    skillsRequired: ["physical", "endurance", "teaching", "encouragement", "communication"],
    requiredLicence: false,
    requiresDegree: false,
    felonyFriendly: true,
    idealSchedule: ["flexible", "school_hours"],
    valuesAligned: ["autonomy", "meaning"]
  },
  {
    id: "pet_care_specialist",
    title: "Pet Care & Dog Trainer Assistant",
    description: "Assist with pet-sitting, dog training sessions, or veterinary clinic administrative and care support.",
    salaryRange: "$28,000 - $45,000",
    workType: "Local (In-Person)",
    skillsRequired: ["animal_care", "reliability", "patience"],
    requiredLicence: false,
    requiresDegree: false,
    felonyFriendly: true,
    idealSchedule: ["flexible", "school_hours"],
    valuesAligned: ["stability", "autonomy"]
  },
  {
    id: "boutique_alterations",
    title: "Sewing, Alterations & Boutique Specialist",
    description: "Provide alterations, tailorship, costume helper services, or boutique operational support.",
    salaryRange: "$32,000 - $50,000",
    workType: "Local (In-Person)",
    skillsRequired: ["sewing", "craft", "attention_to_detail", "creativity"],
    requiredLicence: false,
    requiresDegree: false,
    felonyFriendly: true,
    idealSchedule: ["school_hours", "weekdays"],
    valuesAligned: ["stability", "autonomy"]
  },
  {
    id: "event_organizer",
    title: "Community Event & Recreation Coordinator",
    description: "Organize low-budget fun runs, picnics, corporate team events, or local community class calendars.",
    salaryRange: "$38,000 - $60,000",
    workType: "Hybrid",
    skillsRequired: ["planning", "communication", "budgeting", "fun", "leadership"],
    requiredLicence: false,
    requiresDegree: false,
    felonyFriendly: true,
    idealSchedule: ["flexible", "weekends"],
    valuesAligned: ["meaning", "autonomy"]
  },
  {
    id: "veteran_peer_support",
    title: "Veteran Peer Support Specialist",
    description: "Provide counseling, resource navigation, and group sessions for military veterans transitioning to civilian life.",
    salaryRange: "$40,000 - $58,000",
    workType: "Hybrid",
    skillsRequired: ["military_background", "empathy", "listening", "discipline"],
    requiredLicence: false,
    requiresDegree: false,
    felonyFriendly: true,
    idealSchedule: ["weekdays", "flexible"],
    valuesAligned: ["meaning", "stability"]
  },
  {
    id: "clinical_reviewer",
    title: "Clinical Reviewer (Non-Licensed)",
    description: "Conduct utilization reviews, analyze insurance claims, and audit charts using clinical diagnostics knowledge.",
    salaryRange: "$70,000 - $110,000",
    workType: "Remote-friendly",
    skillsRequired: ["clinical_knowledge", "triage", "analytical", "detail_oriented"],
    requiredLicence: false, // UM/Review roles can be done by non-active license clinicians
    requiresDegree: false, // Does not require traditional university if clinical background exists
    felonyFriendly: true,
    idealSchedule: ["weekdays", "school_hours"],
    valuesAligned: ["stability", "money"]
  },
  {
    id: "clinical_documentation_specialist",
    title: "Clinical Documentation Improvement (CDI) Specialist",
    description: "Review medical records to ensure accurate clinical descriptions, improving coding accuracy and billing logic.",
    salaryRange: "$65,000 - $95,000",
    workType: "Remote-friendly",
    skillsRequired: ["medical_terms", "writing", "record_keeping", "auditing"],
    requiredLicence: false,
    requiresDegree: false,
    felonyFriendly: true,
    idealSchedule: ["weekdays"],
    valuesAligned: ["stability", "money"]
  },
  {
    id: "medical_writer",
    title: "Medical Writer & Content Strategist",
    description: "Synthesize clinical research, write medical articles, develop educational content, or review clinical studies.",
    salaryRange: "$75,000 - $120,000",
    workType: "Remote-friendly",
    skillsRequired: ["medical_knowledge", "writing", "research", "synthesis"],
    requiredLicence: false,
    requiresDegree: false,
    felonyFriendly: true,
    idealSchedule: ["flexible"],
    valuesAligned: ["autonomy", "meaning"]
  },
  {
    id: "clinical_policy_analyst",
    title: "Clinical & Public Health Policy Analyst",
    description: "Draft organizational guidelines, research state health regulations, and analyze public health statistics.",
    salaryRange: "$80,000 - $130,000",
    workType: "Remote-friendly",
    skillsRequired: ["healthcare_data", "policy", "writing", "legal"],
    requiredLicence: false,
    requiresDegree: false,
    felonyFriendly: true,
    idealSchedule: ["weekdays"],
    valuesAligned: ["meaning", "autonomy"]
  },
  {
    id: "healthcare_data_analyst",
    title: "Healthcare Data Analyst",
    description: "Compile and inspect operational clinical databases, review costs, and model utilization efficiency trends.",
    salaryRange: "$70,000 - $105,000",
    workType: "Remote-friendly",
    skillsRequired: ["analytics", "medical_terms", "SQL/excel", "detail_oriented"],
    requiredLicence: false,
    requiresDegree: false,
    felonyFriendly: true,
    idealSchedule: ["weekdays"],
    valuesAligned: ["stability", "money"]
  },
  {
    id: "vibe_coder",
    title: "AI & Rapid Prototyping Developer",
    description: "Create website wireframes, build automations, and vibe code solutions using AI tools and scripting languages.",
    salaryRange: "$60,000 - $120,000",
    workType: "Remote-friendly",
    skillsRequired: ["programming", "rapid_prototyping", "logical", "self_starter"],
    requiredLicence: false,
    requiresDegree: false,
    felonyFriendly: true,
    idealSchedule: ["flexible"],
    valuesAligned: ["autonomy", "money"]
  }
];

// Military Occupational Specialty (MOS) / Air Force Specialty Code (AFSC) / Navy Ratings (Rates) database
export const MILITARY_OCCUPATIONAL_CODES = {
  "60B": {
    title: "Pediatrician (Medical Corps)",
    branch: "Army",
    skills: ["clinical_knowledge", "medical_terms", "medical_knowledge", "detail_oriented", "triage", "patience", "empathy"],
    civilianEquivalents: ["clinical_reviewer", "clinical_documentation_specialist", "medical_writer", "clinical_policy_analyst"]
  },
  "61N": {
    title: "Flight Surgeon",
    branch: "Army",
    skills: ["clinical_knowledge", "medical_terms", "medical_knowledge", "detail_oriented", "triage", "leadership", "risk management", "analytical"],
    civilianEquivalents: ["clinical_reviewer", "clinical_documentation_specialist", "medical_writer", "clinical_policy_analyst", "healthcare_data_analyst"]
  },
  "68W": {
    title: "Combat Medic Specialist",
    branch: "Army",
    skills: ["clinical_knowledge", "medical_terms", "medical_knowledge", "triage", "endurance", "physical", "risk management"],
    civilianEquivalents: ["clinical_reviewer", "clinical_documentation_specialist", "adventure_guide"]
  },
  "HM": {
    title: "Hospital Corpsman",
    branch: "Navy",
    skills: ["clinical_knowledge", "medical_terms", "medical_knowledge", "triage", "detail_oriented", "reliability"],
    civilianEquivalents: ["clinical_reviewer", "clinical_documentation_specialist", "medical_writer"]
  },
  "11B": {
    title: "Infantryman",
    branch: "Army",
    skills: ["physical", "endurance", "leadership", "risk management", "reliability", "discipline"],
    civilianEquivalents: ["adventure_guide", "fitness_coach", "veteran_peer_support"]
  },
  "0311": {
    title: "Rifleman",
    branch: "Marine Corps",
    skills: ["physical", "endurance", "leadership", "risk management", "reliability", "discipline"],
    civilianEquivalents: ["adventure_guide", "fitness_coach", "veteran_peer_support"]
  },
  "25B": {
    title: "Information Technology Specialist",
    branch: "Army",
    skills: ["programming", "logical", "self_starter", "rapid_prototyping", "detail_oriented"],
    civilianEquivalents: ["vibe_coder", "healthcare_data_analyst"]
  },
  "3D0X2": {
    title: "Cyber Systems Operations",
    branch: "Air Force",
    skills: ["programming", "logical", "self_starter", "rapid_prototyping", "detail_oriented"],
    civilianEquivalents: ["vibe_coder", "healthcare_data_analyst"]
  },
  "IT": {
    title: "Information Systems Technician",
    branch: "Navy",
    skills: ["programming", "logical", "self_starter", "rapid_prototyping", "detail_oriented"],
    civilianEquivalents: ["vibe_coder", "healthcare_data_analyst"]
  },
  "42A": {
    title: "Human Resources Specialist",
    branch: "Army",
    skills: ["detail_oriented", "reliability", "scheduling", "communication", "writing"],
    civilianEquivalents: ["clinical_documentation_specialist", "event_organizer"]
  },
  "YN": {
    title: "Yeoman",
    branch: "Navy / Coast Guard",
    skills: ["detail_oriented", "reliability", "scheduling", "communication", "writing"],
    civilianEquivalents: ["clinical_documentation_specialist", "event_organizer"]
  },
  "92Y": {
    title: "Unit Supply Specialist",
    branch: "Army",
    skills: ["reliability", "detail_oriented", "planning", "budgeting"],
    civilianEquivalents: ["event_organizer"]
  },
  "LS": {
    title: "Logistics Specialist",
    branch: "Navy",
    skills: ["reliability", "detail_oriented", "planning", "budgeting"],
    civilianEquivalents: ["event_organizer"]
  },
  "31B": {
    title: "Military Police",
    branch: "Army",
    skills: ["risk management", "leadership", "reliability", "discipline", "physical"],
    civilianEquivalents: ["adventure_guide", "veteran_peer_support"]
  },
  "MA": {
    title: "Master-at-Arms",
    branch: "Navy",
    skills: ["risk management", "leadership", "reliability", "discipline", "physical"],
    civilianEquivalents: ["adventure_guide", "veteran_peer_support"]
  }
};

export function parseMilitaryOccupationalService(text) {
  if (!text) return [];
  const normalized = text.toUpperCase();
  const results = [];
  
  Object.keys(MILITARY_OCCUPATIONAL_CODES).forEach(code => {
    const regex = new RegExp(`\\b${code}\\b`, 'i');
    if (regex.test(normalized)) {
      results.push({
        code,
        ...MILITARY_OCCUPATIONAL_CODES[code]
      });
    }
  });
  
  return results;
}

// Helper to extract skill tags based on questionnaire inputs
export function extractUserTags(profile) {
  const tags = new Set();

  // 1. Parse Hobbies
  const hobbies = Array.isArray(profile.hobbies) ? profile.hobbies : JSON.parse(profile.hobbies || '[]');
  hobbies.forEach(hobby => {
    const h = hobby.toLowerCase();
    if (h.includes("climbing") || h.includes("marathon") || h.includes("sport") || h.includes("run") || h.includes("yoga")) {
      tags.add("physical");
      tags.add("endurance");
    }
    if (h.includes("poetry") || h.includes("writ") || h.includes("art") || h.includes("music") || h.includes("paint")) {
      tags.add("creativity");
      tags.add("writing");
    }
    if (h.includes("sewing") || h.includes("seamstress") || h.includes("woodwork") || h.includes("garden") || h.includes("diy") || h.includes("craft")) {
      tags.add("craft");
      tags.add("attention_to_detail");
    }
    if (h.includes("dog") || h.includes("cat") || h.includes("pet") || h.includes("animal") || h.includes("husky")) {
      tags.add("animal_care");
      tags.add("patience");
      tags.add("reliability");
    }
  });

  // 2. Parse Military Service
  const military = typeof profile.military === 'string' ? JSON.parse(profile.military || '{"served":false}') : (profile.military || { served: false });
  const militaryServed = military.served || (profile.militaryService && profile.militaryService.trim() !== "");
  if (militaryServed) {
    tags.add("military_background");
    tags.add("discipline");
    tags.add("leadership");
    tags.add("risk management");
    tags.add("reliability");

    const militaryServiceText = profile.militaryService || military.militaryService || military.role || "";
    const matchedCodes = parseMilitaryOccupationalService(militaryServiceText);
    matchedCodes.forEach(codeInfo => {
      codeInfo.skills.forEach(skill => tags.add(skill));
    });
  }

  // 3. Parse Parenting & Caregiving
  if (profile.parenting_caregiving === 1 || profile.parenting_caregiving === true || profile.parentingCaregiving === true) {
    tags.add("empathy");
    tags.add("triage");
    tags.add("patience");
    tags.add("reliability");
    tags.add("coaching");
    tags.add("scheduling");
  }

  // 4. Parse Community Roles
  const community = Array.isArray(profile.community_roles) ? profile.community_roles : JSON.parse(profile.community_roles || '[]');
  community.forEach(role => {
    const r = role.toLowerCase();
    if (r.includes("organiz") || r.includes("lead") || r.includes("coach") || r.includes("teach") || r.includes("guid")) {
      tags.add("leadership");
      tags.add("coaching");
      tags.add("teaching");
      tags.add("communication");
    }
  });

  // 5. Parse Past Work History (Jobs)
  const jobs = Array.isArray(profile.jobs) ? profile.jobs : JSON.parse(profile.jobs || '[]');
  jobs.forEach(job => {
    const title = (job.title || "").toLowerCase();
    const desc = (job.responsibilities || "").toLowerCase();
    
    // Clinical Indicators
    if (title.includes("physician") || title.includes("doctor") || title.includes("dr") || title.includes("md") || title.includes("medicine") || title.includes("clinical") || title.includes("er") || title.includes("emergency") || title.includes("nurse") || title.includes("rn")) {
      tags.add("clinical_knowledge");
      tags.add("medical_terms");
      tags.add("medical_knowledge");
      tags.add("analytical");
      tags.add("detail_oriented");
      tags.add("triage");
      tags.add("medical_knowledge");
    }
    // Coding / Software
    if (title.includes("code") || title.includes("programmer") || title.includes("developer") || title.includes("software") || title.includes("tech") || desc.includes("coding") || desc.includes("vibe")) {
      tags.add("programming");
      tags.add("logical");
      tags.add("self_starter");
      tags.add("rapid_prototyping");
    }
    // Teaching
    if (title.includes("teach") || title.includes("school") || title.includes("professor") || title.includes("instructor")) {
      tags.add("teaching");
      tags.add("communication");
    }
    // Writing
    if (title.includes("writer") || title.includes("editor") || title.includes("content") || title.includes("journalist")) {
      tags.add("writing");
      tags.add("communication");
      tags.add("research");
      tags.add("synthesis");
    }
  });

  // 6. Personality preferences (solo vs team, structure etc)
  const personality = typeof profile.personality === 'string' ? JSON.parse(profile.personality || '{}') : (profile.personality || {});
  if (personality.prefersSolo >= 4) {
    tags.add("patience");
  }
  if (personality.stressTolerance >= 4) {
    tags.add("risk management");
    tags.add("triage");
  }

  return Array.from(tags);
}

// Matching core logic
export function calculateMatches(profile) {
  const userTags = extractUserTags(profile);
  const userConstraints = Array.isArray(profile.constraints) ? profile.constraints : JSON.parse(profile.constraints || "[]");
  const dealBreakers = Array.isArray(profile.deal_breakers) ? profile.deal_breakers : JSON.parse(profile.deal_breakers || "[]");
  
  const hasNoDegree = userConstraints.includes("no_degree");
  const hasFelony = userConstraints.includes("felony");
  const hasNoLicense = userConstraints.includes("no_license");
 
  const personality = typeof profile.personality === 'string' ? JSON.parse(profile.personality || '{}') : (profile.personality || {});
  const userValues = Array.isArray(personality.values) ? personality.values : [];
  
  const userSchedule = Array.isArray(profile.schedule) ? profile.schedule : JSON.parse(profile.schedule || "[]");
 
  // Military Code Translation
  const military = typeof profile.military === 'string' ? JSON.parse(profile.military || '{"served":false}') : (profile.military || { served: false });
  const militaryServiceText = profile.militaryService || military.militaryService || military.role || "";
  const matchedMilitaryCodes = parseMilitaryOccupationalService(militaryServiceText);

  const matches = JOB_FAMILIES.map(job => {
    let score = 50; // Starting baseline
    const matchingSkills = [];
    const gaps = [];

    // 1. Calculate Tag Match (Weight: 8 points per matching tag)
    job.skillsRequired.forEach(skill => {
      if (userTags.includes(skill)) {
        score += 12;
        matchingSkills.push(skill);
      } else {
        gaps.push(skill);
      }
    });

    // 2. Schedule Fit (Weight: 8 points)
    const scheduleMatches = job.idealSchedule.filter(s => userSchedule.includes(s));
    score += scheduleMatches.length * 4;

    // 3. Values Alignment (Weight: 10 points per matches)
    const valueMatches = job.valuesAligned.filter(v => userValues.includes(v));
    score += valueMatches.length * 6;

    // 4. Remote vs In-Person preference adjustment
    const workPreference = profile.work_preference || "remote";
    if (workPreference === "remote" && job.workType.toLowerCase().includes("remote")) {
      score += 15;
    } else if (workPreference === "in_person" && job.workType.toLowerCase().includes("in-person")) {
      score += 15;
    }

    // 5. Military Occupational Boost
    let militaryEquivalentBoost = 0;
    const matchedOccupations = [];
    
    matchedMilitaryCodes.forEach(codeInfo => {
      if (codeInfo.civilianEquivalents.includes(job.id)) {
        militaryEquivalentBoost += 20; // boost score by 20 points
        matchedOccupations.push(`${codeInfo.title} (${codeInfo.code})`);
      }
    });
    score += militaryEquivalentBoost;

    // 6. HARD FILTERS (Apply heavy penalties or zero-out scores)
    let constraintMatch = true;
    let reasonForFilter = "";

    // License constraint check
    if (hasNoLicense && job.requiredLicence) {
      score -= 100;
      constraintMatch = false;
      reasonForFilter = "Requires active state licensure";
    }

    // Degree constraint check
    if (hasNoDegree && job.requiresDegree) {
      score -= 100;
      constraintMatch = false;
      reasonForFilter = "Requires formal higher degree";
    }

    // Felony constraint check
    if (hasFelony && !job.felonyFriendly) {
      score -= 100;
      constraintMatch = false;
      reasonForFilter = "Strict background screening / licensing constraints";
    }

    // Deal Breakers filters (e.g. "no night shifts", "no sales", etc.)
    dealBreakers.forEach(breaker => {
      const b = breaker.toLowerCase();
      if (b.includes("sales") && job.id.includes("sales")) {
        score -= 80;
      }
      if (b.includes("night") && job.idealSchedule.includes("night")) {
        score -= 80;
      }
    });

    // Make sure scores stay in reasonable range (0-100)
    const finalScore = Math.min(100, Math.max(0, score));

    // Custom Positioning Rationale & Pitch Angle for user
    const rationale = generateCustomRationale(job.id, profile, userTags, matchedOccupations);

    return {
      id: job.id,
      title: job.title,
      description: job.description,
      salaryRange: job.salaryRange,
      workType: job.workType,
      score: finalScore,
      constraintMatch,
      reasonForFilter,
      matchingSkills,
      gaps,
      rationale: rationale.rationale,
      pitchAngle: rationale.pitchAngle
    };
  });

  // Filter out completely incompatible matches (score < 40 or constraintMatch = false if there are other matches)
  let results = matches.filter(m => m.score >= 40);
  
  // Sort by highest score descending
  results.sort((a, b) => b.score - a.score);

  return results;
}

// Generate tailored context rationale based on user background
function generateCustomRationale(jobId, profile, userTags, matchedOccupations = []) {
  const hasMilitary = (profile.military && profile.military.served) || 
                      (profile.militaryService && profile.militaryService.trim() !== "");
  const hasParenting = profile.parenting_caregiving === 1 || profile.parenting_caregiving === true || profile.parentingCaregiving === true;

  // Custom military title insertion
  let militaryContext = "";
  if (matchedOccupations.length > 0) {
    militaryContext = `Directly translates your military service as a ${matchedOccupations.join(" and ")} to civilian tasks. `;
  } else if (hasMilitary) {
    militaryContext = "Leverages your military background, leadership, and discipline. ";
  }

  switch (jobId) {
    case "adventure_guide":
      return {
        rationale: `${militaryContext}Leverages your interest in physical endurance and leadership. ${hasParenting ? "Your parenting experience translates directly into group logistics and keeping groups safe." : ""}`,
        pitchAngle: "Your safety awareness, background in teamwork, and endurance make you a reliable coordinator under high-stress conditions."
      };
    case "fitness_coach":
      return {
        rationale: `${militaryContext}Translates your physical background and hobbies (marathons, yoga, running) into coaching pathways. Ideal for flexible autonomous scheduling.`,
        pitchAngle: "Your personal commitment to training schedules and discipline gives you the authority and knowledge to motivate and train others."
      };
    case "pet_care_specialist":
      return {
        rationale: `${militaryContext}Your patience and affinity for animals (such as huskies) map well to dog training and sitting structures, offering stable work with low administrative strain.`,
        pitchAngle: "Highly patient and responsible care coordination. You provide consistent care and boundary structures for clients' pets."
      };
    case "boutique_alterations":
      return {
        rationale: `${militaryContext}Utilizes your specific sewing skills, eye for design, and interest in craft. Excellent for a quiet, focused environment that rewards precision.`,
        pitchAngle: "A highly meticulous craftsman with a background in custom tailoring, wardrobe alterations, and textile management."
      };
    case "event_organizer":
      return {
        rationale: `${militaryContext}Utilizes planning, budgeting, and coordination skills. Your community service shows you know how to build fun experiences cheaply.`,
        pitchAngle: "A community organizer who excels at optimizing budgets, arranging micro-logistics, and crafting memorable outings."
      };
    case "veteran_peer_support":
      return {
        rationale: `${militaryContext}Your military background gives you automatic peer rapport. A deeply meaningful track where you guide others through transition.`,
        pitchAngle: "A dedicated veteran support advocate leveraging firsthand military experience to ease transition and navigate resource structures."
      };
    case "clinical_reviewer":
      return {
        rationale: `${militaryContext}Uses your deep medical diagnostics and triage experience. It allows you to analyze cases from a remote desk without needing active clinical practice licensing.`,
        pitchAngle: "A senior medical advisor combining extensive clinical pattern-recognition with administrative utilization review and triage skills."
      };
    case "clinical_documentation_specialist":
      return {
        rationale: `${militaryContext}Bridges clinical vocabulary and compliance records. Perfect for ensuring chart accuracy and medical compliance remotely.`,
        pitchAngle: "Expert in translating clinical logs and chart notes into high-accuracy billing and compliance summaries."
      };
    case "medical_writer":
      return {
        rationale: `${militaryContext}Blends clinical understanding with writing hobbies. You can write clinical evidence syntheses, brochures, or guidelines autonomously.`,
        pitchAngle: "Clinical writer with medical diagnostic training, specializing in distilling technical medicine protocols into clear materials."
      };
    case "clinical_policy_analyst":
      return {
        rationale: `${militaryContext}Your health background maps onto compliance, public health, and regulation. You audit rules rather than treat patients.`,
        pitchAngle: "Healthcare systems advisor with intensive emergency medicine training, specializing in compliance audit and policy synthesis."
      };
    case "healthcare_data_analyst":
      return {
        rationale: `${militaryContext}Ideal if you enjoy logical data reviews. Combine medical understanding with statistics to report on bed utilization and clinic metrics.`,
        pitchAngle: "Clinical analytics technician. Blends hospital operations experience with database querying to deliver administrative insights."
      };
    case "vibe_coder":
      return {
        rationale: `${militaryContext}Applies programming interests and rapid logic skills. Vibe coding allows you to build products and prototypes using modern AI assistance.`,
        pitchAngle: "An agile developer utilizing advanced AI programming tools to rapidly scaffold, test, and ship responsive software modules."
      };
    default:
      return {
        rationale: "Aligned with your expressed skills and scheduling interests.",
        pitchAngle: "Adaptable coordinator ready to utilize transferable background competencies."
      };
  }
}
