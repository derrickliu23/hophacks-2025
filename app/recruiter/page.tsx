'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

function TypewriterHeader() {
  const phrases = ['Elite Talent Hub', 'Excellence Awaits']
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [text, setText] = useState('')
  const [phase, setPhase] = useState<'typing' | 'deleting' | 'done'>('typing')
  const [showCursor, setShowCursor] = useState(true)

  const TYPING_MS = 120
  const DELETING_MS = 70
  const PAUSE_AFTER_TYPING_MS = 3000
  const PAUSE_BEFORE_NEXT_MS = 1000

  useEffect(() => {
    if (phase === 'done') {
      setShowCursor(false)
      return
    }
    const iv = setInterval(() => setShowCursor(v => !v), 500)
    return () => clearInterval(iv)
  }, [phase])

  useEffect(() => {
    if (phase === 'done') return

    const current = phrases[phraseIndex]
    let timeout: any

    if (phase === 'typing') {
      if (text === current) {
        if (phraseIndex === phrases.length - 1) {
          // Final phrase reached: stop the loop and keep the text
          setPhase('done')
        } else {
          timeout = setTimeout(() => setPhase('deleting'), PAUSE_AFTER_TYPING_MS)
        }
      } else {
        timeout = setTimeout(() => {
          setText(current.slice(0, text.length + 1))
        }, TYPING_MS)
      }
    } else if (phase === 'deleting') {
      if (text === '') {
        timeout = setTimeout(() => {
          setPhraseIndex(Math.min(phraseIndex + 1, phrases.length - 1))
          setPhase('typing')
        }, PAUSE_BEFORE_NEXT_MS)
      } else {
        timeout = setTimeout(() => {
          setText(current.slice(0, Math.max(0, text.length - 1)))
        }, DELETING_MS)
      }
    }

    return () => clearTimeout(timeout)
  }, [text, phase, phraseIndex])

  return (
    <span className="inline-flex items-baseline">
      <span>{text}</span>
      {phase !== 'done' && (
        <span
          className={`${showCursor ? 'opacity-100' : 'opacity-0'} ml-1 inline-block align-baseline w-[2px] h-[1em] bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500`}
          aria-hidden="true"
        />
      )}
    </span>
  )
}

export default function RecruiterDashboard() {
  const stats = [
    { title: "Active Jobs", value: "12", change: "+3 this week", gradient: "from-blue-500 to-cyan-500" },
    { title: "Applications", value: "248", change: "15 pending review", gradient: "from-green-500 to-emerald-500" },
    { title: "Interviews", value: "32", change: "8 this week", gradient: "from-purple-500 to-pink-500" },
    { title: "Elite Candidates", value: "56", change: "Top 1% talent", gradient: "from-orange-500 to-red-500" }
  ]

  const quickActions = [
    { 
      title: "View Candidates", 
      description: "Browse elite talent profiles", 
      gradient: "from-blue-600 to-purple-600",
      href: "/recruiter/candidates"
    },
    { 
      title: "Post New Job", 
      description: "Create compelling job listings", 
      gradient: "from-green-600 to-emerald-600",
      href: "/recruiter/jobs"
    },
    { 
      title: "Analytics", 
      description: "Track hiring performance", 
      gradient: "from-purple-600 to-pink-600",
      href: "/recruiter/analytics"
    },
    { 
      title: "Company Profile", 
      description: "Manage your organization", 
      gradient: "from-orange-600 to-red-600",
      href: "/recruiter/company"
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-6"
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
          <TypewriterHeader />
        </h1>
        <p className="text-xl text-gray-300 font-light">
          Connect with exceptional talent at the highest level
        </p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            whileHover={{ scale: 1.05, y: -5 }}
            className="relative bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl hover:shadow-xl transition-all duration-300"
          >
            {/* Glow Effect */}
            <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-20 rounded-2xl blur-xl`} />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className={`px-2 py-1 bg-gradient-to-r ${stat.gradient} text-white text-xs rounded-lg`}>
                  LIVE
                </div>
              </div>
              <h3 className="text-gray-300 text-sm font-medium mb-2">{stat.title}</h3>
              <p className={`text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${stat.gradient} mb-1`}>
                {stat.value}
              </p>
              <p className="text-gray-400 text-xs">{stat.change}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
      >
        {quickActions.map((action, index) => (
          <motion.div
            key={action.title}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className="group relative"
          >
            <Link href={action.href}>
              <div className="relative bg-black/60 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl hover:shadow-xl transition-all duration-500 h-full">
                {/* Hover Glow */}
                <div className={`absolute inset-0 bg-gradient-to-r ${action.gradient} opacity-0 group-hover:opacity-20 rounded-3xl blur-2xl transition-opacity duration-500`} />
                
                <div className="relative">
                  <h2 className={`text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r ${action.gradient}`}>
                    {action.title}
                  </h2>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {action.description}
                  </p>
                  <div className={`inline-flex items-center px-6 py-3 bg-gradient-to-r ${action.gradient} text-white font-semibold rounded-xl shadow-lg transition-all duration-300`}>
                    Launch →
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Activity */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative bg-black/40 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl"
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-white/10">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Recent Recruiting Activity
          </h2>
          <p className="text-gray-400 mt-1">Latest updates in your talent pipeline</p>
        </div>
        
        {/* Activity List */}
        <div className="p-8">
          <div className="space-y-6">
            {[
              { text: "New application from Senior ML Engineer at Stanford", time: "2 hours ago", color: "green" },
              { text: "Interview scheduled with Full-Stack Engineer from Meta", time: "4 hours ago", color: "blue" },
              { text: "Job posting for Principal Engineer published", time: "6 hours ago", color: "purple" },
              { text: "Offer accepted by Backend Engineer from Google", time: "1 day ago", color: "pink" }
            ].map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
              >
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${
                  activity.color === 'green' ? 'from-green-400 to-emerald-500' :
                  activity.color === 'blue' ? 'from-blue-400 to-cyan-500' :
                  activity.color === 'purple' ? 'from-purple-400 to-pink-500' :
                  'from-pink-400 to-rose-500'
                } shadow-lg`} />
                <div className="flex-1">
                  <p className="text-white font-medium">{activity.text}</p>
                  <p className="text-gray-400 text-sm">{activity.time}</p>
                </div>
                <div className="text-gray-500">
                  →
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
