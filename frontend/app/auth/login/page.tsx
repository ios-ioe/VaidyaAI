'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/Button'
import { Heading, Body, Label } from '@/components/Typography'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // TEMP DEV-ONLY BYPASS — remove before production, replace with real auth call to FastAPI backend
    setTimeout(() => {
      if (email === 'admin' && password === 'admin') {
        // TEMP DEV-ONLY: plain localStorage flag, not secure auth. Replace with real backend session/JWT via httpOnly cookies before production.
        const authData = {
          name: 'Dr. Sharma',
          email: 'dr.sharma@vaidyaclinic.com',
          loggedInAt: new Date().toISOString(),
        }
        localStorage.setItem('vaidya_dev_auth', btoa(JSON.stringify(authData)))
        setIsLoading(false)
        router.push('/dashboard')
      } else {
        setError('Invalid credentials — dev mode: use admin/admin')
        setIsLoading(false)
      }
    }, 800)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-parchment">
      {/* Main Card */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-md border border-gold/20 overflow-hidden">
        {/* Header Section */}
        <div className="px-6 pt-8 pb-6 text-center">
          <Heading level={2} className="text-maroon">
            VaidyaAI
          </Heading>
          <div className="h-[2px] w-12 bg-gold mx-auto mt-3 mb-2" />
          <Body size="sm" className="text-muted-foreground uppercase tracking-widest">
            Clinical Reasoning System
          </Body>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          {/* Error Message */}
          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
              <Body size="sm" className="text-red-700">
                {error}
              </Body>
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-1">
            <Label htmlFor="email">Email Address</Label>
            <input
              id="email"
              type="text"
              placeholder="practitioner@clinic.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-parchment border border-border rounded-lg focus:border-gold focus:ring-1 focus:ring-gold/50 outline-none transition-all text-ink placeholder-muted-foreground"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-parchment border border-border rounded-lg focus:border-gold focus:ring-1 focus:ring-gold/50 outline-none transition-all text-ink placeholder-muted-foreground pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-ink transition-colors text-sm"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <a href="#" className="text-sm text-gold hover:text-maroon transition-colors font-medium">
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <Button
            variant="primary"
            size="lg"
            type="submit"
            disabled={isLoading}
            className="w-full mt-6"
          >
            {isLoading ? 'Authenticating...' : 'Login to Clinic'}
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-3 py-2">
            <div className="flex-1 h-[1px] bg-border" />
            <span className="text-xs text-muted-foreground">New Practitioner?</span>
            <div className="flex-1 h-[1px] bg-border" />
          </div>

          {/* Register Link */}
          <div className="text-center">
            <a
              href="/auth/register"
              className="inline-flex items-center gap-1 text-sm text-gold hover:text-maroon transition-colors font-medium border-b border-gold/30 hover:border-maroon/30"
            >
              Register clinic
              <span>→</span>
            </a>
          </div>

          {/* Dev Mode Note */}
          <div className="pt-2 border-t border-border">
            <Body size="sm" className="text-muted-foreground text-center">
              Dev mode: admin / admin
            </Body>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="fixed bottom-6 text-center w-full px-4">
        <Body size="sm" className="text-muted-foreground">
          © 2024 VaidyaAI. All rights reserved.
        </Body>
        <div className="flex justify-center gap-3 text-xs text-muted-foreground mt-2">
          <a href="#" className="hover:text-maroon transition-colors">
            Terms of Service
          </a>
          <span>•</span>
          <a href="#" className="hover:text-maroon transition-colors">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  )
}
