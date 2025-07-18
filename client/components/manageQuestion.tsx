"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, FileText } from "lucide-react"
import Link from "next/link"

interface ManageQuestionsProps {
  examId: number
  examCourseCode: string
}

export default function ManageQuestions({ examId, examCourseCode }: ManageQuestionsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Exam Questions - {examCourseCode}</CardTitle>
            <CardDescription>Add and manage questions for this exam</CardDescription>
          </div>
          <Button asChild>
            <Link href={`/lecturer/exam-questions?examId=${examId}&courseCode=${examCourseCode}`}>
              <Plus className="h-4 w-4 mr-2" />
              Add Questions
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-slate-500">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="mb-2">No questions added yet</p>
          <p className="text-sm mb-4">Start by adding questions manually or uploading via Excel</p>
          <Button asChild>
            <Link href={`/lecturer/exam-questions?examId=${examId}&courseCode=${examCourseCode}`}>
              Add Your First Question
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
