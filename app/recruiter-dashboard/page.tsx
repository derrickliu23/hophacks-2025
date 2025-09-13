import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function RecruiterDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile?.role) redirect('/role')
  if (profile.role !== 'recruiter') redirect('/candidate-dashboard')

  const signOut = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Recruiter Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Profile Management */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-3">Profile</h2>
            <p className="text-gray-600 mb-4">Manage your recruiter and company information</p>
            <a 
              href="/recruiter-profile"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-block"
            >
              Edit Profile
            </a>
          </div>

          {/* Job Posting */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-3">Job Postings</h2>
            <p className="text-gray-600 mb-4">Create and manage job listings</p>
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Post New Job
            </button>
          </div>

          {/* Candidate Management */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-3">Candidates</h2>
            <p className="text-gray-600 mb-4">Review applications and manage candidates</p>
            <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
              View Candidates
            </button>
          </div>

          {/* Company Settings */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-3">Company</h2>
            <p className="text-gray-600 mb-4">Manage company settings and branding</p>
            <button className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">
              Company Settings
            </button>
          </div>

          {/* Analytics */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-3">Analytics</h2>
            <p className="text-gray-600 mb-4">View hiring metrics and job performance</p>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
              View Analytics
            </button>
          </div>

          {/* Messages */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-3">Messages</h2>
            <p className="text-gray-600 mb-4">Communicate with candidates</p>
            <button className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700">
              View Messages
            </button>
          </div>
        </div>

        <form action={signOut}>
          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Sign Out
          </button>
        </form>
      </div>
    </div>
  )
}
