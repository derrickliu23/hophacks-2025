'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface Exam {
  id: string
  title: string
  description: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  duration: number // in minutes
  topics: string[]
  questionCount: number
  language: string
  completed: boolean
  score?: number
}

export default function ExamsPage() {
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all')
  const [filterLanguage, setFilterLanguage] = useState<string>('all')

  // Mock exam data
  const exams: Exam[] = [
    {
      id: 'javascript-fundamentals',
      title: 'JavaScript Fundamentals',
      description: 'Test your understanding of core JavaScript concepts including variables, functions, and data structures.',
      difficulty: 'Easy',
      duration: 45,
      topics: ['Variables', 'Functions', 'Arrays', 'Objects'],
      questionCount: 5,
      language: 'JavaScript',
      completed: true,
      score: 85
    },
    {
      id: 'react-components',
      title: 'React Component Development',
      description: 'Build functional and class components, handle state, and implement event handlers.',
      difficulty: 'Medium',
      duration: 60,
      topics: ['Components', 'State', 'Props', 'Event Handling'],
      questionCount: 4,
      language: 'JavaScript',
      completed: false
    },
    {
      id: 'algorithms-data-structures',
      title: 'Algorithms & Data Structures',
      description: 'Solve complex problems involving sorting, searching, and data manipulation.',
      difficulty: 'Hard',
      duration: 90,
      topics: ['Sorting', 'Searching', 'Trees', 'Graphs'],
      questionCount: 6,
      language: 'Python',
      completed: false
    },
    {
      id: 'python-basics',
      title: 'Python Programming Basics',
      description: 'Demonstrate proficiency in Python syntax, data types, and control structures.',
      difficulty: 'Easy',
      duration: 40,
      topics: ['Syntax', 'Lists', 'Dictionaries', 'Loops'],
      questionCount: 5,
      language: 'Python',
      completed: true,
      score: 92
    },
    {
      id: 'database-queries',
      title: 'SQL Database Queries',
      description: 'Write complex SQL queries including joins, subqueries, and aggregations.',
      difficulty: 'Medium',
      duration: 50,
      topics: ['SELECT', 'JOINS', 'Subqueries', 'Aggregation'],
      questionCount: 4,
      language: 'SQL',
      completed: false
    },
    {
      id: 'system-design',
      title: 'System Design Fundamentals',
      description: 'Design scalable systems and explain architectural decisions.',
      difficulty: 'Hard',
      duration: 120,
      topics: ['Scalability', 'Load Balancing', 'Databases', 'Caching'],
      questionCount: 3,
      language: 'Conceptual',
      completed: false
    }
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'from-green-500 to-emerald-500'
      case 'Medium': return 'from-yellow-500 to-orange-500'
      case 'Hard': return 'from-red-500 to-pink-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getDifficultyTextColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-700'
      case 'Medium': return 'text-orange-700'
      case 'Hard': return 'text-red-700'
      default: return 'text-gray-700'
    }
  }

  const filteredExams = exams.filter(exam => {
    const matchesDifficulty = filterDifficulty === 'all' || exam.difficulty === filterDifficulty
    const matchesLanguage = filterLanguage === 'all' || exam.language === filterLanguage
    return matchesDifficulty && matchesLanguage
  })

  const completedCount = exams.filter(exam => exam.completed).length
  const averageScore = exams.filter(exam => exam.completed && exam.score).reduce((sum, exam) => sum + (exam.score || 0), 0) / exams.filter(exam => exam.completed && exam.score).length || 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
          Coding Examinations
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Test your programming skills with hands-on coding challenges
        </p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
      >
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-700">Total Exams</h3>
          <p className="text-3xl font-bold text-blue-600">{exams.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-700">Completed</h3>
          <p className="text-3xl font-bold text-green-600">{completedCount}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-700">Average Score</h3>
          <p className="text-3xl font-bold text-purple-600">{Math.round(averageScore)}%</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-700">In Progress</h3>
          <p className="text-3xl font-bold text-orange-600">{exams.length - completedCount}</p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col md:flex-row gap-4 justify-center items-center"
      >
        <select
          value={filterDifficulty}
          onChange={(e) => setFilterDifficulty(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <select
          value={filterLanguage}
          onChange={(e) => setFilterLanguage(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Languages</option>
          <option value="JavaScript">JavaScript</option>
          <option value="Python">Python</option>
          <option value="SQL">SQL</option>
          <option value="Conceptual">Conceptual</option>
        </select>
      </motion.div>

      {/* Exams Grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {filteredExams.map((exam, index) => (
          <motion.div
            key={exam.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group relative"
          >
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{exam.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{exam.description}</p>
                  </div>
                  {exam.completed && exam.score && (
                    <div className="ml-4 text-center">
                      <div className="text-2xl font-bold text-green-600">{exam.score}%</div>
                      <div className="text-xs text-gray-500">Score</div>
                    </div>
                  )}
                </div>

                {/* Difficulty Badge */}
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getDifficultyColor(exam.difficulty)} text-white`}>
                    {exam.difficulty}
                  </span>
                  <span className="text-sm text-gray-500">{exam.language}</span>
                </div>
              </div>

              {/* Details */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">{exam.duration}</div>
                    <div className="text-xs text-gray-500">Minutes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">{exam.questionCount}</div>
                    <div className="text-xs text-gray-500">Questions</div>
                  </div>
                </div>

                {/* Topics */}
                <div className="mb-6">
                  <div className="text-sm font-medium text-gray-700 mb-2">Topics:</div>
                  <div className="flex flex-wrap gap-1">
                    {exam.topics.map((topic, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <Link href={`/candidate/exams/${exam.id}`}>
                  <button className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                    exam.completed
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
                  }`}>
                    {exam.completed ? 'Review Exam' : 'Start Exam'}
                  </button>
                </Link>
              </div>

              {/* Completion Indicator */}
              {exam.completed && (
                <div className="absolute top-4 right-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* No Results */}
      {filteredExams.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No exams found</h3>
          <p className="text-gray-500">Try adjusting your filter criteria</p>
        </motion.div>
      )}
    </div>
  )
}
