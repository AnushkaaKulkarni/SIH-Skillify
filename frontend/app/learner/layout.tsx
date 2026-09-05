'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { StudentSidebar } from '@/components/learner/sidebar'
import { StudentTopbar } from '@/components/learner/topbar'
import { FeatureLock } from '@/components/FeatureLock'
import { useSubscription } from '@/contexts/SubscriptionContext'

// Feature mapping for routes
const routeFeatureMap: Record<string, string> = {
  '/learner/dashboard': 'Dashboard',
  '/learner/quiz': 'AI Quiz',
  '/learner/code-editor': 'Code Editor',
  '/learner/exams': 'Exams',
  '/learner/marksheets': 'MarkSheets',
  '/learner/oral': 'Oral Practice',
  '/learner/interview': 'Interview',
  '/learner/certifications': 'Courses',
  '/learner/materials': 'Materials',
  '/learner/ai-tutor': 'AI Tutor',
  '/learner/ai-notes': 'AI Notes',
  '/learner/ai-mentor': 'AI Mentor',
  '/learner/grievances': 'Grievances',
  // Profile and Notifications are always accessible
  '/learner/profile': 'Profile',
  '/learner/notifications': 'Notifications',
}

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { hasFeature } = useSubscription()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Get the feature for the current route
  const currentFeature = routeFeatureMap[pathname]
  const canAccessFeature = !currentFeature || hasFeature(currentFeature, 'learner')

  if (!mounted) {
    return (
      <div className="flex h-screen bg-background">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  // If the feature is locked, show the lock screen
  if (!canAccessFeature && currentFeature) {
    return (
      <div className="flex h-screen bg-background">
        <StudentSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <StudentTopbar />
          <main className="flex-1 overflow-auto p-8">
            <FeatureLock 
              feature={currentFeature} 
              role="learner"
              fallback={
                <div className="max-w-2xl mx-auto">
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-4">
                      {currentFeature} Locked
                    </h1>
                    <p className="text-lg text-muted-foreground">
                      This feature is not available in your current subscription plan.
                    </p>
                  </div>
                </div>
              }
            >
              {children}
            </FeatureLock>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <StudentSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <StudentTopbar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
