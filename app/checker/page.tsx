"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Copy, Check } from "lucide-react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import toast from "react-hot-toast";

interface CaptionAnalysis {
  original_analysis: {
    catchiness: number;
    grammar: number;
    clarity: number;
    hashtag_usage: number;
    hook_strength: number;
    cta_present: string;
    tone: string;
    suggestions: string[];
  };
  improved_captions: Array<{
    text: string;
    scores: {
      catchiness: number;
      grammar: number;
      clarity: number;
      hashtag_usage: number;
      hook_strength: number;
      cta_present: string;
      tone: string;
    };
  }>;
}

export default function CheckerPage() {
  const [caption, setCaption] = useState("");
  const [captionVibe, setCaptionVibe] = useState("");
  const [analysis, setAnalysis] = useState<CaptionAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [user, setUser] = useState<any>(null);
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);

  const handleCaptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 300) {
      setCaption(value);
    } else {
      toast.error("Caption maximum length reached");
    }
  };

  const analyzeCaption = async (caption: string) => {
    try {
      const userRes = await axios.get("/api/user");
      const currentUser = userRes.data.data;
      setUser(currentUser);

      if (!currentUser?.verified && currentUser.requests >= 1) {
        toast.error("Please verify your email id for further caption requests");
        return;
      }
      const response = await axios.post(
        "/api/analyze",
        { caption, captionVibe },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      toast.success("Captions generated successfully");
      return data;
    } catch (error: any) {
      console.log("Error", error);
      toast.error(
        error.response.data.error ||
          "Something went wrong in generating captions"
      );
      throw error;
    }
  };

  const handleAnalyze = async () => {
    if (!caption.trim()) return;

    setIsAnalyzing(true);
    try {
      const result = await analyzeCaption(caption);

      console.log("RESUOLT FROM AI", result);
      setAnalysis(result);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-500 dark:text-green-400";
    if (score >= 6) return "text-amber-500 dark:text-amber-400";
    return "text-pink-500 dark:text-pink-400";
  };

  const getProgressColor = (score: number) => {
    if (score >= 8) return "bg-green-500";
    if (score >= 6) return "bg-amber-500";
    return "bg-pink-500";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Header */}
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-gray-100 flex items-center">
                  <Sparkles className="mr-2 h-5 w-5 text-indigo-500 dark:text-violet-500" />
                  Enter Your Caption
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Paste your caption here... Include hashtags, emojis, and any CTAs you want analyzed!"
                  value={caption}
                  maxLength={301}
                  onChange={handleCaptionChange}
                  className="min-h-[200px] bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-slate-900 dark:text-gray-100"
                />

                {/* ✨ Add Caption Vibe Selector Here */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-gray-300">
                    Describe the vibe for the caption
                  </label>
                  <input
                    type="text"
                    value={captionVibe}
                    onChange={(e) => setCaptionVibe(e.target.value)}
                    placeholder="e.g. playful, sarcastic, educational..."
                    className="w-full rounded-md border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {caption.length} characters
                  </span>
                  <Button
                    onClick={handleAnalyze}
                    disabled={
                      !caption.trim() || !captionVibe.trim() || isAnalyzing
                    }
                    className="bg-indigo-500 hover:bg-indigo-600 dark:bg-violet-500 dark:hover:bg-violet-600 text-white"
                  >
                    {isAnalyzing ? "Analyzing..." : "Analyze Caption"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Original Analysis */}
            {analysis && (
              <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-gray-100">
                    Original Caption Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Catchiness
                        </span>
                        <span
                          className={`font-bold ${getScoreColor(
                            analysis.original_analysis.catchiness
                          )}`}
                        >
                          {analysis.original_analysis.catchiness}/10
                        </span>
                      </div>
                      <Progress
                        value={analysis.original_analysis.catchiness * 10}
                        className="h-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Grammar
                        </span>
                        <span
                          className={`font-bold ${getScoreColor(
                            analysis.original_analysis.grammar
                          )}`}
                        >
                          {analysis.original_analysis.grammar}/10
                        </span>
                      </div>
                      <Progress
                        value={analysis.original_analysis.grammar * 10}
                        className="h-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Clarity
                        </span>
                        <span
                          className={`font-bold ${getScoreColor(
                            analysis.original_analysis.clarity
                          )}`}
                        >
                          {analysis.original_analysis.clarity}/10
                        </span>
                      </div>
                      <Progress
                        value={analysis.original_analysis.clarity * 10}
                        className="h-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Hashtags
                        </span>
                        <span
                          className={`font-bold ${getScoreColor(
                            analysis.original_analysis.hashtag_usage
                          )}`}
                        >
                          {analysis.original_analysis.hashtag_usage}/10
                        </span>
                      </div>
                      <Progress
                        value={analysis.original_analysis.hashtag_usage * 10}
                        className="h-2"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-900 dark:text-gray-100">
                        Hook Strength
                      </span>
                      <span
                        className={`font-bold ${getScoreColor(
                          analysis.original_analysis.hook_strength
                        )}`}
                      >
                        {analysis.original_analysis.hook_strength}/10
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-900 dark:text-gray-100">
                        CTA Present
                      </span>
                      <Badge
                        variant={
                          analysis.original_analysis.cta_present === "Yes"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {analysis.original_analysis.cta_present}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-900 dark:text-gray-100">
                        Tone
                      </span>
                      <Badge
                        variant="outline"
                        className="border-indigo-500 dark:border-violet-500 text-indigo-500 dark:text-violet-500"
                      >
                        {analysis.original_analysis.tone}
                      </Badge>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                    <h4 className="font-medium text-slate-900 dark:text-gray-100 mb-2">
                      Suggestions for Improvement
                    </h4>
                    <ul className="space-y-1">
                      {(showAllSuggestions
                        ? analysis.original_analysis.suggestions
                        : analysis.original_analysis.suggestions.slice(0, 2)
                      ).map((suggestion, index) => (
                        <li
                          key={index}
                          className="text-sm text-gray-500 dark:text-gray-400 flex items-start"
                        >
                          <span className="text-indigo-500 dark:text-violet-500 mr-2">
                            •
                          </span>
                          {suggestion}
                        </li>
                      ))}

                      {analysis.original_analysis.suggestions.length > 2 && (
                        <button
                          className="text-xs text-indigo-600 dark:text-violet-400 hover:underline mt-1"
                          onClick={() =>
                            setShowAllSuggestions(!showAllSuggestions)
                          }
                        >
                          {showAllSuggestions ? "Show Less" : "Show More"}
                        </button>
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {analysis && (
              <>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-gray-100">
                  🔥 Improved Captions
                </h2>
                {analysis.improved_captions.map((improved, index) => (
                  <Card
                    key={index}
                    className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700"
                  >
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg text-slate-900 dark:text-gray-100">
                          Version {index + 1}
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(improved.text, index)}
                          className="text-gray-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-100"
                        >
                          {copiedIndex === index ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                        <p className="text-slate-900 dark:text-gray-100">
                          {improved.text}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center">
                          <div
                            className={`text-xl font-bold ${getScoreColor(
                              improved.scores.catchiness
                            )}`}
                          >
                            {improved.scores.catchiness}/10
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Catchiness
                          </div>
                        </div>
                        <div className="text-center">
                          <div
                            className={`text-xl font-bold ${getScoreColor(
                              improved.scores.hook_strength
                            )}`}
                          >
                            {improved.scores.hook_strength}/10
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Hook Strength
                          </div>
                        </div>
                        <div className="text-center">
                          <div
                            className={`text-xl font-bold ${getScoreColor(
                              improved.scores.clarity
                            )}`}
                          >
                            {improved.scores.clarity}/10
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Clarity
                          </div>
                        </div>
                        <div className="text-center">
                          <div
                            className={`text-xl font-bold ${getScoreColor(
                              improved.scores.hashtag_usage
                            )}`}
                          >
                            {improved.scores.hashtag_usage}/10
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Hashtags
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-slate-700">
                        <Badge
                          variant="outline"
                          className="border-pink-500 dark:border-pink-400 text-pink-500 dark:text-pink-400"
                        >
                          {improved.scores.tone}
                        </Badge>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Grammar: {improved.scores.grammar}/10
                        </span>
                        <div className="text-center">
                          <Badge
                            variant={
                              improved.scores.cta_present === "Yes"
                                ? "default"
                                : "secondary"
                            }
                          >
                            CTA: {improved.scores.cta_present}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}

            {!analysis && !isAnalyzing && (
              <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
                <CardContent className="p-12 text-center">
                  <Sparkles className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 dark:text-gray-100 mb-2">
                    Ready to Analyze Your Caption?
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Enter your caption on the left and click "Analyze Caption"
                    to get started!
                  </p>
                </CardContent>
              </Card>
            )}

            {isAnalyzing && (
              <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
                <CardContent className="p-12 text-center">
                  <div className="animate-spin h-12 w-12 border-4 border-indigo-500 dark:border-violet-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-gray-100 mb-2">
                    Analyzing Your Caption...
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Our AI is checking hooks, grammar, hashtags, and more!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
