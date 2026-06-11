# Recruiter Performance Analytics Dashboard

A professional, mobile-first recruiting performance dashboard with deep contextual metric analysis. Built with React, TypeScript, Vite, and Recharts.

## Quick Start

```bash
# Clone the repository
git clone https://github.com/ayy-j/recruiter-analytics-dashboard.git
cd recruiter-analytics-dashboard

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open **http://localhost:5173** in your browser.

## Build for Production

```bash
npm run build
npm run preview
```

## Dashboard Sections

| Section | Description |
|---|---|
| **Executive Summary** | KPI strip, performance narrative, cumulative throughput, monthly activity, org summary |
| **Operating Context** | Timeline of 7 operating phases, throughput by phase, constraint window narratives |
| **Offer Funnel** | Funnel visualization, stage breakdown, outcome doughnut, accept rates by org, requisition fill persistence |
| **Velocity & Throughput** | Cumulative charts, velocity by phase, run rate comparison, monthly activity |
| **Cycle Time** | Offer→Accept, Accept→Start, Offer→Start metrics, days-to-accept distribution, speed by seniority |
| **Portfolio Mix** | Org split, level distribution (L60–L67), career stage mix, senior share over time, senior hires by domain |
| **Domain Scope** | Domain cards for Azure Core, Quantum, Discovery, and Robotics; complexity narrative; portfolio expansion map |
| **Offer Log** | Full filterable data table with all 53 offer events, computed cycle times, and phase context |

## Data Context

The dashboard contextualizes all metrics against material operating constraints:

- **Jul 14 – Sep 12, 2025**: 60-day onboarding & ramp
- **Sep 12 – Nov 3, 2025**: Full productivity (peak throughput)
- **Nov 3 – Dec 8, 2025**: iCIMS → TA Hub migration pause
- **Dec 9, 2025 – Jan 1, 2026**: Recovery & holiday period
- **Jan 1 – Mar 3, 2026**: Full capacity + internal recruiting
- **Mar 3 – Mar 24, 2026**: Azure Core hiring slowdown
- **Mar 25 – Jun 11, 2026**: Post-slowdown MDQ expansion

## Tech Stack

- **React 18** with function components + hooks
- **TypeScript** for type safety
- **Vite** for fast dev/build
- **React Router v6** for navigation
- **Recharts** for all data visualizations
- **date-fns** for date manipulation
- **Inter + JetBrains Mono** fonts via Google Fonts
- **CSS custom properties** for dark theme theming
- **Mobile-first** responsive design with bottom nav on small screens
