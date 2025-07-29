"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Chrome,
  CheckCircle,
  Check,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "@/components/Navbar";
import toast from "react-hot-toast";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Calculate password strength
    const password = formData.password;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  }, [formData.password]);

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords don't match!");
        return;
      }

      setIsLoading(true);

      // Simulate API call
      await axios.post("/api/signup", {
        fullName: formData.name,
        email: formData.email,
        password: formData.password,
      });

      toast.success("User created successfully.");
      toast.success("Please verify your email");
      router.push("/auth/login");
    } catch (error) {
      alert("Error creating a user");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    // Simulate Google OAuth
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push("/checker");
    setIsLoading(false);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-pink-500 dark:bg-pink-400";
    if (passwordStrength <= 3) return "bg-amber-500 dark:bg-amber-400";
    return "bg-green-500 dark:bg-green-400";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return "Weak";
    if (passwordStrength <= 3) return "Medium";
    return "Strong";
  };

  const passwordRequirements = [
    { text: "At least 8 characters", met: formData.password.length >= 8 },
    { text: "One uppercase letter", met: /[A-Z]/.test(formData.password) },
    { text: "One lowercase letter", met: /[a-z]/.test(formData.password) },
    { text: "One number", met: /[0-9]/.test(formData.password) },
    {
      text: "One special character",
      met: /[^A-Za-z0-9]/.test(formData.password),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Header */}
      <Navbar />

      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Welcome Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-gray-100">
              Join CaptionChecker! 🚀
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Create your account and start writing viral captions
            </p>
          </div>

          <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center text-slate-900 dark:text-gray-100">
                Create Account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Google Signup */}
              {/* <Button
                variant="outline"
                className="w-full border-gray-300 dark:border-slate-600 text-slate-900 dark:text-gray-100 bg-transparent hover:bg-gray-50 dark:hover:bg-slate-700"
                onClick={handleGoogleSignup}
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
                    Or create with email
                  </span>
                </div>
              </div> */}

              {/* Signup Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-slate-900 dark:text-gray-100"
                  >
                    Full name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="pl-10 bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-slate-900 dark:text-gray-100"
                      required
                    />
                  </div>
                </div>

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
                      placeholder="Create a password"
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
                  {formData.password && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400">
                          Password strength
                        </span>
                        <span
                          className={`font-medium ${getPasswordStrengthColor().replace(
                            "bg-",
                            "text-"
                          )}`}
                        >
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                          style={{ width: `${(passwordStrength / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-slate-900 dark:text-gray-100"
                  >
                    Confirm password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="pl-10 pr-10 bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-slate-900 dark:text-gray-100"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 text-gray-400 dark:text-gray-500 hover:text-slate-900 dark:hover:text-gray-100"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {formData.confirmPassword &&
                    formData.password !== formData.confirmPassword && (
                      <p className="text-xs text-pink-500 dark:text-pink-400">
                        Passwords don't match
                      </p>
                    )}
                  {formData.confirmPassword &&
                    formData.password === formData.confirmPassword &&
                    formData.password && (
                      <p className="text-xs text-green-500 dark:text-green-400 flex items-center">
                        <Check className="h-3 w-3 mr-1" />
                        Passwords match
                      </p>
                    )}
                </div>

                {/* Password Requirements */}
                {formData.password && (
                  <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg space-y-2">
                    <h4 className="text-sm font-medium text-slate-900 dark:text-gray-100">
                      Password Requirements:
                    </h4>
                    <div className="space-y-1">
                      {passwordRequirements.map((req, index) => (
                        <div key={index} className="flex items-center text-xs">
                          <div
                            className={`w-3 h-3 rounded-full mr-2 flex items-center justify-center ${
                              req.met
                                ? "bg-green-500 dark:bg-green-400"
                                : "bg-gray-300 dark:bg-gray-600"
                            }`}
                          >
                            {req.met && (
                              <CheckCircle className="h-2 w-2 text-white" />
                            )}
                          </div>
                          <span
                            className={
                              req.met
                                ? "text-green-600 dark:text-green-400"
                                : "text-gray-500 dark:text-gray-400"
                            }
                          >
                            {req.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-indigo-500 hover:bg-indigo-600 dark:bg-violet-500 dark:hover:bg-violet-600 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>

              <div className="text-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link
                    href="/auth/login"
                    className="text-indigo-500 dark:text-violet-500 hover:text-indigo-600 dark:hover:text-violet-600 font-medium"
                  >
                    Sign in
                  </Link>
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-4">
            <h3 className="font-medium text-slate-900 dark:text-gray-100 mb-3">
              What you'll get:
            </h3>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Check className="h-4 w-4 text-green-500 dark:text-green-400 mr-2" />
                Unlimited caption analysis
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Check className="h-4 w-4 text-green-500 dark:text-green-400 mr-2" />
                3 AI-improved versions per caption
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Check className="h-4 w-4 text-green-500 dark:text-green-400 mr-2" />
                Caption history and analytics
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Check className="h-4 w-4 text-green-500 dark:text-green-400 mr-2" />
                Priority customer support
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              🔒 Your data is secure and encrypted
            </p>
            {/* <div className="flex justify-center items-center space-x-4 mt-2">
              <span className="text-xs text-gray-400 dark:text-gray-500">Join 10K+ creators</span>
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
