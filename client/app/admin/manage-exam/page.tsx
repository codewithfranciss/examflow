"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Eye, Edit, Trash2 } from "lucide-react"

import RegisterStudents from "@/components/exam-management/registerStudent"
import StudentPerformance from "@/components/exam-management/studentPerformance"
import ManageQuestions from "@/components/exam-management/manageQuestion"
import ExamStats from "@/components/exam-management/examStats"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
interface Exam {
  id: string
  courseName: string
  courseCode: string
  examTypes: string[] | string
  numberOfQuestions: number
  duration: number
  createdAt: string
}

interface Student {
  id: number
  matricNo: string
  name: string
  email: string
  department: string
  lecturer: string
  score: number
  status: "completed" | "pending"
}

export default function ManageExams() {
  const [exams, setExams] = useState<Exam[]>([])
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [examToDelete, setExamToDelete] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const [courseStudents, setCourseStudents] = useState<Student[]>([])

  const handleDeleteExam = async () => {
    if (!examToDelete) return
  
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/delete-exam/${examToDelete}`, {
        method: "DELETE",
      })
  
      const result = await res.json()
  
      if (!res.ok) throw new Error(result.error || "Failed to delete exam.")
  
      toast.success("Exam deleted successfully.")
      // Remove from state
      setExams((prev) => prev.filter((e) => e.id !== examToDelete))
    } catch (err: any) {
      toast.error(err.message || "An error occurred.")
    } finally {
      setShowDeleteDialog(false)
      setExamToDelete(null)
    }
  }
  

  const confirmDeleteExam = () => {
    console.log("Deleting exam:", examToDelete)
    setShowDeleteDialog(false)
    setExamToDelete(null)
  }



  const getStatusBadge = (type: string) => {
    const statusConfig: Record<string, { color: string; label: string }> = {
      active: { color: "bg-green-100 text-green-800", label: "Active" },
      completed: { color: "bg-blue-100 text-blue-800", label: "Completed" },
      draft: { color: "bg-gray-100 text-gray-800", label: "Draft" }
    }

    const config = statusConfig[type] || statusConfig["draft"]
    return <span className={`px-2 py-1 rounded-md text-xs font-medium ${config.color}`}>{config.label}</span>
  }

  const fetchExams = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/fetch-exam`)
      const data = await res.json()
      if (Array.isArray(data.exams)) {
        setExams(data.exams)
      } else {
        console.warn("Unexpected response format:", data)
        setExams([])
      }
    } catch (err) {
      console.error("Error fetching exams:", err)
      setExams([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExams()
  }, [])

  const ExamDetailsView = ({ exam }: { exam: Exam }) => (
    <div className="space-y-6">
      <ExamStats
        studentsCount={courseStudents.length}
        completedCount={courseStudents.filter((s) => s.status === "completed").length}
        averageScore={
          courseStudents.length
            ? Math.round(courseStudents.reduce((acc, s) => acc + s.score, 0) / courseStudents.length)
            : 0
        }
      />

      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="performance">Student Performance</TabsTrigger>
          <TabsTrigger value="register">Register Students</TabsTrigger>
          <TabsTrigger value="questions">Manage Questions</TabsTrigger>
        </TabsList>

        <TabsContent value="performance">
          <StudentPerformance
            examCourseCode={exam.courseCode}
            examCourseName={exam.courseName}
            students={courseStudents}
          />
        </TabsContent>

        <TabsContent value="register">
          <RegisterStudents
            examCourseCode={exam.courseCode}
            students={courseStudents}
            examId={exam.id}
           
          />
        </TabsContent>

        <TabsContent value="questions">
          <ManageQuestions examId={exam.id} examTitle={exam.courseName} examCourseCode={exam.courseCode} />
        </TabsContent>
      </Tabs>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/admin/dashboard" className="inline-flex items-center text-slate-600 hover:text-slate-800 mr-4">
              <ArrowLeft className="h-4 w-4 mr-1" />
            </Link>
            <h1 className="text-2xl font-bold text-slate-900">
              {selectedExam ? `Manage ${selectedExam.courseCode}` : "Manage Exams"}
            </h1>
          </div>
          {selectedExam && (
            <Button variant="outline" onClick={() => setSelectedExam(null)}>
              Back to Exams List
            </Button>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <p className="text-center text-muted-foreground">Loading exams...</p>
        ) : !selectedExam ? (
          <Card>
            <CardHeader>
              <CardTitle>Your Exams</CardTitle>
              <CardDescription>Manage your created examinations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead>Types</TableHead>
                      <TableHead>Questions</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {exams.map((exam) => (
                      <TableRow key={exam.id}>
                        <TableCell>
                          <div className="font-medium">{exam.courseCode}</div>
                          <div className="text-sm text-muted-foreground">{exam.courseName}</div>
                        </TableCell>
                        <TableCell>
                          {Array.isArray(exam.examTypes) ? exam.examTypes.join(", ") : exam.examTypes}
                        </TableCell>
                        <TableCell>{exam.numberOfQuestions}</TableCell>
                        <TableCell>{exam.duration} min</TableCell>
                        <TableCell>  <span className="px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
    Active
  </span></TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedExam(exam)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/admin/edit-exam?id=${exam.id}`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setExamToDelete(exam.id)
                                setShowDeleteDialog(true)
                              }}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <ExamDetailsView exam={selectedExam} />
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this exam?</AlertDialogTitle>
              <AlertDialogDescription>This action is permanent.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteExam} className="bg-red-600 hover:bg-red-700">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
