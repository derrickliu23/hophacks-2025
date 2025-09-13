'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function RecruiterProfile() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    headline: '',
    linkedin: '',
    avatar_url: '',
    // Recruiter-specific fields (we'll store these in existing columns creatively)
    company_name: '', // We can use headline for company info
    job_title: '',    // We can use a structured format
    company_website: '',
    company_description: '',
    phone: ''
  })
  
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/login')
      return
    }

    // Check if user is a recruiter
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userProfile?.role !== 'recruiter') {
      router.push('/dashboard')
      return
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Error loading profile:', error)
      alert('Error loading profile: ' + error.message)
    } else if (data) {
      // Parse structured data from existing fields
      const headlineParts = (data.headline || '').split(' | ')
      const companyName = headlineParts[0] || ''
      const jobTitle = headlineParts[1] || ''
      const companyDescription = headlineParts[2] || ''

      setProfile({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        headline: data.headline || '',
        linkedin: data.linkedin || '',
        avatar_url: data.avatar_url || '',
        company_name: companyName,
        job_title: jobTitle,
        company_website: data.resume_url || '', // Repurpose resume_url for company website
        company_description: companyDescription,
        phone: '' // We'll add this to headline if needed
      })
    }
    
    setLoading(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const saveProfile = async () => {
    setSaving(true)
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      alert('Please log in to update your profile')
      setSaving(false)
      return
    }

    // Structure the data for storage
    const structuredHeadline = [
      profile.company_name,
      profile.job_title,
      profile.company_description
    ].filter(Boolean).join(' | ')

    const updateData = {
      first_name: profile.first_name,
      last_name: profile.last_name,
      headline: structuredHeadline,
      linkedin: profile.linkedin,
      avatar_url: profile.avatar_url,
      resume_url: profile.company_website // Repurpose for company website
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .update(updateData)
      .eq('id', user.id)

    if (error) {
      console.error('Error updating profile:', error)
      alert('Error updating profile: ' + error.message)
    } else {
      alert('Recruiter profile updated successfully!')
    }
    
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          <p>Loading recruiter profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Recruiter Profile</h1>
          <button 
            onClick={() => router.push('/recruiter-dashboard')}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="space-y-6">
            {/* Personal Information Section */}
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={profile.first_name}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={profile.last_name}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  value={profile.job_title}
                  onChange={(e) => handleInputChange('job_title', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Senior Technical Recruiter, Talent Acquisition Manager"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  value={profile.linkedin}
                  onChange={(e) => handleInputChange('linkedin', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Picture URL
                </label>
                <input
                  type="url"
                  value={profile.avatar_url}
                  onChange={(e) => handleInputChange('avatar_url', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://... link to your profile picture"
                />
                {profile.avatar_url && (
                  <div className="mt-2">
                    <img 
                      src={profile.avatar_url} 
                      alt="Profile preview" 
                      className="w-16 h-16 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Company Information Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Company Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={profile.company_name}
                  onChange={(e) => handleInputChange('company_name', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your company name"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Website
                </label>
                <input
                  type="url"
                  value={profile.company_website}
                  onChange={(e) => handleInputChange('company_website', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://yourcompany.com"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Description
                </label>
                <textarea
                  value={profile.company_description}
                  onChange={(e) => handleInputChange('company_description', e.target.value)}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief description of your company, industry, and culture..."
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8">
            <button
              onClick={saveProfile}
              disabled={saving}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? 'Saving...' : 'Save Recruiter Profile'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
