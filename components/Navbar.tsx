"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { LogOut, Home, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600">SmartSpace</span>
            </div>
            <div className="ml-6 flex items-center space-x-4">
              <Link href={session ? "/dashboard" : "/"} className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium inline-flex items-center">
                <Home className="w-4 h-4 mr-1" /> {session ? "Dashboard" : "Home"}
              </Link>
              {(session?.user as any)?.role === "Admin" && (
                <Link href="/admin" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium inline-flex items-center">
                   <LayoutDashboard className="w-4 h-4 mr-1" /> Admin Dashboard
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center">
            {session ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard/profile" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                  My Profile
                </Link>
                <div className="text-sm hidden sm:block">
                  <span className="font-semibold text-gray-900">{session.user?.name}</span>
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                    {(session.user as any)?.tier} Member
                  </span>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  <LogOut className="w-4 h-4 mr-1" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                  Sign in
                </Link>
                <Link href="/register" className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
