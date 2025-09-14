'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { exams, Exam, Question, TestCase } from '../utils/exams'

interface ExamPageProps {
  params: { examId: string }
}

export default function ExamPage({ params }: ExamPageProps) {
  const { examId } = params
  const exam = exams.find(e => e.id === examId)

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<string[]>(Array(exam?.questions.length || 0).fill(''))
  const [testResults, setTestResults] = useState<{ passed: boolean; output: any; expected: any }[][]>(
    Array(exam?.questions.length || 0).fill([])
  )
  const [scores, setScores] = useState<number[]>(Array(exam?.questions.length || 0).fill(0))
  const [submitted, setSubmitted] = useState(false)
  const [timeLeft, setTimeLeft] = useState((exam?.duration ?? 60) * 60) // in seconds

  if (!exam) return <div className="text-white text-center py-12">Exam not found</div>

  const currentQuestion = exam.questions[currentQuestionIndex]

  // Timer effect
  useEffect(() => {
    if (submitted) return
    if (timeLeft <= 0) {
      submitExam()
      return
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000)
    return () => clearInterval(timer)
  }, [timeLeft, submitted])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const handleAnswerChange = (value: string) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestionIndex] = value
    setAnswers(newAnswers)
  }

  const runCode = () => {
    const results: { passed: boolean; output: any; expected: any }[] = []

    currentQuestion.testCases.forEach(tc => {
      try {
        // eslint-disable-next-line no-eval
        const func = eval(`(${answers[currentQuestionIndex]})`)
        const output = func(...tc.input)
        const passed = JSON.stringify(output) === JSON.stringify(tc.expected)
        results.push({ passed, output, expected: tc.expected })
      } catch (err: any) {
        results.push({ passed: false, output: err.message, expected: tc.expected })
      }
    })

    const newTestResults = [...testResults]
    newTestResults[currentQuestionIndex] = results
    setTestResults(newTestResults)

    const passedCount = results.filter(r => r.passed).length
    const total = results.length
    const newScores = [...scores]
    newScores[currentQuestionIndex] = Math.round((passedCount / total) * 100)
    setScores(newScores)
  }

  const submitExam = () => {
    exam.questions.forEach((_, idx) => {
      setCurrentQuestionIndex(idx)
      runCode()
    })
    setSubmitted(true)
  }

  const totalScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-60 bg-white/5 backdrop-blur-lg border-r border-white/20 p-4 flex flex-col overflow-y-auto">
        <Link href="/candidate/exams" className="text-white/80 mb-4 font-medium hover:underline">
          ← Back to Exams
        </Link>

        <h2 className="text-white/90 font-bold mb-4">{exam.title}</h2>
        {exam.questions.map((q, idx) => (
          <button
            key={q.id}
            onClick={() => setCurrentQuestionIndex(idx)}
            className={`mb-2 p-2 rounded-lg text-left text-white/90 font-medium transition-all w-full ${
              currentQuestionIndex === idx
                ? 'bg-blue-500/50'
                : scores[idx] > 0
                ? 'bg-green-500/20'
                : 'hover:bg-white/10'
            }`}
          >
            Question {idx + 1} {scores[idx] > 0 ? `• ${scores[idx]}%` : ''}
          </button>
        ))}

        <div className="mt-auto">
          <div className="text-white/80 mb-2">Time Left: {formatTime(timeLeft)}</div>
          <button
            onClick={submitExam}
            className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            Submit Exam
          </button>

          {submitted && (
            <div className="mt-4 text-white/90 bg-white/10 backdrop-blur-sm p-3 rounded-lg">
              <h3 className="font-bold mb-2">Exam Submitted!</h3>
              <p>Total Score: {totalScore}%</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="bg-white/5 backdrop-blur-lg border-b border-white/20 p-4 flex justify-between items-center">
          <div className="text-white/90 font-semibold">
            {exam.difficulty} • {exam.duration} min • Question {currentQuestionIndex + 1}/{exam.questions.length}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Problem */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-1/2 bg-white/10 backdrop-blur-lg border-r border-white/20 p-6 overflow-y-auto"
          >
            <h3 className="text-white/90 font-bold text-lg mb-4">Question {currentQuestionIndex + 1}</h3>
            <p className="text-gray-300 whitespace-pre-wrap">{currentQuestion.prompt}</p>
          </motion.div>

          {/* Editor + results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-1/2 flex flex-col p-6"
          >
            <textarea
              value={answers[currentQuestionIndex]}
              onChange={(e) => handleAnswerChange(e.target.value)}
              className="flex-1 w-full p-3 rounded-lg bg-white/10 text-white/90 border border-white/20 font-mono resize-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              placeholder={currentQuestion.starterCode || '// Write your function here...'}
            />

            <div className="flex gap-2 mt-4">
              <button
                onClick={runCode}
                className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium hover:from-green-600 hover:to-emerald-600 transition-all"
              >
                Run Code
              </button>
            </div>

            {testResults[currentQuestionIndex].length > 0 && (
              <div className="mt-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg p-3 text-white/90 font-mono overflow-y-auto max-h-60">
                <h3 className="font-semibold mb-2">Test Cases</h3>
                <ul className="space-y-1">
                  {testResults[currentQuestionIndex].map((r, idx) => (
                    <li key={idx} className="flex justify-between">
                      <span>Test {idx + 1}</span>
                      <span className={r.passed ? 'text-green-400' : 'text-red-400'}>
                        {r.passed ? 'Passed ✅' : `Failed ❌ (Got: ${JSON.stringify(r.output)})`}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-2 font-bold">Score: {scores[currentQuestionIndex]}%</div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
