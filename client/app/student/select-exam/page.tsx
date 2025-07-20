"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building, FileText, Play, User } from "lucide-react"
import toast from "react-hot-toast"

type Exam = {
  id: string
  courseCode: string
  courseName: string
  department: string
  lecturer: string
  duration: number
  examTypes: string[]
  questions: {
    type: string
    question: string
    options?: string[]
  }[]
}

export default function SelectExam() {
  const router = useRouter()

  const [matricNo, setMatricNo] = useState("")
  const [fullName, setFullName] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [selectedLecturer, setSelectedLecturer] = useState("")
  const [selectedExamId, setSelectedExamId] = useState("")
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(false)

  // Load student info from localStorage
  useEffect(() => {
    const info = localStorage.getItem("studentAuthInfo")
    if (info) {
      try {
        const parsed = JSON.parse(info)
        setMatricNo(parsed.matricNo || "")
        setFullName(parsed.fullName || "")
      } catch {
        toast.error("Session error. Please log in again.")
        router.push("/student/login")
      }
    } else {
      toast.error("Please log in first.")
      router.push("/student/login")
    }
  }, [router])

  // Fetch exams
  useEffect(() => {
    if (!matricNo) return

    const fetchExams = async () => {
      setLoading(true)
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/student/${encodeURIComponent(matricNo)}`)
        const data = await res.json()
        if (!res.ok) {
          toast.error(data.message || "Unable to load exams")
          return
        }
        setExams(data.exams || [])
      } catch {
        toast.error("Connection error while fetching exams")
      } finally {
        setLoading(false)
      }
    }

    fetchExams()
  }, [matricNo])

  const handleDepartmentChange = useCallback((value: string) => {
    setSelectedDepartment(value)
    setSelectedLecturer("")
    setSelectedExamId("")
  }, [])

  const handleLecturerChange = useCallback((value: string) => {
    setSelectedLecturer(value)
    setSelectedExamId("")
  }, [])

  useEffect(() => {
    if (!selectedExamId) return
    const selectedExam = exams.find(e => e.id === selectedExamId)
    if (!selectedExam) return

    const examData = {
      examId: selectedExam.id,
      examTypes: selectedExam.examTypes,
      duration: selectedExam.duration,
      courseCode: selectedExam.courseCode,
      courseName: selectedExam.courseName,
      questions: selectedExam.questions
    }

    localStorage.setItem("selectedExamDetails", JSON.stringify(examData))
  }, [selectedExamId, exams])

  const handleStartExam = () => {
    if (!selectedDepartment || !selectedLecturer || !selectedExamId) {
      toast.error("Select Department, Lecturer, and Exam to continue.")
      return
    }
    router.push(`/student/exam?examId=${selectedExamId}`)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Start Your Exam</h1>
            <p className="text-slate-600">Please follow the steps below to proceed.</p>
          </div>
          <span className="text-sm text-slate-600">
            Welcome, <span className="font-medium">{fullName || matricNo}</span>
          </span>
        </div>
      </header>

      {/* Body */}
      <main className="max-w-4xl mx-auto px-4 py-10 space-y-10">
        {loading && <p className="text-center text-blue-600">Loading exams...</p>}
        {!loading && exams.length === 0 && (
          <p className="text-center text-red-500">No exams found for your matric number.</p>
        )}

        {/* Step-by-step selection form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1: Department */}
          <Card className={selectedDepartment ? "ring-2 ring-blue-500" : ""}>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <Building className="text-blue-600 w-6 h-6" />
              </div>
              <CardTitle>Step 1: Department</CardTitle>
              <CardDescription>Select your department</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedDepartment} onValueChange={handleDepartmentChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose department" />
                </SelectTrigger>
                <SelectContent>
                  {[...new Set(exams.map(e => e.department))]
                    .filter(Boolean)
                    .map(dep => (
                      <SelectItem key={dep} value={dep}>
                        {dep}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Step 2: Lecturer */}
          <Card className={selectedLecturer ? "ring-2 ring-green-500" : selectedDepartment ? "" : "opacity-50"}>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <User className="text-green-600 w-6 h-6" />
              </div>
              <CardTitle>Step 2: Lecturer</CardTitle>
              <CardDescription>Select your lecturer</CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedLecturer}
                onValueChange={handleLecturerChange}
                disabled={!selectedDepartment}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose lecturer" />
                </SelectTrigger>
                <SelectContent>
                  {[...new Set(
                    exams.filter(e => e.department === selectedDepartment).map(e => e.lecturer)
                  )].filter(Boolean).map(lect => (
                    <SelectItem key={lect} value={lect}>
                      {lect}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Step 3: Exam */}
          <Card className={selectedExamId ? "ring-2 ring-purple-500" : selectedLecturer ? "" : "opacity-50"}>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                <FileText className="text-purple-600 w-6 h-6" />
              </div>
              <CardTitle>Step 3: Exam</CardTitle>
              <CardDescription>Select your exam</CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedExamId}
                onValueChange={setSelectedExamId}
                disabled={!selectedLecturer}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose exam" />
                </SelectTrigger>
                <SelectContent>
                  {exams
                    .filter(e => e.department === selectedDepartment && e.lecturer === selectedLecturer)
                    .map(e => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.courseName} ({e.courseCode})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {/* Start Button */}
        <div className="flex justify-center">
          <Button
            size="lg"
            className="px-8"
            onClick={handleStartExam}
            disabled={!selectedDepartment || !selectedLecturer || !selectedExamId}
          >
            <Play className="h-4 w-4 mr-2" />
            Start Selected Exam
          </Button>
        </div>
      </main>
    </div>
  )
}
