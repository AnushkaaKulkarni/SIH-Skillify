'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X, ArrowRight } from 'lucide-react'
import { useState } from 'react'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl group">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
              <span className="font-extrabold text-lg">S</span>
            </div>
            <span className="text-gray-900 font-bold tracking-tight">Skillify<span className="text-primary">AI</span></span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10">
            <Link href="#features" className="text-sm font-semibold text-gray-600 hover:text-primary transition-colors duration-200">
              Features
            </Link>
            <Link href="/about" className="text-sm font-semibold text-gray-600 hover:text-primary transition-colors duration-200">
              About
            </Link>
            <Link href="/contact" className="text-sm font-semibold text-gray-600 hover:text-primary transition-colors duration-200">
              Contact
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                Log in
              </Button>
            </Link>
            <Link href="/subscription">
              <Button className="text-sm font-medium h-10 px-6 rounded-full bg-primary text-white hover:bg-primary/95 shadow-sm transition-all">
                Get Started
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-gray-100 bg-white">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4 px-2">
                <Link 
                  href="#features" 
                  className="text-base font-semibold text-gray-600 hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                </Link>
                <Link 
                  href="/about" 
                  className="text-base font-semibold text-gray-600 hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                <Link 
                  href="/contact" 
                  className="text-base font-semibold text-gray-600 hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
              </div>
              <div className="flex flex-col gap-3 pt-4 border-t border-gray-100 px-2">
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-center h-12 rounded-xl text-gray-600 font-semibold border-gray-200">
                    Log in
                  </Button>
                </Link>
                <Link href="/subscription" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full justify-center h-12 rounded-xl bg-primary text-white font-semibold">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
