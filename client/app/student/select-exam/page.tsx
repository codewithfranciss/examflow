"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Users, FileText, Play, User, Building } from "lucide-react"
import Link from "next/link"

export default function SelectExam() {
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [selectedLecturer, setSelectedLecturer] = useState("")
  const [selectedExam, setSelectedExam] = useState("")

 


  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Select Exam</h1>
              <p className="text-slate-600">Choose your department, lecturer, and exam to begin</p>
            </div>
            <div className="text-sm text-slate-600">
              Welcome, <span className="font-medium">CS/2021/001</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Selection Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1: Department */}
            <Card className={selectedDepartment ? "ring-2 ring-blue-500" : ""}>
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <Building className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Step 1: Department</CardTitle>
                <CardDescription>Select your department</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose department" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* {departments.map((department) => (
                      <SelectItem key={department} value={department}>
                        {department}
                      </SelectItem>
                    ))} */}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Step 2: Lecturer */}
            <Card className={selectedLecturer ? "ring-2 ring-green-500" : selectedDepartment ? "" : "opacity-50"}>
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <User className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Step 2: Lecturer</CardTitle>
                <CardDescription>Select your lecturer</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedLecturer} onValueChange={setSelectedLecturer} disabled={!selectedDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose lecturer" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* {availableLecturers.map((lecturer) => (
                      <SelectItem key={lecturer} value={lecturer}>
                        {lecturer}
                      </SelectItem>
                    ))} */}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Step 3: Exam */}

            <Card className={selectedExam ? "ring-2 ring-purple-500" : selectedLecturer ? "" : "opacity-50"}>
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Step 3: Exam</CardTitle>
                <CardDescription>Select your exam</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedLecturer} onValueChange={setSelectedLecturer} disabled={!selectedDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose lecturer" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* {availableLecturers.map((lecturer) => (
                      <SelectItem key={lecturer} value={lecturer}>
                        {lecturer}
                      </SelectItem>
                    ))} */}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
            
          </div>

          {/* Available Exams */}
          

          {/* No Exams Message */}
          

          {/* Start Exam Button */}
         
            <div className="flex justify-center">
              <Button size="lg" className="px-8" asChild>
                <Link href={`/student/exam?examId=${selectedExam}`}>
                  <Play className="h-4 w-4 mr-2" />
                  Start Selected Exam
                </Link>
              </Button>
            </div>
        </div>
      </div>
    </div>
  )
}
