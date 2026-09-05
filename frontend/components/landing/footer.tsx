'use client'

import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'

export function Footer() {
  const [currentYear, setCurrentYear] = useState(2026)

  useEffect(() => {
    setCurrentYear(new Date().getFullYear())
  }, [])

  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-20 pb-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Brand */}
          <div className="space-y-6 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl group inline-flex">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-white shadow-sm">
                <span className="font-extrabold">S</span>
              </div>
              <span className="text-gray-900 font-bold tracking-tight">Skillify<span className="text-primary">AI</span></span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed pr-4">
              Equipping the next generation of modern learners with powerful AI tools for maximum academic excellence.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary/30 transition-all shadow-sm">
                <Mail className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary/30 transition-all shadow-sm">
                <Phone className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary/30 transition-all shadow-sm">
                <MapPin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-6">Product</h3>
            <ul className="space-y-4">
              <li><Link href="#features" className="text-sm text-gray-500 hover:text-primary font-medium transition-colors">Features</Link></li>
              <li><Link href="#" className="text-sm text-gray-500 hover:text-primary font-medium transition-colors">Pricing</Link></li>
              <li><Link href="#" className="text-sm text-gray-500 hover:text-primary font-medium transition-colors">Security</Link></li>
              <li><Link href="#" className="text-sm text-gray-500 hover:text-primary font-medium transition-colors">Enterprise</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-6">Company</h3>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-sm text-gray-500 hover:text-primary font-medium transition-colors">About</Link></li>
              <li><Link href="#" className="text-sm text-gray-500 hover:text-primary font-medium transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-500 hover:text-primary font-medium transition-colors">Contact</Link></li>
              <li><Link href="#" className="text-sm text-gray-500 hover:text-primary font-medium transition-colors">Careers</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-6">Legal</h3>
            <ul className="space-y-4">
              <li><Link href="#" className="text-sm text-gray-500 hover:text-primary font-medium transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm text-gray-500 hover:text-primary font-medium transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-sm text-gray-500 hover:text-primary font-medium transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 font-medium">
            © {currentYear} SkillifyAI Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors">Privacy</Link>
            <Link href="#" className="text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors">Terms</Link>
            <Link href="#" className="text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
