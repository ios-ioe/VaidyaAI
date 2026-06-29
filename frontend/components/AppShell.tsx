'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, Bell, User, LayoutDashboard, Users, Video, FileText, Settings as SettingsIcon } from 'lucide-react'
import { Heading } from './Typography'

interface AppShellProps {
  children: React.ReactNode
  clinicName?: string
  userName?: string
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  clinicName = 'VaidyaAI Clinic',
  userName = 'Dr. Sharma',
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [profileOpen, setProfileOpen] = useState(false)
  const router = useRouter()

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Patients', href: '/patients/72019', icon: Users },
    { label: 'Consultations', href: '/consultation', icon: Video },
    { label: 'Reports', href: '/reports', icon: FileText },
    { label: 'Settings', href: '/settings', icon: SettingsIcon },
  ]

  return (
    <div className="flex h-screen bg-parchment">
      {/* Sidebar */}
      <aside
        className={`bg-maroon text-white transition-all duration-300 flex flex-col ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-[#8B2E35]">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div>
                <div className="text-lg font-bold font-fraunces">Vaidya</div>
                <div className="text-xs text-gold font-jakarta">AI Clinical</div>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 hover:bg-[#8B2E35] rounded-lg transition-colors"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const IconComponent = item.icon
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#8B2E35] transition-colors font-jakarta text-sm group ${
                  sidebarOpen ? 'justify-start' : 'justify-center'
                }`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <IconComponent size={22} className="text-gold group-hover:text-white transition-colors" strokeWidth={1.5} />
                {sidebarOpen && <span className="group-hover:text-gold transition-colors">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#8B2E35]">
          <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center'}`}>
            <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center font-bold text-maroon">
              DS
            </div>
            {sidebarOpen && (
              <div className="text-sm">
                <div className="font-medium">Dr. Sharma</div>
                <div className="text-xs text-[#E8DDD0]">Ayurvedic Doctor</div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-border px-8 py-4 flex items-center justify-between shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-maroon font-fraunces">{clinicName}</h1>
          </div>
          <div className="flex items-center gap-6 relative">
            <button
              className="p-2 hover:bg-parchment rounded-lg transition-colors text-ink"
              aria-label="Notifications"
            >
              <Bell size={20} />
            </button>
            <div className="h-8 w-px bg-border" />
            
            {/* Profile Dropdown Trigger */}
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-3 px-3 py-2 hover:bg-parchment rounded-lg transition-colors text-ink"
              aria-label="Profile"
            >
              <User size={20} />
              <span className="font-jakarta text-sm">{userName}</span>
            </button>

            {/* Profile Dropdown Menu */}
            {profileOpen && (
              <>
                {/* Backdrop to close dropdown */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setProfileOpen(false)}
                  onKeyDown={(e) => e.key === 'Escape' && setProfileOpen(false)}
                />
                
                {/* Dropdown Panel */}
                <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-border z-20">
                  {/* Practitioner Info */}
                  <div className="px-6 py-4">
                    <div className="font-medium text-ink font-jakarta">{userName}</div>
                    <div className="text-sm text-muted-foreground">dr.sharma@vaidyaclinic.com</div>
                  </div>
                  
                  {/* Divider */}
                  <div className="h-px bg-border" />
                  
                  {/* Logout Button */}
                  <button
                    onClick={() => {
                      // TEMP DEV-ONLY: clear localStorage flag and redirect to landing
                      localStorage.removeItem('vaidya_dev_auth')
                      setProfileOpen(false)
                      router.push('/')
                    }}
                    className="w-full px-6 py-3 text-left text-maroon font-medium hover:bg-parchment transition-colors text-sm"
                  >
                    Log out
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

AppShell.displayName = 'AppShell'
