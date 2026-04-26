import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Home, Calendar, BookOpen, Sparkles } from 'lucide-react'
import HomeTab from './components/HomeTab'
import ScheduleTab from './components/ScheduleTab'
import GuideTab from './components/GuideTab'
import ActivityTab from './components/ActivityTab'

const TABS = [
  { id: 'home',     label: 'Home',     icon: Home },
  { id: 'schedule', label: 'Schedule', icon: Calendar },
  { id: 'guide',    label: 'Guide',    icon: BookOpen },
  { id: 'activity', label: 'Activity', icon: Sparkles },
]

const TAB_COMPONENTS = {
  home:     HomeTab,
  schedule: ScheduleTab,
  guide:    GuideTab,
  activity: ActivityTab,
}

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -6, transition: { duration: 0.15 } },
}

export default function App() {
  const [activeTab, setActiveTab] = useState('home')
  const ActiveComponent = TAB_COMPONENTS[activeTab]

  return (
    <div className="flex flex-col h-full max-w-md mx-auto bg-stone-50">
      {/* Scrollable content area */}
      <main className="flex-1 overflow-y-auto pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <ActiveComponent onNavigate={setActiveTab} />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-stone-200 flex safe-bottom shadow-[0_-1px_8px_rgba(0,0,0,0.06)]">
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex flex-col items-center justify-center pt-2 pb-3 gap-0.5 transition-colors ${
                active ? 'text-rose-400' : 'text-stone-400'
              }`}
            >
              <Icon size={22} strokeWidth={active ? 2.2 : 1.8} />
              <span className={`text-[10px] tracking-wide ${active ? 'font-semibold' : 'font-normal'}`}>
                {label}
              </span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
