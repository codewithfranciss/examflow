"use client"

import { useRef } from "react"
import * as XLSX from "xlsx"
import { v4 as uuidv4 } from "uuid"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import ExcelUploadTemplate from "@/components/excel-template/excel-template"
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

type ExcelUploadBoxProps = {
  onParsedQuestions: (questions: any[]) => void
}

export default function ExcelUploadBox({ onParsedQuestions }: ExcelUploadBoxProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer)
      const workbook = XLSX.read(data, { type: "array" })
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const rows = XLSX.utils.sheet_to_json(sheet)

      const questions = (rows as any[]).map((row) => {
        const type = row["Question Type"]?.toLowerCase()
        const question = row["Question Text"]

        const isMSQ = type === "msq"
        const isSubjective = type === "subjective"

        return {
          id: uuidv4(), // ✅ Unique ID
          type,
          question,
          options: isMSQ
            ? [row["Option A"], row["Option B"], row["Option C"], row["Option D"]]
            : undefined,
          correctAnswer: isMSQ
            ? row["Correct Answer"]?.toLowerCase()
            : isSubjective
            ? row["Answer"]
            : undefined,
        }
      })

      onParsedQuestions(questions)
    }

    reader.readAsArrayBuffer(file)
  }

  return (
    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Upload Questions</DialogTitle>
        <DialogDescription>
          Upload questions to this exam using Excel
        </DialogDescription>
      </DialogHeader>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          All content must be lowercase, trimmed, and formatted correctly. Ensure questions follow the proper format.
        </AlertDescription>
      </Alert>

      <div
        className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        <p className="text-slate-600 mb-4">Click to choose an Excel file</p>
        <Button variant="outline">Choose Excel File</Button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".xlsx, .xls"
          onChange={handleFile}
        />
      </div>

      <ExcelUploadTemplate />
    </DialogContent>
  )
}
