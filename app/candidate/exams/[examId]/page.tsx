'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'

interface Question {
  id: string
  title: string
  description: string
  difficulty: string
  starterCode: string
  language: string
  testCases: TestCase[]
  hints: string[]
}

interface TestCase {
  input: string
  expectedOutput: string
  explanation?: string
}

interface Exam {
  id: string
  title: string
  questions: Question[]
  duration: number
  timeRemaining: number
}

export default function ExamPage() {
  const params = useParams()
  const router = useRouter()
  const examId = params.examId as string

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [code, setCode] = useState('')
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [testResults, setTestResults] = useState<boolean[]>([])
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Mock exam data
  const examData: { [key: string]: Exam } = {
    'javascript-fundamentals': {
      id: 'javascript-fundamentals',
      title: 'JavaScript Fundamentals',
      duration: 45 * 60, // 45 minutes in seconds
      timeRemaining: 45 * 60,
      questions: [
        {
          id: 'js-1',
          title: 'Array Sum Function',
          description: 'Write a function that takes an array of numbers and returns their sum.',
          difficulty: 'Easy',
          language: 'javascript',
          starterCode: `function sumArray(numbers) {
  // Your code here
  
}`,
          testCases: [
            { input: '[1, 2, 3, 4, 5]', expectedOutput: '15' },
            { input: '[]', expectedOutput: '0' },
            { input: '[-1, 1, 0]', expectedOutput: '0' }
          ],
          hints: [
            'Use a loop to iterate through the array',
            'Initialize a sum variable to 0',
            'Add each element to the sum'
          ]
        },
        {
          id: 'js-2',
          title: 'String Reversal',
          description: 'Create a function that reverses a string without using built-in reverse methods.',
          difficulty: 'Easy',
          language: 'javascript',
          starterCode: `function reverseString(str) {
  // Your code here
  
}`,
          testCases: [
            { input: '"hello"', expectedOutput: '"olleh"' },
            { input: '"javascript"', expectedOutput: '"tpircsavaj"' },
            { input: '""', expectedOutput: '""' }
          ],
          hints: [
            'Loop through the string from end to beginning',
            'Build a new string character by character',
            'Consider using string indexing'
          ]
        }
      ]
    },
    'react-components': {
      id: 'react-components',
      title: 'React Component Development',
      duration: 60 * 60,
      timeRemaining: 60 * 60,
      questions: [
        {
          id: 'react-1',
          title: 'Counter Component',
          description: 'Create a React counter component with increment and decrement buttons.',
          difficulty: 'Medium',
          language: 'javascript',
          starterCode: `import React, { useState } from 'react';

function Counter() {
  // Your code here
  
  return (
    <div>
      {/* Your JSX here */}
    </div>
  );
}

export default Counter;`,
          testCases: [
            { input: 'Initial render', expectedOutput: 'Counter displays 0' },
            { input: 'Click increment', expectedOutput: 'Counter displays 1' },
            { input: 'Click decrement', expectedOutput: 'Counter displays -1' }
          ],
          hints: [
            'Use useState hook for state management',
            'Create event handlers for increment and decrement',
            'Display the current count value'
          ]
        }
      ]
    }
  }

  const exam = examData[examId]
  const currentQuestion = exam?.questions[currentQuestionIndex]

  useEffect(() => {
    if (!exam) {
      router.push('/candidate/exams')
      return
    }

    setTimeRemaining(exam.timeRemaining)

    // Timer countdown
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmitExam()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [exam])

  // Separate effect for code initialization to prevent interference with typing
  useEffect(() => {
    if (currentQuestion) {
      setCode(currentQuestion.starterCode || '')
      setTestResults([])
    }
  }, [currentQuestionIndex]) // Only when question index changes

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleRunCode = () => {
    // Mock test execution
    const mockResults = currentQuestion?.testCases.map(() => Math.random() > 0.3)
    setTestResults(mockResults || [])
  }

  const handleSubmitExam = () => {
    setIsSubmitted(true)
    // Handle exam submission logic
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (exam?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  if (!exam) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Exam Not Found</h2>
          <button
            onClick={() => router.push('/candidate/exams')}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
          >
            Back to Exams
          </button>
        </div>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-24"
      >
        <div className="bg-white rounded-2xl shadow-lg p-12 max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Exam Submitted!</h2>
          <p className="text-gray-600 mb-8">Your answers have been recorded. Results will be available soon.</p>
          <button
            onClick={() => router.push('/candidate/exams')}
            className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to Exams
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-800">{exam.title}</h1>
              <span className="text-sm text-gray-500">
                Question {currentQuestionIndex + 1} of {exam.questions.length}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`px-4 py-2 rounded-lg font-mono text-lg font-bold ${
                timeRemaining < 300 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {formatTime(timeRemaining)}
              </div>
              <button
                onClick={toggleFullscreen}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Problem Panel */}
          <div className="w-1/2 bg-gray-50 border-r border-gray-200 overflow-y-auto">
            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">{currentQuestion?.title}</h2>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    currentQuestion?.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                    currentQuestion?.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {currentQuestion?.difficulty}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">{currentQuestion?.description}</p>
              </div>

              {/* Test Cases */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Test Cases</h3>
                <div className="space-y-3">
                  {currentQuestion?.testCases.map((testCase, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">Test Case {index + 1}</span>
                        {testResults.length > 0 && (
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            testResults[index] ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {testResults[index] ? 'PASS' : 'FAIL'}
                          </span>
                        )}
                      </div>
                      <div className="text-sm">
                        <div className="mb-1">
                          <span className="font-medium text-gray-700">Input:</span>
                          <code className="ml-2 bg-gray-100 px-2 py-1 rounded">{testCase.input}</code>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Expected:</span>
                          <code className="ml-2 bg-gray-100 px-2 py-1 rounded">{testCase.expectedOutput}</code>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hints */}
              <div className="mb-6">
                <button
                  onClick={() => setShowHints(!showHints)}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                >
                  <svg className={`w-4 h-4 transition-transform ${showHints ? 'rotate-90' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Hints ({currentQuestion?.hints.length})</span>
                </button>
                {showHints && (
                  <div className="mt-3 space-y-2">
                    {currentQuestion?.hints.map((hint, index) => (
                      <div key={index} className="bg-yellow-50 border-l-4 border-yellow-400 p-3">
                        <p className="text-sm text-yellow-800">{hint}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Code Editor Panel */}
          <div className="w-1/2 flex flex-col">
            {/* Editor Header */}
            <div className="bg-gray-800 text-white px-4 py-2 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium">{currentQuestion?.language}</span>
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleRunCode}
                  className="bg-green-600 hover:bg-green-700 px-4 py-1 rounded text-sm font-medium transition-colors"
                >
                  Run Code
                </button>
              </div>
            </div>

            {/* Code Editor */}
            <div className="flex-1 bg-gray-900">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-full bg-gray-900 text-green-400 font-mono text-sm p-4 border-none outline-none resize-none focus:ring-0"
                style={{ lineHeight: '1.5' }}
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                placeholder="// Start coding here..."
                tabIndex={0}
                readOnly={false}
              />
            </div>

            {/* Navigation and Actions */}
            <div className="bg-white border-t border-gray-200 px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <button
                    onClick={handlePrevQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNextQuestion}
                    disabled={currentQuestionIndex === (exam.questions.length - 1)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <button
                  onClick={handleSubmitExam}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium"
                >
                  Submit Exam
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
