import React from 'react'
import {
    SignedIn,
    SignedOut,
    SignInButton,
    SignUpButton,
    UserButton,
  } from "@clerk/nextjs";

const Profile = () => {
  return (
    <div className="relative flex items-center space-x-2">
        <SignedOut>
        <SignUpButton>
            <button className="px-3 py-1 border rounded-md text-sm font-medium hover:bg-gray-50">
            Sign Up
            </button>
        </SignUpButton>
        <SignInButton>
            <button className="px-3 py-1 border rounded-md text-sm font-medium hover:bg-gray-50">
            Log In
            </button>
        </SignInButton>
        </SignedOut>

        <SignedIn>
        {/* shows the circular avatar and dropdown menu */}
        <UserButton
            afterSignOutUrl="/"
            appearance={{
            elements: {
                userButtonAvatarBox: "h-8 w-8",
            },
            }}
        />
        </SignedIn>
    </div>
  )
}

export default Profile