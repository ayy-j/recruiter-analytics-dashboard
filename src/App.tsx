import { Routes, Route, NavLink, useLocation } from 'react-router-dom'
import ExecutiveSummary from './pages/ExecutiveSummary'
import OperatingContext from './pages/OperatingContext'
import OfferFunnel from './pages/OfferFunnel'
import Velocity from './pages/Velocity'
import CycleTime from './pages/CycleTime'
import PortfolioMix from './pages/PortfolioMix'
import DomainScope from './pages/DomainScope'
import OfferLog from './pages/OfferLog'

const navSections = [
  {
    label: 'Overview',
    items: [
      { to: '/', icon: '📊', label: 'Executive Summary', end: true },
      { to: '/context', icon: '🗓️', label: 'Operating Context' },
    ],
  },
  {
    label: 'Performance',
    items: [
      { to: '/funnel', icon: '🔽', label: 'Offer Funnel' },
      { to: '/velocity', icon: '⚡', label: 'Velocity & Throughput' },
      { to: '/cycle-time', icon: '⏱️', label: 'Cycle Time' },
    ],
  },
  {
    label: 'Portfolio',
    items: [
      { to: '/portfolio', icon: '🎯', label: 'Portfolio Mix' },
      { to: '/domains', icon: '🌐', label: 'Domain Scope' },
    ],
  },
  {
    label: 'Data',
    items: [
      { to: '/offers', icon: '📋', label: 'Offer Log' },
    ],
  },
]

const allNavItems = navSections.flatMap((s) => s.items)

export default function App() {
  const location = useLocation()

  return (
    <div className="app-shell">
      {/* Desktop Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">📈</div>
          <div className="sidebar-brand-text">Recruiter<br />Analytics</div>
        </div>
        <nav className="sidebar-nav">
          {navSections.map((section) => (
            <div key={section.label}>
              <div className="sidebar-section-label">{section.label}</div>
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                >
                  <span className="nav-item-icon">{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<ExecutiveSummary />} />
          <Route path="/context" element={<OperatingContext />} />
          <Route path="/funnel" element={<OfferFunnel />} />
          <Route path="/velocity" element={<Velocity />} />
          <Route path="/cycle-time" element={<CycleTime />} />
          <Route path="/portfolio" element={<PortfolioMix />} />
          <Route path="/domains" element={<DomainScope />} />
          <Route path="/offers" element={<OfferLog />} />
        </Routes>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-nav">
        {allNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `mobile-nav-item${isActive ? ' active' : ''}`
            }
          >
            <span className="mobile-nav-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
