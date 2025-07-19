"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

export default function EditExam() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const examId = searchParams.get("id")

  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    courseName: "",
    courseCode: "",
    examTypes: [] as string[],
    numberOfQuestions: "",
    duration: "",
  })

  const examTypeOptions = [
    { label: "MSQ (Objective)", value: "msq" },
    { label: "Subjective", value: "subjective" },
    { label: "Coding", value: "coding" },
  ]

  useEffect(() => {
    const fetchExam = async () => {
      if (!examId) return
      setLoading(true)
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/fetch-exam/${examId}`)
        const data = await res.json()
        setFormData({
          courseName: data.exam.courseName,
          courseCode: data.exam.courseCode,
          examTypes: Array.isArray(data.exam.examTypes) ? data.exam.examTypes : [],
          numberOfQuestions: data.exam.numberOfQuestions.toString(),
          duration: data.exam.duration.toString(),
        })
      } catch (err) {
        toast.error("Failed to load exam")
      } finally {
        setLoading(false)
      }
    }
    fetchExam()
  }, [examId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/edit-exam/${examId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          numberOfQuestions: parseInt(formData.numberOfQuestions),
          duration: parseInt(formData.duration),
          examTypes: formData.examTypes,
        }),
      })

      if (!res.ok) throw new Error("Failed to update exam")

      toast.success("Exam updated successfully")
      router.push("/admin/manage-exam")
    } catch (err) {
      console.error(err)
      toast.error("Update failed")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleExamTypeChange = (value: string, checked: boolean) => {
    setFormData((prev) => {
      const updated = checked
        ? [...prev.examTypes, value]
        : prev.examTypes.filter((v) => v !== value)
      return { ...prev, examTypes: updated }
    })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Link
              href="/admin/manage-exam"
              className="inline-flex items-center text-slate-600 hover:text-slate-800 mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
            </Link>
            <h1 className="text-2xl font-bold text-slate-900">Edit Exam</h1>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Edit Exam Details</CardTitle>
            <CardDescription>Update the examination information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="courseName">Course Name</Label>
                  <Input
                    id="courseName"
                    placeholder="e.g., Computer Science"
                    value={formData.courseName}
                    onChange={(e) => handleInputChange("courseName", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="courseCode">Course Code</Label>
                  <Input
                    id="courseCode"
                    placeholder="e.g., CS101"
                    value={formData.courseCode}
                    onChange={(e) => handleInputChange("courseCode", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Exam Types</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {examTypeOptions.map((type) => (
                    <div
                      key={type.value}
                      className="flex items-center gap-3 p-2 border rounded-md hover:bg-slate-100"
                    >
                      <Checkbox
                        id={type.value}
                        checked={formData.examTypes.includes(type.value)}
                        onCheckedChange={(checked) => handleExamTypeChange(type.value, !!checked)}
                      />
                      <label htmlFor={type.value} className="text-sm">
                        {type.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numberOfQuestions">Number of Questions</Label>
                  <Input
                    id="numberOfQuestions"
                    type="number"
                    placeholder="e.g., 20"
                    min="1"
                    value={formData.numberOfQuestions}
                    onChange={(e) => handleInputChange("numberOfQuestions", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="e.g., 60"
                    min="1"
                    value={formData.duration}
                    onChange={(e) => handleInputChange("duration", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1" disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Updating..." : "Update Exam"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => router.push("/lecturer/manage-exams")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
