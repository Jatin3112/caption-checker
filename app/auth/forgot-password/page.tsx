"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, CheckCircle } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import Navbar from "@/components/Navbar";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setIsLoading(true);

      // Simulate API call
      await axios.post("/api/forgot-password", {
        email,
      });
    } catch (error) {
    } finally {
      setIsEmailSent(true);
      setIsLoading(false);
      toast.success("Please check your email id");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Header */}
      <Navbar />

      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl text-slate-900 dark:text-gray-100">
                {isEmailSent
                  ? "Check your email! 📧"
                  : "Forgot your password? 🔐"}
              </CardTitle>
              <p className="text-gray-500 dark:text-gray-400">
                {isEmailSent
                  ? "We've sent a password reset link to your email address."
                  : "No worries! Enter your email and we'll send you a reset link."}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEmailSent ? (
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <CheckCircle className="h-16 w-16 text-green-500 dark:text-green-400" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      We sent a password reset link to:
                    </p>
                    <p className="font-medium text-slate-900 dark:text-gray-100">
                      {email}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Didn't receive the email? Check your spam folder or try
                      again.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setIsEmailSent(false)}
                      className="w-full border-gray-300 dark:border-slate-600 text-slate-900 dark:text-gray-100"
                    >
                      Try different email
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-slate-900 dark:text-gray-100"
                    >
                      Email address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-slate-900 dark:text-gray-100"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-indigo-500 hover:bg-indigo-600 dark:bg-violet-500 dark:hover:bg-violet-600 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending reset link..." : "Send Reset Link"}
                  </Button>
                </form>
              )}

              <div className="text-center">
                <Link
                  href="/auth/login"
                  className="text-sm text-indigo-500 dark:text-violet-500 hover:text-indigo-600 dark:hover:text-violet-600"
                >
                  ← Back to sign in
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Help Section */}
          <div className="text-center space-y-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Still having trouble? Contact our support team
            </p>
            <Button
              variant="ghost"
              className="text-xs text-indigo-500 dark:text-violet-500 hover:text-indigo-600 dark:hover:text-violet-600"
            >
              Get Help →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
