'use client'

import { createClient } from '@/utils/supabase/client'

export default function RoleSelect() {
  const supabase = createClient()

  const setRole = async (role: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('user_profiles').upsert({
        id: user.id,
        email: user.email,
        role: role
      })
      window.location.href = '/dashboard'
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Choose Your Role</h1>
      <button 
        onClick={() => setRole('candidate')} 
        className="bg-blue-500 text-white px-4 py-2 mr-2"
      >
        Candidate
      </button>
      <button 
        onClick={() => setRole('recruiter')} 
        className="bg-green-500 text-white px-4 py-2"
      >
        Recruiter
      </button>
    </div>
  )
}
