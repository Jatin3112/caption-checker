"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Moon,
  Sun,
  ArrowRight,
  Play,
  Star,
  Users,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
import Navbar from "@/components/Navbar";

const heroOptions = [
  {
    headline: "🚀 Make Your Captions Trend-Worthy in Seconds",
    subheadline:
      "AI scores your caption for hooks, clarity, hashtags & CTAs — then gives you 3 viral-style improvements, emojis included.",
  },
  {
    headline: "Are Your Captions Killing Your Reach? 😬",
    subheadline:
      "Get AI-powered feedback on your captions and unlock 3 viral-ready versions — complete with emojis, CTAs, and trending formats.",
  },
  {
    headline: "Write Captions Like Top Creators — Without Overthinking. 🤔",
    subheadline:
      "Our AI checks clarity, grammar, hooks, hashtags, and more. Get 3 viral-style captions instantly. Grow faster, post smarter.",
  },
];

export default function HomePage() {
  const [currentHero, setCurrentHero] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroOptions.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 min-h-[120px] flex flex-col justify-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-gray-100 mb-6 transition-all duration-500">
              {heroOptions[currentHero].headline}
            </h1>
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto transition-all duration-500">
              {heroOptions[currentHero].subheadline}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/checker">
              <Button
                size="lg"
                className="bg-indigo-500 hover:bg-indigo-600 dark:bg-violet-500 dark:hover:bg-violet-600 text-white px-8 py-4 text-lg"
              >
                <Play className="mr-2 h-5 w-5" />
                Check My Caption
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg border-gray-300 dark:border-slate-600 text-slate-900 dark:text-gray-100 bg-transparent"
            >
              <ArrowRight className="mr-2 h-5 w-5" />
              See Examples
            </Button>
          </div>

          {/* Hero indicators */}
          <div className="flex justify-center space-x-2 mb-12">
            {heroOptions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentHero(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentHero
                    ? "bg-indigo-500 dark:bg-violet-500"
                    : "bg-gray-300 dark:bg-slate-600"
                }`}
              />
            ))}
          </div>

          {/* Preview Card */}
          <Card className="max-w-2xl mx-auto bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
            <CardContent className="p-8">
              <div className="text-left space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900 dark:text-gray-100">
                    Caption Analysis Preview
                  </h3>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-pink-500 dark:bg-pink-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-amber-500 dark:bg-amber-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full"></div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Original Caption:
                  </p>
                  <p className="text-slate-900 dark:text-gray-100">
                    "Check out this amazing workout routine!"
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-500 dark:text-amber-400">
                      6/10
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Hook Strength
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500 dark:text-green-400">
                      9/10
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Grammar
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-pink-500 dark:text-pink-400">
                      5/10
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Hashtags
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              ✅ Trusted by creators across Instagram, YouTube, TikTok
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-center justify-center space-x-3">
                <Users className="h-8 w-8 text-indigo-500 dark:text-violet-500" />
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-gray-100">
                    10K+
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Active Users
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <TrendingUp className="h-8 w-8 text-pink-500 dark:text-pink-400" />
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-gray-100">
                    2M+
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Captions Analyzed
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <Star className="h-8 w-8 text-amber-500 dark:text-amber-400" />
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-gray-100">
                    4.9/5
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    User Rating
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
