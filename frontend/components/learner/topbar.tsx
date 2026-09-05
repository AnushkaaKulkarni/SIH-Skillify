'use client'

import Link from 'next/link'
import { Search, Bell, User } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export function StudentTopbar() {
  return (
    <header className="h-16 border-b border-border bg-card px-8 flex items-center justify-between">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search courses, materials..."
            className="pl-10 h-9 border-border bg-secondary"
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-6 ml-6">
        {/* Notification */}
        <Link href="/learner/notifications" className="relative text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full text-xs text-primary-foreground flex items-center justify-center">
            3
          </span>
        </Link>

        {/* Profile */}
        <Link href="/learner/profile">
          <Avatar className="w-8 h-8 cursor-pointer hover:ring-2 ring-primary transition-all">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
              JD
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  )
}
