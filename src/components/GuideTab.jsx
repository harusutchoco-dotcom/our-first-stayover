import { useState } from 'react'
import { Wifi, Copy, Check, Towel, Droplets, Wind, Smile, Trash2, Volume2, Moon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback: show copied anyway
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-xs bg-stone-100 hover:bg-stone-200 active:scale-95 transition-all px-3 py-1.5 rounded-lg font-mono text-stone-700"
    >
      <span className="truncate max-w-40">{value}</span>
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.span key="check" initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }}>
            <Check size={13} className="text-emerald-500 flex-shrink-0" />
          </motion.span>
        ) : (
          <motion.span key="copy" initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }}>
            <Copy size={13} className="text-stone-400 flex-shrink-0" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}

const AMENITIES = [
  { icon: Towel,   label: 'タオル',         available: true },
  { icon: Droplets, label: '歯ブラシ',      available: true },
  { icon: Wind,    label: 'ドライヤー',      available: true },
  { icon: Smile,   label: 'スキンケア用品', available: true },
]

const RULES = [
  { icon: Trash2,  title: 'ゴミの分別',   body: '燃えるゴミ・ペットボトル・缶・瓶は分けてね。袋は用意してあるよ。' },
  { icon: Volume2, title: '夜の声量',      body: '夜22時以降はちょっと静かめに。壁が薄いので 🙏' },
  { icon: Moon,    title: 'お風呂',        body: 'シャワー・バスタブOK！使った後はざっと流しておいてもらえると助かる。' },
]

export default function GuideTab() {
  return (
    <div className="px-5 pt-8 pb-4 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-stone-800 mb-1">Guide</h2>
        <p className="text-xs text-stone-400">アパート案内</p>
      </div>

      {/* Wi-Fi */}
      <section className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Wifi size={18} className="text-sky-400" />
          <h3 className="text-sm font-bold text-stone-700">Wi-Fi</h3>
        </div>
        <div className="space-y-2">
          <div>
            <p className="text-[10px] text-stone-400 mb-1 uppercase tracking-wide">SSID</p>
            <CopyButton value="YOUR_SSID" />
          </div>
          <div>
            <p className="text-[10px] text-stone-400 mb-1 uppercase tracking-wide">Password</p>
            <CopyButton value="YOUR_PASSWORD" />
          </div>
        </div>
        <p className="text-[11px] text-stone-400">タップでコピーできます</p>
      </section>

      {/* Amenities */}
      <section className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm">
        <h3 className="text-sm font-bold text-stone-700 mb-3">アメニティ</h3>
        <div className="grid grid-cols-2 gap-2">
          {AMENITIES.map(({ icon: Icon, label, available }) => (
            <div
              key={label}
              className={`flex items-center gap-2 rounded-xl px-3 py-2.5 ${
                available ? 'bg-emerald-50 border border-emerald-100' : 'bg-stone-50 border border-stone-100'
              }`}
            >
              <Icon size={15} className={available ? 'text-emerald-500' : 'text-stone-300'} />
              <span className="text-xs text-stone-700">{label}</span>
              {available && <Check size={12} className="text-emerald-400 ml-auto" />}
            </div>
          ))}
        </div>
      </section>

      {/* House Rules */}
      <section className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-stone-700 mb-1">ハウスルール</h3>
        {RULES.map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
              <Icon size={15} className="text-amber-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-700">{title}</p>
              <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">{body}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
