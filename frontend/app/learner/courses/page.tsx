'use client'

import { useEffect, useState } from 'react'
import API from '@/lib/api'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]); const [error, setError] = useState(''); const [loading, setLoading] = useState(true); const [working, setWorking] = useState<string | null>(null); const router = useRouter()
  const load = async () => { setLoading(true); setError(''); try { setCourses((await API.get('/courses/recommended')).data.courses || []) } catch (e:any) { setError(e.response?.data?.message || 'Unable to load learning recommendations.') } finally { setLoading(false) } }
  useEffect(() => { load() }, [])
  const complete = async (course: any) => {
    setWorking(course._id); setError('');
    try {
      const result = await API.post(`/courses/${course._id}/complete`);
      setCourses((current) => current.map((item) => item._id === course._id ? { ...item, assessment: result.data.assessmentId || item.assessment, completionStatus: result.data.completed ? 'assessment_created' : item.completionStatus } : item));
      if (result.data.assessmentId) router.push(`/learner/quiz/take/${result.data.assessmentId}`)
    } catch (e:any) {
      setError(e.response?.data?.message || 'Unable to create the post-course assessment.')
    } finally {
      setWorking(null)
    }
  }
  if (loading) return <div className="p-8">Loading recommended learning…</div>
  return <div className="p-8 space-y-6"><div><h1 className="text-3xl font-bold">Courses & Recommended Learning</h1><p className="text-muted-foreground">Resources prioritised from your measured competency gaps.</p></div>{error && <div className="rounded border border-red-200 bg-red-50 p-3 text-red-700">{error} <Button variant="outline" size="sm" onClick={load}>Retry</Button></div>}{courses.length === 0 ? <Card className="p-6">No unresolved skill gaps currently require a learning recommendation.</Card> : <div className="grid gap-4 md:grid-cols-2">{courses.map((course) => <Card className="p-5 space-y-3" key={course._id}><div className="flex justify-between gap-3"><div><h2 className="font-semibold">{course.title}</h2><p className="text-sm text-muted-foreground">{course.platform || 'Learning resource'}</p></div><Button variant="outline" size="sm" disabled={Boolean(course.assessment) || working === course._id} onClick={() => complete(course)}>{working === course._id ? 'Generating…' : '✓ Completed'}</Button></div><p className="text-sm">{course.recommendationReason}</p><p className="text-sm text-muted-foreground">Current level: {course.currentLevel || 0} · Required level: {course.requiredLevel || '-'}</p><div className="flex justify-between items-center"><a className="text-sm text-primary underline" href={course.link} target="_blank" rel="noreferrer">Open learning resource</a>{course.assessment ? <Button size="sm" onClick={() => router.push(`/learner/quiz/take/${course.assessment}`)}>Take Skill Assessment</Button> : <span className="text-xs text-muted-foreground">Complete the course to start assessment</span>}</div></Card>)}</div>}</div>
}
