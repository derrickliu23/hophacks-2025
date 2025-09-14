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
  university: string
  graduation_year: number
  major: string
  gpa: string
  skills: string[]
  experience_years: number
  technical_score: number
  overall_rating: number
}

interface TalentCommunity {
  id: string
  name: string
  description: string
  members: Candidate[]
  color: string
}

export default function TalentCommunitiesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [talentCommunities, setTalentCommunities] = useState<TalentCommunity[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUniversity, setSelectedUniversity] = useState<string>('all')
  const supabase = createClient()

  useEffect(() => {
    fetchCandidatesData()
    initializeTalentCommunities()
  }, [])

  const fetchCandidatesData = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, first_name, last_name, headline, avatar_url, email')
        .eq('role', 'candidate')

      if (error) throw error

      // Add mock university and academic data
      const universitiesPool = [
        'Stanford University', 'MIT', 'UC Berkeley', 'Harvard University', 
        'Carnegie Mellon', 'Caltech', 'Princeton University', 'Cornell University',
        'University of Washington', 'Georgia Tech', 'UT Austin', 'UCLA'
      ]
      
      const majorsPool = [
        'Computer Science', 'Software Engineering', 'Electrical Engineering',
        'Data Science', 'Computer Engineering', 'Information Systems',
        'Mathematics', 'Physics', 'Mechanical Engineering'
      ]

      const skillsPool = [
        'React', 'Python', 'JavaScript', 'TypeScript', 'Node.js', 'AWS', 
        'Machine Learning', 'Docker', 'Kubernetes', 'GraphQL', 'PostgreSQL',
        'TensorFlow', 'Vue.js', 'Angular', 'Go', 'Rust', 'Swift', 'Kotlin'
      ]

      const candidatesWithUniversityData = data?.map(candidate => ({
        ...candidate,
        university: universitiesPool[Math.floor(Math.random() * universitiesPool.length)],
        graduation_year: 2022 + Math.floor(Math.random() * 4), // 2022-2025
        major: majorsPool[Math.floor(Math.random() * majorsPool.length)],
        gpa: (3.2 + Math.random() * 0.8).toFixed(2), // 3.2-4.0 GPA
        skills: skillsPool.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 5) + 3),
        experience_years: Math.floor(Math.random() * 6), // 0-5 years
        technical_score: Math.floor(Math.random() * 40) + 60, // 60-100
        overall_rating: Math.floor(Math.random() * 40) + 60, // 60-100
      })) || []

      setCandidates(candidatesWithUniversityData)
    } catch (error) {
      console.error('Error fetching candidates:', error)
    } finally {
      setLoading(false)
    }
  }

  const initializeTalentCommunities = () => {
    setTalentCommunities([
      {
        id: 'elite-engineers',
        name: 'Elite Engineers',
        description: 'Top-tier engineering talent with exceptional technical skills',
        members: [],
        color: 'from-blue-500 to-cyan-500'
      },
      {
        id: 'ml-specialists', 
        name: 'ML Specialists',
        description: 'Machine learning and AI experts',
        members: [],
        color: 'from-purple-500 to-pink-500'
      },
      {
        id: 'startup-ready',
        name: 'Startup Ready',
        description: 'Versatile engineers perfect for fast-paced environments',
        members: [],
        color: 'from-green-500 to-emerald-500'
      }
    ])
  }

  const addToTalentCommunity = (candidate: Candidate, communityId: string) => {
    setTalentCommunities(prev => prev.map(community => {
      if (community.id === communityId) {
        // Check if candidate is already in this community
        if (community.members.find(member => member.id === candidate.id)) {
          return community
        }
        return {
          ...community,
          members: [...community.members, candidate]
        }
      }
      return community
    }))
  }

  const removeFromTalentCommunity = (candidateId: string, communityId: string) => {
    setTalentCommunities(prev => prev.map(community => {
      if (community.id === communityId) {
        return {
          ...community,
          members: community.members.filter(member => member.id !== candidateId)
        }
      }
      return community
    }))
  }

  const universities = ['all', ...Array.from(new Set(candidates.map(c => c.university)))]
  const filteredCandidates = selectedUniversity === 'all' 
    ? candidates 
    : candidates.filter(c => c.university === selectedUniversity)

  const candidatesByUniversity = filteredCandidates.reduce((acc, candidate) => {
    if (!acc[candidate.university]) {
      acc[candidate.university] = []
    }
    acc[candidate.university].push(candidate)
    return acc
  }, {} as Record<string, Candidate[]>)

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-300">Loading talent communities...</p>
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
          Talent Communities
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Organize elite candidates by university and build targeted talent pools
        </p>
      </motion.div>

      {/* University Filter */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center mb-8"
      >
        <select
          value={selectedUniversity}
          onChange={(e) => setSelectedUniversity(e.target.value)}
          className="px-6 py-3 bg-black/40 backdrop-blur-xl border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {universities.map(uni => (
            <option key={uni} value={uni} className="bg-gray-800 text-white">
              {uni === 'all' ? 'All Universities' : uni}
            </option>
          ))}
        </select>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* University Candidates Section */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-white mb-4">Candidates by University</h2>
          
          {Object.entries(candidatesByUniversity).map(([university, universityCandidates]) => (
            <motion.div
              key={university}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl"
            >
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                {university}
                <span className="ml-3 text-sm bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                  {universityCandidates.length} students
                </span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {universityCandidates.map((candidate) => (
                  <motion.div
                    key={candidate.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 p-1">
                        {candidate.avatar_url ? (
                          <img
                            src={candidate.avatar_url}
                            alt={`${candidate.first_name} ${candidate.last_name}`}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-bold">
                            {candidate.first_name?.[0]}{candidate.last_name?.[0]}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium truncate">
                          {candidate.first_name} {candidate.last_name}
                        </h4>
                        <p className="text-gray-400 text-sm truncate">{candidate.major} '{candidate.graduation_year.toString().slice(-2)}</p>
                        <p className="text-gray-500 text-xs">GPA: {candidate.gpa}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-400">Score:</span>
                          <span className={`text-xs font-bold ${getScoreColor(candidate.technical_score)}`}>
                            {candidate.technical_score}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex flex-wrap gap-1">
                      {candidate.skills.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-md"
                        >
                          {skill}
                        </span>
                      ))}
                      {candidate.skills.length > 3 && (
                        <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-md">
                          +{candidate.skills.length - 3}
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-3 flex space-x-2">
                      {talentCommunities.map(community => (
                        <button
                          key={community.id}
                          onClick={() => addToTalentCommunity(candidate, community.id)}
                          className={`flex-1 text-xs py-2 px-3 rounded-lg bg-gradient-to-r ${community.color} text-white hover:brightness-110 transition-all`}
                        >
                          Add to {community.name}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Talent Communities Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white mb-4">Talent Communities</h2>
          
          {talentCommunities.map((community) => (
            <motion.div
              key={community.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl"
            >
              <div className="mb-4">
                <h3 className={`text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r ${community.color}`}>
                  {community.name}
                </h3>
                <p className="text-gray-400 text-sm">{community.description}</p>
                <span className="inline-block mt-2 text-xs bg-white/10 text-gray-300 px-2 py-1 rounded-full">
                  {community.members.length} members
                </span>
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {community.members.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">No members yet</p>
                    <p className="text-xs">Add candidates from universities</p>
                  </div>
                ) : (
                  community.members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between bg-white/5 p-3 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 p-1">
                          {member.avatar_url ? (
                            <img
                              src={member.avatar_url}
                              alt={`${member.first_name} ${member.last_name}`}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-bold">
                              {member.first_name?.[0]}{member.last_name?.[0]}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">
                            {member.first_name} {member.last_name}
                          </p>
                          <p className="text-gray-400 text-xs">{member.university}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromTalentCommunity(member.id, community.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
