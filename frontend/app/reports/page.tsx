'use client'

import React from 'react'
import { AppShell } from '@/components/AppShell'
import { Card, CardContent, CardHeader } from '@/components/Card'
import { Button } from '@/components/Button'
import { Heading, Body, Label } from '@/components/Typography'

export default function ReportPreview() {
  return (
    <AppShell clinicName="VaidyaAI Clinical Platform" userName="Dr. Sharma">
      <div className="space-y-6">
        {/* Header with Title */}
        <div className="flex items-center justify-between">
          <div>
            <Heading level={2}>Clinical Report</Heading>
            <Body className="text-muted-foreground mt-1">Mrs. Sunita Venkatesh • Case #9402-SV</Body>
          </div>
          <Button variant="primary" size="md">
            ⬇️ Download PDF
          </Button>
        </div>

        {/* Report Document Preview */}
        <Card className="bg-white shadow-lg overflow-hidden">
          {/* Maroon Header Band */}
          <div className="bg-maroon text-white p-8 relative overflow-hidden">
            <div className="flex justify-between items-start relative z-10">
              <div>
                <Heading level={2} className="text-white mb-1">
                  VaidyaAI Clinical Report
                </Heading>
                <Label className="text-white/70 uppercase tracking-widest">
                  Holistic Diagnostic Suite
                </Label>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gold">Dr. Aarav Sharma, B.A.M.S.</div>
                <div className="text-sm text-white/60">ID: VAI-992-041</div>
              </div>
            </div>
            {/* Subtle decorative element */}
            <div className="absolute bottom-0 right-0 opacity-10 text-6xl">🕉️</div>
          </div>

          {/* Report Body */}
          <CardContent className="p-12 bg-parchment space-y-8">
            {/* Patient Information Section */}
            <section>
              <div className="flex justify-between items-end border-b border-gold/30 pb-3 mb-6">
                <Heading level={3} className="text-maroon">
                  Patient Identification
                </Heading>
                <Label className="italic text-muted-foreground">Generated: Oct 24, 2023</Label>
              </div>
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <Label className="uppercase text-muted-foreground mb-2 block text-xs">Name</Label>
                  <Body className="font-semibold">Mrs. Sunita Venkatesh</Body>
                </div>
                <div>
                  <Label className="uppercase text-muted-foreground mb-2 block text-xs">Age / Sex</Label>
                  <Body className="font-semibold">42 / Female</Body>
                </div>
                <div>
                  <Label className="uppercase text-muted-foreground mb-2 block text-xs">Case Ref</Label>
                  <Body className="font-semibold">#9402-SV</Body>
                </div>
              </div>
            </section>

            {/* Clinical Case Summary */}
            <section>
              <Heading level={3} className="text-maroon border-b border-gold/30 pb-3 mb-4">
                Clinical Case Summary
              </Heading>
              <div className="bg-white p-6 rounded-lg border border-border">
                <Body className="italic text-ink leading-relaxed">
                  "Patient presents with chronic Agnimandya (impaired digestive fire) accompanied by intermittent episodes of Shirashoola (headache) specifically in the temporal region. Onset correlates with seasonal transition and increased occupational stress. Initial assessment suggests a primary Pitta provocation with secondary Vata imbalance in the Majja Dhatu."
                </Body>
              </div>
            </section>

            {/* Prakriti & Vikriti Assessment */}
            <section>
              <Heading level={3} className="text-maroon border-b border-gold/30 pb-3 mb-4">
                Prakriti &amp; Vikriti Assessment
              </Heading>
              <div className="grid grid-cols-12 gap-6">
                {/* Dosha Chart */}
                <div className="col-span-4 bg-white p-6 rounded-lg border border-border flex flex-col items-center justify-center h-48">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
                      {/* Pitta (Maroon) */}
                      <circle
                        cx="70"
                        cy="70"
                        r="50"
                        fill="transparent"
                        stroke="#6B1E23"
                        strokeWidth="14"
                        strokeDasharray="188.4 314"
                        strokeDashoffset="0"
                      />
                      {/* Vata (Gold) */}
                      <circle
                        cx="70"
                        cy="70"
                        r="50"
                        fill="transparent"
                        stroke="#D4A857"
                        strokeWidth="14"
                        strokeDasharray="62.8 314"
                        strokeDashoffset="-188.4"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-xl font-bold text-maroon">60%</span>
                      <span className="text-xs font-medium text-muted-foreground">Pitta</span>
                    </div>
                  </div>
                </div>

                {/* Analysis Cards */}
                <div className="col-span-8 grid grid-cols-2 gap-4">
                  <div className="p-4 bg-maroon/10 rounded-lg border border-maroon/20">
                    <Label className="bg-maroon text-white px-2 py-1 rounded text-xs font-bold uppercase">
                      Pitta (High)
                    </Label>
                    <Body size="sm" className="mt-3 text-muted-foreground">
                      Elevated digestive acidity and inflammatory markers observed in systemic review.
                    </Body>
                  </div>
                  <div className="p-4 bg-gold/10 rounded-lg border border-gold/20">
                    <Label className="bg-gold text-ink px-2 py-1 rounded text-xs font-bold uppercase">
                      Vata (Variable)
                    </Label>
                    <Body size="sm" className="mt-3 text-muted-foreground">
                      Irregular sleep patterns and neurological sensitivity noted during Vijnana.
                    </Body>
                  </div>
                  <div className="col-span-2 p-4 bg-sage/10 rounded-lg border border-sage/20">
                    <Label className="bg-sage text-white px-2 py-1 rounded text-xs font-bold uppercase">
                      Kapha (Stable)
                    </Label>
                    <Body size="sm" className="mt-3 text-muted-foreground">
                      Constitutional stability remains intact; no significant accumulation of Ama detected in the Srotas.
                    </Body>
                  </div>
                </div>
              </div>
            </section>

            {/* Recommended Treatment Plan */}
            <section>
              <Heading level={3} className="text-maroon border-b border-gold/30 pb-3 mb-4">
                Recommended Treatment Plan
              </Heading>
              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-gold flex items-center justify-center text-sm">
                    🍽️
                  </div>
                  <div>
                    <Heading level={3} className="text-ink mb-2">
                      Ahara (Dietary Regulation)
                    </Heading>
                    <Body className="text-muted-foreground">
                      Avoid pungent, sour, and overly salty foods. Prioritize cooling herbs like cilantro and fennel. Sweet, bitter, and astringent tastes are recommended.
                    </Body>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-sage flex items-center justify-center text-sm">
                    🧘
                  </div>
                  <div>
                    <Heading level={3} className="text-ink mb-2">
                      Vihara (Lifestyle)
                    </Heading>
                    <Body className="text-muted-foreground">
                      Pranayama (Sheetali and Chandrabhedana) to be practiced for 15 minutes twice daily. Avoid excessive exposure to direct sunlight and high-stress cognitive tasks during midday.
                    </Body>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-maroon flex items-center justify-center text-sm text-white">
                    💊
                  </div>
                  <div>
                    <Heading level={3} className="text-ink mb-2">
                      Aushadhi (Medication)
                    </Heading>
                    <Body className="text-muted-foreground">
                      Avipattikar Churna (5g) with lukewarm water before sleep. Shatavari Ghrita (1 tsp) twice daily before meals for 21 days.
                    </Body>
                  </div>
                </div>
              </div>
            </section>

            {/* Footer with Signature */}
            <section className="mt-12 pt-8 border-t border-maroon/10">
              <div className="flex justify-between items-end">
                <div className="text-muted-foreground italic text-sm">
                  <Body className="text-xs">Certified Digital Document</Body>
                  <Body className="text-xs">Verification Key: B-993-XAL-22</Body>
                </div>
                <div className="text-right">
                  <div className="mb-4 text-lg font-serif italic text-maroon/60">A. Sharma</div>
                  <div className="w-48 border-t border-maroon/50 mb-2"></div>
                  <Label className="block font-bold uppercase text-maroon">Dr. Aarav Sharma</Label>
                  <Label className="block text-muted-foreground">Clinical Director, VaidyaAI</Label>
                </div>
              </div>
            </section>

            {/* Page Numbering */}
            <div className="text-center text-muted-foreground/40 text-xs mt-8">
              Page 1 of 1
            </div>
          </CardContent>
        </Card>

        {/* Print Notice */}
        <Card className="bg-gold/10 border border-gold/20">
          <CardContent className="py-4 px-6 flex items-center gap-3">
            <span className="text-lg">ℹ️</span>
            <Body size="sm" className="text-ink">
              This report is optimized for printing. Use your browser's print function to generate a PDF or physical copy.
            </Body>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
