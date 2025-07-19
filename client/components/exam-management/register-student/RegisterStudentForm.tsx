import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import React from "react";

const departments = ["Computer Science", "Information Technology", "Software Engineering", "Data Science"]
const lecturers = ["Dr. Smith", "Dr. Johnson", "Dr. Williams", "Dr. Brown"]

interface NewStudent {
    matricNo: string;
    password: string;
    department: string;
    lecturer: string;
}

interface RegisterStudentFormProps {
    newStudent: NewStudent;
    setNewStudent: React.Dispatch<React.SetStateAction<NewStudent>>;
    handleAddStudent: () => void;
}

export default function RegisterStudentForm({ newStudent, setNewStudent, handleAddStudent }: RegisterStudentFormProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="matricNo">Matric Number</Label>
        <Input
          id="matricNo"
          value={newStudent.matricNo}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewStudent({ ...newStudent, matricNo: e.target.value })}
          placeholder="CS/2021/001"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={newStudent.password}
         
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewStudent({ ...newStudent, password: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Department</Label>
        <Select value={newStudent.department} onValueChange={(v: string) => setNewStudent({ ...newStudent, department: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Lecturer</Label>
        <Select value={newStudent.lecturer} onValueChange={(v: string) => setNewStudent({ ...newStudent, lecturer: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Select lecturer" />
          </SelectTrigger>
          <SelectContent>
            {lecturers.map((lecturer) => (
              <SelectItem key={lecturer} value={lecturer}>{lecturer}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button onClick={handleAddStudent} className="w-full md:w-auto col-span-2 mt-4">
        Add Student to Course
      </Button>
    </div>
  )
}