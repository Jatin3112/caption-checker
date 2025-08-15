"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import {
  Check,
  Sparkle,
  Star,
  Zap,
  Crown,
  Sparkles,
  Users,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import axios from "axios";
import { loadRazorpayScript } from "@/lib/razorpay";
import { useSession } from "next-auth/react";

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
  features: string[];
  popular?: boolean;
  cta: string;
}

const plans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for trying out CaptionChecker",
    monthlyPrice: 99,
    icon: <Sparkle className="h-6 w-6" />,
    features: [
      "10 caption analyses per month",
      "3 image caption generations per month",
      "Advanced AI scoring (all metrics)",
      "2 improved captions per analysis",
      "Basic hashtag suggestions",
      // "Caption history (30 days)",
    ],
    cta: "Get Started - ₹99",
  },
  {
    id: "vision",
    name: "Vision",
    description: "Perfect for trying out CaptionChecker",
    monthlyPrice: 149,
    badge: "Innovated",
    badgeColor: "bg-green-500 dark:bg-green-400",
    icon: <Sparkles className="h-6 w-6" />,
    features: [
      "20 caption analyses per month",
      "10 image caption generations per month",
      "Advanced AI scoring (all metrics)",
      "2 improved captions per analysis",
      "Basic hashtag suggestions",
      // "Caption history (30 days)",
    ],
    cta: "Get Started - ₹99",
  },
  {
    id: "popular",
    name: "Popular",
    description: "Most chosen by content creators",
    monthlyPrice: 499,
    icon: <Zap className="h-6 w-6" />,
    badge: "Most Popular",
    badgeColor: "bg-pink-500 dark:bg-pink-400",
    popular: true,
    features: [
      "60 caption analyses per month",
      "30 image caption generations per month",
      "Advanced AI scoring (all metrics)",
      "3 improved captions per analysis",
      "Trending hashtags",
      // "Caption history (60 days)",
    ],
    cta: "Choose Popular - ₹499",
  },
  {
    id: "pro",
    name: "Pro",
    description: "For serious content creators",
    monthlyPrice: 999,
    icon: <Crown className="h-6 w-6" />,
    badge: "Best Value",
    badgeColor: "bg-amber-500 dark:bg-amber-400",
    features: [
      "150 caption analyses per month",
      "60 image caption generations per month",
      "Advanced AI scoring (all metrics)",
      "4 improved captions per analysis",
      "Trending hashtags",
      // "Caption history (90 days)",
    ],
    cta: "Go Pro - ₹999",
  },
];

const planPrices: Record<string, number> = {
  starter: 99,
  vision: 149,
  popular: 499,
  pro: 999,
};

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const { data: session, update } = useSession();

  const handlePlanSelect = async (planId: string) => {
    if (planId === "free") {
      router.push("/auth/signup");
      return;
    }

    if (!session) {
      router.push("/auth/login");
      return;
    }
    const amount = planPrices[planId];
    if (!amount) return toast.error("Invalid plan selected");

    setSelectedPlan(planId);
    setIsProcessing(true);

    const razorpayLoaded = await loadRazorpayScript();
    if (!razorpayLoaded) {
      toast.error("Razorpay SDK failed to load.");
      setIsProcessing(false);
      return;
    }

    try {
      // Create order using Axios
      const orderResponse = await axios.post("/api/purchase-plan", { amount });
      const order = orderResponse.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: order.amount,
        currency: "INR",
        name: "Caption Checker",
        description: `Purchase ${planId} Plan`,
        order_id: order.id,
        handler: async function (response: any) {
          // Update plan using Axios
          await axios.post("/api/update-plan", {
            userId: session.user._id,
            planId,
            paymentId: response.razorpay_payment_id,
          });
          await update();

          router.push("/payment/success");
        },
        prefill: {
          name: session.user.fullName,
          email: session.user.email,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error("Payment failed:", error?.response?.data || error.message);
      alert("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const getPrice = (plan: PricingPlan) => {
    return plan.monthlyPrice;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Header */}
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-gray-100 mb-6">
            Choose Your Plan 💎
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto mb-8">
            Affordable pricing for Indian creators. Start with just ₹99 and
            scale as you grow. All plans include our core AI-powered caption
            analysis.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 transition-all duration-300 hover:shadow-lg ${
                plan.popular
                  ? "ring-2 ring-indigo-500 dark:ring-violet-500 scale-105"
                  : ""
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge
                    className={`${plan.badgeColor} text-white border-0 px-3 py-1`}
                  >
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div
                    className={`p-3 rounded-full ${
                      plan.popular
                        ? "bg-indigo-100 dark:bg-violet-900/30 text-indigo-500 dark:text-violet-400"
                        : "bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {plan.icon}
                  </div>
                </div>
                <CardTitle className="text-2xl text-slate-900 dark:text-gray-100">
                  {plan.name}
                </CardTitle>
                <p className="text-gray-500 dark:text-gray-400">
                  {plan.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Pricing */}
                <div className="text-center">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-slate-900 dark:text-gray-100">
                      ₹{getPrice(plan)}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 ml-2">
                      /month
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 dark:text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button
                  onClick={() => handlePlanSelect(plan.id)}
                  disabled={isProcessing && selectedPlan === plan.id}
                  className={`w-full ${
                    plan.popular
                      ? "bg-indigo-500 hover:bg-indigo-600 dark:bg-violet-500 dark:hover:bg-violet-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-gray-100"
                  }`}
                >
                  {isProcessing && selectedPlan === plan.id ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    plan.cta
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-gray-100 text-center mb-8">
            Compare All Features
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-700">
                  <th className="text-left py-4 text-slate-900 dark:text-gray-100">
                    Features
                  </th>
                  <th className="text-center py-4 text-slate-900 dark:text-gray-100">
                    Starter
                  </th>
                  <th className="text-center py-4 text-slate-900 dark:text-gray-100">
                    Vision
                  </th>
                  <th className="text-center py-4 text-slate-900 dark:text-gray-100">
                    Popular
                  </th>
                  <th className="text-center py-4 text-slate-900 dark:text-gray-100">
                    Pro
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-gray-100 dark:border-slate-800">
                  <td className="py-4 text-gray-600 dark:text-gray-300">
                    Caption Analyses
                  </td>
                  <td className="text-center py-4">10/month</td>
                  <td className="text-center py-4">10/month</td>
                  <td className="text-center py-4">60/month</td>
                  <td className="text-center py-4">150/month</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-slate-800">
                  <td className="py-4 text-gray-600 dark:text-gray-300">
                    Image Caption Generations
                  </td>
                  <td className="text-center py-4">3/month</td>
                  <td className="text-center py-4">10/month</td>
                  <td className="text-center py-4">20/month</td>
                  <td className="text-center py-4">50/month</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-slate-800">
                  <td className="py-4 text-gray-600 dark:text-gray-300">
                    Improved Captions
                  </td>
                  <td className="text-center py-4">2</td>
                  <td className="text-center py-4">2</td>
                  <td className="text-center py-4">3</td>
                  <td className="text-center py-4">5</td>
                </tr>
                {/* <tr className="border-b border-gray-100 dark:border-slate-800">
                  <td className="py-4 text-gray-600 dark:text-gray-300">
                    Caption History
                  </td>
                  <td className="text-center py-4">30 days</td>
                  <td className="text-center py-4">60 days</td>
                  <td className="text-center py-4">90 days</td>
                </tr> */}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="text-center mb-16">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-gray-100 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-left">
              <h3 className="font-semibold text-slate-900 dark:text-gray-100 mb-2">
                Can I change plans anytime?
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Yes! You can upgrade or downgrade your plan at any time. Changes
                take effect immediately.
              </p>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-slate-900 dark:text-gray-100 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Try it out! Your first 3 caption requests and one image caption
                generation are on us — no payment needed.
              </p>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-slate-900 dark:text-gray-100 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                We accept all major payment methods, including UPI, credit
                cards, and debit cards.
              </p>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-slate-900 dark:text-gray-100 mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Yes! We offer a 30-day money-back guarantee on all paid plans.
              </p>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center justify-center space-x-3">
              <Users className="h-8 w-8 text-indigo-500 dark:text-violet-500" />
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-gray-100">
                  1K+
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Indian Creators
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <TrendingUp className="h-8 w-8 text-pink-500 dark:text-pink-400" />
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-gray-100">
                  50K+
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
                  4.8/5
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  User Rating
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
