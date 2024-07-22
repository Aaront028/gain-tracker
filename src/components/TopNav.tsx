'use client'

import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import React, { useState } from 'react'
import Link from 'next/link'
import MobileMenuModal from './MobileMenuModal'

const TopNav = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className='flex items-center justify-between p-4 text-xl font-semibold border-b bg-gray-800 text-white'>
      {/* For mobile view, show button to open modal; for desktop, show a link to home */}
      <div className='md:hidden'>
        <button
          className='text-2xl font-bold'
          onClick={() => setIsMobileMenuOpen(true)}
        >
          Gain Tracker
        </button>
      </div>
      <div className='hidden md:flex items-center space-x-4'>
        <Link href='/' className='text-2xl font-bold'>
          Gain Tracker
        </Link>
      </div>

      <div className='flex items-center space-x-4'>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <div className='flex items-center'>
            <Link href='/user-workout' className='hidden md:inline hover:text-gray-300 mr-4'>
              My Workouts
            </Link>
            <UserButton />
          </div>
        </SignedIn>
      </div>

      {isMobileMenuOpen && (
        <MobileMenuModal
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      )}
    </nav>
  )
}

export default TopNav
