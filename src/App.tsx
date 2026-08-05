import { Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { Home, Dumbbell, CalendarDays, BarChart3, Settings2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Workout = lazy(() => import('./pages/Workout'))
const Calendar = lazy(() => import('./pages/Calendar'))
const Analytics = lazy(() => import('./pages/Analytics'))
const Settings = lazy(() => import('./pages/Settings'))
const Warmup = lazy(() => import('./pages/Warmup'))

const navItems: { path: string; label: string; icon: LucideIcon }[] = [
  { path: '/', label: 'HOME', icon: Home },
  { path: '/workout', label: 'TREINO', icon: Dumbbell },
  { path: '/calendar', label: 'PLANO', icon: CalendarDays },
  { path: '/analytics', label: 'DADOS', icon: BarChart3 },
  { path: '/settings', label: 'CONFIG', icon: Settings2 },
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
      <main className={`flex-1 ${isWorkoutActive ? '' : 'pb-18'}`} style={!isWorkoutActive ? { paddingBottom: 'calc(4.5rem + env(safe-area-inset-bottom))' } : undefined}>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/workout" element={<Workout />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/warmup" element={<Warmup />} />
          </Routes>
        </Suspense>
      </main>

      {!isWorkoutActive && (
        <nav className="fixed bottom-0 left-0 right-0 bg-bg-secondary border-t border-border z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
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
                <item.icon size={20} strokeWidth={2} />
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
