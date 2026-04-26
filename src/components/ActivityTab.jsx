import { useState } from 'react'
import { ShoppingCart, Gamepad2, Shuffle, Trophy, Plus, Minus, RotateCcw, ChefHat, Film } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// --- Shopping list ---
const DEFAULT_ITEMS = [
  '夕食食材（肉・野菜）',
  '朝食食材（卵・パン）',
  '飲み物（ジュース・お茶）',
  'お菓子',
  'デザート',
  '調味料・調味酒',
]

// --- Gacha data ---
const RECIPES = ['カレー', 'パスタ', '餃子', 'チャーハン', '鍋', 'オムライス', 'ピザ', 'たこ焼き', '唐揚げ', 'グラタン']
const MOVIES  = ['君の名は', '天気の子', 'ハウルの動く城', 'となりのトトロ', 'コナン（最新作）', 'すずめの戸締まり', '千と千尋の神隠し', 'もののけ姫']

// --- Shopping Checklist ---
function ShoppingList() {
  const [items, setItems] = useState(DEFAULT_ITEMS.map(t => ({ text: t, checked: false })))

  const toggle = i => setItems(prev => prev.map((it, idx) => idx === i ? { ...it, checked: !it.checked } : it))
  const reset  = () => setItems(DEFAULT_ITEMS.map(t => ({ text: t, checked: false })))
  const doneCount = items.filter(i => i.checked).length

  return (
    <section className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ShoppingCart size={18} className="text-emerald-400" />
          <h3 className="text-sm font-bold text-stone-700">買い出しリスト</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-400">{doneCount}/{items.length}</span>
          <button onClick={reset} className="p-1 rounded-lg hover:bg-stone-100 active:scale-90 transition-transform">
            <RotateCcw size={14} className="text-stone-400" />
          </button>
        </div>
      </div>
      <div className="space-y-1.5">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-stone-50 active:scale-98 transition-all text-left"
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
              item.checked ? 'bg-emerald-400 border-emerald-400' : 'border-stone-300'
            }`}>
              {item.checked && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>
            <span className={`text-sm transition-all ${
              item.checked ? 'line-through text-stone-300' : 'text-stone-700'
            }`}>{item.text}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

// --- Game Score ---
function GameScore() {
  const [scores, setScores] = useState([
    { name: 'ホスト', wins: 0, asset: '' },
    { name: 'ゲスト', wins: 0, asset: '' },
  ])
  const [logs, setLogs] = useState([])
  const [gameName, setGameName] = useState('桃鉄')

  const updateWins = (idx, delta) => {
    setScores(prev => prev.map((p, i) => i === idx ? { ...p, wins: Math.max(0, p.wins + delta) } : p))
  }
  const updateAsset = (idx, val) => {
    setScores(prev => prev.map((p, i) => i === idx ? { ...p, asset: val } : p))
  }
  const addLog = () => {
    const winner = scores[0].wins > scores[1].wins ? scores[0].name : scores[1].wins > scores[0].wins ? scores[1].name : '引き分け'
    setLogs(prev => [{
      game: gameName,
      winner,
      score: `${scores[0].name}${scores[0].wins}勝 / ${scores[1].name}${scores[1].wins}勝`,
      time: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
    }, ...prev].slice(0, 10))
  }

  return (
    <section className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm space-y-4">
      <div className="flex items-center gap-2">
        <Gamepad2 size={18} className="text-purple-400" />
        <h3 className="text-sm font-bold text-stone-700">桃鉄・ボドゲ戦績</h3>
      </div>

      {/* Game name input */}
      <div className="flex gap-2">
        {['桃鉄', 'カタン', 'ナナ', 'UNO'].map(g => (
          <button
            key={g}
            onClick={() => setGameName(g)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
              gameName === g ? 'bg-purple-400 border-purple-400 text-white' : 'border-stone-200 text-stone-500'
            }`}
          >{g}</button>
        ))}
      </div>

      {/* Players */}
      <div className="grid grid-cols-2 gap-3">
        {scores.map((p, i) => (
          <div key={i} className="bg-stone-50 rounded-xl p-3 space-y-2">
            <p className="text-xs font-semibold text-stone-600 text-center">{p.name}</p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => updateWins(i, -1)}
                className="w-7 h-7 rounded-full bg-white border border-stone-200 flex items-center justify-center active:scale-90 transition-transform"
              ><Minus size={13} className="text-stone-500" /></button>
              <span className="text-2xl font-bold text-stone-800 tabular-nums w-8 text-center">{p.wins}</span>
              <button
                onClick={() => updateWins(i, 1)}
                className="w-7 h-7 rounded-full bg-purple-400 flex items-center justify-center active:scale-90 transition-transform"
              ><Plus size={13} className="text-white" /></button>
            </div>
            <p className="text-[10px] text-stone-400 text-center">勝利数</p>
            <input
              type="text"
              placeholder="資産額"
              value={p.asset}
              onChange={e => updateAsset(i, e.target.value)}
              className="w-full text-xs text-center bg-white border border-stone-200 rounded-lg px-2 py-1.5 text-stone-700 placeholder-stone-300 focus:outline-none focus:border-purple-300"
            />
          </div>
        ))}
      </div>

      <button
        onClick={addLog}
        className="w-full bg-purple-400 text-white text-sm font-medium py-2.5 rounded-xl active:scale-98 transition-transform flex items-center justify-center gap-2"
      >
        <Trophy size={15} />
        このゲームを記録する
      </button>

      {/* Logs */}
      {logs.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-stone-400 font-medium">戦績ログ</p>
          {logs.map((log, i) => (
            <div key={i} className="flex items-center justify-between bg-stone-50 rounded-xl px-3 py-2">
              <div>
                <p className="text-xs font-semibold text-stone-700">{log.game}</p>
                <p className="text-[10px] text-stone-400">{log.score}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-purple-500 font-medium">{log.winner}</p>
                <p className="text-[10px] text-stone-400">{log.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

// --- Gacha ---
function GachaCard({ title, icon: Icon, items, color }) {
  const [result, setResult] = useState(null)
  const [spinning, setSpinning] = useState(false)

  const spin = () => {
    setSpinning(true)
    setResult(null)
    setTimeout(() => {
      setResult(items[Math.floor(Math.random() * items.length)])
      setSpinning(false)
    }, 400)
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Icon size={18} className={color} />
        <h3 className="text-sm font-bold text-stone-700">{title}</h3>
      </div>

      <button
        onClick={spin}
        disabled={spinning}
        className={`w-full py-3 rounded-xl font-bold text-sm text-white transition-all active:scale-95 ${
          spinning ? 'opacity-70 cursor-not-allowed' : ''
        } ${color === 'text-rose-400' ? 'bg-rose-400' : 'bg-sky-400'}`}
      >
        <div className="flex items-center justify-center gap-2">
          <Shuffle size={15} className={spinning ? 'animate-spin' : ''} />
          {spinning ? 'ガチャ中...' : 'ガチャる！'}
        </div>
      </button>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className={`mt-4 rounded-xl py-3 text-center ${
              color === 'text-rose-400' ? 'bg-rose-50 border border-rose-100' : 'bg-sky-50 border border-sky-100'
            }`}
          >
            <p className={`text-xl font-bold ${color === 'text-rose-400' ? 'text-rose-500' : 'text-sky-500'}`}>
              {result}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// --- Main ---
export default function ActivityTab() {
  return (
    <div className="px-5 pt-8 pb-4 space-y-5">
      <div>
        <h2 className="text-lg font-bold text-stone-800 mb-1">Activity</h2>
        <p className="text-xs text-stone-400">お楽しみコーナー</p>
      </div>

      <ShoppingList />
      <GameScore />
      <GachaCard title="何作る？ガチャ" icon={ChefHat} items={RECIPES} color="text-rose-400" />
      <GachaCard title="何観る？ガチャ"  icon={Film}    items={MOVIES}  color="text-sky-400"  />
    </div>
  )
}
