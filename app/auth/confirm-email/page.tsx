"use client";

import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, CheckCircle, AlertCircle, RefreshCw, Clock } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import axios from "axios";
import toast from "react-hot-toast";

function EmailConfirmationContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [error, setError] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const updateSessionUserData = () => {
    const userDataRaw = sessionStorage.getItem("userData");
    if (userDataRaw) {
      const userData = JSON.parse(userDataRaw);
      userData.verified = true;
      sessionStorage.setItem("userData", JSON.stringify(userData));
    }
  };

  useEffect(() => {
    // Confirm email on component mount
    const confirmEmail = async () => {
      if (!token) {
        setError("Invalid or missing confirmation token");
        setIsLoading(false);
        return;
      }

      try {
        // API call to confirm email
        const res = await axios.post("/api/confirm-email", { token });
        if (res.status === 200) {
          setIsConfirmed(true);
          updateSessionUserData();
        } else {
          setError("This email confirmation link is invalid or has expired");
        }
      } catch (err) {
        setError("Failed to confirm email. Please try again.");
      } finally {
        setIsLoading(false);
        setTimeout(() => {
          router.push("/checker");
        }, 2000);
      }
    };

    confirmEmail();
  }, [token]);

  useEffect(() => {
    // Countdown timer for resend cooldown
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResendEmail = async () => {
    setIsResending(true);
    setError("");
    try {
      const userId = sessionStorage.getItem("userId");
      const res = await axios.post("/api/resend-confirm-email", {
        userId,
      });

      if (res.status === 200 && res.data.alreadyVerified) {
        updateSessionUserData();
        toast.success("User Already Verified");
        setIsConfirmed(true);
        return;
      }

      if (res.status === 200) {
        setResendCooldown(60);
      } else {
        setError("Failed to resend email. Please try again.");
      }
    } catch (err: any) {
      console.error("Resend error:", err);
      setError(
        err?.response?.data?.error ||
          "Failed to resend email. Please try again."
      );
    } finally {
      setIsResending(false);
      setIsLoading(false);
      setTimeout(() => {
        router.push("/checker");
      }, 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-indigo-500 dark:border-violet-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">
            Confirming your email...
          </p>
        </div>
      </div>
    );
  }

  if (isConfirmed) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <CheckCircle className="h-16 w-16 text-green-500 dark:text-green-400" />
                  <div className="absolute -top-1 -right-1">
                    <div className="w-6 h-6 bg-green-500 dark:bg-green-400 rounded-full flex items-center justify-center">
                      <Mail className="h-3 w-3 text-white" />
                    </div>
                  </div>
                </div>
              </div>
              <CardTitle className="text-2xl text-slate-900 dark:text-gray-100">
                Email Confirmed! 🎉
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <div className="space-y-2">
                <p className="text-gray-500 dark:text-gray-400">
                  Great! Your email address has been successfully verified.
                </p>
                {email && (
                  <p className="text-sm font-medium text-slate-900 dark:text-gray-100 bg-gray-50 dark:bg-slate-700 p-3 rounded-lg">
                    {email}
                  </p>
                )}
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <h3 className="font-medium text-green-800 dark:text-green-400 mb-2">
                  What's Next?
                </h3>
                <ul className="text-sm text-green-700 dark:text-green-300 space-y-1 text-left">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Access all premium features
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Unlimited caption analysis
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Priority customer support
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Caption history & analytics
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Welcome Tips */}
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-4">
            <h3 className="font-medium text-slate-900 dark:text-gray-100 mb-3 flex items-center">
              <Mail className="h-4 w-4 mr-2 text-indigo-500 dark:text-violet-500" />
              Quick Start Tips
            </h3>
            <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <p>
                • Start by analyzing your first caption in the Caption Checker
              </p>
              <p>• Save your favorite improved captions for future reference</p>
              <p>• Check out our trending hashtag suggestions</p>
              <p>• Join our community for daily caption inspiration</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="h-16 w-16 text-pink-500 dark:text-pink-400" />
            </div>
            <CardTitle className="text-2xl text-slate-900 dark:text-gray-100">
              Email Confirmation Failed
            </CardTitle>
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

            <div className="text-center space-y-4">
              <p className="text-gray-500 dark:text-gray-400">
                This email confirmation link is invalid or has expired. You can
                request a new confirmation email below.
              </p>

              {email && (
                <div className="bg-gray-50 dark:bg-slate-700 p-3 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Confirming email for:
                  </p>
                  <p className="font-medium text-slate-900 dark:text-gray-100">
                    {email}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <Button
                  onClick={handleResendEmail}
                  disabled={isResending || resendCooldown > 0}
                  className="w-full mb-2 bg-indigo-500 hover:bg-indigo-600 dark:bg-violet-500 dark:hover:bg-violet-600 text-white"
                >
                  {isResending ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : resendCooldown > 0 ? (
                    <>
                      <Clock className="mr-2 h-4 w-4" />
                      Resend in {resendCooldown}s
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Resend Confirmation Email
                    </>
                  )}
                </Button>

                <Link href="/auth/signup">
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 dark:border-slate-600 text-slate-900 dark:text-gray-100 bg-transparent"
                  >
                    Create New Account
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ConfirmEmailPage() {
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
        <EmailConfirmationContent />
      </Suspense>
    </div>
  );
}
