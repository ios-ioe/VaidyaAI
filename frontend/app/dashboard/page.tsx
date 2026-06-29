'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { AppShell } from '@/components/AppShell'
import { Card, CardContent, CardHeader } from '@/components/Card'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { Heading, Body, Label } from '@/components/Typography'

interface Appointment {
  id: string
  time: string
  patientName: string
  type: string
  dosha: 'vata' | 'pitta' | 'kapha'
}

interface Patient {
  id: string
  name: string
  patientId: string
  doshas: ('vata' | 'pitta' | 'kapha')[]
  lastVisit: string
  avatar: string
}

const appointments: Appointment[] = [
  {
    id: '1',
    time: '09:00 AM',
    patientName: 'Karan Malhotra',
    type: 'General Follow-up',
    dosha: 'vata',
  },
  {
    id: '2',
    time: '10:30 AM',
    patientName: 'Priya Singh',
    type: 'Acute Pitta Imbalance',
    dosha: 'pitta',
  },
  {
    id: '3',
    time: '11:15 AM',
    patientName: 'Ananya Verma',
    type: 'Kapha Seasonal Routine',
    dosha: 'kapha',
  },
  {
    id: '4',
    time: '02:00 PM',
    patientName: 'Rajesh Kumar',
    type: 'Consultation',
    dosha: 'vata',
  },
]

const recentPatients: Patient[] = [
  {
    id: '1',
    name: 'Arjun Bhattacharya',
    patientId: 'VA-2947',
    doshas: ['vata', 'pitta'],
    lastVisit: '2 days ago',
    avatar: '👨‍⚕️',
  },
  {
    id: '2',
    name: 'Sushma Iyer',
    patientId: 'VA-8721',
    doshas: ['kapha'],
    lastVisit: '5 days ago',
    avatar: '👩‍⚕️',
  },
  {
    id: '3',
    name: 'Vikram Seth',
    patientId: 'VA-4410',
    doshas: ['pitta', 'kapha'],
    lastVisit: 'Yesterday',
    avatar: '👨‍💼',
  },
  {
    id: '4',
    name: 'Ishita Ray',
    patientId: 'VA-3109',
    doshas: ['vata'],
    lastVisit: '1 week ago',
    avatar: '👩‍🎨',
  },
]

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('')

  const getDoshaColor = (dosha: string) => {
    switch (dosha) {
      case 'vata':
        return 'bg-blue-50 text-blue-700 border border-blue-200'
      case 'pitta':
        return 'bg-red-50 text-red-700 border border-red-200'
      case 'kapha':
        return 'bg-green-50 text-green-700 border border-green-200'
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200'
    }
  }

  return (
    <AppShell clinicName="VaidyaAI Clinical Platform" userName="Dr. Sharma">
      <div className="space-y-6">
        {/* Header with Search */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <Heading level={1} className="text-maroon">
              Good Morning, Dr. Sharma
            </Heading>
            <Body className="text-muted-foreground mt-1">
              4 appointments today • 2 urgent cases
            </Body>
          </div>
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search patients by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-parchment border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon focus:border-transparent"
            />
          </div>
          <Button variant="primary" size="lg">
            + New Consultation
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-border p-6">
            <Label className="text-muted-foreground">Today's Consultations</Label>
            <div className="text-4xl font-bold text-maroon mt-2">4</div>
            <Body size="sm" className="text-muted-foreground mt-1">
              1 urgent, 3 routine
            </Body>
          </div>
          <div className="bg-white rounded-lg border border-border p-6">
            <Label className="text-muted-foreground">Active Patients</Label>
            <div className="text-4xl font-bold text-gold mt-2">147</div>
            <Body size="sm" className="text-muted-foreground mt-1">
              12 high priority
            </Body>
          </div>
          <div className="bg-white rounded-lg border border-border p-6">
            <Label className="text-muted-foreground">Pending Reports</Label>
            <div className="text-4xl font-bold text-sage mt-2">8</div>
            <Body size="sm" className="text-muted-foreground mt-1">
              Due within 3 days
            </Body>
          </div>
          <div className="bg-white rounded-lg border border-border p-6">
            <Label className="text-muted-foreground">Clinic Health</Label>
            <div className="text-4xl font-bold text-maroon mt-2">4.8★</div>
            <Body size="sm" className="text-muted-foreground mt-1">
              Patient satisfaction
            </Body>
          </div>
        </div>

        {/* Appointments and Recent Patients */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Appointments */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <Heading level={3} className="text-maroon">
                  Today's Schedule
                </Heading>
              </CardHeader>
              <CardContent className="space-y-3">
                {appointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="flex items-center gap-4 p-4 bg-parchment rounded-lg border border-border hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="text-center w-16">
                      <div className="text-lg font-bold text-maroon">{appt.time.split(' ')[0]}</div>
                      <Body size="sm" className="text-muted-foreground">
                        {appt.time.split(' ')[1]}
                      </Body>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-ink">{appt.patientName}</div>
                      <Body size="sm" className="text-muted-foreground">
                        {appt.type}
                      </Body>
                    </div>
                    <Badge variant={appt.dosha} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recent Patients Summary */}
          <div>
            <Card>
              <CardHeader>
                <Heading level={3} className="text-maroon">
                  Recent Patients
                </Heading>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentPatients.map((patient) => (
                  <div key={patient.id} className="p-3 bg-parchment rounded-lg hover:shadow-sm transition-shadow cursor-pointer">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-maroon/10 flex items-center justify-center text-maroon text-sm font-bold">
                        {patient.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-ink text-sm">{patient.name}</div>
                        <Body size="sm" className="text-muted-foreground text-xs">
                          {patient.patientId}
                        </Body>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {patient.doshas.map((dosha) => (
                        <Badge key={dosha} variant={dosha} />
                      ))}
                    </div>
                    <Body size="sm" className="text-muted-foreground text-xs">
                      Last: {patient.lastVisit}
                    </Body>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Clinical Tools Navigation */}
        <div>
          <Heading level={2} className="text-maroon mb-6">Access Clinical Tools</Heading>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Prakriti Assessment */}
            <Link href="/assessment">
              <div className="p-6 bg-white rounded-lg border border-border hover:border-gold hover:shadow-lg transition-all cursor-pointer h-full">
                <div className="text-4xl mb-3">📊</div>
                <Heading level={3} className="text-maroon mb-2 text-lg">Prakriti Assessment</Heading>
                <Body size="sm" className="text-muted-foreground">Analyze patient constitution and dosha balance with detailed radial charts</Body>
              </div>
            </Link>

            {/* Treatment Advisor */}
            <Link href="/treatment">
              <div className="p-6 bg-white rounded-lg border border-border hover:border-gold hover:shadow-lg transition-all cursor-pointer h-full">
                <div className="text-4xl mb-3">💊</div>
                <Heading level={3} className="text-maroon mb-2 text-lg">Treatment Advisor</Heading>
                <Body size="sm" className="text-muted-foreground">Create personalized treatment plans with herbs and Panchakarma protocols</Body>
              </div>
            </Link>

            {/* Live Consultation */}
            <Link href="/consultation">
              <div className="p-6 bg-white rounded-lg border border-border hover:border-gold hover:shadow-lg transition-all cursor-pointer h-full">
                <div className="text-4xl mb-3">🎤</div>
                <Heading level={3} className="text-maroon mb-2 text-lg">Live Consultation</Heading>
                <Body size="sm" className="text-muted-foreground">AI-assisted real-time consultation with transcription and clinical reasoning</Body>
              </div>
            </Link>

            {/* Clinical Reports */}
            <Link href="/reports">
              <div className="p-6 bg-white rounded-lg border border-border hover:border-gold hover:shadow-lg transition-all cursor-pointer h-full">
                <div className="text-4xl mb-3">📈</div>
                <Heading level={3} className="text-maroon mb-2 text-lg">Clinical Reports</Heading>
                <Body size="sm" className="text-muted-foreground">Generate professional printable reports with diagnostic summaries</Body>
              </div>
            </Link>
          </div>
        </div>

        {/* All Recent Patients */}
        <Card>
          <CardHeader>
            <Heading level={3} className="text-maroon">
              All Recent Patients
            </Heading>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="p-4 bg-white rounded-lg border border-border hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-maroon/10 flex items-center justify-center text-2xl">
                      {patient.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-ink">{patient.name}</div>
                      <Body size="sm" className="text-muted-foreground">
                        {patient.patientId}
                      </Body>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {patient.doshas.map((dosha) => (
                      <span key={dosha} className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getDoshaColor(dosha)}`}>
                        {dosha}
                      </span>
                    ))}
                  </div>
                  <div className="pt-3 border-t border-border flex justify-between items-center">
                    <Body size="sm" className="text-muted-foreground">
                      Last visit: {patient.lastVisit}
                    </Body>
                    <span className="text-lg">🏥</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* VaidyaAI Insights */}
        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🧠</span>
                  <Heading level={3} className="text-maroon">
                    VaidyaAI Insights
                  </Heading>
                </div>
                <Body className="text-muted-foreground mb-6">
                  Based on your recent consultations, we&apos;ve detected a 15% seasonal spike in Pitta imbalances. We recommend reviewing the latest seasonal dietary guidelines (Ritucharya) for your chronic patients.
                </Body>
                <div className="flex gap-3">
                  <Button variant="primary" size="md">
                    Review Guidelines
                  </Button>
                  <Button variant="ghost" size="md">
                    Dismiss
                  </Button>
                </div>
              </div>
              <div className="w-full md:w-48 h-32 bg-parchment rounded-lg border border-border flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl mb-2">📈</div>
                  <Body size="sm" className="text-muted-foreground font-bold">
                    CLINIC HEALTH
                  </Body>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
