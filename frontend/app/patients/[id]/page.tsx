'use client'

import React, { useState } from 'react'
import { AppShell } from '@/components/AppShell'
import { Card, CardContent, CardHeader } from '@/components/Card'
import { Badge } from '@/components/Badge'
import { Button } from '@/components/Button'
import { Heading, Body, Label } from '@/components/Typography'

interface Vital {
  label: string
  value: string
  unit?: string
  status: string
  statusColor: 'success' | 'warning' | 'error'
}

interface Medication {
  name: string
  dosage: string
  frequency: string
  status: 'active' | 'inactive'
}

interface RiskFlag {
  label: string
  type: 'warning' | 'info'
}

const patient = {
  id: '72019',
  name: 'Leela Krishnan',
  age: 72,
  gender: 'Female',
  phone: '+91 98450 12345',
  location: 'Kochi, Kerala',
  riskLevel: 'high',
  prakriti: 'Vata-Pitta',
}

const vitals: Vital[] = [
  { label: 'Blood Pressure', value: '138/88', status: 'Slightly High', statusColor: 'warning' },
  { label: 'Pulse (Nadi)', value: '76', unit: 'bpm', status: 'Regular', statusColor: 'success' },
  { label: 'Weight', value: '64', unit: 'kg', status: '-1.2kg (30 days)', statusColor: 'success' },
]

const medications: Medication[] = [
  { name: 'Ashwagandha Churna', dosage: '500mg', frequency: 'Twice daily with warm milk', status: 'active' },
  { name: 'Brahmi Vati', dosage: '1 Tablet', frequency: 'After breakfast', status: 'active' },
  { name: 'Amlodipine (Allopathic)', dosage: '5mg', frequency: 'Control for BP', status: 'inactive' },
]

const riskFlags: RiskFlag[] = [
  { label: 'Hypertension Risk', type: 'warning' },
  { label: 'Acute Vata Imbalance', type: 'warning' },
  { label: 'High Sodium Intake', type: 'info' },
]

const doshaSummary = [
  { name: 'Vata', percentage: 45, color: 'maroon' },
  { name: 'Pitta', percentage: 30, color: 'gold' },
  { name: 'Kapha', percentage: 25, color: 'sage' },
]

export default function PatientProfile({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('overview')

  const getVitalStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-sage'
      case 'warning':
        return 'text-gold'
      case 'error':
        return 'text-risk'
      default:
        return 'text-muted-foreground'
    }
  }

  return (
    <AppShell clinicName="VaidyaAI Clinical Platform" userName="Dr. Arjun Sharma">
      <div className="space-y-6">
        {/* Patient Header */}
        <div className="bg-white rounded-lg border border-border p-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-6">
            <div className="flex gap-6 items-start w-full">
              <div className="w-24 h-24 rounded-2xl bg-parchment border border-border flex items-center justify-center flex-shrink-0">
                <div className="text-3xl font-bold text-maroon">LK</div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Heading level={2}>{patient.name}</Heading>
                  <Badge variant="risk">High Risk</Badge>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <Body size="sm" className="text-muted-foreground flex items-center gap-1">
                    📅 {patient.age} Years
                  </Body>
                  <Body size="sm" className="text-muted-foreground flex items-center gap-1">
                    👩 Female
                  </Body>
                  <Body size="sm" className="text-muted-foreground flex items-center gap-1">
                    ☎️ {patient.phone}
                  </Body>
                  <Body size="sm" className="text-muted-foreground flex items-center gap-1">
                    📍 {patient.location}
                  </Body>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" size="md">
                Edit Profile
              </Button>
              <Button variant="primary" size="md">
                Record Vitals
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-t border-border pt-4">
            <div className="flex gap-6">
              {['Overview', 'History', 'Prakriti', 'Treatment Plan', 'Reports'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`pb-2 border-b-2 font-medium transition-colors ${
                    activeTab === tab.toLowerCase()
                      ? 'border-maroon text-maroon'
                      : 'border-transparent text-muted-foreground hover:text-ink'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Overview Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Dosha Summary - Full Width on Left */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <Heading level={3}>Dosha Balance (Vikriti)</Heading>
                </CardHeader>
                <CardContent className="space-y-6">
                  {doshaSummary.map((dosha) => (
                    <div key={dosha.name}>
                      <div className="flex justify-between items-end mb-2">
                        <Label className={`uppercase tracking-widest ${
                          dosha.color === 'maroon' ? 'text-maroon' :
                          dosha.color === 'gold' ? 'text-gold' :
                          'text-sage'
                        }`}>
                          {dosha.name}
                        </Label>
                        <Heading level={3} className={
                          dosha.color === 'maroon' ? 'text-maroon' :
                          dosha.color === 'gold' ? 'text-gold' :
                          'text-sage'
                        }>
                          {dosha.percentage}%
                        </Heading>
                      </div>
                      <div className="h-4 bg-parchment rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full shadow-sm ${
                            dosha.color === 'maroon' ? 'bg-maroon' :
                            dosha.color === 'gold' ? 'bg-gold' :
                            'bg-sage'
                          }`}
                          style={{ width: `${dosha.percentage}%` }}
                        />
                      </div>
                      {dosha.name === 'Vata' && (
                        <Body size="sm" className="text-muted-foreground mt-2">
                          Elevated: Linked to reported insomnia and joint stiffness.
                        </Body>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Recent Vitals */}
            <div className="space-y-4">
              <Heading level={3}>Recent Vitals</Heading>
              {vitals.map((vital, idx) => (
                <Card key={idx}>
                  <CardContent className="pt-6 text-center">
                    <Label className="text-muted-foreground uppercase text-xs block mb-2">
                      {vital.label}
                    </Label>
                    <Heading level={2} className="text-maroon mb-1">
                      {vital.value}
                      {vital.unit && <span className="text-body-md"> {vital.unit}</span>}
                    </Heading>
                    <Body size="sm" className={getVitalStatusColor(vital.statusColor)}>
                      {vital.status}
                    </Body>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Medications & Risk Flags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Heading level={3}>Herbs & Medications</Heading>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {medications.map((med, idx) => (
                  <div
                    key={idx}
                    className={`p-4 bg-parchment rounded-lg border border-border ${
                      med.status === 'inactive' ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <Body className="font-medium">{med.name}</Body>
                        <Body size="sm" className="text-muted-foreground">
                          {med.dosage} • {med.frequency}
                        </Body>
                      </div>
                      {med.status === 'active' && (
                        <span className="text-sage">✓</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Heading level={3}>Clinical Risk Flags</Heading>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {riskFlags.map((flag, idx) => (
                  <Badge
                    key={idx}
                    variant={flag.type === 'warning' ? 'risk' : 'default'}
                  >
                    {flag.label}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
