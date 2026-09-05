'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Plus, Play, FileText } from 'lucide-react'

export default function QuizPage() {
  const [scheduledQuizzes, setScheduledQuizzes] = useState<any[]>([])
  const [pastAttempts, setPastAttempts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'ALL' | 'CUSTOM' | 'SCHEDULED'>('ALL')
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : ''

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch scheduled exams
        const scheduledRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/learner/exams/scheduled`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (scheduledRes.ok) {
          const scheduledData = await scheduledRes.json()
          setScheduledQuizzes(Array.isArray(scheduledData) ? scheduledData : [])
        }
      } catch (err) {
        console.error('Error fetching scheduled exams:', err)
      }

      try {
        // Fetch past quiz attempts
        console.log('Fetching past attempts with token:', token ? 'present' : 'missing')
        const pastRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quiz/result/list`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        console.log('Past attempts response status:', pastRes.status)
        
        if (pastRes.ok) {
          const pastData = await pastRes.json()
          console.log('Past attempts data:', pastData) // for debugging
          setPastAttempts(Array.isArray(pastData) ? pastData : [])
        } else {
          const errorText = await pastRes.text()
          console.error('Error response:', errorText)
        }
      } catch (err) {
        console.error('Error fetching past attempts:', err)
      }

      setLoading(false)
    }

    if (token) {
      fetchData()
    }
  }, [token])

  const filteredAttempts = pastAttempts.filter(item => {
    if (filter === 'ALL') return true;
    if (filter === 'CUSTOM') return item.quizType === 'CUSTOM';
    if (filter === 'SCHEDULED') return item.quizType === 'SCHEDULED';
    return true;
  });

  return (
    <div className="p-8 space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          AI-Powered Quizzes
        </h1>
        <p className="text-muted-foreground mt-2">
          Take scheduled exams or create your own custom quiz
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-8 border border-border hover:shadow-lg transition-shadow cursor-pointer group">
          <Link href="/learner/quiz/scheduled">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>

              <h3 className="text-xl font-semibold">
                Scheduled Exams
              </h3>

              <p className="text-sm text-muted-foreground">
                Take quizzes scheduled by your faculty with AI proctoring
              </p>

              <span className="text-sm font-semibold text-blue-600">
                {scheduledQuizzes.length} exam
                {scheduledQuizzes.length !== 1 ? 's' : ''} available
              </span>

              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                View Exams
              </Button>
            </div>
          </Link>
        </Card>

        <Card className="p-8 border border-border hover:shadow-lg transition-shadow cursor-pointer group">
          <Link href="/learner/quiz/create">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <Plus className="w-6 h-6 text-green-600" />
              </div>

              <h3 className="text-xl font-semibold">
                Create Custom Quiz
              </h3>

              <p className="text-sm text-muted-foreground">
                Generate a custom quiz by specifying subject and topics
              </p>

              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                Create Quiz
              </Button>
            </div>
          </Link>
        </Card>
      </div>

      {/* Scheduled Exams List hidden as originally commented out */}
      
      {/* Previous Attempts */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold">Previous Quiz Reports</h2>
          <div className="flex items-center gap-2">
            <Button variant={filter === 'ALL' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('ALL')}>All</Button>
            <Button variant={filter === 'CUSTOM' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('CUSTOM')}>Custom AI</Button>
            <Button variant={filter === 'SCHEDULED' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('SCHEDULED')}>Scheduled</Button>
          </div>
        </div>

        {filteredAttempts.length > 0 ? (
          <div className="grid gap-4">
            {filteredAttempts.map((item: any) => {
              const percentage = item.score || 0;
              const displayScore = item.correctCount || 0;
              const displayTotal = item.totalQuestions || 0;
              
              return (
                <Card key={item.attemptId} className="p-6 hover:shadow-lg transition-shadow bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-foreground">
                            {item.quizTitle || (item.quizType === 'CUSTOM' ? 'Custom AI Quiz' : 'Scheduled Exam')}
                          </h3>
                          {item.subject && (
                            <div className="mt-2 inline-block">
                              <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full border border-blue-300">
                                📚 {item.subject}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>📅 {new Date(item.submittedAt).toLocaleString()}</p>
                        <p>❓ {item.totalQuestions} Questions</p>
                      </div>
                    </div>

                    <div className="text-right space-y-3">
                      <div>
                        <div className="text-3xl font-bold text-blue-600">{percentage}%</div>
                        <div className="text-sm text-muted-foreground">
                          {displayScore}/{displayTotal} marks
                        </div>
                      </div>
                      <Link href={`/learner/quiz/results?attemptId=${item.attemptId}`}>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full gap-2">
                          <FileText size={16} />
                          View Report
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-8 text-center text-muted-foreground border-dashed">
            <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-base font-medium">No {filter !== 'ALL' ? (filter === 'CUSTOM' ? 'custom AI' : 'scheduled') : ''} previous quiz reports found.</p>
            <p className="text-sm mt-2">Your quiz attempts will appear here after you complete them.</p>
          </Card>
        )}
      </section>
    </div>
  )
}