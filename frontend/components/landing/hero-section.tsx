'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PlayCircle, Brain, TrendingUp, Zap, ArrowRight, Star, Rocket } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden ambient-bg">
      {/* Refined subtle background accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]"></div>
        <div className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Content */}
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-primary text-sm font-medium">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>Next-Generation AI Platform</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] tracking-tight">
                Transform Your <br />
                <span className="gradient-text">Learning Journey</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
                Experience the future of education with AI-powered proctoring, personalized quizzes, and intelligent recommendations tailored for your success.
              </p>
            </div>

            {/* Feature Bullets */}
            <div className="space-y-5">
              <div className="flex items-center gap-4 group">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <span className="text-foreground font-medium text-lg">AI Proctored Exams</span>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-foreground font-medium text-lg">Smart Recommendations</span>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                  <TrendingUp className="w-6 h-6 text-teal-600" />
                </div>
                <span className="text-foreground font-medium text-lg">Real-time Analytics</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/subscription">
                <Button size="lg" className="w-full sm:w-auto text-base h-14 px-8 rounded-xl bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-primary/25 transition-all">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-base h-14 px-8 rounded-xl bg-white/50 backdrop-blur-sm border-gray-200 hover:bg-gray-50/80 transition-all">
                <PlayCircle className="w-5 h-5 mr-2 text-gray-600" />
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Right Side - Illustration with Stats */}
          <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-200 lg:ml-auto">
            <div className="relative w-full max-w-lg mx-auto">
              
              {/* Main card with stats */}
              <Card className="relative p-6 md:p-8 border-[0.5px] border-white glass-card premium-shadow rounded-[2rem] hover-lift overflow-hidden z-10">
                <div className="relative space-y-6">
                  {/* Floating stat badges inside card rather than absolute out of bounds to keep it clean */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/80 rounded-xl p-4 border border-gray-100 shadow-sm">
                      <p className="text-2xl font-bold text-gray-900">50k+</p>
                      <p className="text-sm text-gray-500 font-medium">Active Students</p>
                    </div>
                    <div className="bg-white/80 rounded-xl p-4 border border-gray-100 shadow-sm">
                      <p className="text-2xl font-bold text-gray-900">95%</p>
                      <p className="text-sm text-gray-500 font-medium">Success Rate</p>
                    </div>
                  </div>

                  {/* Hero Image placeholder with clean borders */}
                  <div className="relative overflow-hidden rounded-[1.5rem] border border-gray-100/50 shadow-sm">
                    <img 
                      src="/hero-section-image.png" 
                      alt="Students studying with SkillifyAI"
                      className="h-[300px] w-full object-cover transform hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </div>
                  
                  <div className="bg-primary/5 rounded-xl p-5 border border-primary/10 flex items-center justify-between">
                    <div>
                      <p className="text-base font-bold text-gray-900">500+ Courses</p>
                      <p className="text-sm text-gray-500 font-medium delay-100">Across 20 disciplines</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-md">
                      <Rocket className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
