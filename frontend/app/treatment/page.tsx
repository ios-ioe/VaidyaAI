'use client'

import React, { useState } from 'react'
import { AppShell } from '@/components/AppShell'
import { Card, CardContent, CardHeader } from '@/components/Card'
import { Badge } from '@/components/Badge'
import { Button } from '@/components/Button'
import { Heading, Body, Label } from '@/components/Typography'

interface HerbFormulation {
  id: string
  name: string
  dosage: string
  icon: string
  reasoning: string
}

interface PanchakarmaStep {
  id: string
  name: string
  description: string
  icon: string
}

interface LifestyleItem {
  id: string
  text: string
  completed: boolean
}

const herbFormulations: HerbFormulation[] = [
  {
    id: '1',
    name: 'Amalaki Rasayana',
    dosage: '5g twice daily with warm water',
    icon: '🌿',
    reasoning: 'Potent pitta-pacifier and rejuvenator. Directly addresses the high acid levels in the GI tract while building Ojas to combat fatigue.',
  },
  {
    id: '2',
    name: 'Brahmi Vati',
    dosage: '1 tablet after dinner',
    icon: '💊',
    reasoning: 'Medhya Rasayana for neurological calm. Supports the Majja Dhatu and balances the Sub-Dosha Prana Vayu to regulate sleep cycles.',
  },
  {
    id: '3',
    name: 'Avipattikara Churna',
    dosage: '3g before main meals',
    icon: '🧪',
    reasoning: 'Classic formulation for Amlapitta. Provides mild purgation (Mridu Virechana) to clear accumulated excess heat from the small intestine.',
  },
]

const panchakarmaSteps: PanchakarmaStep[] = [
  {
    id: '1',
    name: 'Shirodhara (Takra)',
    description: '45 minutes daily for 7 days. Uses cooling medicated buttermilk to pacify high Sadhaka Pitta.',
    icon: '💧',
  },
  {
    id: '2',
    name: 'Abhyanga (Kshirabala Oil)',
    description: 'Full body massage with emphasis on feet (Padabhyanga) to ground erratic Vata.',
    icon: '🛢️',
  },
]

const lifestyleItems: LifestyleItem[] = [
  { id: '1', text: 'Favor sweet, bitter, and astringent tastes', completed: false },
  { id: '2', text: 'Avoid fermented foods and nightshades', completed: false },
  { id: '3', text: 'Main meal at peak Sun (12:00 PM - 1:30 PM)', completed: false },
  { id: '4', text: 'Sleep by 10:00 PM for Pitta-Vata balance', completed: false },
  { id: '5', text: 'Morning Abhyanga with cooler oils in summer', completed: false },
]

export default function TreatmentAdvisor() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})

  const toggleItem = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <AppShell clinicName="VaidyaAI Clinical Platform" userName="Dr. Sharma">
      <div className="space-y-8">
        {/* Patient Brief Header */}
        <div className="space-y-4 pb-6 border-b border-border">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Badge variant="default">Case #AI-4092</Badge>
              <span className="text-sm text-muted-foreground">Oct 24, 2023</span>
            </div>
            <Heading level={1}>Aditya Sharma</Heading>
            <Body className="text-muted-foreground">42, Pitta-Vata</Body>
          </div>
          <Body>
            Diagnosis: Chronic Hyperacidity (Amlapitta) with secondary Insomnia and mental fatigue. Recommended protocol focuses on cooling (Sheetala) and grounding (Sthira) interventions.
          </Body>
          <Button variant="primary" size="md">
            Finalize & Generate Report
          </Button>
        </div>

        {/* Primary Formulations */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Heading level={2}>Primary Formulations</Heading>
            <Button variant="secondary" size="sm">
              + Add Supplement
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {herbFormulations.map((herb) => (
              <Card key={herb.id}>
                <CardContent className="pt-6">
                  <div className="mb-4">
                    <Badge variant="default" className="text-xs">
                      Cited from Charaka Samhita
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{herb.icon}</span>
                    <Heading level={3}>{herb.name}</Heading>
                  </div>
                  <div className="mb-4 flex items-center gap-2 text-gold">
                    <span>💊</span>
                    <Label>Dosage: {herb.dosage}</Label>
                  </div>
                  <Body size="sm" className="text-muted-foreground">
                    {herb.reasoning}
                  </Body>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Panchakarma & Diet Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Panchakarma Suggestions */}
          <Card>
            <CardHeader>
              <Heading level={3} className="flex items-center gap-2">
                🧖 Panchakarma Protocol
              </Heading>
            </CardHeader>
            <CardContent className="space-y-4">
              {panchakarmaSteps.map((step) => (
                <div key={step.id} className="flex gap-4 p-4 bg-parchment rounded-lg border border-border">
                  <div className="text-2xl">{step.icon}</div>
                  <div className="flex-1">
                    <Label className="block mb-1">{step.name}</Label>
                    <Body size="sm" className="text-muted-foreground">
                      {step.description}
                    </Body>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Diet & Lifestyle Checklist */}
          <Card>
            <CardHeader>
              <Heading level={3} className="flex items-center gap-2">
                ✓ Diet & Lifestyle Plan
              </Heading>
            </CardHeader>
            <CardContent className="space-y-3">
              {lifestyleItems.map((item) => (
                <label key={item.id} className="flex items-center gap-3 p-2 hover:bg-parchment rounded cursor-pointer group transition-colors">
                  <input
                    type="checkbox"
                    checked={checkedItems[item.id] || false}
                    onChange={() => toggleItem(item.id)}
                    className="w-5 h-5 rounded border-2 border-maroon cursor-pointer accent-maroon"
                  />
                  <Body className={checkedItems[item.id] ? 'line-through text-muted-foreground' : ''}>{item.text}</Body>
                </label>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Additional Recommendations */}
        <Card>
          <CardHeader>
            <Heading level={3}>Clinical Guidance</Heading>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-parchment rounded-lg border border-border">
                <Label className="block mb-2 text-maroon">Preferred Seasons</Label>
                <Body size="sm">Autumn (Sharad Ritu) and early Spring (Vasant Ritu) are optimal for this protocol.</Body>
              </div>
              <div className="p-4 bg-parchment rounded-lg border border-border">
                <Label className="block mb-2 text-maroon">Follow-up</Label>
                <Body size="sm">Reassess Prakriti and symptoms after 6-8 weeks of consistent protocol adherence.</Body>
              </div>
            </div>
            <div className="p-4 bg-parchment rounded-lg border border-border">
              <Label className="block mb-2 text-maroon">Warnings</Label>
              <Body size="sm">Discontinue formulations if GI distress occurs. Avoid Shirodhara if suffering from active migraine or acute sinusitis.</Body>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
