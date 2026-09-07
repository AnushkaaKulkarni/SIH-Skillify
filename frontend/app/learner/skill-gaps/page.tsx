'use client'

import { useEffect, useState } from 'react'
import API from '@/lib/api'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const requiredScoreForLevel = (level: number) => {
  const mapping: Record<number, number> = { 1: 0, 2: 40, 3: 55, 4: 70, 5: 85 }
  return mapping[Number(level)] ?? 0
}

export default function SkillGapsPage() {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState('')

  const load = async () => {
    setError('')
    try {
      const response = await API.get('/learner/competencies/overview')
      setData(response.data)
    } catch (e: any) {
      setError(e.response?.data?.message || 'Unable to load competency data.')
    }
  }

  useEffect(() => { load() }, [])

  if (!data && !error) return <div className="p-8">Loading skill gaps…</div>
  if (error) return <div className="p-8 space-y-3"><p className="text-red-600">{error}</p><Button onClick={load}>Retry</Button></div>

  const rows = data?.competencies || []

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Skill Gaps</h1>
        <p className="text-muted-foreground">Evidence-based gaps for {data?.targetRole || 'your target role'}.</p>
      </div>

      <Card className="overflow-x-auto p-5">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="p-2">Competency</th>
              <th className="p-2">Current Score</th>
              <th className="p-2">Current Level</th>
              <th className="p-2">Required Score</th>
              <th className="p-2">Required Level</th>
              <th className="p-2">Gap</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item: any) => {
              const currentScore = item.current?.score
              const currentLevel = item.current?.currentLevel
              const requiredLevel = Number(item.requiredLevel || 0)
              const requiredScore = requiredScoreForLevel(requiredLevel)
              const gapValue = Number(item.gap?.gap ?? 0)

              return (
                <tr key={item.competency?._id || item.competency?.name} className="border-b align-top">
                  <td className="p-2 font-medium">{item.competency?.name || 'Unknown competency'}</td>
                  <td className="p-2">{currentScore == null ? 'Not Assessed' : `${currentScore}%`}</td>
                  <td className="p-2">{currentScore == null ? 'Not Assessed' : currentLevel ?? 'Not Assessed'}</td>
                  <td className="p-2">{requiredScore}</td>
                  <td className="p-2">{requiredLevel}</td>
                  <td className="p-2">{gapValue}</td>
                  <td className={`p-2 font-medium ${item.gap?.status === 'open' ? 'text-amber-700' : 'text-green-700'}`}>
                    {item.gap?.status || 'pending'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Card>

      <Card className="p-5">
        <h2 className="font-semibold">Recommended learning</h2>
        <p className="mt-1 text-sm text-muted-foreground">Courses are prioritised from your unresolved competency gaps.</p>
        <Button asChild className="mt-4">
          <Link href="/learner/courses">View recommended courses</Link>
        </Button>
      </Card>
    </div>
  )
}
