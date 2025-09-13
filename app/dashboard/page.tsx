import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile?.role) redirect('/role')

  const signOut = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  if (profile.role === 'candidate') {
    return (
      <div className="p-8">
        <h1 className="text-2xl mb-4">Candidate Dashboard</h1>
        <p>Welcome! You can browse jobs here.</p>
        <form action={signOut}>
          <button className="bg-red-500 text-white px-4 py-2 mt-4">Sign Out</button>
        </form>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Recruiter Dashboard</h1>
      <p>Welcome! You can post jobs here.</p>
      <form action={signOut}>
        <button className="bg-red-500 text-white px-4 py-2 mt-4">Sign Out</button>
      </form>
    </div>
  )
}
