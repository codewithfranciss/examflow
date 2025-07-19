import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Download } from "lucide-react"
import React from "react"

interface ExcelUploadSectionProp{
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleDownloadTemplate: ()=> void
  uploadError: string | null
}

export default function ExcelUploadSection({ handleFileUpload, handleDownloadTemplate, uploadError }: ExcelUploadSectionProp) {
  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
        <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        <p className="text-slate-600 mb-4">Drag and drop your Excel file here, or click to browse</p>
        <Input
          id="excel-upload"
          type="file"
          accept=".xlsx, .xls"
          className="hidden"
          onChange={handleFileUpload}
        />
        <Button onClick={() => document.getElementById("excel-upload")?.click()}>Choose Excel File</Button>
        {uploadError && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{uploadError}</AlertDescription>
          </Alert>
        )}
      </div>
      <div className="text-sm space-y-2">
        <p className="font-medium">Required Columns:</p>
        <ul className="list-disc list-inside space-y-1 text-slate-600">
          <li><strong>Matric Number</strong></li>
          <li><strong>Password</strong></li>
          <li><strong>Department</strong></li>
          <li><strong>Lecturer</strong></li>
        </ul>
        <Button variant="outline" size="sm" onClick={handleDownloadTemplate} className="mt-2">
          <Download className="h-4 w-4 mr-2" /> Download Template
        </Button>
      </div>
    </div>
  )
}
