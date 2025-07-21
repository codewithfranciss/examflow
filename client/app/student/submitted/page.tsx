"use client";

import React, { useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react"; // Added Loader2 for spinner
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Success() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setLoading(true); 
    setTimeout(() => {
      localStorage.removeItem("studentAuthInfo");
      localStorage.removeItem("selectedExamDetails")
      router.push("/");
    }, 1000); 
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 text-center">
      {/* Animated Checkmark */}
      <div className="bg-green-100 p-6 rounded-full shadow-lg mb-6 animate-bounce">
        <CheckCircle className="text-green-600 w-16 h-16" />
      </div>

 
      <h1 className="text-3xl font-bold text-gray-800 mb-3">Successfully Submitted</h1>
      <p className="text-lg text-gray-600">Your score has been captured.</p>

      {/* Button with Loader */}
      <Button
        onClick={handleLogout}
        disabled={loading}
        className="mt-6 bg-primary hover:bg-primary text-white px-6 py-3 text-lg font-semibold flex items-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Logging out...
          </>
        ) : (
          "Logout"
        )}
      </Button>
    </div>
  );
}