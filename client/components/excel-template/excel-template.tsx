"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download } from "lucide-react"
import * as XLSX from "xlsx"

const generateMsqTemplate = () => {
  const wsData = [
    ["Question Type", "Question Text", "Option A", "Option B", "Option C", "Option D", "Correct Answer"],
    ["msq", "What is the capital of France?", "Paris", "London", "Berlin", "Rome", "a"],
  ]

  const worksheet = XLSX.utils.aoa_to_sheet(wsData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "MSQ Template")
  XLSX.writeFile(workbook, "msq_template.xlsx")
}

const generateSubjectiveTemplate = () => {
  const wsData = [
    ["Question Type", "Question Text", "Answer"],
    ["subjective", "Explain the concept of polymorphism in OOP.", "Polymorphism allows methods to behave differently based on the object calling them."],
  ]

  const worksheet = XLSX.utils.aoa_to_sheet(wsData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Subjective Template")
  XLSX.writeFile(workbook, "subjective_template.xlsx")
}

const ExcelUploadTemplate = () => {
  const handleDownload = () => {
    generateMsqTemplate()
    generateSubjectiveTemplate()
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg">Excel Template Format</CardTitle>
        <CardDescription>Use this format for uploading questions via Excel</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm space-y-2">
          <p className="font-medium">Required Columns:</p>
          <ul className="list-disc list-inside space-y-1 text-slate-600">
            <li><strong>Column A:</strong> Question Type (msq, subjective, coding)</li>
            <li><strong>Column B:</strong> Question Text</li>
            <li><strong>Column C - G:</strong> MSQ Options & Correct Answer (only for MSQ)</li>
          </ul>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download Templates
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ExcelUploadTemplate
