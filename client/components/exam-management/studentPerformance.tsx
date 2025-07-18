"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit, Plus, Download } from "lucide-react"

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

interface StudentPerformanceProps {
  examCourseCode: string
  examCourseName: string
  students: Student[]
}

export default function StudentPerformance({ examCourseCode, examCourseName, students }: StudentPerformanceProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getStatusBadge = (status: string) => {
    if (status === "completed") {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          Completed
        </Badge>
      )
    }
    return <Badge variant="secondary">Pending</Badge>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Student Performance - {examCourseCode}</CardTitle>
            <CardDescription>{examCourseName}</CardDescription>
          </div>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Results
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Matric Number</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Lecturer</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.matricNo}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.department}</TableCell>
                  <TableCell>{student.lecturer}</TableCell>
                  <TableCell>
                    <span
                      className={`font-semibold ${
                        student.score >= 80
                          ? "text-green-600"
                          : student.score >= 60
                            ? "text-yellow-600"
                            : student.score > 0
                              ? "text-red-600"
                              : "text-gray-500"
                      }`}
                    >
                      {student.status === "completed" ? `${student.score}%` : "-"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        student.status === "completed" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }
                    >
                      {student.status === "completed" ? "Completed" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" title="View Details">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" title="Edit Score">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" title="Add Extra Marks">
                        <Plus className="h-4 w-4" />
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
  )
}
