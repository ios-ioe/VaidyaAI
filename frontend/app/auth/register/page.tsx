'use client'

import React, { useState } from 'react'
import { Button } from '@/components/Button'
import { Heading, Body, Label } from '@/components/Typography'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    clinicName: '',
    bamsReg: '',
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
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
          {/* Full Name */}
          <div className="space-y-1">
            <Label htmlFor="fullName">Full Name</Label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Dr. Arjun Sharma"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-parchment border border-border rounded-lg focus:border-gold focus:ring-1 focus:ring-gold/50 outline-none transition-all text-ink placeholder-muted-foreground"
            />
          </div>

          {/* Clinic Name */}
          <div className="space-y-1">
            <Label htmlFor="clinicName">Clinic Name</Label>
            <input
              id="clinicName"
              name="clinicName"
              type="text"
              placeholder="AyurVeda Healing Center"
              value={formData.clinicName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-parchment border border-border rounded-lg focus:border-gold focus:ring-1 focus:ring-gold/50 outline-none transition-all text-ink placeholder-muted-foreground"
            />
          </div>

          {/* B.A.M.S. Registration */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="bamsReg">B.A.M.S. Registration Number</Label>
              <span className="text-xs text-muted-foreground cursor-help" title="Enter your official medical council registration number">
                ?
              </span>
            </div>
            <input
              id="bamsReg"
              name="bamsReg"
              type="text"
              placeholder="MC-12345-DL"
              value={formData.bamsReg}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-parchment border border-border rounded-lg focus:border-gold focus:ring-1 focus:ring-gold/50 outline-none transition-all text-ink placeholder-muted-foreground"
            />
          </div>

          {/* Email Address */}
          <div className="space-y-1">
            <Label htmlFor="email">Email Address</Label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="arjun.sharma@clinical.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-parchment border border-border rounded-lg focus:border-gold focus:ring-1 focus:ring-gold/50 outline-none transition-all text-ink placeholder-muted-foreground"
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
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

          {/* Submit Button */}
          <Button
            variant="primary"
            size="lg"
            type="submit"
            disabled={isLoading}
            className="w-full mt-6"
          >
            {isLoading ? 'Processing...' : 'Register Clinic'}
          </Button>

          {/* Login Link */}
          <div className="text-center mt-4">
            <Body size="sm" className="text-muted-foreground">
              Already have an account?{' '}
              <a href="/auth/login" className="text-gold hover:text-maroon transition-colors font-medium">
                Login here
              </a>
            </Body>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="fixed bottom-6 text-center w-full px-4">
        <div className="flex justify-center gap-3 text-xs text-muted-foreground">
          <a href="#" className="hover:text-maroon transition-colors">
            Privacy Policy
          </a>
          <span>•</span>
          <a href="#" className="hover:text-maroon transition-colors">
            Terms of Service
          </a>
          <span>•</span>
          <a href="#" className="hover:text-maroon transition-colors">
            Support
          </a>
        </div>
        <Body size="sm" className="text-muted-foreground opacity-60 mt-2">
          © 2024 VaidyaAI. All rights reserved.
        </Body>
      </div>
    </div>
  )
}
