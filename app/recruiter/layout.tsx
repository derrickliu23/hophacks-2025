'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter, usePathname } from 'next/navigation'

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/login')
      return
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile?.role) {
      router.push('/role')
      return
    }
    
    if (profile.role !== 'recruiter') {
      router.push('/candidate-dashboard')
      return
    }
    
    setLoading(false)
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', path: '/recruiter' },
    { id: 'profile', label: 'Profile', path: '/recruiter/profile' },
    { id: 'jobs', label: 'Job Postings', path: '/recruiter/jobs' },
    { id: 'candidates', label: 'Candidates', path: '/recruiter/candidates' },
    { id: 'company', label: 'Company', path: '/recruiter/company' },
    { id: 'analytics', label: 'Analytics', path: '/recruiter/analytics' },
    { id: 'messages', label: 'Messages', path: '/recruiter/messages' }
  ]

  const isActive = (path: string) => {
    if (path === '/recruiter') {
      return pathname === '/recruiter'
    }
    return pathname.startsWith(path)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Branding, Tabs, and Sign Out */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* EleetCode Branding */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">EleetCode</h1>
              <span className="ml-3 text-gray-400">|</span>
              <span className="ml-3 text-gray-600">Recruiter Dashboard</span>
            </div>

            {/* Tab Navigation and Sign Out */}
            <div className="flex items-center space-x-6">
              {/* Tabs */}
              <nav className="flex space-x-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => router.push(tab.path)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(tab.path)
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>

              {/* Sign Out Button */}
              <button
                onClick={signOut}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
