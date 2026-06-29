'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/Button'
import { Heading, Body } from '@/components/Typography'

export default function LandingPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const testimonials = [
    {
      name: 'Dr. Aarav Sharma, B.A.M.S.',
      location: 'Delhi, India • 15+ years experience',
      text: 'VaidyaAI has transformed how I manage patient consultations. The real-time diagnostic support is invaluable, and the treatment planning is comprehensive and evidence-based.',
      rating: 5,
    },
    {
      name: 'Dr. Priya Nair, B.A.M.S.',
      location: 'Kerala, India • 8 years experience',
      text: 'The patient context panels and AI suggestions during consultations save me hours each week. I can now see more patients with higher quality care.',
      rating: 5,
    },
    {
      name: 'Dr. Vikram Singh, B.A.M.S.',
      location: 'Mumbai, India • 12 years experience',
      text: 'The structured approach to Prakriti assessment and treatment planning has improved my clinical outcomes. My patients report better satisfaction with care.',
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-parchment">
      {/* Navigation Header */}
      <header className="bg-white border-b border-border px-8 py-4 flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold text-maroon font-fraunces">VaidyaAI</div>
          <div className="text-xs text-gold font-jakarta">Clinical Platform</div>
        </div>
        <div className="flex gap-4">
          <Link href="/auth/login">
            <Button variant="ghost" size="md">
              Sign In
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button variant="primary" size="md">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-8 py-20 text-center">
        <Heading level={1} className="mb-6">
          Clinical Intelligence for Ayurvedic Practitioners
        </Heading>
        <Body size="lg" className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          VaidyaAI combines ancient Ayurvedic wisdom with modern technology to deliver personalized patient care, 
          intelligent diagnostics, and evidence-based treatment planning.
        </Body>
        <div className="flex gap-4 justify-center">
          <Link href="/auth/register">
            <Button variant="primary" size="lg">
              Start Free Trial
            </Button>
          </Link>
          <Link href="#features">
            <Button variant="secondary" size="lg">
              Learn More
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-8 py-20">
        <Heading level={2} className="text-center mb-16">
          Powerful Features for Modern Practitioners
        </Heading>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-max">
          {/* Feature 1 - Large */}
          <div className="md:col-span-2 md:row-span-2 bg-white rounded-lg border border-border p-8 hover:shadow-lg transition-shadow flex flex-col justify-between">
            <div>
              <div className="text-5xl mb-6">🧬</div>
              <Heading level={3} className="mb-3 text-maroon">
                Prakriti Assessment
              </Heading>
              <Body size="sm" className="text-muted-foreground">
                Advanced radial charts and dosha analysis to quickly determine patient constitution and imbalances. Get comprehensive reports with personalized insights.
              </Body>
            </div>
            <div className="mt-6 text-2xl text-gold">→</div>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-lg border border-border p-8 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">💊</div>
            <Heading level={3} className="mb-2 text-maroon">
              Treatment Plans
            </Heading>
            <Body size="sm" className="text-muted-foreground">
              Personalized herbs, Panchakarma, and lifestyle recommendations backed by classical texts.
            </Body>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-lg border border-border p-8 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">🎤</div>
            <Heading level={3} className="mb-2 text-maroon">
              Live Consultation
            </Heading>
            <Body size="sm" className="text-muted-foreground">
              AI-assisted transcription with real-time clinical reasoning and suggestions.
            </Body>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-lg border border-border p-8 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">📋</div>
            <Heading level={3} className="mb-2 text-maroon">
              Patient Profiles
            </Heading>
            <Body size="sm" className="text-muted-foreground">
              Comprehensive medical history, progress tracking, and risk assessments.
            </Body>
          </div>

          {/* Feature 5 */}
          <div className="bg-white rounded-lg border border-border p-8 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">📈</div>
            <Heading level={3} className="mb-2 text-maroon">
              Reports
            </Heading>
            <Body size="sm" className="text-muted-foreground">
              Professional printable reports with diagnostic summaries and treatment plans.
            </Body>
          </div>

          {/* Feature 6 */}
          <div className="bg-white rounded-lg border border-border p-8 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">🔒</div>
            <Heading level={3} className="mb-2 text-maroon">
              Secure & Compliant
            </Heading>
            <Body size="sm" className="text-muted-foreground">
              Enterprise-grade security for sensitive patient data.
            </Body>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white border-t border-b border-border py-20">
        <div className="max-w-4xl mx-auto px-8">
          <Heading level={2} className="text-center mb-16">
            Trusted by Ayurvedic Practitioners Worldwide
          </Heading>
          
          {/* Carousel */}
          <div className="bg-parchment rounded-lg p-12 border border-border">
            <div className="flex gap-1 mb-6 justify-center">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-gold text-2xl">
                  ★
                </span>
              ))}
            </div>
            <Body className="mb-8 italic text-center text-lg">
              &quot;{testimonials[currentTestimonial].text}&quot;
            </Body>
            <div className="text-center">
              <div className="font-medium text-ink text-lg">{testimonials[currentTestimonial].name}</div>
              <div className="text-sm text-muted-foreground">{testimonials[currentTestimonial].location}</div>
            </div>

            {/* Carousel Controls */}
            <div className="flex gap-4 justify-center mt-8">
              <button
                onClick={() => setCurrentTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                className="px-4 py-2 text-maroon border border-maroon rounded-lg hover:bg-maroon hover:text-white transition-colors"
              >
                ← Previous
              </button>
              <div className="flex gap-2 items-center">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentTestimonial(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === currentTestimonial ? 'bg-maroon w-6' : 'bg-border'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => setCurrentTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
                className="px-4 py-2 text-maroon border border-maroon rounded-lg hover:bg-maroon hover:text-white transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="max-w-6xl mx-auto px-8 py-20">
        <Heading level={2} className="text-center mb-16">
          Seamlessly Integrate with Your Workflow
        </Heading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-5xl mb-4">⚡</div>
            <Heading level={3} className="mb-3 text-maroon">
              Easy Setup
            </Heading>
            <Body size="sm" className="text-muted-foreground">
              Get started in minutes. No complex configuration or steep learning curve required.
            </Body>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-4">🔗</div>
            <Heading level={3} className="mb-3 text-maroon">
              Integrations
            </Heading>
            <Body size="sm" className="text-muted-foreground">
              Works with your existing EMR and practice management systems.
            </Body>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-4">📱</div>
            <Heading level={3} className="mb-3 text-maroon">
              Mobile Ready
            </Heading>
            <Body size="sm" className="text-muted-foreground">
              Access from any device, anywhere. Full-featured mobile app included.
            </Body>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-white border-t border-b border-border py-20">
        <div className="max-w-6xl mx-auto px-8">
          <Heading level={2} className="text-center mb-16">
            Simple, Transparent Pricing
          </Heading>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter */}
            <div className="border border-border rounded-lg p-8 hover:shadow-lg transition-shadow">
              <Heading level={3} className="mb-2 text-maroon">
                Starter
              </Heading>
              <div className="text-3xl font-bold text-gold mb-4">$49<span className="text-lg text-muted-foreground">/mo</span></div>
              <Body size="sm" className="text-muted-foreground mb-6">
                Perfect for solo practitioners
              </Body>
              <ul className="space-y-3 mb-8">
                <li className="flex gap-2 text-sm">
                  <span className="text-maroon">✓</span>
                  <span>Up to 50 patients</span>
                </li>
                <li className="flex gap-2 text-sm">
                  <span className="text-maroon">✓</span>
                  <span>Basic reporting</span>
                </li>
                <li className="flex gap-2 text-sm">
                  <span className="text-maroon">✓</span>
                  <span>Email support</span>
                </li>
              </ul>
              <Link href="/auth/register" className="block">
                <Button variant="secondary" size="md" className="w-full">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Professional */}
            <div className="border-2 border-maroon rounded-lg p-8 hover:shadow-lg transition-shadow relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-maroon text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
              <Heading level={3} className="mb-2 text-maroon">
                Professional
              </Heading>
              <div className="text-3xl font-bold text-gold mb-4">$149<span className="text-lg text-muted-foreground">/mo</span></div>
              <Body size="sm" className="text-muted-foreground mb-6">
                For growing clinics
              </Body>
              <ul className="space-y-3 mb-8">
                <li className="flex gap-2 text-sm">
                  <span className="text-maroon">✓</span>
                  <span>Up to 500 patients</span>
                </li>
                <li className="flex gap-2 text-sm">
                  <span className="text-maroon">✓</span>
                  <span>Advanced analytics</span>
                </li>
                <li className="flex gap-2 text-sm">
                  <span className="text-maroon">✓</span>
                  <span>Priority support</span>
                </li>
                <li className="flex gap-2 text-sm">
                  <span className="text-maroon">✓</span>
                  <span>Team collaboration</span>
                </li>
              </ul>
              <Link href="/auth/register" className="block">
                <Button variant="primary" size="md" className="w-full">
                  Start Free Trial
                </Button>
              </Link>
            </div>

            {/* Enterprise */}
            <div className="border border-border rounded-lg p-8 hover:shadow-lg transition-shadow">
              <Heading level={3} className="mb-2 text-maroon">
                Enterprise
              </Heading>
              <div className="text-3xl font-bold text-gold mb-4">Custom</div>
              <Body size="sm" className="text-muted-foreground mb-6">
                For large institutions
              </Body>
              <ul className="space-y-3 mb-8">
                <li className="flex gap-2 text-sm">
                  <span className="text-maroon">✓</span>
                  <span>Unlimited patients</span>
                </li>
                <li className="flex gap-2 text-sm">
                  <span className="text-maroon">✓</span>
                  <span>Custom integrations</span>
                </li>
                <li className="flex gap-2 text-sm">
                  <span className="text-maroon">✓</span>
                  <span>Dedicated support</span>
                </li>
                <li className="flex gap-2 text-sm">
                  <span className="text-maroon">✓</span>
                  <span>SLA guarantee</span>
                </li>
              </ul>
              <Link href="/auth/register" className="block">
                <Button variant="ghost" size="md" className="w-full">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-8 py-20 text-center">
        <Heading level={2} className="mb-6">
          Ready to Elevate Your Practice?
        </Heading>
        <Body size="lg" className="text-muted-foreground mb-8">
          Join hundreds of Ayurvedic practitioners delivering better outcomes with VaidyaAI. Start your free 14-day trial today.
        </Body>
        <div className="flex gap-4 justify-center">
          <Link href="/auth/register">
            <Button variant="primary" size="lg">
              Start Free Trial
            </Button>
          </Link>
          <Link href="#features">
            <Button variant="secondary" size="lg">
              Learn More
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-border py-8 px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <div className="font-bold text-maroon font-fraunces">VaidyaAI</div>
            <div className="text-xs text-muted-foreground">Clinical Intelligence Platform</div>
          </div>
          <div className="text-sm text-muted-foreground">
            &copy; 2024 VaidyaAI. All rights reserved. | Privacy Policy | Terms of Service
          </div>
        </div>
      </footer>
    </div>
  )
}
