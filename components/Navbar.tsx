import React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X } from "lucide-react";
import Link from "next/link";

import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

const Navbar = () => {
  const [isDark, setIsDark] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <header className="border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-500 dark:bg-violet-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CC</span>
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-gray-100">
                CaptionChecker
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDark(!isDark)}
              className="text-slate-900 dark:text-gray-100"
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            <Link href="/pricing">
              <Button
                variant="ghost"
                className="text-slate-900 dark:text-gray-100"
              >
                Pricing
              </Button>
            </Link>

            {!session ? (
              <>
                <Link href="/auth/login">
                  <Button
                    variant="ghost"
                    className="text-slate-900 dark:text-gray-100"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="bg-indigo-500 hover:bg-indigo-600 dark:bg-violet-500 dark:hover:bg-violet-600 text-white">
                    Start Free
                  </Button>
                </Link>
              </>
            ) : (
              <div className="relative group flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-indigo-500 dark:bg-violet-500 flex items-center justify-center text-white font-semibold text-sm cursor-pointer">
                  {(session?.user.fullName ||
                    session?.user.email)[0]?.toUpperCase()}
                </div>
                {/* <div className="absolute right-10 top-12 z-10 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 text-slate-900 dark:text-gray-100 rounded-md shadow-md px-4 py-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                  <div>
                    <strong>Name:</strong> {session?.user.fullName || "N/A"}
                  </div>
                  <div>
                    <strong>Email:</strong> {session?.user.email}
                  </div>
                  <div>
                    <strong>User Verified:</strong>{" "}
                    {session?.user.verified ? "Verified" : "Not Verified"}
                  </div>
                </div> */}
                <Button
                  variant="link"
                  className="text-slate-900 dark:text-gray-100"
                  onClick={() => signOut({ callbackUrl: "/auth/login" })}
                >
                  Logout
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-900 dark:text-gray-100"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 space-y-2">
            <div className="flex items-center flex-col space-x-2">
              {/* <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDark(!isDark)}
                className="text-slate-900 dark:text-gray-100"
              >
                {isDark ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button> */}
              <Link href="/pricing">
                <Button
                  variant="ghost"
                  className="text-slate-900 dark:text-gray-100"
                >
                  Pricing
                </Button>
              </Link>
            </div>

            {!session ? (
              <>
                <Link href="/auth/login">
                  <Button
                    variant="ghost"
                    className="w-full text-slate-900 dark:text-gray-100"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="w-full mb-4 bg-indigo-500 hover:bg-indigo-600 dark:bg-violet-500 dark:hover:bg-violet-600 text-white">
                    Start Free
                  </Button>
                </Link>
              </>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-500 dark:bg-violet-500 flex items-center justify-center text-white font-semibold text-sm">
                    {(session?.user.fullName ||
                      session?.user.email)[0]?.toUpperCase()}
                  </div>
                  {/* <span className="text-slate-900 dark:text-gray-100 font-medium">
                    {session?.user.fullName || session?.user.email}
                  </span> */}
                </div>
                <Button
                  variant="ghost"
                  className="w-full text-slate-900 dark:text-gray-100"
                  onClick={() => signOut({ callbackUrl: "/auth/login" })}
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
