"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import {  FileText, Download } from "lucide-react"


const ExcelUploadTemplate = () => (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg">Excel Template Format</CardTitle>
        <CardDescription>Use this format for uploading questions via Excel</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm space-y-2">
          <p className="font-medium">Required Columns:</p>
          <ul className="list-disc list-inside space-y-1 text-slate-600">
            <li>
              <strong>Column A:</strong> Question Type (msq, subjective, coding)
            </li>
            <li>
              <strong>Column B:</strong> Question Text
            </li>
            <li>
              <strong>Column C:</strong> Option A (for MSQ only)
            </li>
            <li>
              <strong>Column D:</strong> Option B (for MSQ only)
            </li>
            <li>
              <strong>Column E:</strong> Option C (for MSQ only)
            </li>
            <li>
              <strong>Column F:</strong> Option D (for MSQ only)
            </li>
            <li>
              <strong>Column G:</strong> Correct Answer (a, b, c, d for MSQ)
            </li>
            <li>
              <strong>Column H:</strong> Points
            </li>
          </ul>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            View Sample
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  export default ExcelUploadTemplate;