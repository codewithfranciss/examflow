"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function CreateExam() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    courseName: "",
    courseCode: "",
    examType: [] as string[],
    numberOfQuestions: "",
    duration: "",
  })

  const examTypes = [
    { label: "Objective", value: "msq" },
    { label: "Subjective", value: "subjective" },
    { label: "Coding", value: "coding" },
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleExamTypeChange = (value: string, checked: boolean) => {
    setFormData((prev) => {
      const currentTypes = prev.examType
      const updatedTypes = checked
        ? [...currentTypes, value]
        : currentTypes.filter((v) => v !== value)
      return { ...prev, examType: updatedTypes }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Creating exam:", formData)
    router.push(`/lecturer/exam-questions?examId=1&courseCode=${formData.courseCode}`)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <h1 className="text-2xl font-bold text-slate-900">Create New Exam</h1>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Exam Details</CardTitle>
            <CardDescription>
              Fill in the information below to create a new examination
            </CardDescription>
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

              {/* Multiple Exam Type Checkboxes */}
              <div className="space-y-2">
                <Label>Exam Type</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {examTypes.map((type) => (
                    <div
                      key={type.value}
                      className="flex items-center gap-3 p-2 border rounded-md hover:bg-slate-100"
                    >
                      <Checkbox
                        id={type.value}
                        checked={formData.examType.includes(type.value)}
                        onCheckedChange={(checked) =>
                          handleExamTypeChange(type.value, !!checked)
                        }
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
                <Button type="submit" className="flex-1">
                  Create Exam
                </Button>
                <Button type="button" variant="outline" className="flex-1 bg-transparent">
                  Save as Draft
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
