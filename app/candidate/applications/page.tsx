'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface StatData {
  name: string
  value: number
  maxValue: number
  color: string
}

interface CardData {
  title: string
  subtitle: string
  stats: StatData[]
  gradient: string
  icon: string
}

const AnimatedStatBar = ({ stat, delay = 0 }: { stat: StatData; delay?: number }) => {
  const [isVisible, setIsVisible] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  const percentage = (stat.value / stat.maxValue) * 100
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm font-medium text-gray-300 mb-1">
        <span>{stat.name}</span>
        <span className="text-white font-bold">{stat.value}/{stat.maxValue}</span>
      </div>
      <div className="h-3 bg-gray-800/40 rounded-full overflow-hidden backdrop-blur-sm">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: isVisible ? `${percentage}%` : 0 }}
          transition={{ duration: 1, delay: delay / 1000, ease: "easeOut" }}
          className={`h-full rounded-full ${stat.color} shadow-md`}
          style={{
            boxShadow: `0 0 15px ${
              stat.color.includes('blue') ? '#3b82f6' :
              stat.color.includes('purple') ? '#8b5cf6' :
              stat.color.includes('green') ? '#10b981' :
              stat.color.includes('yellow') ? '#f59e0b' :
              '#ef4444'
            }33`
          }}
        />
      </div>
    </div>
  )
}

export default function CandidateApplications() {
  const cardsData: CardData[] = [
    {
      title: "Data Structures & Algorithms",
      subtitle: "Computational Problem Solving Mastery",
      gradient: "from-blue-500 via-blue-600 to-cyan-600",
      icon: "🧠",
      stats: [
        { name: "Array Manipulation", value: 94, maxValue: 100, color: "bg-gradient-to-r from-blue-400 to-blue-600" },
        { name: "Tree Traversal", value: 88, maxValue: 100, color: "bg-gradient-to-r from-blue-500 to-cyan-500" },
        { name: "Graph Algorithms", value: 85, maxValue: 100, color: "bg-gradient-to-r from-cyan-400 to-blue-500" },
        { name: "Dynamic Programming", value: 82, maxValue: 100, color: "bg-gradient-to-r from-blue-600 to-indigo-600" },
        { name: "Sorting & Searching", value: 91, maxValue: 100, color: "bg-gradient-to-r from-indigo-500 to-blue-500" }
      ]
    },
    {
      title: "Machine Learning",
      subtitle: "Advanced AI & Statistical Modeling",
      gradient: "from-purple-500 via-purple-600 to-pink-600",
      icon: "🤖",
      stats: [
        { name: "Supervised Learning", value: 96, maxValue: 100, color: "bg-gradient-to-r from-purple-400 to-purple-600" },
        { name: "Unsupervised Learning", value: 89, maxValue: 100, color: "bg-gradient-to-r from-purple-500 to-pink-500" },
        { name: "Neural Networks", value: 92, maxValue: 100, color: "bg-gradient-to-r from-pink-400 to-purple-500" },
        { name: "Feature Engineering", value: 87, maxValue: 100, color: "bg-gradient-to-r from-purple-600 to-indigo-600" },
        { name: "Model Evaluation", value: 94, maxValue: 100, color: "bg-gradient-to-r from-indigo-500 to-purple-500" }
      ]
    },
    {
      title: "Probability & Statistics",
      subtitle: "Mathematical Foundation Excellence",
      gradient: "from-green-500 via-green-600 to-emerald-600",
      icon: "📊",
      stats: [
        { name: "Bayesian Inference", value: 83, maxValue: 100, color: "bg-gradient-to-r from-green-400 to-green-600" },
        { name: "Hypothesis Testing", value: 79, maxValue: 100, color: "bg-gradient-to-r from-green-500 to-emerald-500" },
        { name: "Regression Analysis", value: 86, maxValue: 100, color: "bg-gradient-to-r from-emerald-400 to-green-500" },
        { name: "Distribution Theory", value: 81, maxValue: 100, color: "bg-gradient-to-r from-green-600 to-teal-600" },
        { name: "Statistical Modeling", value: 84, maxValue: 100, color: "bg-gradient-to-r from-teal-500 to-green-500" }
      ]
    },
    {
      title: "SQL & Databases",
      subtitle: "Enterprise Data Management",
      gradient: "from-yellow-500 via-orange-500 to-red-500",
      icon: "🗄️",
      stats: [
        { name: "Complex Queries", value: 97, maxValue: 100, color: "bg-gradient-to-r from-yellow-400 to-yellow-600" },
        { name: "Database Design", value: 93, maxValue: 100, color: "bg-gradient-to-r from-yellow-500 to-orange-500" },
        { name: "Performance Optimization", value: 91, maxValue: 100, color: "bg-gradient-to-r from-orange-400 to-yellow-500" },
        { name: "Data Warehousing", value: 89, maxValue: 100, color: "bg-gradient-to-r from-orange-600 to-red-600" },
        { name: "ETL Processes", value: 95, maxValue: 100, color: "bg-gradient-to-r from-red-500 to-orange-500" }
      ]
    },
    {
      title: "Numerical Reasoning",
      subtitle: "Quantitative Analysis Expertise",
      gradient: "from-red-500 via-red-600 to-rose-600",
      icon: "🔢",
      stats: [
        { name: "Financial Modeling", value: 92, maxValue: 100, color: "bg-gradient-to-r from-red-400 to-red-600" },
        { name: "Risk Assessment", value: 87, maxValue: 100, color: "bg-gradient-to-r from-red-500 to-rose-500" },
        { name: "Market Analysis", value: 90, maxValue: 100, color: "bg-gradient-to-r from-rose-400 to-red-500" },
        { name: "Portfolio Optimization", value: 85, maxValue: 100, color: "bg-gradient-to-r from-red-600 to-pink-600" },
        { name: "Quantitative Trading", value: 88, maxValue: 100, color: "bg-gradient-to-r from-pink-500 to-red-500" }
      ]
    }
  ]

  // refs + pointer drag state for scroll-to-drag behavior
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const startScrollLeft = useRef(0)

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const onPointerDown = (e: PointerEvent) => {
      isDragging.current = true
      startX.current = e.clientX
      startScrollLeft.current = container.scrollLeft
      container.setPointerCapture?.((e as any).pointerId)
      container.classList.add('cursor-grabbing', 'select-none')
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return
      const x = e.clientX
      const walk = x - startX.current
      container.scrollLeft = startScrollLeft.current - walk
    }

    const endDrag = (e: PointerEvent) => {
      isDragging.current = false
      try { container.releasePointerCapture?.((e as any).pointerId) } catch {}
      container.classList.remove('cursor-grabbing', 'select-none')
    }

    container.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', endDrag)
    window.addEventListener('pointercancel', endDrag)
    container.addEventListener('pointerleave', endDrag)

    return () => {
      container.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', endDrag)
      window.removeEventListener('pointercancel', endDrag)
      container.removeEventListener('pointerleave', endDrag)
    }
  }, [])

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center bg-black overflow-hidden p-6">
      {/* Background shimmer (behind everything) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/10"
            initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, opacity: Math.random() * 0.25 }}
            animate={{ y: -60, opacity: 0 }}
            transition={{ duration: Math.random() * 12 + 8, repeat: Infinity, ease: "linear" }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 text-center mb-8"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
          Skill Assessment
        </h1>
        <p className="text-lg md:text-xl text-gray-300 font-light">Elite Performance Analytics</p>
      </motion.div>

      {/* Horizontal scroll row — native scrolling with snap */}
      <div
        ref={scrollRef}
        className="z-10 w-full max-w-6xl px-6 py-8 overflow-x-auto flex gap-6 snap-x snap-mandatory scroll-smooth"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {cardsData.map((card, index) => (
          <div
            key={index}
            className="relative snap-center flex-shrink-0 w-72 md:w-80 h-[650px] rounded-3xl bg-black/40 backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden"
          >
            {/* shards - purely decorative panes, behind content */}
            <div className="absolute inset-0 z-0">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute inset-0 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl"
                  style={{ clipPath: `polygon(${i * 16}% 0%, ${(i + 1) * 16}% 0%, ${(i + 1) * 16}% 100%, ${i * 16}% 100%)`, opacity: 0.06 }}
                />
              ))}
              {/* holographic glow (low opacity, behind) */}
              <div className={`absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t ${card.gradient} opacity-20 rounded-b-3xl blur-3xl`} />
            </div>

            {/* Card content (z-10 so it sits above shards) */}
            <div className="relative z-10 w-full h-full flex flex-col justify-between p-6">
              <div className="text-center mt-4">
                <div className="text-6xl mb-2">{card.icon}</div>
                <h2 className={`text-3xl md:text-4xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r ${card.gradient}`}>
                  {card.title}
                </h2>
                <p className="text-gray-400 text-sm md:text-base">{card.subtitle}</p>
              </div>

              <div className="mt-4 flex-1 flex flex-col justify-center space-y-3">
                {card.stats.map((stat, i) => (
                  <AnimatedStatBar key={i} stat={stat} delay={i * 150} />
                ))}
              </div>

              {/* visible holographic strip (above shards) */}
              <div className={`absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t ${card.gradient} opacity-30 rounded-b-3xl blur-2xl`} />
            </div>
          </div>
        ))}
      </div>

      {/* Back button */}
      <div className="mt-8 z-10">
        <Link href="/candidate">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-black/60 backdrop-blur-sm border border-gray-500/20 text-gray-300 font-medium rounded-lg hover:border-white/40 hover:text-white transition-all duration-300"
          >
            ← Back to Dashboard
          </motion.button>
        </Link>
      </div>
    </div>
  )
}
