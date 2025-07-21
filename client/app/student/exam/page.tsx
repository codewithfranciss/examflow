"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Clock, Play, Send } from "lucide-react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

type Question = {
  id: string
  type: string
  question: string
  options?: string[]
}

type Exam = {
  examId: string
  duration: number
  courseName: string
  courseCode: string
  examTypes: string[]
  questions: Question[]
  lecturer: string
  department: string
}

export default function StudentExam() {
  const router = useRouter()
  const [exam, setExam] = useState<Exam | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [examStarted, setExamStarted] = useState(false)
  const [currentTab, setCurrentTab] = useState("msq")
  const [currentQuestion, setCurrentQuestion] = useState(1)

  const [answeredQuestions, setAnsweredQuestions] = useState<Record<string, Set<number>>>({})
  const [answers, setAnswers] = useState<Record<string, Record<number, string>>>({})

  useEffect(() => {
    const stored = localStorage.getItem("selectedExamDetails")
    if (!stored) {
      toast.error("No exam data found.")
      router.push("/student/select-exam")
      return
    }

    try {
      const parsed: Exam = JSON.parse(stored)
      setExam(parsed)
      setTimeLeft(parsed.duration * 60)

      const grouped = parsed.questions.reduce((acc: any, q, i) => {
        const index = i + 1
        const type = q.type.toLowerCase()
        if (!acc[type]) acc[type] = { questions: [], answers: {}, answered: new Set() }
        acc[type].questions.push({ ...q, index })
        return acc
      }, {})

      const initAnswers: Record<string, Record<number, string>> = {}
      const initAnswered: Record<string, Set<number>> = {}

      Object.keys(grouped).forEach((type) => {
        initAnswers[type] = {}
        initAnswered[type] = new Set()
      })

      setAnswers(initAnswers)
      setAnsweredQuestions(initAnswered)
      setCurrentTab(Object.keys(grouped)[0] || "msq")
    } catch (err) {
      toast.error("Invalid exam data.")
      router.push("/student/select-exam")
    }
  }, [])

  useEffect(() => {
    if (!examStarted || timeLeft <= 0) return
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000)
    return () => clearInterval(timer)
  }, [examStarted, timeLeft])

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600).toString().padStart(2, "0")
    const m = Math.floor((secs % 3600) / 60).toString().padStart(2, "0")
    const s = (secs % 60).toString().padStart(2, "0")
    return `${h}:${m}:${s}`
  }

  const handleAnswerChange = (type: string, index: number, value: string) => {
    const lowerType = type.toLowerCase()
    setAnswers((prev) => ({
      ...prev,
      [lowerType]: {
        ...prev[lowerType],
        [index]: value,
      },
    }))
    setAnsweredQuestions((prev) => ({
      ...prev,
      [lowerType]: new Set([...prev[lowerType], index]),
    }))
  }

  const QuestionNavigation = ({ type }: { type: string }) => {
    const lowerType = type.toLowerCase()
    const questions = exam?.questions.filter((q) => q.type.toLowerCase() === lowerType) || []
    return (
      <div className="grid grid-cols-5 gap-2">
        <div className="col-span-5 text-sm font-semibold">
          {lowerType.toUpperCase()} ({answeredQuestions[lowerType]?.size || 0}/{questions.length})
        </div>
        {questions.map((q, i) => {
          const status = answeredQuestions[lowerType]?.has(i + 1)
            ? "answered"
            : i + 1 === currentQuestion && lowerType === currentTab
              ? "current"
              : "unanswered"
          const styles = {
            answered: "bg-green-500 text-white",
            current: "bg-blue-500 text-white",
            unanswered: "bg-slate-200 text-black",
          }
          return (
            <Button
              key={q.id}
              className={`w-10 h-10 hover:bg-slate-200 ${styles[status]}`}
              onClick={() => {
                setCurrentQuestion(i + 1)
                setCurrentTab(lowerType)
              }}
            >
              {i + 1}
            </Button>
          )
        })}
      </div>
    )
  }

  const renderQuestion = () => {
    if (!exam) return null
    const allQuestions = exam.questions.filter((q) => q.type.toLowerCase() === currentTab)
    const question = allQuestions[currentQuestion - 1]
    if (!question) return <p>No question found.</p>
    const lowerType = question.type.toLowerCase()

    return (
      <Card>
        <CardHeader>
          <CardTitle>Question {currentQuestion}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{question.question}</p>

          {lowerType === "msq" && (
            <RadioGroup
              value={answers[lowerType]?.[currentQuestion] || ""}
              onValueChange={(val) => handleAnswerChange(lowerType, currentQuestion, val)}
            >
              {question.options?.map((opt, i) => {
                const letter = String.fromCharCode(65 + i) // A, B, C, D
                return (
                  <div key={i} className="flex items-center space-x-2">
                    <RadioGroupItem value={letter} id={`q${i}`} />
                    <Label htmlFor={`q${i}`}>{`${letter}. ${opt}`}</Label>
                  </div>
                )
              })}
            </RadioGroup>
          )}

          {lowerType === "subjective" && (
            <Textarea
              value={answers[lowerType]?.[currentQuestion] || ""}
              onChange={(e) => handleAnswerChange(lowerType, currentQuestion, e.target.value)}
              placeholder="Type your answer..."
            />
          )}

          {lowerType === "coding" && (
            <Textarea
              value={answers[lowerType]?.[currentQuestion] || ""}
              onChange={(e) => handleAnswerChange(lowerType, currentQuestion, e.target.value)}
              placeholder="// write your code here"
              className="font-mono min-h-[300px]"
            />
          )}
        </CardContent>
      </Card>
    )
  }

  const handleSubmit = async () => {
    if (!exam) return
  
    const flatAnswers: { questionId: string; answer: string }[] = []

    const grouped = exam.questions.reduce((acc: Record<string, Question[]>, q) => {
      const type = q.type.toLowerCase()
      if (!acc[type]) acc[type] = []
      acc[type].push(q)
      return acc
    }, {})
  
    Object.entries(grouped).forEach(([type, questions]) => {
      questions.forEach((question, index) => {
        const answer = answers[type]?.[index + 1] || "" 
        flatAnswers.push({
          questionId: question.id,
          answer,
        })
      })
    })
  
    const student = JSON.parse(localStorage.getItem("studentAuthInfo") || "{}")
    const stored: Exam = JSON.parse(localStorage.getItem("selectedExamDetails") || "{}")
  
    const submissionPayload = {
      matricNo: student.matricNo || "N/A",
      fullName: student.fullName || "N/A",
      department: stored?.department || "N/A",
      lecturer: stored?.lecturer || "N/A",
      examId: exam.examId,
      answers: flatAnswers,
    }
  console.log(submissionPayload.answers)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/student/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(submissionPayload)
      })
  
      const result = await res.json()
  
      if (!res.ok) {
        throw new Error(result.error || "Submission failed.")
      }
  
      toast.success(`Exam Submitted! Score: ${result.result.score}/${result.result.totalQuestions}`)
      router.push("/student/submitted")
    } catch (err: any) {
      toast.error(err.message || "Something went wrong. Try again.")
      router.push('/student/select-exam')
    }
  }

  if (!examStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">{exam?.courseName}</CardTitle>
            <CardDescription>Duration: {exam?.duration} mins</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => setExamStarted(true)} size="lg" className="w-full">
              <Play className="mr-2 w-4 h-4" />
              Start Exam
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold">{exam?.courseName}</h1>
          <p className="text-sm text-slate-500">{exam?.courseCode}</p>
        </div>
        <div className="font-mono text-lg">
          <Clock className="inline w-5 h-5 mr-1" />
          <span className={timeLeft < 600 ? "text-red-600" : ""}>{formatTime(timeLeft)}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6 max-w-7xl mx-auto">
        <div className="space-y-4">
          {exam?.examTypes.map((type) => (
            <QuestionNavigation key={type} type={type} />
          ))}
        </div>

        <div className="lg:col-span-3 space-y-6">
          <Tabs value={currentTab} onValueChange={(tab) => {
            setCurrentTab(tab)
            setCurrentQuestion(1)
          }}>
            <TabsList className="grid grid-cols-3 w-full">
              {exam?.examTypes.map((type) => (
                <TabsTrigger key={type} value={type.toLowerCase()}>
                  {type.toUpperCase()}
                </TabsTrigger>
              ))}
            </TabsList>

            {exam?.examTypes.map((type) => (
              <TabsContent key={type} value={type.toLowerCase()}>
                {renderQuestion()}
              </TabsContent>
            ))}
          </Tabs>

          <div className="flex justify-center">
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700"
              onClick={handleSubmit}
            >
              <Send className="mr-2 w-4 h-4" />
              Submit Exam
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
