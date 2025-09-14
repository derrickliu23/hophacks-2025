export interface TestCase {
  input: any[]
  expected: any
}

export interface Question {
  id: number
  prompt: string
  starterCode?: string
  language: 'JavaScript' | 'Python' | 'Conceptual' | 'SQL'
  testCases: TestCase[]
}

export interface Exam {
  id: string
  title: string
  description: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  duration: number // in minutes
  topics: string[]
  language: 'Python' | 'JavaScript' | 'SQL' | 'Conceptual'
  questions: Question[]
  completed: boolean
  score?: number
  questionCount: number
}

export const exams: Exam[] = [
  {
    id: 'javascript-fundamentals',
    title: 'JavaScript Fundamentals',
    description: 'Test your understanding of core JavaScript concepts including variables, functions, and data structures.',
    difficulty: 'Easy',
    duration: 45,
    topics: ['Variables', 'Functions', 'Arrays', 'Objects'],
    language: 'JavaScript',
    completed: true,
    score: 85,
    questions: [
      {
        id: 1,
        prompt: 'Write a function sum(a, b) that returns the sum of two numbers.',
        starterCode: 'function sum(a, b) {\n  // your code here\n}',
        language: 'JavaScript',
        testCases: [
          { input: [1, 2], expected: 3 },
          { input: [-1, 1], expected: 0 },
          { input: [10, 5], expected: 15 }
        ]
      },
      {
        id: 2,
        prompt: 'Return the square of each number in an array.',
        starterCode: 'function squareArray(arr) {\n  // your code here\n}',
        language: 'JavaScript',
        testCases: [
          { input: [[1, 2, 3]], expected: [1, 4, 9] },
          { input: [[0, 5]], expected: [0, 25] }
        ]
      }
    ],
    questionCount: 2
  },
  {
    id: 'react-components',
    title: 'React Component Development',
    description: 'Build functional and class components, handle state, and implement event handlers.',
    difficulty: 'Medium',
    duration: 60,
    topics: ['Components', 'State', 'Props', 'Event Handling'],
    language: 'JavaScript',
    completed: false,
    questions: [
      {
        id: 1,
        prompt: 'Create a functional component that displays "Hello, World!".',
        starterCode: 'function HelloWorld() {\n  // your code here\n}',
        language: 'JavaScript',
        testCases: [
          { input: [], expected: '<div>Hello, World!</div>' }
        ]
      },
      {
        id: 2,
        prompt: 'Create a stateful counter component with increment and decrement buttons.',
        starterCode: 'function Counter() {\n  // your code here\n}',
        language: 'JavaScript',
        testCases: [
          { input: [], expected: 'renders with initial count 0' }
        ]
      }
    ],
    questionCount: 2
  },
  {
    id: 'algorithms-data-structures',
    title: 'Algorithms & Data Structures',
    description: 'Solve complex problems involving sorting, searching, and data manipulation.',
    difficulty: 'Hard',
    duration: 90,
    topics: ['Sorting', 'Searching', 'Trees', 'Graphs'],
    language: 'Python',
    completed: false,
    questions: [
      {
        id: 1,
        prompt: 'Implement quicksort for an array of integers.',
        starterCode: 'def quicksort(arr):\n    # your code here',
        language: 'Python',
        testCases: [
          { input: [[3, 1, 2]], expected: [1, 2, 3] },
          { input: [[5, -1, 0]], expected: [-1, 0, 5] }
        ]
      }
    ],
    questionCount: 1
  },
  {
    id: 'python-basics',
    title: 'Python Programming Basics',
    description: 'Demonstrate proficiency in Python syntax, data types, and control structures.',
    difficulty: 'Easy',
    duration: 40,
    topics: ['Syntax', 'Lists', 'Dictionaries', 'Loops'],
    language: 'Python',
    completed: true,
    score: 92,
    questions: [
      {
        id: 1,
        prompt: 'Write a function that returns the sum of a list of numbers.',
        starterCode: 'def sum_list(lst):\n    # your code here',
        language: 'Python',
        testCases: [
          { input: [[1,2,3]], expected: 6 },
          { input: [[-1,1]], expected: 0 }
        ]
      }
    ],
    questionCount: 1
  },
  {
    id: 'database-queries',
    title: 'SQL Database Queries',
    description: 'Write complex SQL queries including joins, subqueries, and aggregations.',
    difficulty: 'Medium',
    duration: 50,
    topics: ['SELECT', 'JOINS', 'Subqueries', 'Aggregation'],
    language: 'SQL',
    completed: false,
    questions: [
      {
        id: 1,
        prompt: 'Write an SQL query to select all users with age > 18.',
        starterCode: 'SELECT * FROM users WHERE age > 18;',
        language: 'SQL',
        testCases: [
          { input: [], expected: 'SELECT * FROM users WHERE age > 18;' }
        ]
      }
    ],
    questionCount: 1
  },
  {
    id: 'system-design',
    title: 'System Design Fundamentals',
    description: 'Design scalable systems and explain architectural decisions.',
    difficulty: 'Hard',
    duration: 120,
    topics: ['Scalability', 'Load Balancing', 'Databases', 'Caching'],
    language: 'Conceptual',
    completed: false,
    questions: [
      {
        id: 1,
        prompt: 'Design a URL shortening service like bit.ly.',
        starterCode: '// Describe your design here',
        language: 'Conceptual',
        testCases: []
      }
    ],
    questionCount: 1
  }
]
