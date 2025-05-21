// pages/login.js or app/login/[[...sign-in]]/page.js (for App Router)
"use client";

import { useEffect, useState } from "react";
import { SignIn, SignUp } from "@clerk/nextjs";

export default function LoginPage() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-indigo-100 flex flex-col justify-center relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-indigo-200 opacity-30 blur-3xl"></div>
      <div className="absolute top-20 -left-20 w-80 h-80 rounded-full bg-purple-200 opacity-30 blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full bg-pink-200 opacity-20 blur-3xl"></div>
      
      {/* Simple animated elements */}
      <div className="absolute top-1/4 left-1/3 w-4 h-4 rounded-full bg-indigo-400 opacity-70 animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 w-6 h-6 rounded-full bg-indigo-500 opacity-50 animate-ping"></div>
      <div className="absolute bottom-1/3 right-1/4 w-5 h-5 rounded-full bg-purple-400 opacity-60 animate-pulse"></div>
      
      <div className="relative max-w-md w-full mx-auto px-4 pt-6 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <a href="/" className="inline-flex items-center text-indigo-800 text-4xl font-bold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Санхүүгийн Хяналтын Вэбсайт</span>
          </a>
          <p className="mt-1 text-sm text-indigo-500">{time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
        </div>
        
        <SignIn 
                routing="hash"
                signUpUrl="/signup" 
              />
        
        {/* App highlights - with improved icons */}
        <div className="mt-10 flex justify-center space-x-10 text-gray-600 text-sm">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center shadow-sm">
              <svg className="h-6 w-6 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <span>Аюулгүй</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center shadow-sm">
              <svg className="h-6 w-6 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span>Хялбар</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center shadow-sm">
              <svg className="h-6 w-6 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span>Санхүү</span>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-12 text-center text-xs text-indigo-400">
          © {new Date().getFullYear()} Санхүүгийн Технологи. Бүх эрх хуулиар хамгаалагдсан.
        </div>
      </div>
    </div>
  );
}