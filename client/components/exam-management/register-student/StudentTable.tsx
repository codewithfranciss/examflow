import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2 } from "lucide-react"

interface Student {
    id: number;
    matricNo: string;
    password?: string; 
    department: string;
    lecturer: string;
  }
interface StudentTableProps {
    students: Student[];
    onDelete: (id: number) => void; 
  }
export default function StudentTable({ students, onDelete }: StudentTableProps) {
  return (
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
          {students.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-slate-500">
                No students registered yet.
              </TableCell>
            </TableRow>
          ) : (
            students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.matricNo}</TableCell>
                <TableCell>{student.password}</TableCell>
                <TableCell>{student.department}</TableCell>
                <TableCell>{student.lecturer}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-800"
                    onClick={() => onDelete(student.id)}
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
  )
}
