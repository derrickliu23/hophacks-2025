'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { motion } from 'framer-motion'

interface Candidate {
  id: string
  first_name: string
  last_name: string
  headline: string
  avatar_url: string
  email: string
  linkedin: string
  // Mock scores for the Pokemon card effect
  technical_score: number
  experience_score: number
  communication_score: number
  culture_fit_score: number
  overall_rating: number
  // Additional mock data for detailed view
  skills?: string[]
  experience_years?: number
  education?: string
  location?: string
  salary_expectation?: string
}

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterBy, setFilterBy] = useState('all')
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [showModal, setShowModal] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchCandidates()
  }, [])

  const fetchCandidates = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, first_name, last_name, headline, avatar_url, email, linkedin')
        .eq('role', 'candidate')

      if (error) throw error

      // Add mock scores and additional data for demonstration
      const skillsPool = ['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'GraphQL', 'PostgreSQL', 'MongoDB', 'Kubernetes', 'TensorFlow', 'Vue.js', 'Django', 'Spring Boot', 'Redis', 'Elasticsearch']
      const educationPool = ['BS Computer Science - Stanford', 'MS Software Engineering - MIT', 'BS Electrical Engineering - Berkeley', 'PhD Computer Science - CMU', 'BS Mathematics - Harvard', 'MS Data Science - Columbia']
      const locationPool = ['San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Austin, TX', 'Boston, MA', 'Los Angeles, CA', 'Chicago, IL', 'Denver, CO']
      
      const candidatesWithScores = data?.map(candidate => ({
        ...candidate,
        technical_score: Math.floor(Math.random() * 100) + 1,
        experience_score: Math.floor(Math.random() * 100) + 1,
        communication_score: Math.floor(Math.random() * 100) + 1,
        culture_fit_score: Math.floor(Math.random() * 100) + 1,
        overall_rating: Math.floor(Math.random() * 100) + 1,
        skills: skillsPool.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 6) + 3),
        experience_years: Math.floor(Math.random() * 15) + 1,
        education: educationPool[Math.floor(Math.random() * educationPool.length)],
        location: locationPool[Math.floor(Math.random() * locationPool.length)],
        salary_expectation: `$${Math.floor(Math.random() * 200 + 80)}k - $${Math.floor(Math.random() * 100 + 250)}k`
      })) || []

      setCandidates(candidatesWithScores)
    } catch (error) {
      console.error('Error fetching candidates:', error)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-400 to-emerald-500'
    if (score >= 60) return 'from-yellow-400 to-orange-500'
    return 'from-red-400 to-pink-500'
  }

  const getOverallRank = (rating: number) => {
    if (rating >= 90) return { rank: 'S+', color: 'from-purple-400 to-pink-500' }
    if (rating >= 80) return { rank: 'S', color: 'from-blue-400 to-cyan-500' }
    if (rating >= 70) return { rank: 'A', color: 'from-green-400 to-emerald-500' }
    if (rating >= 60) return { rank: 'B', color: 'from-yellow-400 to-orange-500' }
    return { rank: 'C', color: 'from-red-400 to-pink-500' }
  }

  const handleViewProfile = (candidate: Candidate) => {
    setSelectedCandidate(candidate)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedCandidate(null)
  }

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = `${candidate.first_name} ${candidate.last_name} ${candidate.headline}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    
    if (filterBy === 'all') return matchesSearch
    if (filterBy === 'top') return matchesSearch && candidate.overall_rating >= 80
    if (filterBy === 'recent') return matchesSearch // Could add actual date filtering
    return matchesSearch
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading candidates...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
          Elite Candidate Collection
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Discover exceptional talent with detailed performance analytics
        </p>
        
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Candidates</option>
            <option value="top">Top Performers (80+)</option>
            <option value="recent">Recently Active</option>
          </select>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
      >
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-700">Total Candidates</h3>
          <p className="text-3xl font-bold text-blue-600">{candidates.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-700">S-Rank Talents</h3>
          <p className="text-3xl font-bold text-purple-600">
            {candidates.filter(c => c.overall_rating >= 80).length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-700">Avg Technical Score</h3>
          <p className="text-3xl font-bold text-green-600">
            {candidates.length > 0 ? Math.round(candidates.reduce((sum, c) => sum + c.technical_score, 0) / candidates.length) : 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-700">Currently Viewing</h3>
          <p className="text-3xl font-bold text-orange-600">{filteredCandidates.length}</p>
        </div>
      </motion.div>

      {/* Candidate Cards Grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
      >
        {filteredCandidates.map((candidate, index) => {
          const overallRank = getOverallRank(candidate.overall_rating)
          
          return (
            <motion.div
              key={candidate.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative"
            >
              {/* Pokemon Card Style */}
              <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 border-4 border-gray-300 hover:border-blue-400">
                {/* Holographic Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Rank Badge */}
                <div className={`absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-r ${overallRank.color} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg z-10`}>
                  {overallRank.rank}
                </div>

                <div className="relative z-10">
                  {/* Avatar */}
                  <div className="text-center mb-4">
                    <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 p-1">
                      {candidate.avatar_url ? (
                        <img
                          src={candidate.avatar_url}
                          alt={`${candidate.first_name} ${candidate.last_name}`}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-2xl font-bold">
                          {candidate.first_name?.[0]}{candidate.last_name?.[0]}
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {candidate.first_name} {candidate.last_name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {candidate.headline || 'Software Engineer'}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="space-y-3 mb-4">
                    {/* Technical Score */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Technical</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 h-2 bg-gray-300 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${getScoreColor(candidate.technical_score)} transition-all duration-1000`}
                            style={{ width: `${candidate.technical_score}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold w-8 text-right">{candidate.technical_score}</span>
                      </div>
                    </div>

                    {/* Experience Score */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Experience</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 h-2 bg-gray-300 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${getScoreColor(candidate.experience_score)} transition-all duration-1000`}
                            style={{ width: `${candidate.experience_score}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold w-8 text-right">{candidate.experience_score}</span>
                      </div>
                    </div>

                    {/* Communication Score */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Communication</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 h-2 bg-gray-300 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${getScoreColor(candidate.communication_score)} transition-all duration-1000`}
                            style={{ width: `${candidate.communication_score}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold w-8 text-right">{candidate.communication_score}</span>
                      </div>
                    </div>

                    {/* Culture Fit */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Culture Fit</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 h-2 bg-gray-300 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${getScoreColor(candidate.culture_fit_score)} transition-all duration-1000`}
                            style={{ width: `${candidate.culture_fit_score}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold w-8 text-right">{candidate.culture_fit_score}</span>
                      </div>
                    </div>
                  </div>

                  {/* Overall Rating */}
                  <div className="text-center mb-4">
                    <div className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${overallRank.color}`}>
                      Overall: {candidate.overall_rating}/100
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleViewProfile(candidate)}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                    >
                      View Profile
                    </button>
                    <button className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-300">
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* No Results */}
      {filteredCandidates.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No candidates found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </motion.div>
      )}

      {/* Detailed Profile Modal */}
      {showModal && selectedCandidate && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={handleCloseModal}
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 p-1">
                    {selectedCandidate.avatar_url ? (
                      <img
                        src={selectedCandidate.avatar_url}
                        alt={`${selectedCandidate.first_name} ${selectedCandidate.last_name}`}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xl font-bold">
                        {selectedCandidate.first_name?.[0]}{selectedCandidate.last_name?.[0]}
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {selectedCandidate.first_name} {selectedCandidate.last_name}
                    </h2>
                    <p className="text-gray-600">{selectedCandidate.headline}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-gray-500">{selectedCandidate.location}</span>
                      <span className="text-sm text-gray-500">{selectedCandidate.experience_years} years experience</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Scores & Skills */}
                <div className="space-y-6">
                  {/* Performance Scores */}
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Performance Analytics
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-700">Technical Skills</span>
                          <span className="font-bold text-gray-800">{selectedCandidate.technical_score}/100</span>
                        </div>
                        <div className="w-full h-3 bg-gray-300 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${getScoreColor(selectedCandidate.technical_score)}`}
                            style={{ width: `${selectedCandidate.technical_score}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-700">Experience</span>
                          <span className="font-bold text-gray-800">{selectedCandidate.experience_score}/100</span>
                        </div>
                        <div className="w-full h-3 bg-gray-300 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${getScoreColor(selectedCandidate.experience_score)}`}
                            style={{ width: `${selectedCandidate.experience_score}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-700">Communication</span>
                          <span className="font-bold text-gray-800">{selectedCandidate.communication_score}/100</span>
                        </div>
                        <div className="w-full h-3 bg-gray-300 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${getScoreColor(selectedCandidate.communication_score)}`}
                            style={{ width: `${selectedCandidate.communication_score}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-700">Culture Fit</span>
                          <span className="font-bold text-gray-800">{selectedCandidate.culture_fit_score}/100</span>
                        </div>
                        <div className="w-full h-3 bg-gray-300 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${getScoreColor(selectedCandidate.culture_fit_score)}`}
                            style={{ width: `${selectedCandidate.culture_fit_score}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Technical Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCandidate.skills?.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm rounded-full font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="space-y-6">
                  {/* Contact Information */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Contact Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-600 font-medium">Email:</span>
                        <span className="text-gray-800">{selectedCandidate.email}</span>
                      </div>
                      {selectedCandidate.linkedin && (
                        <div className="flex items-center space-x-3">
                          <span className="text-gray-600 font-medium">LinkedIn:</span>
                          <a 
                            href={selectedCandidate.linkedin}
                            className="text-blue-600 hover:text-blue-800"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Profile
                          </a>
                        </div>
                      )}
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-600 font-medium">Location:</span>
                        <span className="text-gray-800">{selectedCandidate.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Education & Experience */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Background
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-600">Education</span>
                        <p className="text-gray-800">{selectedCandidate.education}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Experience</span>
                        <p className="text-gray-800">{selectedCandidate.experience_years} years in software development</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Salary Expectation</span>
                        <p className="text-gray-800">{selectedCandidate.salary_expectation}</p>
                      </div>
                    </div>
                  </div>

                  {/* Overall Rating */}
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 text-center">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Overall Rating</h3>
                    <div className={`text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${getOverallRank(selectedCandidate.overall_rating).color} mb-2`}>
                      {getOverallRank(selectedCandidate.overall_rating).rank}
                    </div>
                    <div className="text-2xl font-bold text-gray-800 mb-4">
                      {selectedCandidate.overall_rating}/100
                    </div>
                    <div className="flex space-x-3">
                      <button className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300">
                        Schedule Interview
                      </button>
                      <button className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-300">
                        Send Message
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
