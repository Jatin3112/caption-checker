import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  const [user, setUser] = useState<any>(null);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  useEffect(() => {
    const cachedUser = sessionStorage.getItem("userData");
    if (cachedUser) {
      setUser(JSON.parse(cachedUser));
    }
  }, []);

  useEffect(() => {
    const cachedUser = sessionStorage.getItem("userData");

    if (cachedUser) {
      setUser(JSON.parse(cachedUser));
    } else {
      const fetchUser = async () => {
        try {
          const res = await axios.get("/api/user");
          const userData = res.data.data;
          sessionStorage.setItem("userId", userData._id);
          sessionStorage.setItem("userData", JSON.stringify(userData));
          setUser(userData || null);
        } catch (err) {
          console.error("Failed to fetch user:", err);
        }
      };
      fetchUser();
    }
  }, []);

  const handleLogout = async () => {
    await axios.get("/api/logout");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("userData");
    window.location.reload();
  };
  return (
    <header className="border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
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

          <div className="flex items-center space-x-4">
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

            {!user ? (
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
              <>
                <div className="relative group flex items-center space-x-2">
                  {/* Circle with first initial */}
                  <div className="w-8 h-8 rounded-full bg-indigo-500 dark:bg-violet-500 flex items-center justify-center text-white font-semibold text-sm cursor-pointer">
                    {(user.fullName || user.email)[0]?.toUpperCase()}
                  </div>

                  {/* Tooltip on hover */}
                  <div className="absolute right-10 top-12 z-10 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 text-slate-900 dark:text-gray-100 rounded-md shadow-md px-4 py-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                    <div>
                      <strong>Name:</strong> {user.fullName || "N/A"}
                    </div>
                    <div>
                      <strong>Email:</strong> {user.email}
                    </div>
                    <div>
                      <strong>Plan:</strong> {user.plan || "Free"}
                    </div>
                    <div>
                      <strong>User Verified:</strong>{" "}
                      {user.verified ? "Verified" : "Not Verified"}
                    </div>
                  </div>

                  {/* Logout button */}
                  <Link href="/">
                    <Button
                      variant="link"
                      className="text-slate-900 dark:text-gray-100"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
