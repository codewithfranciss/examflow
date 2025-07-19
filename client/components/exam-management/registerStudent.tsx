"use client"

import { useState } from "react"
import * as XLSX from "xlsx" // Import the xlsx library
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
  id: number // Assuming ID is either generated or optional for upload
  matricNo: string
  // name: string; // Removed
  // email: string; // Removed
  department: string
  lecturer: string
  password?: string // Add password to the interface as it's in the template
}

interface RegisterStudentsProps {
  examCourseCode: string
  students: Student[] // This will be the initial students, we'll manage the rest in state
  examId: string
  onStudentsRegistered: (newStudents: Student[]) => void
}

export default function RegisterStudents({
  examCourseCode,
  students: initialStudents, // Rename to avoid conflict with state
  examId,
  onStudentsRegistered,
}: RegisterStudentsProps) {
  const [newStudent, setNewStudent] = useState({
    matricNo: "",
    // name: "", // Removed
    // email: "", // Removed
    password: "",
    department: "",
    lecturer: "",
  })
  const [registeredStudents, setRegisteredStudents] = useState<Student[]>(initialStudents) // State to manage current students
  const [uploadError, setUploadError] = useState<string | null>(null) // State for upload errors

  const departments = ["Computer Science", "Information Technology", "Software Engineering", "Data Science"]
  const lecturers = ["Dr. Smith", "Dr. Johnson", "Dr. Williams", "Dr. Brown"]

  const handleAddStudent = () => {
    // Check if required fields are present (matricNo, department, lecturer)
    if (newStudent.matricNo && newStudent.department && newStudent.lecturer) {
      const studentToAdd: Student = {
        id: registeredStudents.length + 1, // Simple ID generation, replace with proper UUID in production
        matricNo: newStudent.matricNo,
        // name: "", // No longer collected via manual input
        // email: "", // No longer collected via manual input
        department: newStudent.department,
        lecturer: newStudent.lecturer,
        password: newStudent.password, // Include password from manual input
      }
      setRegisteredStudents((prevStudents) => [...prevStudents, studentToAdd])
      onStudentsRegistered([...registeredStudents, studentToAdd]) // Notify parent of changes
      setNewStudent({
        matricNo: "",
        // name: "", // Reset removed fields
        // email: "", // Reset removed fields
        password: "",
        department: "",
        lecturer: "",
      })
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null) // Clear previous errors
    const file = event.target.files?.[0]

    if (!file) {
      setUploadError("No file selected.")
      return
    }

    // Basic file type validation
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      setUploadError("Please upload a valid Excel file (.xlsx or .xls).")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: "binary" })
        const sheetName = workbook.SheetNames[0] // Get the first sheet
        const worksheet = workbook.Sheets[sheetName]

        const json: any[] = XLSX.utils.sheet_to_json(worksheet)

        const uploadedStudents: Student[] = json.map((row, index) => ({
          id: registeredStudents.length + 1 + index, // Generate unique IDs for uploaded students
          matricNo: row["Matric Number"] || "", // Map to your expected column headers
          // name: row["Full Name"] || "", // Removed
          // email: row["Email"] || "", // Removed
          password: row["Password"] || "", // Assuming password is in the Excel file
          department: row["Department"] || "",
          lecturer: row["Lecturer"] || "",
        }))

        // Basic validation for required fields from Excel (now only matricNo, department, lecturer)
        const isValid = uploadedStudents.every(student =>
          student.matricNo && student.department && student.lecturer
        );

        if (!isValid) {
            setUploadError("Some rows in the Excel file are missing required data (Matric Number, Department, Lecturer). Please check your template.");
            return;
        }

        setRegisteredStudents((prevStudents) => [...prevStudents, ...uploadedStudents])
        onStudentsRegistered([...registeredStudents, ...uploadedStudents]) // Notify parent of changes

      } catch (error) {
        console.error("Error reading Excel file:", error)
        setUploadError("Error processing Excel file. Please ensure it follows the specified template.")
      }
    }
    reader.onerror = () => {
      setUploadError("Failed to read the file.")
    }
    reader.readAsBinaryString(file)
  }

  // Function to handle student deletion (optional, but good for managing uploaded lists)
  const handleDeleteStudent = (idToDelete: number) => {
    const updatedStudents = registeredStudents.filter(student => student.id !== idToDelete);
    setRegisteredStudents(updatedStudents);
    onStudentsRegistered(updatedStudents);
  };

  // Function to download the template
  const handleDownloadTemplate = () => {
    const templateData = [
      ["Matric Number", "Password", "Department", "Lecturer"], // Updated template headers
      ["CS/2023/001", "securepass123", "Computer Science", "Dr. Smith"],
      // Add more example rows if needed
    ];

    const ws = XLSX.utils.aoa_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students Template");
    XLSX.writeFile(wb, "student_upload_template.xlsx");
  };


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
              {/* Removed Full Name Input */}
              {/* Removed Email Input */}
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
                <Input
                  id="excel-upload"
                  type="file"
                  accept=".xlsx, .xls"
                  className="hidden" // Hide the default input button
                  onChange={handleFileUpload}
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById("excel-upload")?.click()} // Trigger click on hidden input
                >
                  Choose Excel File
                </Button>
                {uploadError && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertDescription>{uploadError}</AlertDescription>
                  </Alert>
                )}
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
                      {/* Removed Full Name requirement */}
                      {/* Removed Email requirement */}
                      <li>
                        <strong>Column B:</strong> Password (e.g., student123)
                      </li>
                      <li>
                        <strong>Column C:</strong> Department (e.g., Computer Science)
                      </li>
                      <li>
                        <strong>Column D:</strong> Lecturer (e.g., Dr. Smith)
                      </li>
                    </ul>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
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
                <TableHead>Password</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Lecturer</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registeredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-slate-500"> {/* Adjusted colSpan */}
                    No students registered yet.
                  </TableCell>
                </TableRow>
              ) : (
                registeredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.matricNo}</TableCell>
                    <TableCell>{student.password}</TableCell>
                    <TableCell>{student.department}</TableCell>
                    <TableCell>{student.lecturer}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDeleteStudent(student.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}