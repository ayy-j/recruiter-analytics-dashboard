export interface OperatingPhase {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  description: string;
  color: string;
  category: 'ramp' | 'normal' | 'constrained' | 'recovery' | 'expansion';
}

export const HIRE_DATE = '2025-07-14';
export const FULL_PRODUCTIVITY_DATE = '2025-09-12';
export const REPORT_AS_OF = '2026-06-11';
export const RAMP_DAYS = 60;

export const phases: OperatingPhase[] = [
  {
    id: 'ramp',
    name: 'Onboarding & Ramp',
    startDate: '2025-07-14',
    endDate: '2025-09-12',
    description:
      'Initial 60-day ramp period. Building stakeholder relationships, learning recruiting tooling and processes, sourcing strategy development, and early pipeline building for Azure Core & AI Infrastructure roles.',
    color: '#f59e0b',
    category: 'ramp',
  },
  {
    id: 'full-productivity',
    name: 'Full Productivity',
    startDate: '2025-09-12',
    endDate: '2025-11-03',
    description:
      'Operating at full productivity across Cloud + AI requisitions. Active pipeline management, offer generation, and candidate closing during peak throughput period.',
    color: '#22c55e',
    category: 'normal',
  },
  {
    id: 'migration',
    name: 'iCIMS → TA Hub Migration',
    startDate: '2025-11-03',
    endDate: '2025-12-08',
    description:
      'Near-complete global recruiting activity pause during ATS migration. Recruiting throughput materially constrained. Offers extended during this window reflect work completed before or started after the pause.',
    color: '#ef4444',
    category: 'constrained',
  },
  {
    id: 'recovery',
    name: 'Recovery Period',
    startDate: '2025-12-09',
    endDate: '2026-01-01',
    description:
      'Gradual restoration of recruiting capacity post-migration. Ramp-up of TA Hub proficiency, pipeline reactivation, and resumption of offer activity.',
    color: '#f59e0b',
    category: 'recovery',
  },
  {
    id: 'full-capacity',
    name: 'Full Capacity + Internal Recruiting',
    startDate: '2026-01-01',
    endDate: '2026-03-03',
    description:
      'Full capacity restored with added responsibility for internal candidate recruitment alongside external. Peak throughput period with balanced portfolio across Cloud + AI and emerging MDQ domains.',
    color: '#22c55e',
    category: 'expansion',
  },
  {
    id: 'azure-slowdown',
    name: 'Azure Core Slowdown & Portfolio Transition',
    startDate: '2026-03-03',
    endDate: '2026-03-24',
    description:
      'Azure Core hiring slowdown reduced capacity. Support transitioned toward Discovery, Quantum, and Robotics teams. MDQ portfolio expanded as primary focus area.',
    color: '#f59e0b',
    category: 'constrained',
  },
  {
    id: 'expansion',
    name: 'Post-Slowdown Expansion',
    startDate: '2026-03-25',
    endDate: REPORT_AS_OF,
    description:
      'Full MDQ focus across Quantum Computing, Scientific Discovery, and Robotics. High-velocity offer generation with senior-level specialization in deeply technical domains.',
    color: '#a855f7',
    category: 'expansion',
  },
];

export function getPhaseForDate(dateStr: string): OperatingPhase | null {
  for (const phase of phases) {
    if (dateStr >= phase.startDate && dateStr <= phase.endDate) return phase;
  }
  return null;
}

export interface DomainInfo {
  id: string;
  name: string;
  shortName: string;
  description: string;
  areas: string[];
  color: string;
}

export const domains: DomainInfo[] = [
  {
    id: 'azure-core',
    name: 'Azure Core & AI Infrastructure',
    shortName: 'Azure Core',
    description:
      'Hyperscale cloud platforms spanning compute, networking, storage, security, distributed systems, AI (GPU/Supercompute) infrastructure, accelerated computing, custom silicon, and optical networking — supporting OpenAI Supercompute and Fairwater datacenter initiatives.',
    areas: [
      'Compute Infrastructure',
      'Networking & SDN',
      'Storage Systems',
      'Cloud Security',
      'Distributed Systems',
      'GPU / Supercompute',
      'Accelerated Computing',
      'Custom Silicon',
      'Optical Networking',
    ],
    color: '#3b82f6',
  },
  {
    id: 'quantum',
    name: 'Microsoft Quantum',
    shortName: 'Quantum',
    description:
      'Scientific computing and advanced research platforms including quantum hardware/software, quantum algorithms, HPC, custom ASIC/FPGA development, quantum chemistry, materials science, and quantum physics research.',
    areas: [
      'Quantum Hardware',
      'Quantum Software',
      'Quantum Algorithms',
      'High-Performance Computing',
      'ASIC / FPGA Development',
      'Quantum Chemistry',
      'Materials Science',
      'Quantum Physics',
    ],
    color: '#a855f7',
  },
  {
    id: 'discovery',
    name: 'Microsoft Discovery — AI for Science',
    shortName: 'Discovery',
    description:
      'Enterprise AI platforms for scientific reasoning, knowledge graphs, multi-agent orchestration, simulation, hypothesis generation, and AI-driven discovery across chemistry, life sciences, pharma, healthcare, energy, semiconductors, and advanced manufacturing.',
    areas: [
      'Scientific Reasoning AI',
      'Knowledge Graphs',
      'Multi-Agent Orchestration',
      'Simulation Workflows',
      'Hypothesis Generation',
      'AI-Driven Discovery',
    ],
    color: '#06b6d4',
  },
  {
    id: 'robotics',
    name: 'Microsoft Robotics',
    shortName: 'Robotics',
    description:
      'Robotics platforms spanning autonomous systems, embodied AI, ROS, vision-language-action models, robotic perception, edge/distributed computing, fleet orchestration, industrial automation, field robotics, human-robot interaction, and large-scale IoT.',
    areas: [
      'Autonomous Systems',
      'Embodied AI',
      'Robot Operating Systems',
      'Vision-Language-Action Models',
      'Robotic Perception',
      'Edge & Distributed Computing',
      'Fleet Orchestration',
      'Industrial Automation',
      'Field Robotics',
      'Human-Robot Interaction',
      'Large-Scale IoT',
    ],
    color: '#f59e0b',
  },
];
