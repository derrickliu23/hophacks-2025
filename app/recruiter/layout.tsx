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
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-xl text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="backdrop-blur-xl bg-black/30 border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Branding */}
            <div className="flex items-center">
              <Image src="/final_logo.png" alt="EleetCode Logo" width={35} height={35} priority className="mr-3" />
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                EleetCode
              </h1>
              <span className="ml-3 text-gray-400">|</span>
              <span className="ml-3 text-gray-300">Recruiter Dashboard</span>
            </div>

            {/* Tabs and Sign Out */}
            <div className="flex items-center space-x-4">
              <nav className="flex space-x-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => router.push(tab.path)}
                    className={`px-4 py-2 rounded-2xl font-medium whitespace-nowrap transition-all duration-300
                      ${
                        isActive(tab.path)
                          ? 'bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white shadow-lg'
                          : 'bg-black/20 text-gray-300 hover:bg-black/40 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>

              <button
                onClick={signOut}
                className="bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-2 rounded-xl hover:brightness-125 transition-all"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
