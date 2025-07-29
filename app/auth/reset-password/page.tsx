"use client";

import type React from "react";

import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Eye,
  EyeOff,
  Lock,
  CheckCircle,
  AlertCircle,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Navbar from "@/components/Navbar";
import toast from "react-hot-toast";

function ResetPasswordContent() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  //Check this
  useEffect(() => {
    // Validate token on component mount
    const validateToken = async () => {
      if (!token) {
        setIsValidToken(false);
        setError("Invalid or missing reset token");
        return;
      }

      // Simulate token validation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock token validation - in real app, this would be an API call
      const isValid = token.length > 10; // Simple mock validation
      setIsValidToken(isValid);

      if (!isValid) {
        setError("This password reset link is invalid or has expired");
      }
    };

    validateToken();
  }, [token]);

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
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call to reset password

      await axios.post("/api/reset-password", {
        token,
        newPassword: formData.password,
      });

      setIsSuccess(true);
    } catch (err) {
      setError("Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
      toast.success("Password resetted successfully");
    }
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

  if (isValidToken === null) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-indigo-500 dark:border-violet-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">
            Validating reset link...
          </p>
        </div>
      </div>
    );
  }

  if (isValidToken === false) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <AlertCircle className="h-16 w-16 text-pink-500 dark:text-pink-400" />
              </div>
              <CardTitle className="text-2xl text-slate-900 dark:text-gray-100">
                Invalid Reset Link
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                This password reset link is invalid or has expired. Please
                request a new one.
              </p>
              <div className="space-y-2">
                <Link href="/auth/forgot-password">
                  <Button className="mb-2 text-white w-full bg-indigo-500 hover:bg-indigo-600 dark:bg-violet-500 dark:hover:bg-violet-600">
                    Request New Reset Link
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 dark:border-slate-600 text-slate-900 dark:text-gray-100 bg-transparent"
                  >
                    Back to Sign In
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl text-slate-900 dark:text-gray-100">
                Password Reset Successful! 🎉
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Your password has been successfully reset. You can now sign in
                with your new password.
              </p>
              <div className="space-y-2">
                <Link href="/auth/login">
                  <Button className="w-full mb-2 text-white bg-indigo-500 hover:bg-indigo-600 dark:bg-violet-500 dark:hover:bg-violet-600">
                    Sign In Now
                  </Button>
                </Link>
                <Link href="/">
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 dark:border-slate-600 text-slate-900 dark:text-gray-100 bg-transparent"
                  >
                    Back to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12 text-indigo-500 dark:text-violet-500" />
            </div>
            <CardTitle className="text-2xl text-slate-900 dark:text-gray-100">
              Reset Your Password 🔐
            </CardTitle>
            <p className="text-gray-500 dark:text-gray-400">
              Enter your new password below. Make sure it's strong and secure!
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert className="border-pink-200 dark:border-pink-800 bg-pink-50 dark:bg-pink-900/20">
                <AlertCircle className="h-4 w-4 text-pink-500 dark:text-pink-400" />
                <AlertDescription className="text-pink-700 dark:text-pink-400">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-slate-900 dark:text-gray-100"
                >
                  New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your new password"
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
                  <div className="space-y-2">
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
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
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
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                    <p className="text-xs text-pink-500 dark:text-pink-400 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Passwords don't match
                    </p>
                  )}
                {formData.confirmPassword &&
                  formData.password === formData.confirmPassword &&
                  formData.password && (
                    <p className="text-xs text-green-500 dark:text-green-400 flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" />
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
                disabled={
                  isLoading || formData.password !== formData.confirmPassword
                }
              >
                {isLoading ? "Resetting Password..." : "Reset Password"}
              </Button>
            </form>

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

        {/* Security Notice */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-indigo-500 dark:text-violet-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-slate-900 dark:text-gray-100 text-sm">
                Security Tips
              </h3>
              <ul className="text-xs text-gray-500 dark:text-gray-400 mt-1 space-y-1">
                <li>• Use a unique password you haven't used elsewhere</li>
                <li>• Consider using a password manager</li>
                <li>• Don't share your password with anyone</li>
                <li>
                  • Sign out of all devices if you suspect unauthorized access
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Header */}
      <Navbar />

      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
            <div className="animate-spin h-12 w-12 border-4 border-indigo-500 dark:border-violet-500 border-t-transparent rounded-full"></div>
          </div>
        }
      >
        <ResetPasswordContent />
      </Suspense>
    </div>
  );
}
