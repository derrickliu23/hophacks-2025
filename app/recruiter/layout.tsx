'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
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
    { id: 'talent-communities', label: 'Talent Communities', path: '/recruiter/talent-communities' },
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
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-300">Loading elite dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=2500&q=80')" }}
      />
      
      {/* Gradient Overlays */}
      <div className="fixed inset-0 bg-gradient-to-br from-black/80 via-gray-900/90 to-black/95" />
      <div className="fixed inset-0 bg-gradient-to-tr from-blue-900/20 via-purple-900/20 to-pink-900/20" />
      
      {/* Animated Background Particles */}
      <div className="fixed inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/10 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Header with Branding, Tabs, and Sign Out */}
      <header className="relative z-20 bg-black/40 backdrop-blur-xl border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* EleetCode Branding */}
            <div className="flex items-center">
              <Image src="/final_logo.png" alt="EleetCode Logo" width={35} height={35} priority className="mr-3" />
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                EleetCode
              </h1>
              <span className="ml-3 text-gray-400">|</span>
              <span className="ml-3 text-gray-300 font-medium">Recruiter Portal</span>
            </div>

            {/* Tab Navigation and Sign Out */}
            <div className="flex items-center space-x-6">
              {/* Tabs */}
              <nav className="flex space-x-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => router.push(tab.path)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 border ${
                      isActive(tab.path)
                        ? 'bg-gradient-to-r from-blue-600/80 to-purple-600/80 text-white border-blue-500/50 shadow-lg shadow-blue-500/25'
                        : 'text-gray-300 hover:text-white hover:bg-white/10 border-transparent hover:border-white/20 backdrop-blur-sm'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>

              {/* Sign Out Button */}
              <button
                onClick={signOut}
                className="bg-gradient-to-r from-red-600/80 to-red-700/80 text-white px-4 py-2 rounded-lg hover:from-red-500/80 hover:to-red-600/80 transition-all duration-300 border border-red-500/30 shadow-lg backdrop-blur-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="relative z-10 min-h-screen pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}
