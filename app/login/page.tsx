'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import logo from '@/public/Eleetcode_no_background.png'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const supabase = createClient()

  const signIn = async () => {
    await supabase.auth.signInWithPassword({ email, password })
    window.location.href = '/dashboard'
  }

  const signUp = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) {
      console.error('Sign up error:', error)
      alert('Error signing up: ' + error.message)
      return
    }

    if (data.user && data.session) {
      console.log('User created successfully:', data.user.id)
      window.location.href = '/role'
    } else if (data.user && !data.session) {
      alert('Please check your email to confirm your account!')
    }
  }

  return (
    <div className="relative w-screen h-screen bg-gradient-to-br from-black via-gray-900 to-blue-950 overflow-hidden">
      
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,255,255,0.15),transparent_50%),radial-gradient(circle_at_bottom_right,rgba(255,0,255,0.15),transparent_50%)]"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
      />

      {/* Logo slightly above center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[225%] z-10">
        <Image
          src={logo}
          alt="EleetCode Logo"
          width={180}
          height={180}
          className="drop-shadow-2xl"
        />
      </div>

      {/* Dead-center login card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="bg-white/20 backdrop-blur-xl rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.7)] border border-white/20 p-10"
        >
          <h1 className="text-4xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 drop-shadow-lg">
            Welcome Back
          </h1>
          <p className="text-center text-gray-300 mt-3 text-sm tracking-wide">
            Sign in to access your dashboard
          </p>

          {/* Form */}
          <div className="mt-8 space-y-5">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border border-gray-600 bg-black/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-lg"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border border-gray-600 bg-black/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-lg"
            />

            {/* Buttons */}
            <div className="flex justify-between mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={signIn}
                className="w-[48%] px-5 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold shadow-lg hover:shadow-xl transition text-lg"
              >
                Sign In
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={signUp}
                className="w-[48%] px-5 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-400 text-white font-semibold shadow-lg hover:shadow-xl transition text-lg"
              >
                Sign Up
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
