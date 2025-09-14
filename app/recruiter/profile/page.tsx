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
    avatar_url: ''
  })
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  
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

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Error loading profile:', error)
      alert('Error loading profile: ' + error.message)
    } else if (data) {
      setProfile({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        headline: data.headline || '',
        linkedin: data.linkedin || '',
        avatar_url: data.avatar_url || ''
      })
      
      if (data.avatar_url) {
        setPreviewUrl(data.avatar_url)
      }
    }
    
    setLoading(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadProfilePicture = async (): Promise<string | null> => {
    if (!selectedFile) return null

    setUploading(true)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const fileExt = selectedFile.name.split('.').pop()
      const fileName = `${user.id}/profile-${Date.now()}.${fileExt}`

      const { data, error } = await supabase.storage
        .from('user_data')
        .upload(fileName, selectedFile, { cacheControl: '3600', upsert: false })

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('user_data')
        .getPublicUrl(data.path)

      return publicUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error uploading image: ' + (error as Error).message)
      return null
    } finally {
      setUploading(false)
    }
  }

  const saveProfile = async () => {
    setSaving(true)
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      alert('Please log in to update your profile')
      setSaving(false)
      return
    }

    try {
      let avatarUrl = profile.avatar_url
      if (selectedFile) {
        const uploadedUrl = await uploadProfilePicture()
        if (uploadedUrl) avatarUrl = uploadedUrl
        else { setSaving(false); return }
      }

      const updateData = {
        first_name: profile.first_name,
        last_name: profile.last_name,
        headline: profile.headline,
        linkedin: profile.linkedin,
        avatar_url: avatarUrl
      }

      const { error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', user.id)

      if (error) throw error

      alert('Recruiter profile updated successfully!')
      setProfile(prev => ({ ...prev, avatar_url: avatarUrl }))
      setSelectedFile(null)
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Error saving profile: ' + (error as Error).message)
    }

    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-xl text-gray-400">Loading profile...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
          Recruiter Profile
        </h1>
        <p className="text-gray-400">Manage your professional information</p>
      </div>

      <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-6 space-y-6">
        {/* Profile Picture */}
        <div className="border-b border-white/20 pb-6">
          <h2 className="text-xl font-semibold text-gray-200 mb-4">Profile Picture</h2>
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              {previewUrl ? (
                <img 
                  src={previewUrl} 
                  alt="Profile preview" 
                  className="w-24 h-24 rounded-full object-cover border-2 border-white/20"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">No Image</span>
                </div>
              )}
            </div>
            <div className="flex-grow">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Upload Profile Picture
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gradient-to-r file:from-blue-600 file:to-purple-600 file:text-white hover:file:brightness-110"
              />
              {selectedFile && (
                <p className="text-sm text-green-400 mt-2">
                  ✓ Selected: {selectedFile.name}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Personal Info */}
        <div>
          <h2 className="text-xl font-semibold text-gray-200 mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">First Name</label>
              <input
                type="text"
                value={profile.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                className="w-full p-3 rounded-xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                placeholder="Enter your first name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Last Name</label>
              <input
                type="text"
                value={profile.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                className="w-full p-3 rounded-xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Professional Headline</label>
            <input
              type="text"
              value={profile.headline}
              onChange={(e) => handleInputChange('headline', e.target.value)}
              className="w-full p-3 rounded-xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400"
              placeholder="e.g., Senior Technical Recruiter at Tech Corp"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">LinkedIn Profile</label>
            <input
              type="url"
              value={profile.linkedin}
              onChange={(e) => handleInputChange('linkedin', e.target.value)}
              className="w-full p-3 rounded-xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-white placeholder-gray-400"
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8">
          <button
            onClick={saveProfile}
            disabled={saving || uploading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:brightness-110 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all"
          >
            {uploading ? 'Uploading Image...' : saving ? 'Saving Profile...' : 'Save Recruiter Profile'}
          </button>
        </div>
      </div>
    </div>
  )
}
