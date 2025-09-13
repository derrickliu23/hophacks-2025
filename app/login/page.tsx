'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const supabase = createClient()

  const signIn = async () => {
    await supabase.auth.signInWithPassword({ email, password })
    window.location.href = '/dashboard'
  }

  const signUp = async () => {
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password
    })
    
    if (error) {
      console.error('Sign up error:', error)
      alert('Error signing up: ' + error.message)
      return
    }
    
    if (data.user && data.session) {
      // User is immediately signed in (no email confirmation required)
      console.log('User created successfully:', data.user.id)
      window.location.href = '/role'
    } else if (data.user && !data.session) {
      // Email confirmation is still required
      alert('Please check your email to confirm your account!')
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Login</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="block w-full p-2 border mb-2"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="block w-full p-2 border mb-4"
      />
      <button onClick={signIn} className="bg-blue-500 text-white px-4 py-2 mr-2">
        Sign In
      </button>
      <button onClick={signUp} className="bg-green-500 text-white px-4 py-2">
        Sign Up
      </button>
    </div>
  )
}
