"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import { ArrowLeft, Upload, Plus, Edit, Trash2, FileText } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import toast from "react-hot-toast"
import ExcelUploadBox from "@/components/exam-questions/excel-upload-box"

type QuestionType = "msq" | "subjective" | "coding"

interface Question {
  id: number
  type: QuestionType
  question: string
  options?: string[]
  correctAnswer?: string
}

interface NewQuestion {
  type: QuestionType
  question: string
  options: string[]
  correctAnswer: string
}

export default function ExamQuestions() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const examId = searchParams.get("examId")
  const courseCode = searchParams.get("courseCode")
  const courseName = searchParams.get("courseName")

  const [questions, setQuestions] = useState<Question[]>([])
  const [isSaving, setIsSaving] = useState(false)

  const [newQuestion, setNewQuestion] = useState<NewQuestion>({
    type: "msq",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
  })

  const [showUploadModal, setShowUploadModal] = useState(false)

  const examData = {
    courseCode: courseCode,
    courseName: courseName,
    examType: "Mixed",
    totalQuestions: 15,
  }

  const handleSaveAll = async () => {
    if (!examId) return toast.error("No exam selected.")
    setIsSaving(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/create-question/${examId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({questions}),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success("Questions saved successfully!")
        router.push("/admin/manage-exam")
      } else {
        toast.error(data.message || "Failed to save questions")
      }
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleParsedExcel = (parsedQuestions: Question[]) => {
    setQuestions((prev) => [...prev, ...parsedQuestions])
    setShowUploadModal(false)
  }

  const handleAddQuestion = () => {
    if (newQuestion.question.trim()) {
      const question: Question = {
        id: questions.length + 1,
        type: newQuestion.type,
        question: newQuestion.question,
        options: newQuestion.type === "msq" ? newQuestion.options.filter((opt) => opt.trim()) : undefined,
        correctAnswer: newQuestion.correctAnswer || undefined,
      }

      setQuestions([...questions, question])
      setNewQuestion({ type: "msq", question: "", options: ["", "", "", ""], correctAnswer: "" })
    }
  }

  const handleDeleteQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...newQuestion.options]
    newOptions[index] = value
    setNewQuestion({ ...newQuestion, options: newOptions })
  }

  const getQuestionTypeLabel = (type: QuestionType) => {
    const labels: Record<QuestionType, string> = {
      msq: "Multiple Choice",
      subjective: "Subjective",
      coding: "Coding",
    }
    return labels[type]
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link href="/admin/manage-exam" className="inline-flex items-center text-slate-600 hover:text-slate-800 transition-colors mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Add Questions</h1>
                <p className="text-slate-600">{examData.courseCode} - {examData.courseName}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Questions
                  </Button>
                </DialogTrigger>
                <ExcelUploadBox onParsedQuestions={handleParsedExcel} />
              </Dialog>
              <Button onClick={handleSaveAll} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Saving...
                  </>
                ) : (
                  <>Save All Questions</>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Question Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Add New Question</CardTitle>
                <CardDescription>Create questions manually</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="questionType">Question Type</Label>
                  <Select
                    value={newQuestion.type}
                    onValueChange={(value: QuestionType) => setNewQuestion({ ...newQuestion, type: value })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="msq">Multiple Choice (MSQ)</SelectItem>
                      <SelectItem value="subjective">Subjective</SelectItem>
                      <SelectItem value="coding">Coding</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="question">Question</Label>
                  <Textarea
                    id="question"
                    placeholder="Enter your question here..."
                    value={newQuestion.question}
                    onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                    className="min-h-[100px]"
                  />
                </div>

                {newQuestion.type === "msq" && (
                  <>
                    <Label>Options</Label>
                    {newQuestion.options.map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <span className="w-8 h-10 flex items-center justify-center bg-slate-100 rounded text-sm font-medium">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <Input
                          placeholder={`Option ${String.fromCharCode(65 + index)}`}
                          value={option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                        />
                      </div>
                    ))}
                    <div className="space-y-2">
                      <Label htmlFor="correctAnswer">Correct Answer</Label>
                      <Select
                        value={newQuestion.correctAnswer}
                        onValueChange={(value: string) => setNewQuestion({ ...newQuestion, correctAnswer: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select correct answer" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="a">A</SelectItem>
                          <SelectItem value="b">B</SelectItem>
                          <SelectItem value="c">C</SelectItem>
                          <SelectItem value="d">D</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                <Button onClick={handleAddQuestion} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Questions List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Questions ({questions.length}/{examData.totalQuestions})</CardTitle>
                <CardDescription>Review and manage your exam questions</CardDescription>
              </CardHeader>
              <CardContent>
                {questions.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No questions added yet</p>
                    <p className="text-sm">Add questions manually or upload via Excel</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {questions.map((question, index) => (
                      <Card key={question.id} className="border-l-4 border-l-blue-500">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-medium bg-slate-100 px-2 py-1 rounded">Q{index + 1}</span>
                                <span className="text-sm text-slate-600">{getQuestionTypeLabel(question.type)}</span>
                              </div>
                              <p className="text-slate-800 font-medium">{question.question}</p>
                            </div>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteQuestion(question.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        {question.type === "msq" && question.options && (
                          <CardContent className="pt-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {question.options.map((option, optIndex) => (
                                <div
                                  key={optIndex}
                                  className={`flex items-center gap-2 p-2 rounded text-sm ${
                                    question.correctAnswer === String.fromCharCode(97 + optIndex)
                                      ? "bg-green-50 border border-green-200"
                                      : "bg-slate-50"
                                  }`}
                                >
                                  <span className="font-medium">{String.fromCharCode(65 + optIndex)}.</span>
                                  <span>{option}</span>
                                  {question.correctAnswer === String.fromCharCode(97 + optIndex) && (
                                    <span className="ml-auto text-green-600 text-xs">✓ Correct</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
