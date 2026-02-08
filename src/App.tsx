import { Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { lazy, Suspense } from 'react'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Workout = lazy(() => import('./pages/Workout'))
const Calendar = lazy(() => import('./pages/Calendar'))
const Analytics = lazy(() => import('./pages/Analytics'))
const Settings = lazy(() => import('./pages/Settings'))

const navItems = [
  { path: '/', label: 'HOME', icon: '⬡' },
  { path: '/workout', label: 'TREINO', icon: '◆' },
  { path: '/calendar', label: 'PLANO', icon: '▦' },
  { path: '/analytics', label: 'DADOS', icon: '◈' },
  { path: '/settings', label: 'CONFIG', icon: '⚙' },
]

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-accent-gold border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function App() {
  const location = useLocation()
  const isWorkoutActive = location.pathname === '/workout'

  return (
    <div className="min-h-dvh bg-bg-primary flex flex-col">
      <main className={`flex-1 ${isWorkoutActive ? '' : 'pb-18'}`}>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/workout" element={<Workout />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Suspense>
      </main>

      {!isWorkoutActive && (
        <nav className="fixed bottom-0 left-0 right-0 bg-bg-secondary border-t border-border z-50">
          <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-1 text-xs font-display font-semibold tracking-wider transition-colors ${
                    isActive
                      ? 'text-accent-gold'
                      : 'text-text-muted hover:text-text-secondary'
                  }`
                }
              >
                <span className="text-lg leading-none">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </div>
  )
}

export default App
