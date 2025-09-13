import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function CandidateDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile?.role) redirect('/role')
  if (profile.role !== 'candidate') redirect('/recruiter-dashboard')

  const signOut = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-black text-green-400 p-8 font-mono">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 text-center tracking-widest animate-pulse">
          $ Candidate_Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Profile Management */}
          <div className="bg-zinc-950 shadow-inner rounded-lg p-6 border border-green-700 hover:border-green-400 transition-all">
            <h2 className="text-xl font-semibold mb-3"> Profile</h2>
            <p className="text-green-300 mb-4">Manage your professional profile and information</p>
            <Link 
              href="/candidate-profile"
              className="bg-green-700 text-black px-4 py-2 rounded hover:bg-green-500 transition-all"
            >
              ./edit_profile
            </Link>
          </div>

          {/* Job Search */}
          <div className="bg-zinc-950 shadow-inner rounded-lg p-6 border border-green-700 hover:border-green-400 transition-all">
            <h2 className="text-xl font-semibold mb-3"> Job_Search</h2>
            <p className="text-green-300 mb-4">Browse and apply to available positions</p>
            <button className="bg-green-700 text-black px-4 py-2 rounded hover:bg-green-500 transition-all">
              ./browse_jobs
            </button>
          </div>

          {/* Applications */}
          <div className="bg-zinc-950 shadow-inner rounded-lg p-6 border border-green-700 hover:border-green-400 transition-all">
            <h2 className="text-xl font-semibold mb-3"> Applications</h2>
            <p className="text-green-300 mb-4">Track your job application status</p>
            <button className="bg-green-700 text-black px-4 py-2 rounded hover:bg-green-500 transition-all">
              ./view_applications
            </button>
          </div>

          {/* Resume Builder */}
          <div className="bg-zinc-950 shadow-inner rounded-lg p-6 border border-green-700 hover:border-green-400 transition-all">
            <h2 className="text-xl font-semibold mb-3"> Resume</h2>
            <p className="text-green-300 mb-4">Build and update your resume</p>
            <button className="bg-green-700 text-black px-4 py-2 rounded hover:bg-green-500 transition-all">
              ./edit_resume
            </button>
          </div>

          {/* Saved Jobs */}
          <div className="bg-zinc-950 shadow-inner rounded-lg p-6 border border-green-700 hover:border-green-400 transition-all">
            <h2 className="text-xl font-semibold mb-3"> Saved_Jobs</h2>
            <p className="text-green-300 mb-4">View jobs you've bookmarked</p>
            <button className="bg-green-700 text-black px-4 py-2 rounded hover:bg-green-500 transition-all">
              ./view_saved
            </button>
          </div>

          {/* Messages */}
          <div className="bg-zinc-950 shadow-inner rounded-lg p-6 border border-green-700 hover:border-green-400 transition-all">
            <h2 className="text-xl font-semibold mb-3"> Messages</h2>
            <p className="text-green-300 mb-4">Communicate with recruiters</p>
            <button className="bg-green-700 text-black px-4 py-2 rounded hover:bg-green-500 transition-all">
              ./view_messages
            </button>
          </div>
        </div>

        <form action={signOut} className="text-center">
          <button className="bg-red-600 text-white px-6 py-2 rounded-xl hover:bg-red-500 transition-all">
            ./sign_out
          </button>
        </form>
      </div>
    </div>
  )
}
