"use client"

import { useEffect, useState } from "react"
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
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel
} from "@/components/ui/select"
import { Eye, Edit, Plus, Download } from "lucide-react"
import * as XLSX from "xlsx"

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
  examId: string
}

export default function StudentPerformance({
  examCourseCode,
  examCourseName,
  examId
}: StudentPerformanceProps) {
  const [students, setStudents] = useState<Student[]>([])
  const [search, setSearch] = useState("")
  const [filterBy, setFilterBy] = useState("all")
  const [filterValue, setFilterValue] = useState("")

  const getStatusBadge = (status: string) => {
    return (
      <Badge className={status === "completed" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
        {status === "completed" ? "Completed" : "Pending"}
      </Badge>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const fetchStudentPerformance = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/performance/${examId}`)
      const data = await res.json()
      setStudents(data.students || [])
    } catch (err) {
      console.error("Error fetching student performance:", err)
    }
  }

  useEffect(() => {
    fetchStudentPerformance()
  }, [examId])

  const departments = Array.from(new Set(students.map((s) => s.department))).filter(Boolean)
  const lecturers = Array.from(new Set(students.map((s) => s.lecturer))).filter(Boolean)

  const filteredStudents = students.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.matricNo.toLowerCase().includes(search.toLowerCase())

    const matchFilter =
      filterBy === "all" ||
      (filterBy === "department" && s.department === filterValue) ||
      (filterBy === "lecturer" && s.lecturer === filterValue)

    return matchSearch && matchFilter
  })

  const handleExport = () => {
    const exportData = filteredStudents.map((s) => ({
      MatricNo: s.matricNo,
      Name: s.name,
      Department: s.department,
      Lecturer: s.lecturer,
      Score: s.status === "completed" ? s.score : "Pending",
      Status: s.status
    }))

    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Student Performance")
    XLSX.writeFile(workbook, `performance-${examCourseCode}.xlsx`)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div>
            <CardTitle>Student Performance - {examCourseCode}</CardTitle>
            <CardDescription>{examCourseName}</CardDescription>
          </div>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Results
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row gap-3 justify-between">
          <Input
            placeholder="Search by name or matric no"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-[220px]"
          />

          <Select
            value={filterBy}
            onValueChange={(val) => {
              setFilterBy(val)
              setFilterValue("")
            }}
          >
            <SelectTrigger className="w-full md:w-[220px]">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Filter</SelectLabel>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="department">By Department</SelectItem>
                <SelectItem value="lecturer">By Lecturer</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {filterBy === "department" && (
            <Select value={filterValue} onValueChange={setFilterValue}>
              <SelectTrigger className="w-full md:w-[220px]">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dep) => (
                  <SelectItem key={dep} value={dep}>
                    {dep}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {filterBy === "lecturer" && (
            <Select value={filterValue} onValueChange={setFilterValue}>
              <SelectTrigger className="w-full md:w-[220px]">
                <SelectValue placeholder="Select Lecturer" />
              </SelectTrigger>
              <SelectContent>
                {lecturers.map((lec) => (
                  <SelectItem key={lec} value={lec}>
                    {lec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="rounded-md border overflow-x-auto">
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
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.matricNo}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.department}</TableCell>
                  <TableCell>{student.lecturer}</TableCell>
                  <TableCell>
                    <span className={`font-semibold ${getScoreColor(student.score)}`}>
                      {student.status === "completed" ? student.score : "-"}
                    </span>
                  </TableCell>
                  <TableCell>{getStatusBadge(student.status)}</TableCell>
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
