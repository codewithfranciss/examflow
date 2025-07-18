"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, UserPlus, Trash2, Download, Info } from "lucide-react"

interface Student {
  id: number
  matricNo: string
  name: string
  email: string
  department: string
  lecturer: string
}

interface RegisterStudentsProps {
  examCourseCode: string
  students: Student[]
  onAddStudent: (student: Omit<Student, "id">) => void
  onRemoveStudent: (id: number) => void
}

export default function RegisterStudents({
  examCourseCode,
  students,
  onAddStudent,
  onRemoveStudent,
}: RegisterStudentsProps) {
  const [newStudent, setNewStudent] = useState({
    matricNo: "",
    name: "",
    email: "",
    password: "",
    department: "",
    lecturer: "",
  })

  const departments = ["Computer Science", "Information Technology", "Software Engineering", "Data Science"]
  const lecturers = ["Dr. Smith", "Dr. Johnson", "Dr. Williams", "Dr. Brown"]

  const handleAddStudent = () => {
    if (newStudent.matricNo && newStudent.name && newStudent.email && newStudent.department && newStudent.lecturer) {
      onAddStudent({
        matricNo: newStudent.matricNo,
        name: newStudent.name,
        email: newStudent.email,
        department: newStudent.department,
        lecturer: newStudent.lecturer,
      })
      setNewStudent({
        matricNo: "",
        name: "",
        email: "",
        password: "",
        department: "",
        lecturer: "",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register Students to {examCourseCode}</CardTitle>
        <CardDescription>Add students to this specific course</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Students will be registered with login credentials. Make sure to provide secure passwords.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="manual" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Manual Input</TabsTrigger>
            <TabsTrigger value="upload">Upload Excel</TabsTrigger>
          </TabsList>

          <TabsContent value="manual">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="matricNo">Matric Number</Label>
                <Input
                  id="matricNo"
                  placeholder="CS/2021/001"
                  value={newStudent.matricNo}
                  onChange={(e) => setNewStudent({ ...newStudent, matricNo: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@university.edu"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter student password"
                  value={newStudent.password}
                  onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={newStudent.department}
                  onValueChange={(value) => setNewStudent({ ...newStudent, department: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lecturer">Lecturer</Label>
                <Select
                  value={newStudent.lecturer}
                  onValueChange={(value) => setNewStudent({ ...newStudent, lecturer: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select lecturer" />
                  </SelectTrigger>
                  <SelectContent>
                    {lecturers.map((lecturer) => (
                      <SelectItem key={lecturer} value={lecturer}>
                        {lecturer}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleAddStudent} className="w-full md:w-auto">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Student to Course
            </Button>
          </TabsContent>

          <TabsContent value="upload">
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 mb-4">Drag and drop your Excel file here, or click to browse</p>
                <Button variant="outline">Choose Excel File</Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Excel Template Format</CardTitle>
                  <CardDescription>Use this format for uploading students via Excel</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm space-y-2">
                    <p className="font-medium">Required Columns:</p>
                    <ul className="list-disc list-inside space-y-1 text-slate-600">
                      <li>
                        <strong>Column A:</strong> Matric Number (e.g., CS/2021/001)
                      </li>
                      <li>
                        <strong>Column B:</strong> Full Name (e.g., John Doe)
                      </li>
                      <li>
                        <strong>Column C:</strong> Email (e.g., john.doe@university.edu)
                      </li>
                      <li>
                        <strong>Column D:</strong> Password (e.g., student123)
                      </li>
                      <li>
                        <strong>Column E:</strong> Department (e.g., Computer Science)
                      </li>
                      <li>
                        <strong>Column F:</strong> Lecturer (e.g., Dr. Smith)
                      </li>
                    </ul>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Matric Number</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Lecturer</TableHead>
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
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveStudent(student.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
