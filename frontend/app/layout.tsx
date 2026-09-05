import React from "react"
import type { Metadata, Viewport } from 'next'

import './globals.css'
import { SubscriptionProvider } from '@/contexts/SubscriptionContext'

export const metadata: Metadata = {
  title: 'SkillifyAI - AI-Powered EdTech Platform',
  description: 'Transform your learning journey with AI-powered exams, personalized quizzes, and intelligent recommendations',
  generator: 'v0.app',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="%234F46E5"/><text x="128" y="180" fontSize="120" fill="white" textAnchor="middle" fontWeight="bold">AI</text></svg>',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <SubscriptionProvider>
          {children}
        </SubscriptionProvider>
      </body>
    </html>
  )
}
