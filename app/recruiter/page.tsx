'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

function TypewriterHeader() {
  const phrases = ['Recruit, Elevate, Execute', 'Opportunities Await']
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [text, setText] = useState('')
  const [phase, setPhase] = useState<'typing' | 'deleting' | 'done'>('typing')
  const [showCursor, setShowCursor] = useState(true)

  const TYPING_MS = 100
  const DELETING_MS = 50
  const PAUSE_AFTER_TYPING_MS = 2500
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
          setPhase('done')
        } else {
          timeout = setTimeout(() => setPhase('deleting'), PAUSE_AFTER_TYPING_MS)
        }
      } else {
        timeout = setTimeout(() => setText(current.slice(0, text.length + 1)), TYPING_MS)
      }
    } else if (phase === 'deleting') {
      if (text === '') {
        timeout = setTimeout(() => {
          setPhraseIndex(Math.min(phraseIndex + 1, phrases.length - 1))
          setPhase('typing')
        }, PAUSE_BEFORE_NEXT_MS)
      } else {
        timeout = setTimeout(() => setText(current.slice(0, Math.max(0, text.length - 1))), DELETING_MS)
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
  const [activeTab, setActiveTab] = useState('jobs')
  const tabs = ['jobs', 'candidates', 'company', 'analytics', 'messages']

  const renderTabContent = () => {
    switch (activeTab) {
      case 'jobs':
        return (
          <div className="bg-black/20 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-semibold text-white mb-4">Job Postings</h2>
            <p className="text-gray-300 mb-6">Create and manage job listings</p>
            <button className="bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-3 rounded-lg hover:brightness-125 transition-all">
              Post New Job
            </button>
          </div>
        )
      case 'candidates':
        return (
          <div className="bg-black/20 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-semibold text-white mb-4">Candidate Management</h2>
            <p className="text-gray-300 mb-6">Review applications and manage candidates</p>
            <button className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-6 py-3 rounded-lg hover:brightness-125 transition-all">
              View Candidates
            </button>
          </div>
        )
      case 'company':
        return (
          <div className="bg-black/20 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-semibold text-white mb-4">Company Settings</h2>
            <p className="text-gray-300 mb-6">Manage company settings and branding</p>
            <button className="bg-gradient-to-r from-orange-500 to-orange-700 text-white px-6 py-3 rounded-lg hover:brightness-125 transition-all">
              Company Settings
            </button>
          </div>
        )
      case 'analytics':
        return (
          <div className="bg-black/20 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-semibold text-white mb-4">Analytics</h2>
            <p className="text-gray-300 mb-6">View hiring metrics and job performance</p>
            <button className="bg-gradient-to-r from-indigo-500 to-indigo-700 text-white px-6 py-3 rounded-lg hover:brightness-125 transition-all">
              View Analytics
            </button>
          </div>
        )
      case 'messages':
        return (
          <div className="bg-black/20 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-semibold text-white mb-4">Messages</h2>
            <p className="text-gray-300 mb-6">Communicate with candidates</p>
            <button className="bg-gradient-to-r from-pink-500 to-pink-700 text-white px-6 py-3 rounded-lg hover:brightness-125 transition-all">
              View Messages
            </button>
          </div>
        )
      default:
        return (
          <div className="bg-black/20 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-semibold text-white mb-4">Welcome to EleetCode</h2>
            <p className="text-gray-300 mb-6">Select a tab above to get started with your recruiting tasks.</p>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white space-y-8">
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
          Navigate your path to extraordinary opportunities
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-2xl font-medium transition-all ${
              activeTab === tab
                ? 'bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-gray-800/30 text-gray-300 hover:bg-gray-800/50'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Main Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {renderTabContent()}
      </motion.div>
    </div>
  )
}
