'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowRight, Zap, Shield, TrendingUp, Rocket, Sparkles } from 'lucide-react'

export function CTASection() {
  const benefits = [
    {
      icon: Zap,
      text: 'Instant AI-powered feedback',
    },
    {
      icon: Shield,
      text: 'Secure proctored examinations',
    },
    {
      icon: TrendingUp,
      text: 'Track your progress in real-time',
    },
  ]

  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.015] mix-blend-overlay"></div>
      
      {/* Background accents */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative mx-auto max-w-5xl px-6 lg:px-8">
        <div className="text-center space-y-8">
          
          <Card className="relative p-12 md:p-20 border border-indigo-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-[2.5rem] overflow-hidden">
            
            {/* Subtle internal gradient */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-indigo-50/50 to-transparent"></div>

            <div className="relative space-y-10 z-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-50 border border-indigo-100 text-primary text-sm font-semibold mx-auto transition-transform hover:-translate-y-0.5 duration-300">
                <Sparkles className="w-4 h-4" />
                Start Your Journey
              </div>
              
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
                  Ready to Transform Your <br className="hidden md:block" />
                  <span className="text-primary">Learning Experience?</span>
                </h2>
                <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                  Join thousands of modern students leveraging AI to accelerate their learning curve and achieve academic excellence.
                </p>
              </div>

              {/* Benefits Grid */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 max-w-3xl mx-auto pt-4">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 text-gray-600"
                    >
                      <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-primary">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium">
                        {benefit.text}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <Link href="/subscription">
                  <Button size="lg" className="w-full sm:w-auto h-14 px-8 rounded-xl bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-primary/25 transition-all text-base font-medium">
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 rounded-xl bg-white border-gray-200 hover:bg-gray-50 text-gray-700 transition-all text-base font-medium">
                  Schedule Demo
                </Button>
              </div>
            </div>
          </Card>

          {/* Trust indicators */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 pt-12 text-sm text-gray-500 font-medium">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-indigo-50 border-2 border-white flex items-center justify-center text-primary text-xs font-bold shadow-sm"
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <span>50,000+ Happy Students</span>
            </div>
            <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-gray-300"></div>
            <div className="flex items-center gap-2 text-yellow-500">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-600 font-semibold ml-1">4.9/5 Rating</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
