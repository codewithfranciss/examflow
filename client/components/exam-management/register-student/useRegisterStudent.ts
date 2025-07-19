import { useState } from "react"
import * as XLSX from "xlsx"

interface Student {
  id: number
  matricNo: string
  department: string
  lecturer: string
  password?: string
}

export default function useRegisterStudents(initialStudents: Student[], examId: string) {
  const [newStudent, setNewStudent] = useState({
    matricNo: "",
    password: "",
    department: "",
    lecturer: "",
  })
  const [registeredStudents, setRegisteredStudents] = useState<Student[]>(initialStudents)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleAddStudent = () => {
    if (newStudent.matricNo && newStudent.department && newStudent.lecturer) {
      const studentToAdd: Student = {
        id: registeredStudents.length + 1,
        matricNo: newStudent.matricNo,
        department: newStudent.department,
        lecturer: newStudent.lecturer,
        password: newStudent.password,
    
      }
      const updated = [...registeredStudents, studentToAdd]
      setRegisteredStudents(updated)
      
      setNewStudent({ matricNo: "", password: "", department: "", lecturer: "" })
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null)
    const file = event.target.files?.[0]
    if (!file) return setUploadError("No file selected.")
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      return setUploadError("Please upload a valid Excel file (.xlsx or .xls).")
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: "binary" })
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const json: any[] = XLSX.utils.sheet_to_json(worksheet)

        const uploaded: Student[] = json.map((row, index) => ({
          id: registeredStudents.length + 1 + index,
          matricNo: row["Matric Number"] || "",
          password: row["Password"] || "",
          department: row["Department"] || "",
          lecturer: row["Lecturer"] || "",
        }))

        const valid = uploaded.every(s => s.matricNo && s.department && s.lecturer)
        if (!valid) return setUploadError("Some rows are missing required fields.")

        const updated = [...registeredStudents, ...uploaded]
        setRegisteredStudents(updated)
       
      } catch (err) {
        console.error(err)
        setUploadError("Error processing file.")
      }
    }
    reader.onerror = () => setUploadError("Failed to read file.")
    reader.readAsBinaryString(file)
  }

  const handleDownloadTemplate = () => {
    const templateData = [
      ["Matric Number", "Password", "Department", "Lecturer"],
      ["CS/2023/001", "securepass123", "Computer Science", "Dr. Smith"],
    ]
    const ws = XLSX.utils.aoa_to_sheet(templateData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Students Template")
    XLSX.writeFile(wb, "student_upload_template.xlsx")
  }

  const handleDeleteStudent = (id: number) => {
    const updated = registeredStudents.filter(s => s.id !== id)
    setRegisteredStudents(updated)
   
  }

  return {
    newStudent,
    setNewStudent,
    registeredStudents,
    uploadError,
    handleAddStudent,
    handleFileUpload,
    handleDownloadTemplate,
    handleDeleteStudent,
  }
} 
