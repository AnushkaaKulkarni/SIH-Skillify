'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, FileText, Download, Calendar, Sparkles } from 'lucide-react'
import API from "@/lib/api"
import { useEffect } from "react"




export default function MaterialsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [materialsData, setMaterialsData] = useState<any[]>([])
useEffect(() => {
  const fetchMaterials = async () => {
    const res = await API.get("/learner/materials")
    setMaterialsData(res.data)
  }
  fetchMaterials()
}, [])
const [activeMaterial, setActiveMaterial] = useState<any | null>(null)

const [selectedFile, setSelectedFile] = useState<string | null>(null)
const [summary, setSummary] = useState<string>("")
const [loading, setLoading] = useState(false)
const [generatingQuiz, setGeneratingQuiz] = useState(false)
const [generationStep, setGenerationStep] = useState('')

const generateQuiz = async (material: any) => {
  setGeneratingQuiz(true)
  setGenerationStep('1/3 Preparing content')
  try {
    setGenerationStep('2/3 Qwen generating')
    const response = await API.post(`/learner/materials/${material._id}/generate-quiz`, { questionCount: 10 })
    setGenerationStep('3/3 Validating questions')
    router.push(`/learner/quiz/take/${response.data.examId}`)
  } catch (error: any) {
    alert(error.response?.data?.message || 'Quiz generation failed')
  } finally {
    setGeneratingQuiz(false)
    setGenerationStep('')
  }
}



  // const subjects = ['all', 'Mathematics', 'Physics', 'English', 'History', 'Science', 'Computer Science']

  const filteredMaterials = materialsData.filter((material) => {
  const search = searchTerm.toLowerCase()

  const matchesSearch =
    material.title?.toLowerCase().includes(search) ||
    material.description?.toLowerCase().includes(search) ||
    material.faculty?.fullName?.toLowerCase().includes(search)

  const matchesSubject =
    selectedSubject.trim() === "" ||
    material.description?.toLowerCase().includes(selectedSubject.toLowerCase())

  return matchesSearch && matchesSubject
})




  return (
    <div className="p-6 space-y-6">
  {/* Header */}
  <div className="space-y-1">
    <h1 className="text-2xl font-semibold text-gray-900">Learning Materials</h1>
    <p className="text-gray-600 text-sm">Access all study materials uploaded by faculty</p>
  </div>

  {/* Search and Filter */}
  <Card className="p-5 border border-gray-200 rounded-lg">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Search Materials</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by title or faculty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 pl-10 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Subject</label>
        <div className="relative">
          <Input
            placeholder="Type subject name..."
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="h-10 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  </Card>

  {/* Materials Grid */}
  {filteredMaterials.length > 0 ? (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMaterials.map((material) => (
          <Card
            key={material._id}
            className="p-5 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200"
          >
            <div className="space-y-4">
              {/* Icon and Subject */}
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-indigo-600" />
                </div>
                <span className="text-xs font-medium text-indigo-700 bg-indigo-50 px-2 py-1 rounded">
                  {material.description}
                </span>
              </div>

              {/* Content */}
              <div>
                <h3 className="font-semibold text-gray-900 line-clamp-1">
                  {material.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  by {material.faculty?.fullName}
                </p>
              </div>

              {/* Meta Info */}
              <div className="flex items-center justify-between text-xs text-gray-500 py-3 border-t border-gray-100">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(material.createdAt).toLocaleDateString()}</span>
                </div>
                <span className="truncate max-w-[100px]">{material.fileName}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {/* Download */}
<Button
  onClick={async () => {
    try {
      const response = await API.get(
        `/learner/materials/download/${material._id}`,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", material.fileName);
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      alert("Download failed");
    }
  }}
  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-sm h-9 gap-2"
>
  <Download className="w-4 h-4" />
  Download
</Button>


                {/* View */}
                <Button
                  onClick={() => {
                    setActiveMaterial(material)
                    setSummary("")
                    const previewUrl = `https://docs.google.com/gview?url=${encodeURIComponent(
                      material.filePath
                    )}&embedded=true`
                    setSelectedFile(previewUrl)
                  }}
                  variant="outline"
                  className="flex-1 text-sm h-9 border-gray-300 hover:bg-gray-50"
                >
                  View
                </Button>

                {/* Summarize */}
                <Button
                  onClick={async () => {
                    try {
                      setActiveMaterial(material)
                      setSelectedFile(null)
                      setSummary("")
                      setLoading(true)
                      const res = await API.post(`/summarize/${material._id}`)
                      setSummary(res.data.summary)
                    } catch (err: any) {
                      console.error("Summarize error:", err.response?.data || err.message)
                      alert(
                        err.response?.data?.message ||
                        "Summarization failed"
                      )
                    }
                    setLoading(false)
                  }}
                  variant="outline"
                  className="flex-1 text-sm h-9 border-gray-300 hover:bg-gray-50"
                >
                  Summarize
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  ) : (
    <Card className="p-10 border border-gray-200 rounded-lg text-center">
      <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
        <FileText className="w-6 h-6 text-gray-400" />
      </div>
      <p className="text-gray-500">No materials found matching your criteria.</p>
    </Card>
  )}

  {/* Viewer / Summary Section */}
  {(selectedFile || summary || loading) && (
    <Card className="p-5 border border-gray-200 rounded-lg">
      {activeMaterial && (
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-gray-900 text-lg">{activeMaterial.title}</h2>
            <p className="text-sm text-gray-600 mt-1">
              by {activeMaterial.faculty?.fullName} • {new Date(activeMaterial.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => generateQuiz(activeMaterial)} disabled={generatingQuiz} className="h-8 text-sm">
              <Sparkles className="w-4 h-4 mr-1" />
              {generatingQuiz ? generationStep : 'Generate Quiz'}
            </Button>
            <Button
              onClick={() => {
                setSelectedFile(null)
                setSummary("")
              }}
              variant="ghost"
              className="h-8 px-3 text-sm text-gray-600 hover:text-gray-900"
            >
              ✕ Close
            </Button>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
          <p className="text-sm text-gray-600">Generating AI summary...</p>
        </div>
      )}

      {/* PDF Preview */}
      {selectedFile && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <iframe
            src={selectedFile}
            width="100%"
            height="500px"
            className="border-0"
            title="Document Preview"
          />
        </div>
      )}

      {/* AI Summary */}
      {summary && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-indigo-600" />
            </div>
            <h3 className="font-medium text-gray-900">AI Summary</h3>
          </div>
          <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {summary}
          </div>
        </div>
      )}
    </Card>
  )}

  {/* Results Count */}
  <div className="text-sm text-gray-600">
    Showing {filteredMaterials.length} of {materialsData.length} materials
  </div>
</div>
  )
}
