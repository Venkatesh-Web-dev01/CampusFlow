import { getCustomOpportunities } from './storage';

// Default fallback seeds if json-server is not active
const SEED_OPPORTUNITIES = [
  {
    id: "opp-1",
    title: "Software Engineering Summer Internship 2026",
    organization: "Google Tech",
    type: "Internship",
    category: "Software Engineering",
    location: "Mountain View, CA / Hybrid",
    deadline: "2026-10-15",
    stipend: "$8,500 / month",
    description: "12-week summer internship working on high-performance infrastructure, cloud APIs, and developer tooling. Collaborate with senior engineering mentors.",
    eligibility: "Currently enrolled in BS, MS, or PhD in Computer Science or related STEM field. Expected graduation 2027.",
    applyUrl: "https://careers.google.com/students",
    tags: ["Software", "React", "Cloud", "Paid", "Hybrid"]
  },
  {
    id: "opp-2",
    title: "Global AI Agent Hackathon 2026",
    organization: "Anthropic & DeepMind",
    type: "Hackathon",
    category: "Artificial Intelligence",
    location: "Online / Global",
    deadline: "2026-09-25",
    stipend: "$50,000 Cash Prizes",
    description: "Build autonomous AI agents for productivity, healthcare, or education over an intensive 48-hour global hackathon.",
    eligibility: "Open to all undergraduate and graduate students globally. Teams up to 4 members.",
    applyUrl: "https://www.anthropic.com",
    tags: ["AI/ML", "Hackathon", "Cash Prize", "Global"]
  },
  {
    id: "opp-3",
    title: "Women in Tech STEM Leadership Scholarship",
    organization: "Grace Hopper Foundation",
    type: "Scholarship",
    category: "Diversity & STEM",
    location: "Global",
    deadline: "2026-11-01",
    stipend: "$10,000 Tuition Grant + Conference Ticket",
    description: "Providing financial assistance and career mentorship to high-achieving women pursuing degrees in computer science and engineering.",
    eligibility: "Undergraduate women studying CS/IT/ECE with minimum 3.2 GPA.",
    applyUrl: "https://ghc.anitab.org",
    tags: ["Scholarship", "WomenInTech", "Grant", "Mentorship"]
  },
  {
    id: "opp-4",
    title: "Full-Stack Web Architecture Intensive Workshop",
    organization: "Vite & React Core Team",
    type: "Workshop",
    category: "Web Development",
    location: "Online Interactive",
    deadline: "2026-09-18",
    stipend: "Free Certification & Swag",
    description: "Hands-on masterclass covering Next.js 15, Server Components, Vite optimizations, and state synchronization.",
    eligibility: "Basic knowledge of JS/React required. Free registration for student email domains.",
    applyUrl: "https://react.dev",
    tags: ["Workshop", "React", "Vite", "Free"]
  },
  {
    id: "opp-5",
    title: "National Undergraduate Algorithm Challenge",
    organization: "Competitive Coding Association",
    type: "Competition",
    category: "Competitive Programming",
    location: "Online",
    deadline: "2026-09-30",
    stipend: "$15,000 + FAANG Interview Opportunities",
    description: "Speed coding competition testing dynamic programming, graph algorithms, and system design concepts under time constraints.",
    eligibility: "All enrolled college students. Individual participation.",
    applyUrl: "https://codeforces.com",
    tags: ["Algorithms", "DataStructures", "Competition", "Prizes"]
  },
  {
    id: "opp-6",
    title: "Product Design & UX Research Fellowship",
    organization: "Figma Education",
    type: "Internship",
    category: "Design & UX",
    location: "San Francisco, CA / Remote",
    deadline: "2026-10-20",
    stipend: "$7,000 / month",
    description: "Work directly with Figma product designers conducting user interviews, building wireframes, and testing design systems.",
    eligibility: "Students majoring in HCI, Product Design, Interaction Design, or related.",
    applyUrl: "https://www.figma.com/careers",
    tags: ["Design", "Figma", "UX", "Paid"]
  },
  {
    id: "opp-7",
    title: "Quantum Computing Student Innovation Grant",
    organization: "IBM Quantum Network",
    type: "Scholarship",
    category: "Quantum & Physics",
    location: "Global / Remote",
    deadline: "2026-12-05",
    stipend: "$12,000 Project Funding",
    description: "Grants awarded to student researchers developing algorithms on IBM Qiskit hardware for quantum optimization.",
    eligibility: "Undergraduate senior or Master's student conducting independent quantum computing project.",
    applyUrl: "https://www.ibm.com/quantum",
    tags: ["Quantum", "Research", "Grant", "IBM"]
  },
  {
    id: "opp-8",
    title: "Cybersecurity Capture The Flag (CTF) Showdown",
    organization: "DEF CON Student Chapter",
    type: "Competition",
    category: "Cybersecurity",
    location: "Online Virtual Arena",
    deadline: "2026-09-22",
    stipend: "$8,000 + Security Certifications",
    description: "Jeopardy-style CTF challenge covering web exploitation, reverse engineering, cryptography, and forensics.",
    eligibility: "Open to student security clubs and solo participants.",
    applyUrl: "https://defcon.org",
    tags: ["Cybersecurity", "CTF", "EthicalHacking", "Competition"]
  }
];

const API_BASE_URL = 'http://localhost:5000/opportunities';

export const fetchOpportunities = async () => {
  let apiData = [];
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200); // Fast timeout for json-server fallback
    const res = await fetch(API_BASE_URL, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      apiData = await res.json();
    } else {
      apiData = SEED_OPPORTUNITIES;
    }
  } catch (err) {
    // Graceful fallback if json-server is offline
    apiData = SEED_OPPORTUNITIES;
  }

  // Merge with locally created custom opportunities
  const customOpps = getCustomOpportunities();
  const allOpps = [...customOpps, ...apiData];
  
  // Deduplicate by ID
  const uniqueMap = new Map();
  allOpps.forEach((item) => uniqueMap.set(item.id, item));
  return Array.from(uniqueMap.values());
};

export const postOpportunity = async (newOpportunity) => {
  try {
    const res = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOpportunity),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('json-server not available for POST, fallback to local storage');
  }
  return newOpportunity;
};
