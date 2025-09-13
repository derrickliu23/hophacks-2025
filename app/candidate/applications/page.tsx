'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-300 font-medium">{stat.name}</span>
        <span className="text-white font-bold">{stat.value}/{stat.maxValue}</span>
      </div>
      <div className="h-3 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: isVisible ? `${percentage}%` : 0 }}
          transition={{ duration: 1.5, delay: delay / 1000, ease: "easeOut" }}
          className={`h-full rounded-full ${stat.color} shadow-lg`}
          style={{
            boxShadow: `0 0 20px ${stat.color.includes('blue') ? '#3b82f6' : 
                                 stat.color.includes('purple') ? '#8b5cf6' : 
                                 stat.color.includes('green') ? '#10b981' : 
                                 stat.color.includes('yellow') ? '#f59e0b' : 
                                 '#ef4444'}33`
          }}
        />
      </div>
    </div>
  )
}

export default function CandidateApplications() {
  const [currentCard, setCurrentCard] = useState(0)
  const [direction, setDirection] = useState(0)

  const cardsData: CardData[] = [
    {
      title: "Performance Overview",
      subtitle: "Comprehensive Skill Assessment",
      gradient: "from-blue-600 via-purple-600 to-pink-600",
      icon: "🎯",
      stats: [
        { name: "Data Structures & Algorithms", value: 87, maxValue: 100, color: "bg-gradient-to-r from-blue-500 to-cyan-500" },
        { name: "Machine Learning", value: 92, maxValue: 100, color: "bg-gradient-to-r from-purple-500 to-pink-500" },
        { name: "Probability & Statistics", value: 78, maxValue: 100, color: "bg-gradient-to-r from-green-500 to-emerald-500" },
        { name: "SQL & Databases", value: 95, maxValue: 100, color: "bg-gradient-to-r from-yellow-500 to-orange-500" },
        { name: "Numerical Reasoning", value: 89, maxValue: 100, color: "bg-gradient-to-r from-red-500 to-rose-500" }
      ]
    },
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

  const nextCard = () => {
    setDirection(1)
    setCurrentCard((prev) => (prev + 1) % cardsData.length)
  }

  const prevCard = () => {
    setDirection(-1)
    setCurrentCard((prev) => (prev - 1 + cardsData.length) % cardsData.length)
  }

  const cardVariants = {
    enter: (direction: number) => ({
      rotateY: direction > 0 ? 90 : -90,
      opacity: 0,
      scale: 0.8
    }),
    center: {
      rotateY: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.23, 1, 0.32, 1]
      }
    },
    exit: (direction: number) => ({
      rotateY: direction < 0 ? 90 : -90,
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.8,
        ease: [0.23, 1, 0.32, 1]
      }
    })
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=2500&q=80')" }}
      />
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-gray-900/90 to-black/95" />
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 via-purple-900/20 to-pink-900/20" />
      
      {/* Animated Background Particles */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: Math.random() * 0.5
            }}
            animate={{
              y: [null, -100],
              opacity: [null, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
            Skill Assessment
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 font-light">
            Elite Performance Analytics
          </p>
        </motion.div>

        {/* Card Container */}
        <div className="relative w-full max-w-4xl h-[600px] flex items-center justify-center perspective-1000">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentCard}
              custom={direction}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute w-full max-w-3xl"
              style={{ 
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden'
              }}
            >
              {/* Glassmorphic Card */}
              <div className="relative bg-black/40 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl">
                {/* Card Glow */}
                <div className={`absolute inset-0 bg-gradient-to-r ${cardsData[currentCard].gradient} opacity-20 rounded-3xl blur-xl`} />
                
                {/* Card Header */}
                <div className="relative text-center mb-8">
                  <div className="text-6xl mb-4">{cardsData[currentCard].icon}</div>
                  <h2 className={`text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r ${cardsData[currentCard].gradient}`}>
                    {cardsData[currentCard].title}
                  </h2>
                  <p className="text-gray-400 text-lg">
                    {cardsData[currentCard].subtitle}
                  </p>
                </div>

                {/* Stats */}
                <div className="relative space-y-6">
                  {cardsData[currentCard].stats.map((stat, index) => (
                    <AnimatedStatBar 
                      key={`${currentCard}-${stat.name}`} 
                      stat={stat} 
                      delay={index * 200} 
                    />
                  ))}
                </div>

                {/* Card Footer */}
                <div className="relative text-center mt-8 pt-6 border-t border-white/10">
                  <div className="flex justify-center space-x-4 text-gray-400">
                    <span>Card {currentCard + 1} of {cardsData.length}</span>
                    <span>•</span>
                    <span>Premium Analytics</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center space-x-8 mt-8">
          <motion.button
            onClick={prevCard}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-blue-500/50 transition-all duration-300 border border-blue-500/30"
          >
            ← Previous
          </motion.button>

          {/* Card Indicators */}
          <div className="flex space-x-2">
            {cardsData.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  setDirection(index > currentCard ? 1 : -1)
                  setCurrentCard(index)
                }}
                whileHover={{ scale: 1.2 }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentCard 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-blue-500/50' 
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>

          <motion.button
            onClick={nextCard}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-purple-500/50 transition-all duration-300 border border-purple-500/30"
          >
            Next →
          </motion.button>
        </div>

        {/* Back to Dashboard */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="mt-12"
        >
          <Link href="/candidate">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-black/60 backdrop-blur-sm border border-gray-500/30 text-gray-300 font-medium rounded-xl hover:border-white/50 hover:text-white transition-all duration-300 shadow-lg"
            >
              ← Back to Dashboard
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
