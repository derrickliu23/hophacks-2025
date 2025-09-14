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
  school: string
  university?: string  // Deprecated, use school instead
  graduation_year?: number
  major?: string
  gpa?: string
  skills?: string[]
  experience_years?: number
  technical_score?: number
  overall_rating?: number
}

interface TalentCommunity {
  id: string
  name: string
  description: string
  color: string
  created_by: string
  created_at: string
  updated_at: string
  members: Candidate[]
}

interface CommunityMember {
  id: string
  community_id: string
  candidate_id: string
  added_by: string
  added_at: string
}

export default function TalentCommunitiesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [talentCommunities, setTalentCommunities] = useState<TalentCommunity[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUniversity, setSelectedUniversity] = useState<string>('all')
  const [error, setError] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newCommunity, setNewCommunity] = useState({ name: '', description: '', color: 'from-blue-500 to-cyan-500' })
  const supabase = createClient()

  useEffect(() => {
    initializeData()
  }, [])

  const initializeData = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('Not authenticated')
        return
      }
      setCurrentUser(user)

      // Fetch both candidates and communities in parallel
      await Promise.all([
        fetchCandidatesData(),
        fetchTalentCommunities(user.id)
      ])
    } catch (err) {
      console.error('Error initializing data:', err)
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const fetchCandidatesData = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, first_name, last_name, headline, avatar_url, email, school')
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

      const candidatesWithData = data?.map(candidate => ({
        ...candidate,
        school: candidate.school || 'School Not Set',
        // Keep some mock data for display purposes (could be moved to database)
        graduation_year: 2022 + Math.floor(Math.random() * 4), // 2022-2025
        major: majorsPool[Math.floor(Math.random() * majorsPool.length)],
        gpa: (3.2 + Math.random() * 0.8).toFixed(2), // 3.2-4.0 GPA
        skills: skillsPool.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 5) + 3),
        experience_years: Math.floor(Math.random() * 6), // 0-5 years
        technical_score: Math.floor(Math.random() * 40) + 60, // 60-100
        overall_rating: Math.floor(Math.random() * 40) + 60, // 60-100
      })) || []

      setCandidates(candidatesWithData)
    } catch (error) {
      console.error('Error fetching candidates:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTalentCommunities = async (userId: string) => {
    try {
      // Fetch communities created by current user
      const { data: communities, error: communitiesError } = await supabase
        .from('talent_communities')
        .select('*')
        .eq('created_by', userId)
        .order('created_at', { ascending: false })

      if (communitiesError) throw communitiesError

      // Fetch community members with candidate details
      const communitiesWithMembers = await Promise.all(
        (communities || []).map(async (community) => {
          const { data: members, error: membersError } = await supabase
            .from('talent_community_members')
            .select(`
              id,
              candidate_id,
              added_by,
              added_at,
              user_profiles!talent_community_members_candidate_id_fkey(
                id,
                first_name,
                last_name,
                headline,
                avatar_url,
                email,
                school
              )
            `)
            .eq('community_id', community.id)

          if (membersError) {
            console.error('Error fetching members for community:', community.id, membersError)
            return { ...community, members: [] }
          }

          // Transform the data to match our interface
          const candidateMembers = (members || []).map((member: any) => ({
            id: member.user_profiles.id,
            first_name: member.user_profiles.first_name,
            last_name: member.user_profiles.last_name,
            headline: member.user_profiles.headline,
            avatar_url: member.user_profiles.avatar_url,
            email: member.user_profiles.email,
            school: member.user_profiles.school || 'School Not Set',
            // Add mock data for display (these could be stored in database too)
            graduation_year: 2024,
            major: 'Computer Science',
            gpa: '3.8',
            skills: ['React', 'TypeScript', 'Node.js'],
            experience_years: 3,
            technical_score: 85,
            overall_rating: 88
          }))

          return {
            ...community,
            members: candidateMembers
          }
        })
      )

      setTalentCommunities(communitiesWithMembers)
    } catch (err) {
      console.error('Error fetching talent communities:', err)
      throw err
    }
  }

  const createTalentCommunity = async (name: string, description: string, color: string) => {
    if (!currentUser) return

    try {
      const { data, error } = await supabase
        .from('talent_communities')
        .insert([{
          name,
          description,
          color,
          created_by: currentUser.id
        }])
        .select()
        .single()

      if (error) throw error

      // Add to local state
      setTalentCommunities(prev => [...prev, { ...data, members: [] }])
      return data
    } catch (err) {
      console.error('Error creating talent community:', err)
      throw err
    }
  }

  const addToTalentCommunity = async (candidate: Candidate, communityId: string) => {
    if (!currentUser) return

    try {
      // Check if candidate is already in this community
      const { data: existingMember } = await supabase
        .from('talent_community_members')
        .select('id')
        .eq('community_id', communityId)
        .eq('candidate_id', candidate.id)
        .single()

      if (existingMember) {
        console.log('Candidate already in community')
        return
      }

      // Add to database
      const { error } = await supabase
        .from('talent_community_members')
        .insert([{
          community_id: communityId,
          candidate_id: candidate.id,
          added_by: currentUser.id
        }])

      if (error) throw error

      // Update local state
      setTalentCommunities(prev => prev.map(community => {
        if (community.id === communityId) {
          return {
            ...community,
            members: [...community.members, candidate]
          }
        }
        return community
      }))

    } catch (err) {
      console.error('Error adding candidate to community:', err)
      setError('Failed to add candidate to community')
    }
  }

  const removeFromTalentCommunity = async (candidateId: string, communityId: string) => {
    if (!currentUser) return

    try {
      // Remove from database
      const { error } = await supabase
        .from('talent_community_members')
        .delete()
        .eq('community_id', communityId)
        .eq('candidate_id', candidateId)

      if (error) throw error

      // Update local state
      setTalentCommunities(prev => prev.map(community => {
        if (community.id === communityId) {
          return {
            ...community,
            members: community.members.filter(member => member.id !== candidateId)
          }
        }
        return community
      }))

    } catch (err) {
      console.error('Error removing candidate from community:', err)
      setError('Failed to remove candidate from community')
    }
  }

  const handleCreateCommunity = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newCommunity.name.trim()) {
      setError('Community name is required')
      return
    }

    try {
      await createTalentCommunity(newCommunity.name, newCommunity.description, newCommunity.color)
      setNewCommunity({ name: '', description: '', color: 'from-blue-500 to-cyan-500' })
      setShowCreateForm(false)
      setError(null)
    } catch (err) {
      setError('Failed to create community')
    }
  }

  const schools = ['all', ...Array.from(new Set(candidates.map(c => c.school).filter(school => school && school !== 'School Not Set')))]
  const filteredCandidates = selectedUniversity === 'all' 
    ? candidates 
    : candidates.filter(c => c.school === selectedUniversity)

  const candidatesBySchool = filteredCandidates.reduce((acc, candidate) => {
    const school = candidate.school || 'School Not Set'
    if (!acc[school]) {
      acc[school] = []
    }
    acc[school].push(candidate)
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

  if (error) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-xl text-red-400 mb-4">Error loading talent communities</p>
          <p className="text-gray-400 mb-6">{error}</p>
          <button 
            onClick={() => {
              setError(null)
              initializeData()
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
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
          Organize elite candidates by school and build targeted talent pools
        </p>
        
        {/* Create Community Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all"
          >
            {showCreateForm ? 'Cancel' : 'Create New Community'}
          </button>
        </div>

        {/* Create Community Form */}
        {showCreateForm && (
          <motion.form
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleCreateCommunity}
            className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-6 max-w-md mx-auto"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Create New Community</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  value={newCommunity.name}
                  onChange={(e) => setNewCommunity(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-black/20 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Full Stack Developers"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={newCommunity.description}
                  onChange={(e) => setNewCommunity(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 bg-black/20 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe this talent community..."
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Color Theme</label>
                <select
                  value={newCommunity.color}
                  onChange={(e) => setNewCommunity(prev => ({ ...prev, color: e.target.value }))}
                  className="w-full px-3 py-2 bg-black/20 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="from-blue-500 to-cyan-500">Blue to Cyan</option>
                  <option value="from-purple-500 to-pink-500">Purple to Pink</option>
                  <option value="from-green-500 to-emerald-500">Green to Emerald</option>
                  <option value="from-orange-500 to-red-500">Orange to Red</option>
                  <option value="from-indigo-500 to-purple-500">Indigo to Purple</option>
                </select>
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
                >
                  Create Community
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 bg-gray-500/20 text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-500/30 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.form>
        )}
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
          {schools.map(school => (
            <option key={school} value={school} className="bg-gray-800 text-white">
              {school === 'all' ? 'All Schools' : school}
            </option>
          ))}
        </select>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* School Candidates Section */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-white mb-4">Candidates by School</h2>
          
          {Object.entries(candidatesBySchool).map(([school, schoolCandidates]) => (
            <motion.div
              key={school}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl"
            >
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                {school}
                <span className="ml-3 text-sm bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                  {schoolCandidates.length} students
                </span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {schoolCandidates.map((candidate) => (
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
          
          {talentCommunities.length === 0 ? (
            <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No Communities Yet</h3>
              <p className="text-gray-400 mb-4">Create your first talent community to start organizing candidates</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
              >
                Create Your First Community
              </button>
            </div>
          ) : (
            talentCommunities.map((community) => (
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
                          <p className="text-gray-400 text-xs">{member.school}</p>
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
            ))
          )}
        </div>
      </div>
    </div>
  )
}
