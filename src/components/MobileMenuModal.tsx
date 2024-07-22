'use client'

import React from 'react'
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'

interface MobileMenuModalProps {
  isOpen: boolean
  onClose: () => void
}

const MobileMenuModal: React.FC<MobileMenuModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50'>
      <div className='flex flex-col bg-gray-800 text-gray-100 p-8 rounded-2xl shadow-2xl w-full h-full max-w-md'>
        <button
          className='absolute top-4 right-4 text-gray-100 text-2xl'
          onClick={onClose}
        >
          &times;
        </button>
        <div className='flex flex-col justify-center items-center h-full'>
          <Link href='/' passHref>
            <button className='block mb-4 text-gray-100 w-full text-left hover:bg-gray-700 p-4 rounded transition' onClick={onClose}>
              Home
            </button>
          </Link>
          <Link href='/user-workout' passHref>
            <button className='block text-gray-100 w-full text-left hover:bg-gray-700 p-4 rounded transition' onClick={onClose}>
              My Workouts
            </button>
          </Link>
          <div className='mt-auto'>
            <UserButton />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileMenuModal
