"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import toast from "react-hot-toast"
import { Loader2 } from "lucide-react"

export default function CreateExam() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      ...formData,
      examTypes: formData.examType,
      numberOfQuestions: parseInt(formData.numberOfQuestions),
      duration: parseInt(formData.duration),
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.message || "Something went wrong")

      toast.success("Exam created successfully")
      router.push("/admin/manage-exam")
      
    } catch (error: any) {
      console.error("Error:", error)
      toast.error("Failed to create exam ")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
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
            <CardDescription>Fill in the information below to create a new examination</CardDescription>
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
                    placeholder="e.g., CSC101"
                    value={formData.courseCode}
                    onChange={(e) => handleInputChange("courseCode", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Exam Type</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {examTypes.map((type) => (
                    <div key={type.value} className="flex items-center gap-3 p-2 border rounded-md hover:bg-slate-100">
                      <Checkbox
                        id={type.value}
                        checked={formData.examType.includes(type.value)}
                        onCheckedChange={(checked) =>
                          handleExamTypeChange(type.value, !!checked)
                        }
                      />
                      <label htmlFor={type.value} className="text-sm">{type.label}</label>
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
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creating...
                    </>
                  ) : (
                    "Create Exam"
                  )}
                </Button>
                <Button type="button" variant="outline" className="flex-1 bg-transparent" disabled={loading}>
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
