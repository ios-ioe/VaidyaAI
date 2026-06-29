'use client'

import React from 'react'
import { AppShell } from '@/components/AppShell'
import { Card, CardContent, CardHeader } from '@/components/Card'
import { Badge } from '@/components/Badge'
import { Button } from '@/components/Button'
import { Heading, Body, Label } from '@/components/Typography'

export default function PrakrtiAssessment() {
  const [activeTab, setActiveTab] = React.useState('summary')

  return (
    <AppShell clinicName="VaidyaAI Clinical Platform" userName="Dr. Sharma">
      <div className="space-y-6">
        {/* Breadcrumb & Header */}
        <div>
          <div className="flex items-center gap-2 text-muted-foreground mb-2 text-sm">
            <span>Patients</span>
            <span className="text-muted-foreground">/</span>
            <span>Arjun Mehta</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-maroon font-medium">Prakriti Assessment</span>
          </div>
          <Heading level={2}>Patient Constitution (Prakriti)</Heading>
        </div>

        {/* Main Assessment Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section: Dosha Wheel & Summary */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  {/* Dosha Radial Chart */}
                  <div className="flex-shrink-0 w-64 h-64 relative flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
                      {/* Center circle */}
                      <circle cx="70" cy="70" r="50" fill="white" stroke="#E8DDD0" strokeWidth="2" />
                      
                      {/* Pitta (Maroon) - 42% */}
                      <circle
                        cx="70"
                        cy="70"
                        r="50"
                        fill="transparent"
                        stroke="#6B1E23"
                        strokeWidth="14"
                        strokeDasharray="132 314"
                        strokeDashoffset="0"
                      />
                      
                      {/* Vata (Gold) - 38% */}
                      <circle
                        cx="70"
                        cy="70"
                        r="50"
                        fill="transparent"
                        stroke="#D4A857"
                        strokeWidth="14"
                        strokeDasharray="119.3 314"
                        strokeDashoffset="-132"
                      />
                      
                      {/* Kapha (Sage) - 20% */}
                      <circle
                        cx="70"
                        cy="70"
                        r="50"
                        fill="transparent"
                        stroke="#4A6B5A"
                        strokeWidth="14"
                        strokeDasharray="62.8 314"
                        strokeDashoffset="-251.3"
                      />
                    </svg>
                    
                    {/* Center text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <Label className="text-xs uppercase tracking-widest text-muted-foreground">Dominant</Label>
                      <Heading level={3} className="text-maroon">Pitta-Vata</Heading>
                      <Label className="text-gold font-medium">64% Intensity</Label>
                    </div>
                  </div>

                  {/* Summary Text */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 rounded-full bg-maroon"></div>
                      <Heading level={3}>Assessment Summary</Heading>
                    </div>
                    <p className="italic text-ink mb-4 leading-relaxed">
                      "The patient exhibits a strong Pitta-Vata duality, manifesting as heightened metabolic heat tempered by nervous system irregularity. Digestion is sharp but prone to acidity, while physical energy oscillates between intense focus and rapid depletion."
                    </p>
                    <Body className="text-muted-foreground">
                      Clinical observation suggests an imbalance in Ranjaka Pitta, potentially exacerbated by environmental stressors. Recommend stabilizing the central nervous system before addressing gastrointestinal heat.
                    </Body>
                  </div>
                </div>

                {/* Symptom Tags */}
                <div className="mt-8 pt-6 border-t border-border">
                  <Label className="block mb-4">Observed Clinical Markers</Label>
                  <div className="flex flex-wrap gap-3">
                    <span className="px-4 py-2 rounded-full bg-parchment border border-border text-ink text-sm flex items-center gap-2">
                      💧 Dry Skin
                    </span>
                    <span className="px-4 py-2 rounded-full bg-maroon/10 border border-maroon/20 text-maroon text-sm flex items-center gap-2">
                      🔥 Sharp Digestion
                    </span>
                    <span className="px-4 py-2 rounded-full bg-gold/10 border border-gold/20 text-ink text-sm flex items-center gap-2">
                      ⚡ Rapid Speech
                    </span>
                    <span className="px-4 py-2 rounded-full bg-sage/10 border border-sage/20 text-sage text-sm flex items-center gap-2">
                      ❄️ Cold Extremities
                    </span>
                    <span className="px-4 py-2 rounded-full bg-parchment border border-border text-ink text-sm flex items-center gap-2">
                      👁️ Reddened Sclera
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Section: Dosha Details & CTA */}
          <div className="space-y-4">
            {/* Dosha Breakdown */}
            <Card>
              <CardHeader>
                <Label className="text-maroon font-bold">Detailed Dosha Mix</Label>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Pitta */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label className="text-maroon font-medium">Pitta (Fire/Water)</Label>
                    <span className="text-sm font-bold text-ink">42%</span>
                  </div>
                  <div className="w-full h-2 bg-parchment rounded-full overflow-hidden">
                    <div className="h-full bg-maroon" style={{ width: '42%' }}></div>
                  </div>
                </div>

                {/* Vata */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label className="text-gold font-medium">Vata (Air/Ether)</Label>
                    <span className="text-sm font-bold text-ink">38%</span>
                  </div>
                  <div className="w-full h-2 bg-parchment rounded-full overflow-hidden">
                    <div className="h-full bg-gold" style={{ width: '38%' }}></div>
                  </div>
                </div>

                {/* Kapha */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label className="text-sage font-medium">Kapha (Earth/Water)</Label>
                    <span className="text-sm font-bold text-ink">20%</span>
                  </div>
                  <div className="w-full h-2 bg-parchment rounded-full overflow-hidden">
                    <div className="h-full bg-sage" style={{ width: '20%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">✨</span>
                  <Label className="text-maroon font-bold">VaidyaAI Insights</Label>
                </div>
                <Body size="sm" className="text-muted-foreground">
                  Pattern detected: Seasonal transition (Sharad Ritu) is likely aggravating the Pitta element. Consider cooling (Shitavirya) therapies rather than aggressive cleansing.
                </Body>
              </CardContent>
            </Card>

            {/* CTA Button */}
            <Button variant="primary" size="lg" className="w-full">
              Generate Treatment Plan
            </Button>
            <Body size="sm" className="text-center text-muted-foreground">
              Assessment verified by clinical logic engine v4.2
            </Body>
          </div>
        </div>

        {/* Detailed Attributes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Physical Traits */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-parchment flex items-center justify-center">
                  💪
                </div>
                <Heading level={3}>Physical Constitution</Heading>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between pb-2 border-b border-border text-sm">
                <span className="text-muted-foreground">Frame</span>
                <span className="font-bold text-ink">Medium/Athletic</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-border text-sm">
                <span className="text-muted-foreground">Skin Temp</span>
                <span className="font-bold text-ink">Warm</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Endurance</span>
                <span className="font-bold text-ink">Moderate</span>
              </div>
            </CardContent>
          </Card>

          {/* Mental Traits */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-parchment flex items-center justify-center">
                  🧠
                </div>
                <Heading level={3}>Psychological Profile</Heading>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between pb-2 border-b border-border text-sm">
                <span className="text-muted-foreground">Memory</span>
                <span className="font-bold text-ink">Sharp/Analytical</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-border text-sm">
                <span className="text-muted-foreground">Sleep</span>
                <span className="font-bold text-ink">Interrupted</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Stress Response</span>
                <span className="font-bold text-ink">Reactive</span>
              </div>
            </CardContent>
          </Card>

          {/* Digestive Traits */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-parchment flex items-center justify-center">
                  🔥
                </div>
                <Heading level={3}>Digestive Profile</Heading>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between pb-2 border-b border-border text-sm">
                <span className="text-muted-foreground">Agni (Digestion)</span>
                <span className="font-bold text-ink">Sharp/Variable</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-border text-sm">
                <span className="text-muted-foreground">Appetite</span>
                <span className="font-bold text-ink">Irregular</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Digestion Time</span>
                <span className="font-bold text-ink">2-3 hours</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
