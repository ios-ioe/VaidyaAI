'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { AppShell } from '@/components/AppShell'
import { Card, CardContent, CardHeader } from '@/components/Card'
import { Badge } from '@/components/Badge'
import { Button } from '@/components/Button'
import { Heading, Body, Label } from '@/components/Typography'

const ConsultationPage = () => {
  const [consultationTime, setConsultationTime] = useState('12:45')

  const patientContext = {
    name: 'Ramesh Sharma',
    age: 64,
    id: 'VA-004492',
    prakriti: 'Vata-Pitta',
    agni: 'Vishama (Irregular)',
    vataLevel: 78,
    pittaLevel: 45,
    kaphaLevel: 22,
  }

  const transcriptLines = [
    {
      speaker: 'doctor',
      text: 'Namaste Ramesh-ji. How has your digestion been since our last session with the Triphala Churna?',
    },
    {
      speaker: 'patient',
      text: "It's better, but I'm still feeling a lot of bloating in the evenings, especially after dinner. I feel very heavy, and my sleep is quite restless.",
    },
    {
      speaker: 'doctor',
      text: 'Understood. Are you experiencing any dryness in the throat or joint cracking during the day?',
    },
    {
      speaker: 'patient',
      text: "Yes, precisely. My knees have been cracking more lately, and my skin feels very dry despite the humidity.",
    },
    {
      speaker: 'doctor',
      text: 'I see. This indicates a significant Vata aggravation in the Pakvashaya...',
      isLive: true,
    },
  ]

  const suggestions = [
    { title: 'Dashmoolarishta', matchPercentage: 92, description: 'Recommended for balancing Apana Vayu and relieving bloating.' },
    { title: 'Abhyanga', matchPercentage: 85, description: 'Prescribe daily oil massage with Dhanwantaram Thailam for Vata dryness.' },
  ]

  const riskIndicators = [
    { title: 'Severe Vata Imbalance', severity: 'high', details: 'Observing high anxiety and sleep disruption symptoms.' },
    { title: 'Dhatu Depletion', severity: 'medium', details: 'Suspected Mamsa Dhatu Kshaya based on weight history.' },
  ]

  return (
    <AppShell clinicName="VaidyaAI Clinical Platform" userName="Dr. Sharma">
      <div className="flex h-full gap-4 p-4 bg-parchment">
        {/* Left Sidebar - Patient Context */}
        <div className="w-1/4 space-y-4 overflow-y-auto">
          {/* Patient Identity */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-maroon/20 flex items-center justify-center text-maroon font-bold text-xl">
                  RS
                </div>
                <div className="flex-1">
                  <Heading level={3} className="text-maroon mb-1">{patientContext.name}</Heading>
                  <Body size="sm" className="text-muted-foreground">Age: {patientContext.age} | ID: {patientContext.id}</Body>
                </div>
              </div>
              <div className="space-y-3 pt-3 border-t border-border">
                <div className="flex justify-between items-center">
                  <Label>Prakriti</Label>
                  <Badge variant="default">{patientContext.prakriti}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <Label>Agni</Label>
                  <Body size="sm" className="text-gold">{patientContext.agni}</Body>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dosha Analysis */}
          <Card>
            <CardHeader>
              <Heading level={3} className="text-maroon">Current Dosha State</Heading>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <Label>Vata (High)</Label>
                  <Body size="sm">{patientContext.vataLevel}%</Body>
                </div>
                <div className="w-full bg-border rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-gold" style={{ width: `${patientContext.vataLevel}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <Label>Pitta (Balanced)</Label>
                  <Body size="sm">{patientContext.pittaLevel}%</Body>
                </div>
                <div className="w-full bg-border rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-maroon" style={{ width: `${patientContext.pittaLevel}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <Label>Kapha (Low)</Label>
                  <Body size="sm">{patientContext.kaphaLevel}%</Body>
                </div>
                <div className="w-full bg-border rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-sage" style={{ width: `${patientContext.kaphaLevel}%` }} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Indicators */}
          <Card>
            <CardHeader>
              <Heading level={3} className="text-maroon">Risk Indicators</Heading>
            </CardHeader>
            <CardContent className="space-y-3">
              {riskIndicators.map((indicator, idx) => (
                <div key={idx} className={`p-3 rounded-lg ${indicator.severity === 'high' ? 'bg-risk/10' : 'bg-gold/10'}`}>
                  <Label className="text-maroon">{indicator.title}</Label>
                  <Body size="sm" className="text-muted-foreground mt-1">{indicator.details}</Body>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Center Panel - Consultation */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between bg-white border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Heading level={3} className="text-maroon">VaidyaAI Workspace</Heading>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <Body size="sm" className="text-ink">LIVE CONSULTATION: Patient #{patientContext.id.split('-')[1]}</Body>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-parchment px-3 py-2 rounded-lg">
                <Body size="sm" className="text-maroon font-medium">{consultationTime}</Body>
              </div>
              <Link href="/treatment">
                <Button variant="secondary" size="md">
                  Create Treatment Plan
                </Button>
              </Link>
              <Button variant="primary" size="md">
                End Consultation
              </Button>
            </div>
          </div>

          {/* Transcript */}
          <Card className="flex-1 flex flex-col overflow-hidden">
            <CardHeader className="bg-parchment border-b border-border">
              <Heading level={3} className="text-maroon">Live Transcript</Heading>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto space-y-4">
              {transcriptLines.map((line, idx) => (
                <div key={idx} className="flex gap-4">
                  <Body size="sm" className={`font-bold shrink-0 w-16 ${line.speaker === 'doctor' ? 'text-maroon' : 'text-gold'}`}>
                    {line.speaker === 'doctor' ? 'Doctor:' : 'Patient:'}
                  </Body>
                  <Body size="sm" className={line.isLive ? 'italic border-l-2 border-maroon pl-3' : ''}>
                    {line.text}
                  </Body>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Clinical Reasoning */}
          <Card>
            <CardHeader>
              <Heading level={3} className="text-maroon">Real-time Clinical Reasoning</Heading>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-maroon font-semibold">Nidana (Etiology)</Label>
                <ul className="mt-2 space-y-2 text-sm">
                  <li className="flex gap-2"><span className="text-maroon">•</span>Sheetala Ahara (Cold food intake)</li>
                  <li className="flex gap-2"><span className="text-maroon">•</span>Vegadharana (Suppression of urges)</li>
                </ul>
              </div>
              <div>
                <Label className="text-maroon font-semibold">Samprapti (Pathogenesis)</Label>
                <ul className="mt-2 space-y-2 text-sm">
                  <li className="flex gap-2"><span className="text-maroon">•</span>Vata Chaya in Pakvashaya</li>
                  <li className="flex gap-2"><span className="text-maroon">•</span>Srotas obstruction</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Suggestions & Actions */}
        <div className="w-1/4 space-y-4 overflow-y-auto">
          {/* Suggestions */}
          <Card>
            <CardHeader>
              <Heading level={3} className="text-maroon">AI Suggestions</Heading>
            </CardHeader>
            <CardContent className="space-y-3">
              {suggestions.map((suggestion, idx) => (
                <div key={idx} className="p-3 border border-border rounded-lg hover:border-maroon transition-colors cursor-pointer">
                  <div className="flex justify-between items-start mb-1">
                    <Label className="text-maroon">{suggestion.title}</Label>
                    <Badge variant="default" className="text-xs">{suggestion.matchPercentage}% Match</Badge>
                  </div>
                  <Body size="sm" className="text-muted-foreground">{suggestion.description}</Body>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <Heading level={3} className="text-maroon">Quick Actions</Heading>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/assessment" className="block">
                <Button variant="secondary" size="md" className="w-full">
                  View Assessment
                </Button>
              </Link>
              <Link href="/reports" className="block">
                <Button variant="secondary" size="md" className="w-full">
                  Generate Report
                </Button>
              </Link>
              <Link href="/treatment" className="block">
                <Button variant="primary" size="md" className="w-full">
                  Treatment Plan
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card>
            <CardHeader>
              <Heading level={3} className="text-maroon">System Status</Heading>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <Label>Recording</Label>
                <Badge variant="vata">Active</Badge>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <Label>Transcription</Label>
                <Badge variant="pitta">Running</Badge>
              </div>
              <div className="flex justify-between items-center py-2">
                <Label>Connection</Label>
                <Badge variant="kapha">Stable</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}

export default ConsultationPage
