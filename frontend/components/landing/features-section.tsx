'use client'

import { Card } from '@/components/ui/card'
import { Zap, BookOpen, Users, BarChart3, Shield, Lightbulb, ArrowRight, Sparkles, Gem } from 'lucide-react'

export function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: 'AI Proctoring',
      description: 'Advanced AI-powered exam monitoring to ensure exam integrity and prevent cheating.',
      colorClass: 'text-indigo-600',
      bgClass: 'bg-indigo-50 border-indigo-100',
    },
    {
      icon: Lightbulb,
      title: 'Smart Recommendations',
      description: 'Personalized learning paths based on your performance and learning style.',
      colorClass: 'text-blue-600',
      bgClass: 'bg-blue-50 border-blue-100',
    },
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      description: 'Comprehensive performance metrics and insights to track your progress accurately.',
      colorClass: 'text-emerald-600',
      bgClass: 'bg-emerald-50 border-emerald-100',
    },
    {
      icon: BookOpen,
      title: 'Rich Learning Materials',
      description: 'Access to curated study materials, notes, and resources from expert faculty.',
      colorClass: 'text-amber-600',
      bgClass: 'bg-amber-50 border-amber-100',
    },
    {
      icon: Users,
      title: 'Interactive Community',
      description: 'Connect with peers, ask questions, and learn together in a supportive environment.',
      colorClass: 'text-rose-600',
      bgClass: 'bg-rose-50 border-rose-100',
    },
    {
      icon: Zap,
      title: 'Instant Feedback',
      description: 'Get immediate feedback on your quizzes and exams with detailed explanations.',
      colorClass: 'text-sky-600',
      bgClass: 'bg-sky-50 border-sky-100',
    },
  ]

  return (
    <section id="features" className="py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Soft divider */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center space-y-6 mb-20 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-200 text-gray-700 text-sm font-medium">
            <Gem className="w-4 h-4 text-primary" />
            <span>Powerful Capabilities</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight tracking-tight">
            Features Built for <br/>
            <span className="gradient-text">Academic Excellence</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Everything you need to excel in your examinations and accelerate your learning journey with cutting-edge AI technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={index}
                className="group relative p-8 border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-all duration-400 hover:-translate-y-1 rounded-3xl overflow-hidden"
              >
                <div className="relative space-y-6">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-colors duration-300 ${feature.bgClass}`}>
                    <Icon className={`w-7 h-7 ${feature.colorClass}`} />
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-500 leading-relaxed font-medium">
                      {feature.description}
                    </p>
                  </div>
                  
                  {/* Arrow indicator */}
                  <div className="pt-2 flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <span className="text-sm font-semibold">Explore feature</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
