'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const isAuthPage = pathname === '/signin' || pathname === '/signup';

  if (isAuthPage) {
    return null;
  }

  return (
    <footer className="bg-white py-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link href="/" className="flex items-center text-blue-600 font-bold text-lg">
              <Image 
                src="/Logo.png" 
                alt="Event Buddy Logo" 
                width={24} 
                height={24} 
                className="mr-2"
              />
              Event buddy.
            </Link>
          </div>
          
          <div className="flex space-x-6">
            <Link href="/" className="text-sm text-blue-600 hover:text-blue-400">
              Home
            </Link>
            <Link href="/signin" className="text-sm text-blue-600 hover:text-blue-400">
              Sign in
            </Link>
            <Link href="/signup" className="text-sm text-blue-600 hover:text-blue-400">
              Sign up
            </Link>
            <Link href="/privacy-policy" className="text-sm text-blue-600 hover:text-blue-400">
              Privacy Policy
            </Link>
          </div>
        </div>
        
        <hr className="my-6 border-black" />
        
        <div className="text-center text-xs text-gray-500">
          © 2025 Event buddy. All rights reserved.
        </div>
      </div>
    </footer>
  );
} 