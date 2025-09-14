'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface RecruitingEvent {
  id: string
  title: string
  company: string
  date: Date
  time: string
  type: 'interview' | 'networking' | 'presentation' | 'assessment'
  location: string
  description: string
}

function TypewriterHeader() {
  const phrases = ['Limits, Unbounded', 'Opportunities Await']
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

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 8, 1)) // Start in September 2025
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // Mock recruiting events
  const events: RecruitingEvent[] = [
    {
      id: '1',
      title: 'Elite Engineering Summit',
      company: 'Google',
      date: new Date(2025, 8, 15),
      time: '2:00 PM - 4:00 PM',
      type: 'networking',
      location: 'Virtual',
      description: 'Exclusive networking event for top-tier engineering talent'
    },
    {
      id: '2',
      title: 'Technical Interview',
      company: 'Meta',
      date: new Date(2025, 8, 18),
      time: '10:00 AM - 11:30 AM',
      type: 'interview',
      location: 'Menlo Park, CA',
      description: 'Final round technical interview for Senior SWE position'
    },
    {
      id: '3',
      title: 'AI Innovation Showcase',
      company: 'OpenAI',
      date: new Date(2025, 8, 22),
      time: '6:00 PM - 8:00 PM',
      type: 'presentation',
      location: 'San Francisco, CA',
      description: 'Exclusive presentation on cutting-edge AI developments'
    },
    {
      id: '4',
      title: 'System Design Assessment',
      company: 'Netflix',
      date: new Date(2025, 8, 25),
      time: '1:00 PM - 3:00 PM',
      type: 'assessment',
      location: 'Virtual',
      description: 'Advanced system design evaluation for Principal Engineer role'
    },
    {
      id: '5',
      title: 'Coding Challenge',
      company: 'Apple',
      date: new Date(2025, 8, 12),
      time: '9:00 AM - 12:00 PM',
      type: 'assessment',
      location: 'Cupertino, CA',
      description: 'Live coding assessment for iOS Engineering position'
    },
    {
      id: '6',
      title: 'Leadership Panel',
      company: 'Tesla',
      date: new Date(2025, 8, 14),
      time: '3:00 PM - 5:00 PM',
      type: 'presentation',
      location: 'Austin, TX',
      description: 'Panel discussion with Tesla engineering leadership'
    },
    {
      id: '7',
      title: 'Final Interview',
      company: 'Microsoft',
      date: new Date(2025, 8, 16),
      time: '11:00 AM - 1:00 PM',
      type: 'interview',
      location: 'Seattle, WA',
      description: 'Executive interview for Principal Engineering Manager'
    },
    {
      id: '8',
      title: 'Tech Talk Series',
      company: 'Amazon',
      date: new Date(2025, 8, 19),
      time: '4:00 PM - 6:00 PM',
      type: 'networking',
      location: 'Virtual',
      description: 'AWS architecture deep dive with senior engineers'
    },
    {
      id: '9',
      title: 'Product Demo Day',
      company: 'Stripe',
      date: new Date(2025, 8, 20),
      time: '1:00 PM - 3:00 PM',
      type: 'presentation',
      location: 'San Francisco, CA',
      description: 'Showcase of latest payment infrastructure innovations'
    },
    {
      id: '10',
      title: 'Pair Programming',
      company: 'Airbnb',
      date: new Date(2025, 8, 21),
      time: '10:00 AM - 12:00 PM',
      type: 'assessment',
      location: 'Virtual',
      description: 'Collaborative coding session for Senior Full-Stack role'
    },
    {
      id: '11',
      title: 'Startup Pitch Night',
      company: 'Y Combinator',
      date: new Date(2025, 8, 23),
      time: '7:00 PM - 9:00 PM',
      type: 'networking',
      location: 'Mountain View, CA',
      description: 'Exclusive networking with YC founders and engineers'
    },
    {
      id: '12',
      title: 'Architecture Review',
      company: 'Uber',
      date: new Date(2025, 8, 26),
      time: '2:00 PM - 4:00 PM',
      type: 'interview',
      location: 'San Francisco, CA',
      description: 'System architecture discussion for Staff Engineer position'
    },
    {
      id: '13',
      title: 'Quantum Computing Workshop',
      company: 'IBM',
      date: new Date(2025, 8, 27),
      time: '9:00 AM - 5:00 PM',
      type: 'presentation',
      location: 'New York, NY',
      description: 'Hands-on workshop with quantum computing researchers'
    },
    {
      id: '14',
      title: 'Culture Fit Interview',
      company: 'Spotify',
      date: new Date(2025, 8, 28),
      time: '3:00 PM - 4:00 PM',
      type: 'interview',
      location: 'Virtual',
      description: 'Values alignment discussion for Senior Backend Engineer'
    },
    {
      id: '15',
      title: 'ML Engineering Symposium',
      company: 'DeepMind',
      date: new Date(2025, 8, 30),
      time: '10:00 AM - 6:00 PM',
      type: 'networking',
      location: 'London, UK',
      description: 'Annual gathering of AI/ML engineering talent'
    },
    {
      id: '21',
      title: 'Team Meet & Greet',
      company: 'Slack',
      date: new Date(2025, 8, 5),
      time: '3:00 PM - 5:00 PM',
      type: 'networking',
      location: 'Virtual',
      description: 'Casual meetup with engineering team members'
    },
    {
      id: '22',
      title: 'Design Challenge',
      company: 'Figma',
      date: new Date(2025, 8, 9),
      time: '1:00 PM - 4:00 PM',
      type: 'assessment',
      location: 'San Francisco, CA',
      description: 'Product design assessment for Frontend Engineer role'
    },
    {
      id: '23',
      title: 'CTO Coffee Chat',
      company: 'Discord',
      date: new Date(2025, 8, 11),
      time: '4:00 PM - 5:00 PM',
      type: 'interview',
      location: 'Virtual',
      description: 'Informal chat with CTO about engineering culture'
    },
    // August 2025 events
    {
      id: '16',
      title: 'Phone Screening',
      company: 'ByteDance',
      date: new Date(2025, 7, 28),
      time: '2:00 PM - 3:00 PM',
      type: 'interview',
      location: 'Virtual',
      description: 'Initial technical screening for TikTok backend engineer'
    },
    {
      id: '17',
      title: 'Startup Demo Day',
      company: 'Sequoia Capital',
      date: new Date(2025, 7, 25),
      time: '5:00 PM - 8:00 PM',
      type: 'networking',
      location: 'Palo Alto, CA',
      description: 'Portfolio company presentations and networking'
    },
    {
      id: '18',
      title: 'Code Review Session',
      company: 'GitHub',
      date: new Date(2025, 7, 22),
      time: '11:00 AM - 1:00 PM',
      type: 'assessment',
      location: 'Virtual',
      description: 'Collaborative code review for Platform Engineer role'
    },
    // October 2025 events
    {
      id: '19',
      title: 'Follow-up Interview',
      company: 'Palantir',
      date: new Date(2025, 9, 3),
      time: '10:00 AM - 11:30 AM',
      type: 'interview',
      location: 'Palo Alto, CA',
      description: 'Technical deep dive for Forward Deployed Engineer'
    },
    {
      id: '20',
      title: 'AI Conference',
      company: 'NVIDIA',
      date: new Date(2025, 9, 8),
      time: '9:00 AM - 6:00 PM',
      type: 'networking',
      location: 'San Jose, CA',
      description: 'GPU Technology Conference networking session'
    }
  ]

  const today = new Date()
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i)

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const getEventsForDate = (day: number) => {
    return events.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate.getDate() === day && 
             eventDate.getMonth() === month && 
             eventDate.getFullYear() === year
    })
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'interview': return 'bg-red-500'
      case 'networking': return 'bg-blue-500'
      case 'presentation': return 'bg-purple-500'
      case 'assessment': return 'bg-orange-500'
      default: return 'bg-gray-500'
    }
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Invite-Only Events
        </h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={prevMonth}
            className="p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all"
          >
            ←
          </button>
          <h3 className="text-xl font-semibold text-white min-w-[200px] text-center">
            {monthNames[month]} {year}
          </h3>
          <button
            onClick={nextMonth}
            className="p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <div className="bg-black/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl">
            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-gray-400 font-medium py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {emptyDays.map(day => (
                <div key={`empty-${day}`} className="h-24" />
              ))}
              {days.map(day => {
                const dayEvents = getEventsForDate(day)
                const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year
                const hasEvents = dayEvents.length > 0
                
                return (
                  <motion.div
                    key={day}
                    whileHover={{ scale: 1.05 }}
                    className={`h-24 p-2 rounded-lg cursor-pointer transition-all relative ${
                      isToday 
                        ? 'bg-gradient-to-br from-blue-500/30 to-purple-500/30 border border-blue-400/50' 
                        : hasEvents
                        ? 'bg-white/5 hover:bg-white/10 border border-white/10'
                        : 'hover:bg-white/5'
                    }`}
                    onClick={() => setSelectedDate(new Date(year, month, day))}
                  >
                    <div className="flex flex-col h-full">
                      <span className={`text-sm font-medium ${
                        isToday ? 'text-white' : hasEvents ? 'text-white' : 'text-gray-300'
                      }`}>
                        {day}
                      </span>
                      <div className="flex-1 mt-1">
                        {dayEvents.slice(0, 2).map((event, index) => (
                          <div
                            key={event.id}
                            className={`text-xs px-1 py-0.5 rounded mb-1 ${getEventTypeColor(event.type)} text-white truncate`}
                          >
                            {event.company}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-gray-400">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Event Details Sidebar */}
        <div className="space-y-4">
          <div className="bg-black/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">Upcoming Events</h3>
            <div className="space-y-4">
              {events
                .filter(event => event.date >= today)
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .slice(0, 3)
                .map(event => (
                  <motion.div
                    key={event.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getEventTypeColor(event.type)} mt-1.5`} />
                      <div className="flex-1">
                        <h4 className="font-medium text-white">{event.title}</h4>
                        <p className="text-sm text-gray-300">{event.company}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {event.date.toLocaleDateString()} • {event.time}
                        </p>
                        <p className="text-xs text-gray-400">{event.location}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>

          {/* Event Legend */}
          <div className="bg-black/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">Event Types</h3>
            <div className="space-y-2">
              {[
                { type: 'interview', label: 'Interviews', color: 'bg-red-500' },
                { type: 'networking', label: 'Networking', color: 'bg-blue-500' },
                { type: 'presentation', label: 'Presentations', color: 'bg-purple-500' },
                { type: 'assessment', label: 'Assessments', color: 'bg-orange-500' }
              ].map(item => (
                <div key={item.type} className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm text-gray-300">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CandidateDashboard() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

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
          Navigate your path to extraordinary opportunities
        </p>
      </motion.div>

      {/* Calendar Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Calendar />
      </motion.div>
    </div>
  )
}
