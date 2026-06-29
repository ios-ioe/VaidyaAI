'use client'

import React from 'react'
import { AppShell } from '@/components/AppShell'
import { Card, CardContent, CardHeader } from '@/components/Card'
import { Button } from '@/components/Button'
import { Heading, Body, Label } from '@/components/Typography'

export default function SettingsPage() {
  const [clinicName, setClinicName] = React.useState('VaidyaAI Clinic')
  const [email, setEmail] = React.useState('dr.sharma@vaidyaai.com')
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true)

  const handleSave = () => {
    // Handle save logic
    console.log('Settings saved')
  }

  return (
    <AppShell clinicName="Settings" userName="Dr. Sharma">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <Heading level={1}>Settings & Preferences</Heading>
          <Body className="text-muted-foreground mt-1">Manage your clinic information and account preferences</Body>
        </div>

        {/* Clinic Settings */}
        <Card>
          <CardHeader>
            <Heading level={3}>Clinic Information</Heading>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="mb-2 block">Clinic Name</Label>
              <input
                type="text"
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-parchment text-ink focus:outline-none focus:ring-2 focus:ring-maroon"
              />
            </div>

            <div>
              <Label className="mb-2 block">Primary Email</Label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-parchment text-ink focus:outline-none focus:ring-2 focus:ring-maroon"
              />
            </div>

            <div>
              <Label className="mb-2 block">License Number</Label>
              <input
                type="text"
                defaultValue="BAMS-2020-12345"
                className="w-full px-4 py-2 border border-border rounded-lg bg-parchment text-ink focus:outline-none focus:ring-2 focus:ring-maroon"
              />
            </div>

            <div>
              <Label className="mb-2 block">Phone Number</Label>
              <input
                type="tel"
                defaultValue="+91 9876 543 210"
                className="w-full px-4 py-2 border border-border rounded-lg bg-parchment text-ink focus:outline-none focus:ring-2 focus:ring-maroon"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <Heading level={3}>Notifications</Heading>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-parchment rounded-lg border border-border">
              <div>
                <Label className="block">Email Notifications</Label>
                <Body size="sm" className="text-muted-foreground">
                  Receive alerts for new appointments and urgent cases
                </Body>
              </div>
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                className="w-5 h-5 accent-maroon cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-parchment rounded-lg border border-border">
              <div>
                <Label className="block">SMS Alerts</Label>
                <Body size="sm" className="text-muted-foreground">
                  Get critical notifications via SMS
                </Body>
              </div>
              <input type="checkbox" className="w-5 h-5 accent-maroon cursor-pointer" />
            </div>

            <div className="flex items-center justify-between p-4 bg-parchment rounded-lg border border-border">
              <div>
                <Label className="block">Weekly Reports</Label>
                <Body size="sm" className="text-muted-foreground">
                  Receive summary of weekly statistics
                </Body>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-maroon cursor-pointer" />
            </div>
          </CardContent>
        </Card>

        {/* Account Security */}
        <Card>
          <CardHeader>
            <Heading level={3}>Account Security</Heading>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="ghost" size="md" className="w-full justify-start">
              Change Password
            </Button>
            <Button variant="ghost" size="md" className="w-full justify-start">
              Two-Factor Authentication
            </Button>
            <Button variant="ghost" size="md" className="w-full justify-start">
              View Login History
            </Button>
          </CardContent>
        </Card>

        {/* Billing */}
        <Card>
          <CardHeader>
            <Heading level={3}>Billing & Subscription</Heading>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-parchment rounded-lg border border-border">
              <div className="flex justify-between items-center mb-2">
                <Label>Current Plan</Label>
                <span className="font-medium text-maroon">Professional</span>
              </div>
              <Body size="sm" className="text-muted-foreground mb-4">
                $99/month • Next billing date: February 15, 2024
              </Body>
              <Button variant="secondary" size="sm">
                Manage Subscription
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex gap-4 justify-end">
          <Button variant="ghost" size="md">
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </AppShell>
  )
}
