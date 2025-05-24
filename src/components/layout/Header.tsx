'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth-context';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Header() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const pathname = usePathname();
  const isAuthPage = pathname === '/signin' || pathname === '/signup';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white py-5 px-6 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image 
              src="/Logo.png" 
              alt="Event buddy logo" 
              width={28} 
              height={28} 
              className="mr-2" 
            />
            <span className="text-blue-600 font-bold text-xl">Event buddy.</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              {isAdmin ? (
                <Link href="/admin" className="text-gray-700 hover:text-blue-900 mr-4">
                  Admin Dashboard
                </Link>
              ) : (
                <Link href="/dashboard" className="text-gray-700 hover:text-blue-900 mr-4">
                  Dashboard
                </Link>
              )}
              <div className="text-gray-700 mr-4">
                Hello, {user?.name ? user.name.split(' ')[0] : 'User'}!
              </div>
              <button
                onClick={logout}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium shadow-lg"
              >
                Logout
              </button>
            </>
          ) : !isAuthPage && (
            <>
              <Link
                href="/signin"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="bg-blue-500 hover:bg-blue-600 text-white ml-3 px-6 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
          <nav className="flex flex-col space-y-3 pt-4">
            {isAuthenticated ? (
              <>
                <div className="text-gray-700 px-2">
                  Hello, {user?.name ? user.name.split(' ')[0] : 'User'}!
                </div>
                {isAdmin ? (
                  <Link 
                    href="/admin" 
                    className="text-gray-700 hover:text-blue-900 px-2 py-2 rounded-lg hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                ) : (
                  <Link 
                    href="/dashboard" 
                    className="text-gray-700 hover:text-blue-900 px-2 py-2 rounded-lg hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg text-left"
                >
                  Logout
                </button>
              </>
            ) : !isAuthPage && (
              <>
                <Link
                  href="/signin"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
} 