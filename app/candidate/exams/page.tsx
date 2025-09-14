'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { exams, Exam } from './utils/exams'

export default function ExamsPage() {
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all')
  const [filterLanguage, setFilterLanguage] = useState<string>('all')

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'from-green-500 to-emerald-500'
      case 'Medium': return 'from-yellow-500 to-orange-500'
      case 'Hard': return 'from-red-500 to-pink-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const filteredExams = exams.filter(exam => {
    const matchesDifficulty = filterDifficulty === 'all' || exam.difficulty === filterDifficulty
    const matchesLanguage = filterLanguage === 'all' || exam.language === filterLanguage
    return matchesDifficulty && matchesLanguage
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
          Coding Examinations
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Test your programming skills with hands-on coding challenges
        </p>
        <Link href="/candidate">
          <button className="mt-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white">
            Back to Dashboard
          </button>
        </Link>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="flex flex-col md:flex-row gap-4 justify-center items-center"
      >
        <select
          value={filterDifficulty}
          onChange={(e) => setFilterDifficulty(e.target.value)}
          className="px-4 py-2 border border-gray-600 rounded-lg bg-gray-900 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <select
          value={filterLanguage}
          onChange={(e) => setFilterLanguage(e.target.value)}
          className="px-4 py-2 border border-gray-600 rounded-lg bg-gray-900 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Languages</option>
          <option value="JavaScript">JavaScript</option>
          <option value="Python">Python</option>
          <option value="SQL">SQL</option>
          <option value="Conceptual">Conceptual</option>
        </select>
      </motion.div>

      {/* Exams Grid */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {filteredExams.map((exam) => (
          <motion.div key={exam.id} whileHover={{ scale: 1.02 }} className="bg-gray-900 rounded-2xl shadow-lg border border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-xl font-bold text-white mb-2">{exam.title}</h3>
              <p className="text-gray-300 text-sm line-clamp-2">{exam.description}</p>
              <div className="mt-3 flex justify-between items-center">
                <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getDifficultyColor(exam.difficulty)} text-white`}>
                  {exam.difficulty}
                </span>
                <span className="text-gray-400 text-sm">{exam.language}</span>
              </div>
            </div>
            <div className="p-6 flex flex-col gap-3">
              <div className="flex justify-between text-gray-300 text-sm">
                <span>Duration: {exam.duration} min</span>
                <span>Questions: {exam.questionCount}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {exam.topics.map((topic, idx) => (
                  <span key={idx} className="px-2 py-1 bg-gray-800 text-gray-200 text-xs rounded-md">
                    {topic}
                  </span>
                ))}
              </div>

              {/* Dynamic Exam Link */}
              <Link href={`/candidate/exams/${exam.id}`}>
                <button className="w-full py-2 mt-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium">
                  Take Exam
                </button>
              </Link>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* No Results */}
      {filteredExams.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 text-gray-300">
          <h3 className="text-xl font-semibold mb-2">No exams found</h3>
          <p>Try adjusting your filters</p>
        </motion.div>
      )}
    </div>
  )
}
