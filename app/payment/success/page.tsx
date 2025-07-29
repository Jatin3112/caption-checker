"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Moon, Sun, CheckCircle, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Header */}
      <Navbar />

      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md text-center">
          <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <CheckCircle className="h-20 w-20 text-green-500 dark:text-green-400" />
                  <div className="absolute -top-2 -right-2">
                    <Sparkles className="h-8 w-8 text-amber-500 dark:text-amber-400" />
                  </div>
                </div>
              </div>
              <CardTitle className="text-2xl text-slate-900 dark:text-gray-100">
                Payment Successful! 🎉
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-500 dark:text-gray-400">
                Welcome to CaptionChecker Pro! Your account has been upgraded
                and you now have access to all premium features.
              </p>

              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <h3 className="font-medium text-green-800 dark:text-green-400 mb-2">
                  What's Next?
                </h3>
                <ul className="text-sm text-green-700 dark:text-green-300 space-y-1 text-left">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Start analyzing captions with unlimited access
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Get 3 AI-improved versions per caption
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Access your caption history & analytics
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Priority customer support
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <Link href="/checker">
                  <Button className="w-full bg-indigo-500 hover:bg-indigo-600 dark:bg-violet-500 dark:hover:bg-violet-600 text-white">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Start Creating Viral Captions
                  </Button>
                </Link>
                <Link href="/">
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 dark:border-slate-600 text-slate-900 dark:text-gray-100 bg-transparent"
                  >
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Back to Home
                  </Button>
                </Link>
              </div>

              <div className="text-center pt-4 border-t border-gray-200 dark:border-slate-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Receipt sent to your email • Need help? Contact support
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
