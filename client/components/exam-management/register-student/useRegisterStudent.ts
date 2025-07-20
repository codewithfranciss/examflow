import { useState } from "react"
import * as XLSX from "xlsx"
import toast from "react-hot-toast"
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

  const handleAddStudent = async() => {
    if(!newStudent.matricNo ||!newStudent.password || !newStudent.department || !newStudent.lecturer){
        toast.error("Please fill in all fields")
    }
    if (newStudent.matricNo && newStudent.department && newStudent.lecturer) {
      const studentToAdd: Student = {
        id: registeredStudents.length + 1,
        matricNo: newStudent.matricNo,
        department: newStudent.department,
        lecturer: newStudent.lecturer,
        password: newStudent.password,
    
      }
      try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/register/${examId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStudent), 
      });
    
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to add student.");
      }else{
        toast.success(data.message)
      }
    
      setRegisteredStudents((prevStudents) => [...prevStudents, data.student]);
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } 
      
      setNewStudent({ matricNo: "", password: "", department: "", lecturer: "" })
    }
  }

  

const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  setUploadError(null);
  const file = event.target.files?.[0];
  if (!file) return setUploadError("No file selected.");
  if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
    return setUploadError("Please upload a valid Excel file (.xlsx or .xls).");
  }

  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const json: any[] = XLSX.utils.sheet_to_json(worksheet);

      const studentsData = json.map((row) => ({
        matricNo: row["Matric Number"] || "",
        password: row["Password"] || "",
        department: row["Department"] || "",
        lecturer: row["Lecturer"] || "",
      }));

      const isValid = studentsData.every(s => s.matricNo && s.password && s.department && s.lecturer);
      if (!isValid) {
        setUploadError("Some rows are missing required fields.");
        toast.error("Some rows are missing required fields.");
        return;
      }

     
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/bulk-register/${examId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify( studentsData ),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Failed to upload students.");
        return;
      }
      toast.success(
        `Upload successful: Inserted ${result.summary.totalInserted} / ${result.summary.totalReceived}. Ignored Duplicates: ${result.summary.duplicatesIgnoredInBatch}`
      );

      event.target.value = "";
      

    } catch (error: any) {
      console.error("Error during file upload:", error);
      setUploadError("Upload failed.");
      toast.error("Upload failed: " + error.message);
      
    }
  };

  reader.onerror = () => {
    setUploadError("Failed to read file.");
    toast.error("Failed to read file.");
  };

  reader.readAsBinaryString(file);
};


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
