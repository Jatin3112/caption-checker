"use client";

import type React from "react";

import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  CreditCard,
  Lock,
  Shield,
  Check,
  Calendar,
  User,
  Mail,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";

function PaymentContent() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
    email: "",
    billingAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "US",
    },
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "pro";
  const billing = searchParams.get("billing") || "monthly";

  const planDetails = {
    starter: {
      name: "Starter Plan",
      monthlyPrice: 100,
      yearlyPrice: 100,
      features: ["10 caption analyses", "3 improved captions", "Email support"],
    },
    popular: {
      name: "Popular Plan",
      monthlyPrice: 500,
      yearlyPrice: 500,
      features: ["60 caption analyses", "Priority support", "Export features"],
    },
    pro: {
      name: "Pro Plan",
      monthlyPrice: 1000,
      yearlyPrice: 1000,
      features: [
        "150 caption analyses",
        "Advanced analytics",
        "Unlimited history",
      ],
    },
  };

  const currentPlan =
    planDetails[plan as keyof typeof planDetails] || planDetails.pro;
  const price =
    billing === "yearly" ? currentPlan.yearlyPrice : currentPlan.monthlyPrice;
  const savings =
    billing === "yearly"
      ? currentPlan.monthlyPrice * 12 - currentPlan.yearlyPrice
      : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Redirect to success page
    router.push("/payment/success");
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Form */}
        <div className="space-y-6">
          <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-gray-100 flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-slate-900 dark:text-gray-100"
                  >
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={paymentData.email}
                      onChange={(e) =>
                        setPaymentData({
                          ...paymentData,
                          email: e.target.value,
                        })
                      }
                      className="pl-10 bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="cardNumber"
                    className="text-slate-900 dark:text-gray-100"
                  >
                    Card Number
                  </Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                    <Input
                      id="cardNumber"
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={paymentData.cardNumber}
                      onChange={(e) =>
                        setPaymentData({
                          ...paymentData,
                          cardNumber: formatCardNumber(e.target.value),
                        })
                      }
                      className="pl-10 bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600"
                      maxLength={19}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="expiryDate"
                      className="text-slate-900 dark:text-gray-100"
                    >
                      Expiry Date
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                      <Input
                        id="expiryDate"
                        type="text"
                        placeholder="MM/YY"
                        value={paymentData.expiryDate}
                        onChange={(e) =>
                          setPaymentData({
                            ...paymentData,
                            expiryDate: formatExpiryDate(e.target.value),
                          })
                        }
                        className="pl-10 bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600"
                        maxLength={5}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="cvv"
                      className="text-slate-900 dark:text-gray-100"
                    >
                      CVV
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                      <Input
                        id="cvv"
                        type="text"
                        placeholder="123"
                        value={paymentData.cvv}
                        onChange={(e) =>
                          setPaymentData({
                            ...paymentData,
                            cvv: e.target.value.replace(/\D/g, ""),
                          })
                        }
                        className="pl-10 bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600"
                        maxLength={4}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="cardName"
                    className="text-slate-900 dark:text-gray-100"
                  >
                    Cardholder Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                    <Input
                      id="cardName"
                      type="text"
                      placeholder="John Doe"
                      value={paymentData.cardName}
                      onChange={(e) =>
                        setPaymentData({
                          ...paymentData,
                          cardName: e.target.value,
                        })
                      }
                      className="pl-10 bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600"
                      required
                    />
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h3 className="font-medium text-slate-900 dark:text-gray-100">
                    Billing Address
                  </h3>

                  <div className="space-y-2">
                    <Label
                      htmlFor="street"
                      className="text-slate-900 dark:text-gray-100"
                    >
                      Street Address
                    </Label>
                    <Input
                      id="street"
                      type="text"
                      placeholder="123 Main St"
                      value={paymentData.billingAddress.street}
                      onChange={(e) =>
                        setPaymentData({
                          ...paymentData,
                          billingAddress: {
                            ...paymentData.billingAddress,
                            street: e.target.value,
                          },
                        })
                      }
                      className="bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="city"
                        className="text-slate-900 dark:text-gray-100"
                      >
                        City
                      </Label>
                      <Input
                        id="city"
                        type="text"
                        placeholder="New York"
                        value={paymentData.billingAddress.city}
                        onChange={(e) =>
                          setPaymentData({
                            ...paymentData,
                            billingAddress: {
                              ...paymentData.billingAddress,
                              city: e.target.value,
                            },
                          })
                        }
                        className="bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="state"
                        className="text-slate-900 dark:text-gray-100"
                      >
                        State
                      </Label>
                      <Input
                        id="state"
                        type="text"
                        placeholder="NY"
                        value={paymentData.billingAddress.state}
                        onChange={(e) =>
                          setPaymentData({
                            ...paymentData,
                            billingAddress: {
                              ...paymentData.billingAddress,
                              state: e.target.value,
                            },
                          })
                        }
                        className="bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="zipCode"
                      className="text-slate-900 dark:text-gray-100"
                    >
                      ZIP Code
                    </Label>
                    <Input
                      id="zipCode"
                      type="text"
                      placeholder="10001"
                      value={paymentData.billingAddress.zipCode}
                      onChange={(e) =>
                        setPaymentData({
                          ...paymentData,
                          billingAddress: {
                            ...paymentData.billingAddress,
                            zipCode: e.target.value,
                          },
                        })
                      }
                      className="bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-indigo-500 hover:bg-indigo-600 dark:bg-violet-500 dark:hover:bg-violet-600 text-white py-3"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Complete Payment
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-gray-100">
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-slate-900 dark:text-gray-100">
                    {currentPlan.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Billed {billing === "yearly" ? "annually" : "monthly"}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-900 dark:text-gray-100">
                    ₹{price}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    /month
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium text-slate-900 dark:text-gray-100">
                  What's included:
                </h4>
                {currentPlan.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center text-sm text-gray-600 dark:text-gray-300"
                  >
                    <Check className="h-4 w-4 text-green-500 dark:text-green-400 mr-2" />
                    {feature}
                  </div>
                ))}
              </div>

              <Separator />

              <div className="flex justify-between items-center font-medium">
                <span className="text-slate-900 dark:text-gray-100">Total</span>
                <span className="text-2xl text-slate-900 dark:text-gray-100">
                  ₹{price}
                </span>
              </div>

              {/* Security Notice */}
            </CardContent>
          </Card>

          {/* Security Notice */}
          <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-green-500 dark:text-green-400 mt-0.5" />
                <div>
                  <h3 className="font-medium text-slate-900 dark:text-gray-100 text-sm">
                    Secure Payment
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Your payment information is encrypted and secure. We never
                    store your card details.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Money Back Guarantee */}
          <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Check className="h-6 w-6 text-green-500 dark:text-green-400" />
                </div>
                <h3 className="font-medium text-slate-900 dark:text-gray-100 text-sm">
                  30-Day Money Back Guarantee
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Not satisfied? Get a full refund within 30 days, no questions
                  asked.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
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
        <PaymentContent />
      </Suspense>
    </div>
  );
}
