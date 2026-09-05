'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GraduationCap, ArrowRight } from 'lucide-react'

export default function AITutorPage() {
  const router = useRouter()

  const [topic, setTopic] = useState('')
  const [minutes, setMinutes] = useState(5)
  const [isStarting, setIsStarting] = useState(false)

  const exampleTopics = [
    'Photosynthesis',
    'Calculus Limits',
    'Database Indexing',
    'DNA Replication'
  ]

  const handleStartSession = () => {
    if (!topic) return

    setIsStarting(true)

    setTimeout(() => {
      router.push(
        `/learner/ai-tutor/session?topic=${encodeURIComponent(
          topic
        )}&minutes=${minutes}`
      )
    }, 600)
  }

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
            <GraduationCap className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">AI Tutor</h1>
        </div>
        <p className="text-muted-foreground">
          Learn any topic with your personal AI classroom teacher.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Setup Panel */}
        <Card className="p-8 border border-border">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Start a Learning Session
          </h2>

          <div className="space-y-6">

            {/* Topic Input */}
            <div className="space-y-2">
              <Label>
                Choose a Topic <span className="text-red-500">*</span>
              </Label>

              <Input
                placeholder="What would you like to learn today?"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />

              <p className="text-xs text-muted-foreground">
                Example: "Deadlock in Operating Systems"
              </p>
            </div>

            {/* Duration Input */}
            <div className="space-y-2">
              <Label>Session Duration (Minutes)</Label>

              <Input
                type="number"
                min={1}
                max={60}
                value={minutes}
                onChange={(e) =>
                  setMinutes(Number(e.target.value) || 1)
                }
              />

              <p className="text-xs text-muted-foreground">
                Recommended: 5 – 15 minutes
              </p>
            </div>

            {/* Start Button */}
            <Button
              onClick={handleStartSession}
              disabled={!topic || isStarting}
              className="w-full bg-primary hover:bg-primary/90 h-11 gap-2 text-base font-medium"
            >
              {isStarting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Starting...
                </>
              ) : (
                <>
                  <ArrowRight className="w-5 h-5" />
                  Start Learning Session
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Features Panel */}
        <Card className="p-8 border border-border bg-secondary/50">
          <h3 className="text-xl font-bold text-foreground mb-6">
            What You'll Get
          </h3>

          <div className="space-y-4">
            {[
              {
                title: 'Animated AI Avatar',
                desc: 'Cartoon-style AI tutor with speaking animation'
              },
              {
                title: 'Live Whiteboard Typing',
                desc: 'Word-by-word explanation synced with speech'
              },
              {
                title: 'Session Timer',
                desc: 'AI teaches for the exact duration you choose'
              },
              {
                title: 'Replay & Speed Control',
                desc: 'Pause, resume, replay and control speed up to 2x'
              }
            ].map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="mt-1 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">
                    {index + 1}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Example Topics */}
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-sm font-medium text-foreground mb-3">
              Example Topics:
            </p>

            <div className="flex flex-wrap gap-2">
              {exampleTopics.map((t) => (
                <button
                  key={t}
                  onClick={() => setTopic(t)}
                  className="px-3 py-1 rounded-full border border-border hover:bg-background/50 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
