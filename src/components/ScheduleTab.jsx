import { useState, useEffect } from 'react'
import { Train, Bus, Home, Gamepad2, ShoppingCart, UtensilsCrossed, Coffee, TreePine, Navigation } from 'lucide-react'

const DAY1 = [
  { time: '09:50', label: '上田駅発（しなの鉄道）',      icon: Train,          note: 'しなの鉄道で長野へ' },
  { time: '10:34', label: '長野駅着',                    icon: Train,          note: '' },
  { time: '10:50', label: '長野駅前発（高速バス 0003便）', icon: Bus,            note: '高速バスで長岡へ約2.5時間' },
  { time: '13:19', label: '長岡北バス停着',              icon: Navigation,     note: 'ここから徒歩22分' },
  { time: '13:20', label: 'アパートへ移動',              icon: Navigation,     note: '県道69号経由・徒歩22分' },
  { time: '13:45', label: 'アパート到着・開会宣言 🎉',   icon: Home,           note: 'やっと着いた〜！' },
  { time: '15:00', label: 'ボドゲ・桃鉄タイム',         icon: Gamepad2,       note: '全力で遊ぶ時間' },
  { time: '17:00', label: '買い出し作戦会議',            icon: ShoppingCart,   note: '夕食の食材を買いに' },
  { time: '18:30', label: 'クッキング & 夕食',           icon: UtensilsCrossed, note: '一緒に作ろう' },
]

const DAY2 = [
  { time: '09:00', label: '朝食作り',                        icon: Coffee,         note: 'のんびり朝ごはん' },
  { time: '11:30', label: 'お散歩・長岡造形大学周辺散策',   icon: TreePine,       note: '緑の中を歩こう' },
  { time: '13:25', label: '長岡造形大学前バス発',           icon: Bus,            note: '長岡駅大手口行き' },
  { time: '13:50', label: '長岡駅着',                       icon: Navigation,     note: '' },
  { time: '14:10', label: '長岡駅発（新幹線）',             icon: Train,          note: 'また会おうね 👋' },
]

function toMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number)
  return h * 60 + m
}

function getStatus(item, index, items, now, day) {
  const month = now.getMonth() + 1
  const date  = now.getDate()
  if (month !== 5 || date !== day) {
    if (month === 5 && date > day) return 'past'
    if (month === 5 && date < day) return 'future'
    if (month > 5) return 'past'
    return 'future'
  }
  const nowMin  = now.getHours() * 60 + now.getMinutes()
  const itemMin = toMinutes(item.time)
  const nextMin = index + 1 < items.length ? toMinutes(items[index + 1].time) : 24 * 60
  if (nowMin >= itemMin && nowMin < nextMin) return 'current'
  if (nowMin >= nextMin) return 'past'
  return 'future'
}

function TimelineItem({ item, index, items, now, day }) {
  const status = getStatus(item, index, items, now, day)
  const Icon = item.icon
  const isLast = index === items.length - 1

  return (
    <div className="flex gap-3">
      {/* Left: dot + line */}
      <div className="flex flex-col items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-all ${
          status === 'current' ? 'bg-rose-400 shadow-lg shadow-rose-200 ring-4 ring-rose-100' :
          status === 'past'    ? 'bg-stone-200' :
                                 'bg-white border-2 border-stone-200'
        }`}>
          <Icon size={15} className={
            status === 'current' ? 'text-white' :
            status === 'past'    ? 'text-stone-400' :
                                   'text-stone-400'
          } />
        </div>
        {!isLast && (
          <div className={`w-0.5 flex-1 my-1 ${status === 'past' ? 'bg-stone-200' : 'bg-stone-100'}`} />
        )}
      </div>

      {/* Right: content */}
      <div className={`flex-1 pb-4 ${isLast ? '' : ''}`}>
        <div className={`rounded-xl p-3 transition-all ${
          status === 'current' ? 'bg-rose-50 border border-rose-200' :
          status === 'past'    ? 'opacity-45' :
                                 ''
        }`}>
          <div className="flex items-baseline gap-2">
            <span className={`text-sm font-bold tabular-nums ${
              status === 'current' ? 'text-rose-500' : 'text-stone-500'
            }`}>{item.time}</span>
            {status === 'current' && (
              <span className="text-[10px] bg-rose-400 text-white px-1.5 py-0.5 rounded-full font-medium">NOW</span>
            )}
          </div>
          <p className={`text-sm font-medium mt-0.5 ${
            status === 'current' ? 'text-stone-800' : 'text-stone-700'
          }`}>{item.label}</p>
          {item.note && (
            <p className="text-[11px] text-stone-400 mt-0.5">{item.note}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ScheduleTab() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="px-5 pt-8 pb-4">
      <h2 className="text-lg font-bold text-stone-800 mb-1">Schedule</h2>
      <p className="text-xs text-stone-400 mb-6">1泊2日の旅程</p>

      {/* Day 1 */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-rose-400 text-white text-xs font-bold px-3 py-1 rounded-full">Day 1</span>
          <span className="text-xs text-stone-500">5月5日（月）</span>
        </div>
        <div>
          {DAY1.map((item, i) => (
            <TimelineItem key={i} item={item} index={i} items={DAY1} now={now} day={5} />
          ))}
        </div>
      </div>

      {/* Day 2 */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-sky-400 text-white text-xs font-bold px-3 py-1 rounded-full">Day 2</span>
          <span className="text-xs text-stone-500">5月6日（火）</span>
        </div>
        <div>
          {DAY2.map((item, i) => (
            <TimelineItem key={i} item={item} index={i} items={DAY2} now={now} day={6} />
          ))}
        </div>
      </div>
    </div>
  )
}
