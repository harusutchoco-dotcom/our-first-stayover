import { useState, useEffect } from 'react'
import { Calendar, MapPin, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

// All schedule items (shared logic with ScheduleTab)
const ALL_SCHEDULE = [
  { day: 5, time: '09:50', label: '上田駅発（しなの鉄道）' },
  { day: 5, time: '10:34', label: '長野駅着' },
  { day: 5, time: '10:50', label: '長野駅前発（高速バス 0003便）' },
  { day: 5, time: '13:19', label: '長岡北バス停着' },
  { day: 5, time: '13:20', label: 'アパートへ移動（徒歩22分）' },
  { day: 5, time: '13:45', label: 'アパート到着・開会宣言 🎉' },
  { day: 5, time: '15:00', label: 'ボドゲ・桃鉄タイム' },
  { day: 5, time: '17:00', label: '買い出し作戦会議' },
  { day: 5, time: '18:30', label: 'クッキング & 夕食' },
  { day: 6, time: '09:00', label: '朝食作り' },
  { day: 6, time: '11:30', label: 'お散歩・長岡造形大学周辺散策' },
  { day: 6, time: '13:25', label: '長岡造形大学前バス発' },
  { day: 6, time: '13:50', label: '長岡駅着' },
  { day: 6, time: '14:10', label: '長岡駅発（新幹線）' },
]

function toMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number)
  return h * 60 + m
}

function getCurrentItem(now) {
  const month = now.getMonth() + 1
  const day = now.getDate()
  if (month !== 5 || (day !== 5 && day !== 6)) return null

  const nowMin = now.getHours() * 60 + now.getMinutes()
  const todayItems = ALL_SCHEDULE.filter(i => i.day === day)

  let current = null
  for (let i = 0; i < todayItems.length; i++) {
    const itemMin = toMinutes(todayItems[i].time)
    const nextMin = i + 1 < todayItems.length ? toMinutes(todayItems[i + 1].time) : 24 * 60
    if (nowMin >= itemMin && nowMin < nextMin) {
      current = todayItems[i]
      break
    }
  }
  return current
}

function useCountdown(target) {
  const [diff, setDiff] = useState(() => target - Date.now())
  useEffect(() => {
    const id = setInterval(() => setDiff(target - Date.now()), 1000)
    return () => clearInterval(id)
  }, [target])
  return diff
}

export default function HomeTab({ onNavigate }) {
  const [now, setNow] = useState(new Date())
  const TARGET = new Date('2025-05-05T09:50:00').getTime()
  const diff = useCountdown(TARGET)

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(id)
  }, [])

  const currentItem = getCurrentItem(now)
  const isEventDay = now.getMonth() + 1 === 5 && (now.getDate() === 5 || now.getDate() === 6)

  const totalSec = Math.max(0, Math.floor(diff / 1000))
  const days  = Math.floor(totalSec / 86400)
  const hours = Math.floor((totalSec % 86400) / 3600)
  const mins  = Math.floor((totalSec % 3600) / 60)
  const secs  = totalSec % 60
  const pad   = n => String(n).padStart(2, '0')

  return (
    <div className="px-5 pt-8 pb-4 space-y-6">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center space-y-1"
      >
        <div className="text-4xl mb-3">🏠✨</div>
        <h1 className="text-xl font-bold text-stone-800 leading-snug">
          Our First Stayover
        </h1>
        <p className="text-sm text-rose-400 font-medium tracking-wide">in Nagaoka</p>
        <p className="text-xs text-stone-400 mt-1">May 5–6, 2025</p>
      </motion.div>

      {/* Countdown or current */}
      {diff > 0 && !isEventDay ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.35 }}
          className="bg-gradient-to-br from-rose-50 to-amber-50 rounded-2xl p-5 border border-rose-100 text-center"
        >
          <p className="text-xs text-rose-400 font-semibold uppercase tracking-widest mb-3">
            Countdown
          </p>
          <div className="flex justify-center gap-3">
            {[['日', days], ['時', hours], ['分', mins], ['秒', secs]].map(([unit, val]) => (
              <div key={unit} className="flex flex-col items-center">
                <span className="text-3xl font-bold text-rose-500 tabular-nums">{pad(val)}</span>
                <span className="text-[10px] text-stone-400 mt-0.5">{unit}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-stone-400 mt-3">5月5日 09:50 まで</p>
        </motion.div>
      ) : isEventDay && currentItem ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-rose-50 to-amber-50 rounded-2xl p-5 border border-rose-200"
        >
          <p className="text-xs text-rose-400 font-semibold uppercase tracking-widest mb-2">Now</p>
          <p className="text-base font-bold text-stone-800">{currentItem.time}</p>
          <p className="text-stone-700 mt-0.5">{currentItem.label}</p>
        </motion.div>
      ) : isEventDay ? (
        <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100 text-center">
          <p className="text-stone-600 text-sm">全スケジュール完了！お疲れさま 🎊</p>
        </div>
      ) : null}

      {/* Info cards */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onNavigate('schedule')}
          className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm text-left hover:bg-stone-50 active:scale-95 transition-transform"
        >
          <Calendar size={20} className="text-sky-400 mb-2" />
          <p className="text-xs font-semibold text-stone-700">スケジュール</p>
          <p className="text-[10px] text-stone-400 mt-0.5">1泊2日の行程</p>
        </button>
        <button
          onClick={() => onNavigate('guide')}
          className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm text-left hover:bg-stone-50 active:scale-95 transition-transform"
        >
          <MapPin size={20} className="text-emerald-400 mb-2" />
          <p className="text-xs font-semibold text-stone-700">アパート案内</p>
          <p className="text-[10px] text-stone-400 mt-0.5">Wi-Fi・設備情報</p>
        </button>
      </div>

      {/* Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm"
      >
        <p className="text-sm text-stone-600 leading-relaxed">
          はじめてのお泊まり、楽しもうね 🌙<br />
          ゆっくり、のんびり、二人の時間。
        </p>
        <button
          onClick={() => onNavigate('activity')}
          className="mt-3 flex items-center gap-1 text-xs text-rose-400 font-medium"
        >
          アクティビティを見る <ChevronRight size={14} />
        </button>
      </motion.div>
    </div>
  )
}
