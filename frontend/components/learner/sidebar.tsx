'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useSubscription } from '@/contexts/SubscriptionContext'
import { FeatureTooltip } from '@/components/FeatureTooltip'
import {
  LayoutDashboard,
  Brain,
  Target,
  Bell,
  BookOpen,
  User,
  LogOut,
  Sparkles,
  GraduationCap,
  Lock,
} from 'lucide-react'

const menuItems: Array<{
  label: string
  icon: typeof LayoutDashboard
  href: string
  feature: string
  comingSoon?: boolean
}> = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/learner/dashboard',
    feature: 'Dashboard',
  },
  {
    label: 'Skill Gaps',
    icon: Target,
    href: '/learner/skill-gaps',
    feature: 'Profile',
  },
  {
    label: 'Courses',
    icon: BookOpen,
    href: '/learner/courses',
    feature: 'Courses',
  },
  {
    label: 'Materials',
    icon: BookOpen,
    href: '/learner/materials',
    feature: 'Materials',
  },
  {
    label: 'Assessments',
    icon: GraduationCap,
    href: '/learner/quiz',
    feature: 'AI Quiz',
  },
  {
    label: 'AI Tutor',
    icon: GraduationCap,
    href: '/learner/ai-tutor',
    feature: 'AI Tutor',
  },
  {
    label: 'Notifications',
    icon: Bell,
    href: '/learner/notifications',
    feature: 'Notifications',
  },
  {
    label: 'Profile',
    icon: User,
    href: '/learner/profile',
    feature: 'Profile',
  },
]

export function StudentSidebar() {
  const pathname = usePathname()
  const { hasFeature } = useSubscription()

  return (
    <aside className="w-64 border-r border-border bg-sidebar flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <Link href="/learner/dashboard" className="flex items-center gap-2 font-bold text-lg">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-sidebar-foreground">SkillifyAI</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            const canAccess = hasFeature(item.feature, 'learner')

            return (
              <FeatureTooltip
                key={item.label}
                feature={item.feature}
                role="learner"
                isLocked={!canAccess}
              >
                {canAccess && !item.comingSoon ? (
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent/50',
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.comingSoon ? `${item.label} (Coming Soon)` : item.label}</span>
                  </Link>
                ) : (
                  <div
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors opacity-60',
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent/50',
                    )}
                  >
                    <Lock className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                )}
              </FeatureTooltip>
            )
          })}

        </div>
      </nav>

      {/* Logout */}
      <div className="border-t border-sidebar-border p-3">
        <Link href="/">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </Link>
      </div>
    </aside>
  )
}
