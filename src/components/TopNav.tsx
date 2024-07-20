'use client'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { UploadButton } from '../app/utils/uploadthing'
import React from 'react'
import { useRouter } from 'next/navigation'

const TopNav = () => {
  const router = useRouter()

  return (
    <div className='flex w-full items-center justify-between p-4 text-xl font-semibold border-b '>
      <div>Gain Tracker</div>
      <div className='flex flex-row'>

        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          {/* <UploadButton endpoint="imageUploader" onClientUploadComplete={() => { router.refresh() }} /> */}
          <UserButton />
        </SignedIn>
      </div>
    </div>
  )
}

export default TopNav