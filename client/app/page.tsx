"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GraduationCap, Loader2 } from "lucide-react"
import toast from "react-hot-toast"

export default function StudentLogin() {
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [matricNo, setMatricNo] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
   

    setTimeout(async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/student`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ matricNo, password }),
        })

        const data = await res.json()

        if (res.ok) {
          toast.success("🎉 Login successful! Redirecting...")
          localStorage.setItem("studentInfo", JSON.stringify({
            fullName,
            matricNo,
            password
          }))
          router.push("/student/select-exam")
        } else {
          toast.error(data.message || "Invalid credentials")
        }
      } catch (error) {
        toast.error("Unable to connect to server")
      } finally {
        setIsLoading(false)
      }
    }, 3000) // 3-second delay before making the request
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <GraduationCap className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Student Login</CardTitle>
            <CardDescription>Enter your credentials to access your exams</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="matric">Matric Number</Label>
                <Input
                  id="matric"
                  type="text"
                  placeholder="Enter your matric number"
                  value={matricNo}
                  onChange={(e) => setMatricNo(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password/Token</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password or token"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Logging in...
                  </span>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
