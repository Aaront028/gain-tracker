'use client'
import React from 'react';
import { FaDumbbell, FaChartLine, FaUserPlus } from 'react-icons/fa';
import { SignInButton } from '@clerk/nextjs';
import Image from 'next/image';

const SignInPrompt: React.FC = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <Image
        src="/sven-mieke-Lx_GDv7VA9M-unsplash.jpg"
        alt="Gym Background"
        fill
        style={{ objectFit: 'cover' }}
        quality={100}
        className="absolute z-0"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-60 z-10"></div>

      {/* Content */}
      <div className="relative z-20 flex flex-col md:flex-row items-center justify-center w-full max-w-7xl mx-auto px-4 py-12">
        <div className="md:w-1/2 mb-8 md:mb-0 text-center md:text-left">
          <h1 className="text-5xl font-bold mb-6 text-yellow-400">Gain Tracker</h1>
          <p className="text-2xl mb-8 text-white">Transform your fitness journey with personalized tracking and insights.</p>
        </div>

        <div className="md:w-1/2 md:pl-12 max-w-md bg-gray-900 bg-opacity-80 p-8 rounded-lg shadow-2xl">
          <div className="space-y-6 mb-8">
            <FeatureItem icon={<FaDumbbell />} text="Log and track your workouts" />
            <FeatureItem icon={<FaChartLine />} text="Visualize your progress over time" />
            <FeatureItem icon={<FaUserPlus />} text="Get personalized recommendations" />
          </div>

          <SignInButton mode="modal">
            <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-lg transition duration-300 text-lg">
              Start Your Fitness Journey
            </button>
          </SignInButton>

          <p className="mt-4 text-sm text-gray-400 text-center">
            Already a member? Sign in to continue your progress.
          </p>
        </div>
      </div>
    </div>
  );
};

const FeatureItem: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
  <div className="flex items-center space-x-4">
    <div className="text-yellow-400 text-2xl">{icon}</div>
    <span className="text-white">{text}</span>
  </div>
);

export default SignInPrompt;
