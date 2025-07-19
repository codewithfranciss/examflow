import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"
import useRegisterStudents from "./register-student/useRegisterStudent"
import RegisterStudentForm from "./register-student/RegisterStudentForm"
import ExcelUploadSection from "./register-student/ExcelUploadStudent"
import StudentTable from "./register-student/StudentTable"
interface Student {
  id: number;
  matricNo: string;
  department: string;
  lecturer: string;
  password?: string; 
}


interface RegisterStudentsProps {
  examCourseCode: string;
  students: Student[]; 
  examId: string;
}

export default function RegisterStudents({
  examCourseCode,
  students: initialStudents,
  examId,

}: RegisterStudentsProps) { 

const {
    newStudent,
    setNewStudent,
    registeredStudents,
    handleAddStudent,
    handleDeleteStudent,
    handleFileUpload,
    handleDownloadTemplate,
    uploadError,
  } = useRegisterStudents(initialStudents, examId)

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
            <RegisterStudentForm
              newStudent={newStudent}
              setNewStudent={setNewStudent}
              handleAddStudent={handleAddStudent}
            />
          </TabsContent>

          <TabsContent value="upload">
            <ExcelUploadSection
              handleFileUpload={handleFileUpload}
              handleDownloadTemplate={handleDownloadTemplate}
              uploadError={uploadError}
            />
          </TabsContent>
        </Tabs>

        <StudentTable students={registeredStudents} onDelete={handleDeleteStudent} />
      </CardContent>
    </Card>
  )
}
