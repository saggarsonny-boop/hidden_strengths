import { calculateMatches } from './matchingEngine.js';

// 1. Mock Rada's profile details
const radaProfile = {
  name: "Rada",
  ageRange: "30-39",
  location: "USA",
  workPreference: "in_person",
  constraints: ["no_degree"], // no degree, served in military
  education: { degreeType: "none", certificates: [] },
  jobs: [],
  military: { served: true, branch: "USAF", role: "airman", years: 4 },
  parentingCaregiving: true, // has a 5 year old son
  communityRoles: [],
  hobbies: ["poetry", "rock climbing", "marathons", "seamstress", "vegan", "crazy dancing", "picnics"],
  personality: { prefersSolo: 3, prefersStructure: 3, stressTolerance: 4, values: ["meaning", "autonomy"] },
  schedule: ["flexible", "weekends"],
  incomeTarget: "30k-50k",
  dealBreakers: []
};

// 2. Mock Sonny's profile details
const sonnyProfile = {
  name: "Sonny",
  ageRange: "50-59",
  location: "Missouri",
  workPreference: "remote",
  constraints: ["felony", "no_active_license"], // convicted felon, no active medical license
  education: { degreeType: "doctorate", certificates: [] },
  jobs: [
    { title: "Emergency Medicine Physician", employer: "Hospital", startDate: "2000", endDate: "2020", responsibilities: "Provided rapid diagnostics, emergency room triage, patient clinical evaluations, and policy compliance guidance." }
  ],
  military: { served: false },
  parentingCaregiving: true, // lives with 21 year old son
  communityRoles: ["teaching", "communication"],
  hobbies: ["writing", "vibe coding", "Tibetan rites"],
  personality: { prefersSolo: 4, prefersStructure: 2, stressTolerance: 5, values: ["meaning", "stability", "autonomy"] },
  schedule: ["weekdays"],
  incomeTarget: "70k-120k",
  dealBreakers: ["no sales", "no high-stress clinical work"]
};

// 3. Mock Thomas's profile details (Military test case)
const thomasProfile = {
  name: "Thomas",
  location: "Olympia, WA",
  workPreference: "remote",
  constraints: ["felony"], // conspiracy to violate anti kickback statute (felony)
  education: { degreeType: "doctorate", certificates: [] },
  jobs: [
    { title: "Army Flight Surgeon", employer: "US Army", startDate: "2000", endDate: "2020", responsibilities: "Emergency medicine triage, flight surgeon operations, pediatric clinic support." }
  ],
  military: { served: true },
  militaryService: "20 years 60b, 61n",
  parentingCaregiving: false,
  communityRoles: [],
  hobbies: ["Flying- all things aviation.", "cyclist", "testing software"],
  personality: { prefersSolo: 4, prefersStructure: 3, stressTolerance: 5, values: ["meaning", "stability", "autonomy"] },
  schedule: ["weekdays"],
  incomeTarget: "100k+",
  dealBreakers: []
};

function runTest() {
  console.log("=== RUNNING PROGRAMMATIC MATCHING ENGINE TEST ===");

  // A. Evaluate Rada
  console.log("\nEvaluating Rada's Profile...");
  const radaMatches = calculateMatches(radaProfile);
  console.log(`Found ${radaMatches.length} job matches for Rada.`);
  const radaJobIds = radaMatches.slice(0, 4).map(m => m.id);
  console.log("Top matches suggested for Rada:", radaJobIds);

  const expectedRadaMatches = ["adventure_guide", "fitness_coach", "boutique_alterations", "pet_care_specialist"];
  const radaPass = expectedRadaMatches.some(jobId => radaJobIds.includes(jobId));
  if (radaPass) {
    console.log("✅ Rada match verification passed.");
  } else {
    console.error("❌ Rada match verification failed! Expected top matches to include physical or craft options.");
  }

  // B. Evaluate Sonny
  console.log("\nEvaluating Sonny's Profile...");
  const sonnyMatches = calculateMatches(sonnyProfile);
  console.log(`Found ${sonnyMatches.length} job matches for Sonny.`);
  const sonnyJobIds = sonnyMatches.slice(0, 4).map(m => m.id);
  console.log("Top matches suggested for Sonny:", sonnyJobIds);

  const expectedSonnyMatches = ["clinical_reviewer", "clinical_documentation_specialist", "medical_writer", "clinical_policy_analyst"];
  const sonnyPass = expectedSonnyMatches.some(jobId => sonnyJobIds.includes(jobId));
  if (sonnyPass) {
    console.log("✅ Sonny match verification passed.");
  } else {
    console.error("❌ Sonny match verification failed! Expected clinical support / medical review / analyst roles.");
  }

  // C. Evaluate Thomas (Military MOS check)
  console.log("\nEvaluating Thomas's Profile (Military MOS: 60b, 61n)...");
  const thomasMatches = calculateMatches(thomasProfile);
  console.log(`Found ${thomasMatches.length} job matches for Thomas.`);
  const thomasJobIds = thomasMatches.slice(0, 4).map(m => m.id);
  console.log("Top matches suggested for Thomas:", thomasJobIds);
  
  const reviewerMatch = thomasMatches.find(m => m.id === "clinical_reviewer");
  console.log("Details of clinical_reviewer match (expected customized flight surgeon & pediatrician MOS details):");
  console.log(JSON.stringify(reviewerMatch, null, 2));

  const expectedThomasMatches = ["clinical_reviewer", "clinical_documentation_specialist", "medical_writer", "clinical_policy_analyst"];
  const thomasPass = expectedThomasMatches.some(jobId => thomasJobIds.includes(jobId));
  const isRationaleCustomized = reviewerMatch && (reviewerMatch.rationale.includes("Flight Surgeon (61N)") || reviewerMatch.rationale.includes("Pediatrician (60B)"));
  
  if (thomasPass && isRationaleCustomized) {
    console.log("✅ Thomas military match & custom rationale verification passed.");
  } else {
    console.error("❌ Thomas military match verification failed! Check score boosts and rationale customization.");
  }

  if (radaPass && sonnyPass && thomasPass && isRationaleCustomized) {
    console.log("\n🎉 ALL PROGRAMMATIC MATCHING ENGINE TESTS PASSED SUCCESSFULLY! 🎉");
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTest();
