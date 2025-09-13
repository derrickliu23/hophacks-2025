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

  // Redirect to role-specific dashboard
  if (profile.role === 'candidate') {
    redirect('/candidate')
  } else if (profile.role === 'recruiter') {
    redirect('/recruiter')
  }

  // Fallback (shouldn't reach here with valid roles)
  redirect('/role')
}
