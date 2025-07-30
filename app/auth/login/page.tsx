"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Moon,
  Sun,
  ArrowLeft,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Chrome,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "@/components/Navbar";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [isDark, setIsDark] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Login failed");

      await new Promise((res) => setTimeout(res, 300));
      router.push("/checker?login=true");
      toast.success("Login Successful");
    } catch (error) {
      toast.error("Something went wrong during login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    // Simulate Google OAuth
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push("/checker");
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Header */}
      <Navbar />

      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Welcome Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-gray-100">
              Welcome back! 👋
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Sign in to your account to continue analyzing captions
            </p>
          </div>

          <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center text-slate-900 dark:text-gray-100">
                Sign In
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Google Login */}
              {/* <Button
                variant="outline"
                className="w-full border-gray-300 dark:border-slate-600 text-slate-900 dark:text-gray-100 bg-transparent hover:bg-gray-50 dark:hover:bg-slate-700"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <Chrome className="mr-2 h-4 w-4" />
                Continue with Google
              </Button> */}

              {/* <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full border-gray-200 dark:border-slate-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-slate-800 px-2 text-gray-500 dark:text-gray-400">
                    Or continue with email
                  </span>
                </div>
              </div> */}

              {/* Email/Password Form */}
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
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="pl-10 bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-slate-900 dark:text-gray-100"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-slate-900 dark:text-gray-100"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="pl-10 pr-10 bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-slate-900 dark:text-gray-100"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 text-gray-400 dark:text-gray-500 hover:text-slate-900 dark:hover:text-gray-100"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-indigo-500 dark:text-violet-500 hover:text-indigo-600 dark:hover:text-violet-600"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-indigo-500 hover:bg-indigo-600 dark:bg-violet-500 dark:hover:bg-violet-600 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="text-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Don't have an account?{" "}
                  <Link
                    href="/auth/signup"
                    className="text-indigo-500 dark:text-violet-500 hover:text-indigo-600 dark:hover:text-violet-600 font-medium"
                  >
                    Sign up
                  </Link>
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Trust Indicators */}
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              🔒 Your data is secure and encrypted
            </p>
            {/* <div className="flex justify-center items-center space-x-4 mt-2">
              <span className="text-xs text-gray-400 dark:text-gray-500">Trusted by 10K+ creators</span>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div key={star} className="w-3 h-3 bg-amber-400 dark:bg-amber-500 rounded-full"></div>
                ))}
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
